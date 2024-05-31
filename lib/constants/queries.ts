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

export const groupsCardIncludeQuery = {
    include: {
        group: {
            include: {
                members: {
                    select: {
                        userId: true,
                        balance: true,
                    }
                },
                _count: {
                    select: {
                        members: true,
                    }
                }
            }
        }
    }
};