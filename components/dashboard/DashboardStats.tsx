import StatsCard from '@/components/dashboard/StatsCard';
import { userStatsData } from '@/lib/actions/user';
import { IconKey } from '@/lib/constants/icons';

interface statsProps {
    statsTitle: string;
    statsValue: string;
    statsDescription: string;
    statsIcon: IconKey;
}

const DashboardStats = async () => {
    const [totalBalance, totalTransactionAmount, totalTransactionCount] = await userStatsData();

    const statsData: statsProps[] = [
        {
            statsTitle: `Totally, ${typeof totalBalance === "number" && totalBalance < 0 ? "you owe" : "you get"}`,
            statsValue: `₹ ${typeof totalBalance === "number" ? Math.abs(totalBalance) : totalBalance}`,
            statsIcon: "IndianRupee",
            statsDescription: "+20.1% from last month"
        },
        {
            statsTitle: "Total Expense",
            statsValue: `₹ ${totalTransactionAmount}`,
            statsIcon: "ReceiptText",
            statsDescription: "+20.1% from last month"
        },
        {
            statsTitle: "Total Transactions",
            statsValue: `${totalTransactionCount}`,
            statsIcon: "Activity",
            statsDescription: "+19% from last month"
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {
                statsData.map((statData, index) => <StatsCard key={`dashboard-stats-card-${index}`} {...statData} />)
            }
        </div>
    )
}

export default DashboardStats
