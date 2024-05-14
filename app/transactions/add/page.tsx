import {
  DumbbellIcon,
  IndianRupee,
  Pencil,
} from "lucide-react"
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import AddTransactionContributers from "./components/AddContributers/AddContributers"
import AddTransactionRecipents from "./components/AddRecipents/AddRecipents"

export default function AddTransaction() {
  return (
    <div key="1" className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Add Transaction</CardTitle>
            <CardDescription>Record a new transaction for your group.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 ">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-full h-full relative group/editavatar"
                >
                  <span className="absolute bg-accent w-full h-full flex justify-center items-center opacity-0 group-hover/editavatar:opacity-80 transition-all ease-in">
                    Change
                  </span>
                  <DumbbellIcon className="w-auto h-full text-gray-400 p-6" />
                </Button>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="group">
                      Group
                    </label>
                    <Select defaultValue="Acme Inc">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Acme Inc">Acme Inc</SelectItem>
                        <SelectItem value="Vercel">Vercel</SelectItem>
                        <SelectItem value="Shadcn">Shadcn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="title">
                      Transaction Title
                    </label>
                    <div className="flex-1">
                      <Input
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:focus:ring-blue-500 dark:focus:border-blue-500 sm:text-sm"
                        id="title"
                        placeholder="Enter transaction title"
                        type="text"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="amount">
                      Transaction Amount
                    </label>
                    <div className="relative flex-1">
                      <IndianRupee className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="block w-full border-gray-300 rounded-r-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:focus:ring-blue-500 dark:focus:border-blue-500 sm:text-sm pl-8"
                        id="amount"
                        placeholder="Enter transaction amount"
                        type="number"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <AddTransactionContributers />
                </div>
                <div>
                  <AddTransactionRecipents />
                </div>

              </div>
              <div className="flex justify-end">
                <Button type="submit">
                  Save Transaction
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
