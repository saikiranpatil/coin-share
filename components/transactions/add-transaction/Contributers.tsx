"use client";

import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AvatarImage,
  AvatarFallback,
  Avatar
} from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ChevronsUpDown, Edit2, X } from "lucide-react";
import UserCombobox from "../UserCombobox";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useStepper } from "@/components/stepper";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import SelectUser from "@/components/select-user";
import { Card } from "@/components/ui/card";

const Contributers = ({ transactionData, setTransactionData, users }) => {
  const {
    nextStep,
    prevStep,
    isDisabledStep,
  } = useStepper();

  const totalAmount = transactionData.basicDetails?.amount | 0;
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [leftAmount, setLeftAmount] = useState(0);

  const [tab, setTab] = useState("single");

  const [singleContributer, setSingleContributer] = useState<UserSelectListProps | undefined>(undefined);
  const [multipleContributers, setMultipleContributers] = useState<UserSelectListProps[]>([]);

  const [filteredSingleContributers, setFilteredSingleContributers] = useState<UserSelectListProps[]>([]);
  const [filteredMultipleContributers, setFilteredMultipleContributers] = useState<UserSelectListProps[]>([]);

  const onTabChange = (value: string) => {
    setTab(value);
  }

  const onMultipleUserSelect = (user: UserSelectListProps) => {
    if (!multipleContributers.some(multipleContributer => multipleContributer.id === user.id)) {
      setMultipleContributers([...multipleContributers, user]);
    }
  }

  const onUserRemoveClick = (userId: string) => {
    const updatedMultipleContributers = multipleContributers.filter(multipleContributer => multipleContributer.id !== userId);
    setMultipleContributers(updatedMultipleContributers);
  }

  const onNextClick = () => {

  }

  useEffect(() => {
    setLeftAmount(totalAmount - selectedAmount);
  }, [selectedAmount, totalAmount]);

  useEffect(() => {
    const newFilteredMultipleContributers = users
      .filter(user => !multipleContributers.some(multipleContributers => multipleContributers.id === user.id));
    setFilteredMultipleContributers(newFilteredMultipleContributers);
  }, [users, multipleContributers]);

  useEffect(() => {
    if (singleContributer) {
      const newFilteredSingleContributer = users
        .filter(user => user.id !== singleContributer.id);
      setFilteredSingleContributers(newFilteredSingleContributer);
    } else {
      setFilteredMultipleContributers(users);
    }
  }, [users, singleContributer]);



  return (
    <Tabs value={tab} onValueChange={onTabChange} className="flex flex-col justify-between w-full h-full space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="single">
          Single
        </TabsTrigger>
        <TabsTrigger value="multiple">
          Multiple
        </TabsTrigger>
      </TabsList>
      <TabsContent value="single">
        <SelectUser users={users} setClickedUser={setSingleContributer} >
          <Card
            className="w-full justify-between"
          >
            {singleContributer ?
              (
                <div className="max-w-80 mx-auto flex justify-center items-center gap-4 p-2 cursor-pointer">
                  <Avatar className="w-12 h-12 rounded-full mr-2">
                    <AvatarImage alt="User Avatar" src="/placeholder.svg" />
                    <AvatarFallback>ED</AvatarFallback>
                  </Avatar>
                  <span className="text-gray-900 dark:text-gray-100">{singleContributer.name}</span>
                  <Edit2 className="h-4 w-4 shrink-0 opacity-50" />
                </div>
              )
              :
              (
                <Button
                  variant="outline"
                  className="w-full justify-between"
                >
                  Add Contributer...
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              )
            }
          </Card>
        </SelectUser>
      </TabsContent>
      <TabsContent value="multiple">
        <SelectUser users={filteredMultipleContributers} setClickedUser={onMultipleUserSelect} >
          <Card className="w-full justify-between">
            <Button
              variant="outline"
              className="w-full justify-between"
            >
              Add Contributer...
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </Card>
        </SelectUser>
        {multipleContributers?.length > 0 &&
          <ScrollArea className="h-40 rounded-md border py-1 pt-4 mt-4">
            {multipleContributers.map((contributer, idx) => (
              <div key={"usercardcontributers" + idx} className="max-w-80 mx-auto">
                <Label className="flex justify-between items-center space-x-2">
                  <Avatar className="w-12 h-12 rounded-full mr-2">
                    <AvatarImage alt="User Avatar" src="/placeholder.svg" />
                    <AvatarFallback>ED</AvatarFallback>
                  </Avatar>
                  <span className="text-gray-900 dark:text-gray-100">{contributer.name}</span>
                  <Input className="w-24" placeholder="Amount" type="number" min="0" />
                  <Button size="icon" variant="secondary" onClick={() => onUserRemoveClick(contributer.id)}><X size="16" /></Button>
                </Label>
                <Separator className="my-4" />
              </div>
            ))}
          </ScrollArea>
        }
        <div className="flex flex-col gap-4 my-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Total Amount:</span>
            <span className="font-medium">₹{totalAmount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Selected Total:</span>
            <span className="font-medium">₹{selectedAmount}</span>
          </div>
          <div className={`flex items-center justify-between ${leftAmount ? "text-red-500" : "text-muted-foreground"}`}>
            <span>Left Amount:</span>
            <span className="font-medium">₹{leftAmount}</span>
          </div>
        </div>
      </TabsContent>
      <div className="flex justify-end w-full gap-4">
        <Button
          disabled={isDisabledStep}
          onClick={prevStep}
          variant="secondary"
        >
          Prev
        </Button>
        <Button onClick={onNextClick}>
          Next
        </Button>
      </div>
    </Tabs>
  )
}

export default Contributers
