import { db } from '@/lib/db/db';
import type { ToolDef } from './types';

// ─── Tool Definitions (neutral format) ───────────────────────────────────────

export const toolDefs: ToolDef[] = [
  {
    name: 'get_balances',
    description: 'Get the current user\'s overall balance summary across all groups. Shows who owes what.',
    params: {},
    required: [],
  },
  {
    name: 'list_groups',
    description: 'List all expense groups the current user belongs to with balance status.',
    params: {},
    required: [],
  },
  {
    name: 'get_group_details',
    description: 'Get full details of a specific group: members, their balances, and recent transactions.',
    params: {
      group_id: { type: 'string', description: 'The ID of the group to fetch details for' },
    },
    required: ['group_id'],
  },
  {
    name: 'list_transactions',
    description: 'List recent transactions for the user. Optionally filter by a specific group.',
    params: {
      group_id: { type: 'string', description: 'Optional: filter transactions by this group ID' },
      limit: { type: 'integer', description: 'Number of transactions to return (default 8, max 20)' },
    },
    required: [],
  },
  {
    name: 'search_users',
    description: 'Search for users by name or email. Use this to find user IDs before creating expenses.',
    params: {
      query: { type: 'string', description: 'Name or email to search for' },
    },
    required: ['query'],
  },
  {
    name: 'create_expense',
    description: 'Create a new payment expense in a group. The payer paid the full amount; recipients are who owe a share. Pass recipient_user_ids as comma-separated user IDs. Amount is split equally among recipients.',
    params: {
      group_id: { type: 'string', description: 'ID of the group to add the expense to' },
      description: { type: 'string', description: 'Description of the expense (e.g. "Dinner at Pizza Hut")' },
      total_amount: { type: 'number', description: 'Total expense amount in rupees' },
      payer_user_id: { type: 'string', description: 'User ID of who paid. Use "me" for the current user.' },
      recipient_user_ids: { type: 'string', description: 'Comma-separated user IDs of everyone who benefits (include payer if they also benefit)' },
    },
    required: ['group_id', 'description', 'total_amount', 'recipient_user_ids'],
  },
  {
    name: 'settle_debt',
    description: 'Record a settlement payment from the current user to another user in a group.',
    params: {
      group_id: { type: 'string', description: 'ID of the group where the debt exists' },
      to_user_id: { type: 'string', description: 'User ID of who is being paid back' },
      amount: { type: 'number', description: 'Amount being settled in rupees' },
    },
    required: ['group_id', 'to_user_id', 'amount'],
  },
];

// ─── Tool Execution ───────────────────────────────────────────────────────────

