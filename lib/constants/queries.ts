export const transactionTableIncludeQuery = {
    user: {
        select: {
            name: true,
        }
    },
    groups: {
        select: {
            name: true,
        }
    },
    contributors: {
        select: {
            amount: true,
            user: {
                select: {
                    id: true,
                    name: true,
                }
            }
        },
    },
    recipients: {
        select: {
            amount: true,
            user: {
                select: {
                    id: true,
                    name: true,
                }
            }
        },
    }
};

export const findTransactionsOfUserQuery = {

}