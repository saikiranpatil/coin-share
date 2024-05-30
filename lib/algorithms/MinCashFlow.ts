export interface Entry {
    key: string;
    amount: number;
}

class SortedMap {
    public entries: Entry[];

    constructor() {
        this.entries = [];
    }

    set(key: string, amount: number): void {
        const index = this.entries.findIndex(entry => entry.key === key);
        if (index !== -1) {
            this.entries[index].amount = amount;
        } else {
            this.entries.push({ key, amount });
            this.entries.sort((a, b) => a.amount - b.amount);
        }
    }

    get(key: string): number | undefined {
        const entry = this.entries.find(entry => entry.key === key);
        return entry ? entry.amount : undefined;
    }

    delete(key: string): void {
        const index = this.entries.findIndex(entry => entry.key === key);
        if (index !== -1) {
            this.entries.splice(index, 1);
        }
    }

    getEntries(): Entry[] {
        return this.entries.map(entry => ({ key: entry.key, amount: entry.amount }));
    }
}

const getMinAmount = (cashFlow: cashFlowProps) => {
    const netAmount: Entry[] = [];
    for (const transaction of cashFlow) {
        let fromIndex = netAmount.findIndex(t => t.key === transaction.from);
        let toIndex = netAmount.findIndex(t => t.key === transaction.to);

        if (fromIndex === -1) {
            netAmount.push({ key: transaction.from, amount: 0 });
            fromIndex = netAmount.length - 1;
        }
        if (toIndex === -1) {
            netAmount.push({ key: transaction.to, amount: 0 });
            toIndex = netAmount.length - 1;
        }

        netAmount[fromIndex].amount -= transaction.amount;
        netAmount[toIndex].amount += transaction.amount;

        return netAmount;
    }
}

export const getMinCashFlow: (netAmount: Entry[]) => cashFlowDataProps[] = (netAmount) => {
    const dueAmount = new SortedMap();

    for (const netCash of netAmount) {
        dueAmount.set(netCash.key, netCash.amount);
    }

    const minCashFlow: cashFlowDataProps[] = [];
    while (dueAmount.entries.length !== 0) {
        const minAmount = dueAmount.entries[0];
        const maxAmount = dueAmount.entries[dueAmount.entries.length - 1];

        dueAmount.delete(minAmount.key);
        dueAmount.delete(maxAmount.key);

        if (minAmount.amount + maxAmount.amount === 0) {
            minCashFlow.push({
                from: minAmount.key,
                to: maxAmount.key,
                amount: maxAmount.amount
            });
        } else if (Math.abs(minAmount.amount) > Math.abs(maxAmount.amount)) {
            minCashFlow.push({
                from: minAmount.key,
                to: maxAmount.key,
                amount: maxAmount.amount
            });

            dueAmount.set(minAmount.key, minAmount.amount + maxAmount.amount);
        } else {
            minCashFlow.push({
                from: minAmount.key,
                to: maxAmount.key,
                amount: -1 * minAmount.amount
            });

            dueAmount.set(maxAmount.key, minAmount.amount + maxAmount.amount);
        }
    }

    return minCashFlow;
}