export async function executeTool(
  name: string,
  args: Record<string, any>,
  userId: string,
): Promise<unknown> {
  try {
    switch (name) {
      case 'get_balances': {
        const members = await db.groupMember.findMany({
          where: { userId },
          include: { group: { select: { id: true, name: true } } },
        });
        const total = members.reduce((s, m) => s + m.balance, 0);
        return {
          totalBalance: total,
          summary: total > 0 ? 'You are owed money overall' : total < 0 ? 'You owe money overall' : 'All settled up',
          byGroup: members.map((m) => ({
            groupId: m.groupId,
            groupName: m.group.name,
            balance: m.balance,
            status: m.balance > 0 ? 'owed to you' : m.balance < 0 ? 'you owe' : 'settled',
          })),
        };
      }

      case 'list_groups': {
        const groups = await db.group.findMany({
          where: { members: { some: { userId } } },
          include: {
            _count: { select: { members: true } },
            members: { where: { userId }, select: { balance: true } },
          },
        });
        return groups.map((g) => ({
          id: g.id,
          name: g.name,
          memberCount: g._count.members,
          myBalance: g.members[0]?.balance ?? 0,
          status:
            (g.members[0]?.balance ?? 0) > 0
              ? 'owed to you'
              : (g.members[0]?.balance ?? 0) < 0
              ? 'you owe'
              : 'settled',
        }));
      }

      case 'get_group_details': {
        const group = await db.group.findFirst({
          where: { id: args.group_id, members: { some: { userId } } },
          include: {
            members: { include: { user: { select: { id: true, name: true, email: true } } } },
            transactions: {
              take: 5,
              orderBy: { createdAt: 'desc' },
              select: { id: true, description: true, amount: true, type: true, createdAt: true },
            },
            userGroupBalance: {
              where: { OR: [{ fromUserId: userId }, { toUserId: userId }] },
            },
          },
        });
        if (!group) return { error: 'Group not found or you are not a member' };
        return {
          id: group.id,
          name: group.name,
          members: group.members.map((m) => ({
            id: m.userId,
            name: m.user.name,
            email: m.user.email,
            balance: m.balance,
            status: m.balance > 0 ? 'owed to you' : m.balance < 0 ? 'owes you' : 'settled',
          })),
          recentTransactions: group.transactions.map((t) => ({
            id: t.id,
            description: t.description,
            amount: t.amount,
            type: t.type,
            date: t.createdAt.toISOString().split('T')[0],
          })),
          myBalanceWithOthers: group.userGroupBalance.map((b) => ({
            fromUserId: b.fromUserId,
            toUserId: b.toUserId,
            amount: b.amount,
          })),
        };
      }

      case 'list_transactions': {
        const limit = Math.min(Number(args.limit ?? 8), 20);
        const where: Record<string, unknown> = {
          OR: [
            { contributors: { some: { userId } } },
            { recipients: { some: { userId } } },
          ],
        };
        if (args.group_id) where.groupId = args.group_id;

        const txns = await db.transaction.findMany({
          where,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            groups: { select: { name: true } },
            contributors: { include: { user: { select: { name: true } } } },
            recipients: { include: { user: { select: { name: true } } } },
          },
        });
        return txns.map((t) => ({
          id: t.id,
          description: t.description,
          amount: t.amount,
          type: t.type,
          group: t.groups.name,
          date: t.createdAt.toISOString().split('T')[0],
          paidBy: t.contributors.map((c) => `${c.user.name} (₹${c.amount})`).join(', '),
          for: t.recipients.map((r) => `${r.user.name} (₹${r.amount})`).join(', '),
        }));
      }

      case 'search_users': {
        const users = await db.user.findMany({
          where: {
            OR: [
              { name: { contains: args.query, mode: 'insensitive' } },
              { email: { contains: args.query, mode: 'insensitive' } },
            ],
            NOT: { id: userId },
          },
          take: 5,
          select: { id: true, name: true, email: true },
        });
        return users.length > 0 ? users : { message: 'No users found matching that query' };
      }

      case 'create_expense': {
        const payerId = args.payer_user_id === 'me' || !args.payer_user_id ? userId : args.payer_user_id;
        const recipientIds: string[] = (args.recipient_user_ids as string)
          .split(',')
          .map((id: string) => id.trim())
          .filter(Boolean);

        if (recipientIds.length === 0) return { error: 'No recipients specified' };

        const totalAmount = Number(args.total_amount);
        const perPerson = parseFloat((totalAmount / recipientIds.length).toFixed(2));

        // Verify group membership
        const group = await db.group.findFirst({
          where: { id: args.group_id, members: { some: { userId } } },
        });
        if (!group) return { error: 'Group not found or access denied' };

        const transaction = await db.transaction.create({
          data: {
            type: 'Payment',
            description: args.description,
            amount: totalAmount,
            creatorUserId: userId,
            groupId: args.group_id,
            contributors: { create: [{ userId: payerId, amount: totalAmount }] },
            recipients: {
              create: recipientIds.map((rid) => ({ userId: rid, amount: perPerson })),
            },
          },
        });

        // Update group member balances
        for (const rid of recipientIds) {
          if (rid === payerId) continue;
          await db.groupMember.updateMany({
            where: { userId: rid, groupId: args.group_id },
            data: { balance: { decrement: perPerson } },
          });
          await db.groupMember.updateMany({
            where: { userId: payerId, groupId: args.group_id },
            data: { balance: { increment: perPerson } },
          });
        }

        return {
          success: true,
          transactionId: transaction.id,
          message: `Expense "${args.description}" of ₹${totalAmount} added to ${group.name}. Split ₹${perPerson} per person among ${recipientIds.length} people.`,
        };
      }

      case 'settle_debt': {
        const amount = Number(args.amount);
        const group = await db.group.findFirst({
          where: { id: args.group_id, members: { some: { userId } } },
        });
        if (!group) return { error: 'Group not found or access denied' };

        await db.transaction.create({
          data: {
            type: 'Settlement',
            description: 'Settlement',
            amount,
            creatorUserId: userId,
            groupId: args.group_id,
            contributors: { create: [{ userId, amount }] },
            recipients: { create: [{ userId: args.to_user_id, amount }] },
          },
        });

        await db.groupMember.updateMany({
          where: { userId, groupId: args.group_id },
          data: { balance: { increment: amount } },
        });
        await db.groupMember.updateMany({
          where: { userId: args.to_user_id, groupId: args.group_id },
          data: { balance: { decrement: amount } },
        });

        return { success: true, message: `Settlement of ₹${amount} recorded in ${group.name}.` };
      }

      default:
        return { error: `Unknown tool: ${name}` };
    }
  } catch (err) {
    console.error(`Tool ${name} error:`, err);
    return { error: `Failed to execute ${name}` };
  }
}

// ─── Format converters ────────────────────────────────────────────────────────

export function toGroqTools() {
  return toolDefs.map((t) => ({
    type: 'function',
    function: {
      name: t.name,
      description: t.description,
      parameters: {
        type: 'object',
        properties: Object.fromEntries(
          Object.entries(t.params).map(([k, v]) => [
            k,
            { type: v.type, description: v.description, ...(v.enum ? { enum: v.enum } : {}) },
          ]),
        ),
        required: t.required,
      },
    },
  }));
}

const GEMINI_TYPE_MAP: Record<string, string> = {
  string: 'STRING',
  number: 'NUMBER',
  integer: 'INTEGER',
  boolean: 'BOOLEAN',
};

export function toGeminiTools() {
  return [
    {
      functionDeclarations: toolDefs.map((t) => ({
        name: t.name,
        description: t.description,
        parameters:
          Object.keys(t.params).length === 0
            ? undefined
            : {
                type: 'OBJECT',
                properties: Object.fromEntries(
                  Object.entries(t.params).map(([k, v]) => [
                    k,
                    {
                      type: GEMINI_TYPE_MAP[v.type] ?? 'STRING',
                      description: v.description,
                      ...(v.enum ? { enum: v.enum } : {}),
                    },
                  ]),
                ),
                required: t.required,
              },
      })),
    },
  ];
}