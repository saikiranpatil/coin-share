import { type ClassValue, clsx } from "clsx"
import moment from "moment";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type getTransactionStatusOfUserProps = (userId: string, transactions: any, type: "Settlement" | "Payment") =>
  { tag: TransactionsStatusTagProps, text: string };

export const getTransactionStatusOfUser: getTransactionStatusOfUserProps = (userId, transactions, type) => {
  for (const contributor of transactions.contributors) {
    const { user, amount } = contributor;
    if (user.id === userId) {
      if (type === "Payment") {
        return {
          tag: "credit",
          text: `Credited Rs.${amount}`,
        };
      } else {
        return {
          tag: "collect",
          text: `Collected Rs.${amount}`,
        };
      }
    }
  }

  for (const recipient of transactions.recipients) {
    if (recipient.user.id === userId) {
      if (type === "Payment") {
        return {
          tag: "debit",
          text: `Debited Rs.${recipient.amount}`,
        };
      } else {
        return {
          tag: "return",
          text: `Returned Rs.${recipient.amount}`,
        };
      }
    }
  }

  return {
    tag: "uninvolved",
    text: "Not involved",
  };
}

export const getFilteredTransactions = (transactions: any, userId: string) => transactions.map(
  (transaction: any) => {
    const {
      id, type, description, createdAt, amount,
      user: { name: creatorName }, groups: { name: groupName }
    } = transaction;

    return ({
      id, type, description, groupName,
      status: getTransactionStatusOfUser(userId, transaction, type),
      createdAt: moment(createdAt).format("YYYY-MM-DD, hh:mm A"), amount,
      creatorName: creatorName ?? "Unknown",
    })
  }
);

interface getFilteredGoupsProps {
  (group: {
    members: {
      user: {
        id: string;
        name: string;
        email: string;
        image: string | null;
      },
    }[],
    transactions: any,
    userGroupBalance: {
      amount: number;
      fromUserId: string;
      toUserId: string;
    }[],
  }, userId: string): any
}

export const getFilteredGoups: getFilteredGoupsProps = (group, userId) => {
  const balanceMap: { [key: string]: number } = {};
  group.userGroupBalance.forEach(({ amount, fromUserId, toUserId }) => {
    if (fromUserId === userId) {
      balanceMap[toUserId] = (balanceMap[toUserId] || 0) - amount;
    } else if (toUserId === userId) {
      balanceMap[fromUserId] = (balanceMap[fromUserId] || 0) - amount;
    }
  });
  
  let userGroupStatusText = "";
  const members = group.members.map(
    ({ user: { id, name, email, image } }) => {
      const balance = balanceMap[id] || 0;

      const statusText = balance ? balance > 0 ? `You get back Rs.${balance}` : `You owe Rs.${-1 * balance}` : "All settled";
      const statusTag: GroupStatusTagProps = balance ? balance > 0 ? "getback" : "owe" : "settled";
      const status = {
        tag: statusTag,
        text: statusText
      };

      if (id == userId) {
        userGroupStatusText = statusText;
      }

      return ({
        id, status, name: name ?? "Unknown", email, image
      })
    }
  );

  return {
    ...group,
    members,
    transactions: getFilteredTransactions(group.transactions, userId),
    statusText: userGroupStatusText
  };
}