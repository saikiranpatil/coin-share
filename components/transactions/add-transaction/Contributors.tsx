"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import SingleContributor from "./SingleContributor";
import MultipleContributors from "./MultipleContributors";

const Contributors = ({ transactionData, setTransactionData, users }) => {
  return (
    <Tabs
      defaultValue={transactionData.contributors.isMultiple ? "multiple" : "single"}
      className="flex flex-col justify-between w-full h-full space-y-4"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="single">
          Single
        </TabsTrigger>
        <TabsTrigger value="multiple">
          Multiple
        </TabsTrigger>
      </TabsList>
      <TabsContent value="single">
        <SingleContributor users={users} transactionData={transactionData} setTransactionData={setTransactionData} />
      </TabsContent>
      <TabsContent value="multiple">
        <MultipleContributors users={users} transactionData={transactionData} setTransactionData={setTransactionData} />
      </TabsContent>
    </Tabs>
  )
}

export default Contributors
