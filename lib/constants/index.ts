export const navItems = [
    {
        id: "/dashboard",
        title: "Dashboard",
    },
    {
        id: "/transactions",
        title: "Transactions",
    },
    {
        id: "/groups",
        title: "Groups",
    },
    {
        id: "/friends",
        title: "Friends",
    },
];

export const transactionStatusClassMap: { [K in TransactionsStatusTagProps]: string } = {
    "credit": "text-green-500",
    "debit": "text-red-500",
    "return": "text-blue-500",
    "collect": "text-blue-500",
    "uninvolved": "text-gray-500",
};

export const groupStatusClassMap: { [K in GroupStatusTagProps]: string } = {
    "getback": "text-green-500",
    "owe": "text-red-500",
    "settled": "text-gray-500",
};