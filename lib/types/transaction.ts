type TransactionsStatusTagProps = "credit" | "debit" | "collect" | "return" | "uninvolved";

interface TransactionTableProps {
    id: string;
    type: string;
    description: string;
    createdAt: string;
    amount: number;
    creatorName: string;
    status: {
        tag: TransactionsStatusTagProps;
        text: string;
    }
}

/**
 * Add Transactions Data Props
*/
interface AddTransactionDataMembersProps {
    id: string;
    name: string;
    image?: string;
    amount: number;
}

interface AddTransactionDataBasicDetailsProps {
    type: "Payment" | "Settlement";
    description: string;
    amount: string;
    groupId: string;
    image?: string;
}

interface AddTransactionDataContributersProps {
    isMultiple: boolean;
    single?: UserSelectListProps;
    multiple?: AddTransactionDataMembersProps[];
}

interface AddTransactionDataProps {
    basicDetails?: AddTransactionDataBasicDetailsProps | undefined;
    contributors: AddTransactionDataContributersProps;
    recipients: AddTransactionDataMembersProps[] | undefined;
}
