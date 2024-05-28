import { type ClassValue, clsx } from "clsx"
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
          text: `You credited Rs.${amount}`,
        };
      } else {
        return {
          tag: "collect",
          text: `You collected Rs.${amount}`,
        };
      }
    }
  }

  for (const recipient of transactions.recipients) {
    if (recipient.user.id === userId) {
      if (type === "Payment") {
        return {
          tag: "debit",
          text: `You debited Rs.${recipient.amount}`,
        };
      } else {
        return {
          tag: "return",
          text: `You returned Rs.${recipient.amount}`,
        };
      }
    }
  }

  return {
    tag: "uninvolved",
    text: "Not involved",
  };
}