"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import SingleContributer from "./SingleContributer";
import MultipleContributers from "./MultipleContributers";

const Contributers = ({ transactionData, setTransactionData, users }) => {
  return (
    <Tabs
      defaultValue={transactionData.contributers.isMultiple ? "multiple" : "single"}
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
        <SingleContributer users={users} transactionData={transactionData} setTransactionData={setTransactionData} />
      </TabsContent>
      <TabsContent value="multiple">
        <MultipleContributers users={users} transactionData={transactionData} setTransactionData={setTransactionData} />
      </TabsContent>
    </Tabs>
  )
}

export default Contributers
