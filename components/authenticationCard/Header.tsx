import { PieChart } from "lucide-react"

interface headerProps {
    label: string
}

const Header = ({ label }: headerProps) => {
    return (
        <div className="w-full flex flex-col gap-y-4 items-center justify-center">
            <div className="flex gap-2 items-center">
                <PieChart />
                <h1 className="text-2xl font-bold">
                    Coin Share
                </h1>
            </div>
            <p>
                {label}
            </p>
        </div>
    )
}

export default Header
