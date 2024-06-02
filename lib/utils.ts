import { type ClassValue, clsx } from "clsx"
import moment from "moment";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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

interface getFilteredGoupDetailsProps {
  (group: {
    name: string;
    image: { url: string } | null;
    members: {
      balance: number,
      user: {
        id: string;
        name: string;
        email: string;
        image: { url: string } | null;
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

export const getFilteredGoupDetails: getFilteredGoupDetailsProps = (group, userId) => {
  const { name, image, userGroupBalance } = group;
  let userBalanceInGroup = 0;
  const balanceMap: { [key: string]: number } = {};

  userGroupBalance.forEach(({ amount, fromUserId, toUserId }) => {
    if (fromUserId === userId) {
      balanceMap[toUserId] = (balanceMap[toUserId] || 0) - amount;
    } else if (toUserId === userId) {
      balanceMap[fromUserId] = (balanceMap[fromUserId] || 0) - amount;
    }
  });

  const members = group.members.map(
    ({ balance: groupBalance, user: { id, name, email, image } }) => {
      const balance = balanceMap[id] || 0;
      const status = getStatusTextForGroup(balance);

      if (id === userId) userBalanceInGroup = groupBalance;

      return ({
        id, status, name: name ?? "Unknown", email, imageUrl: image?.url
      })
    }
  );

  return {
    name,
    imageUrl: image?.url,
    members,
    transactions: getFilteredTransactions(group.transactions, userId),
    statusText: getStatusTextForGroup(userBalanceInGroup).text
  };
}

interface filteredGroupsItemProps {
  id: string;
  name: string;
  image: string | null;
  members: {
    userId: string;
    balance: number;
  }[],
  _count: {
    members: number,
  }
}

export const filteredGroups = async (groups: filteredGroupsItemProps[], userId: string) => {
  groups.map(({ id, name, image, members, _count: { members: membersCount } }) => {
    const balance = members.find(member => member.userId === userId)?.balance || 0;
    const status = getStatusTextForGroup(balance);

    return ({
      id,
      name,
      image,
      status,
      membersCount
    })
  });
}

export const getStatusTextForGroup = (balance: number) => {
  const statusText = balance ? balance > 0 ? `You get back Rs.${balance}` : `You owe Rs.${-1 * balance}` : "All settled";
  const statusTag: GroupStatusTagProps = balance ? balance > 0 ? "getback" : "owe" : "settled";

  return {
    tag: statusTag,
    text: statusText
  };
}