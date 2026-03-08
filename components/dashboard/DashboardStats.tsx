import StatsCard from '@/components/dashboard/StatsCard';
import { getUserStats } from '@/lib/actions/user';
import { IconKey } from '@/lib/constants/icons';

interface statsProps {
    statsTitle: string;
    statsValue: string;
    statsDescription: string;
    statsIcon: IconKey;
}

const DashboardStats = async () => {
    const { data: userStatsData, error } = await getUserStats();

    const defaultSummary = {
        totalBalance: 0,
        totalVolume: 0,
        totalTransactions: 0,
    };

    const summary = {
        ...defaultSummary,
        ...userStatsData
    }

    const statsData: statsProps[] = [
        {
            statsTitle: `Totally, ${typeof summary.totalBalance === "number" && summary.totalBalance < 0 ? "you owe" : "you get"}`,
            statsValue: `₹ ${typeof summary.totalBalance === "number" ? Math.abs(summary.totalBalance) : summary.totalBalance}`,
            statsIcon: "IndianRupee",
            statsDescription: "+20.1% from last month"
        },
        {
            statsTitle: "Total Expense",
            statsValue: `₹ ${summary.totalVolume}`,
            statsIcon: "ReceiptText",
            statsDescription: "+20.1% from last month"
        },
        {
            statsTitle: "Total Transactions",
            statsValue: `${summary.totalTransactions}`,
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
