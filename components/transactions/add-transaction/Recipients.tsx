"use client";

import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator"

import UserCardWithAmount from "../UserCardWithAmount";
import UserCombobox from "../UserCombobox";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useStepper } from "@/components/stepper";

const tags = Array.from({ length: 10 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
)

const users = [];

const Recipients = ({ transactionData, setTransactionData, users }) => {
  const {
    nextStep,
    prevStep,
    resetSteps,
    isDisabledStep,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
  } = useStepper();
  return (
    <>
      <ScrollArea className="h-40 rounded-md border px-32 py-1">
        {tags.map((tag, idx) => (
          <>
            <UserCardWithAmount key={"usercardcontributers" + idx} tag={tag} />
            {idx !== tags.length - 1 && <Separator className="my-4" />}
          </>
        ))}
      </ScrollArea>
      <div className="flex flex-col gap-4 my-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-500 dark:text-gray-400">Total Amount:</span>
          <span className="font-medium">₹1,000</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500 dark:text-gray-400">Selected Total:</span>
          <span className="font-medium">₹1,500</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-red-500">Left Amount:</span>
          <span className="text-red-500 font-medium">₹500</span>
        </div>
      </div>
      <div className="flex justify-end w-full gap-4">
        <Button
          disabled={isDisabledStep}
          onClick={prevStep}
          variant="secondary"
        >
          Prev
        </Button>
        <Button type="submit">
          Next
        </Button>
      </div>
    </>
  )
}

export default Recipients
