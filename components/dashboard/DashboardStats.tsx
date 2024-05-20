import StatsCard from '@/components/StatsCard';
import { IconKey } from '@/constants/icons';

interface statsProps {
    statsTitle: string;
    statsValue: string;
    statsDescription: string;
    statsIcon: IconKey;
}

const statsData: statsProps[] = [
    {
        statsTitle: "Totally, you owe",
        statsValue: "₹ 5,452",
        statsIcon: "IndianRupee",
        statsDescription: "+20.1% from last month"
    },
    {
        statsTitle: "Total Expense",
        statsValue: "₹ 10,452",
        statsIcon: "ReceiptText",
        statsDescription: "+20.1% from last month"
    },
    {
        statsTitle: "Total Transactions",
        statsValue: "152",
        statsIcon: "Activity",
        statsDescription: "+19% from last month"
    },
];
const DashboardStats = () => (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {
            statsData.map((statData, index) => <StatsCard key={`dashboard-stats-card-${index}`} {...statData} />)
        }
    </div>
)

export default DashboardStats
