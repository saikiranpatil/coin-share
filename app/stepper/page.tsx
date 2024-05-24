"use client";

import {
    Step,
    Stepper,
    useStepper,
    type StepItem,
} from "@/components/stepper"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card";

const steps = [
    { label: "Step 1" },
    { label: "Step 2" },
    { label: "Step 3" },
] satisfies StepItem[]

export default function StepperDemo() {
    return (
        <div className="m-16">
            <Card className="p-4">
                <CardContent>
                    <div className="flex w-full flex-col gap-4">
                        <Stepper initialStep={0} steps={steps} variant="circle-alt">
                            <Step label="Step 1">
                                <div className="h-40 flex items-center justify-center my-4 border bg-secondary text-primary rounded-md">
                                    <h1 className="text-xl">Step 1</h1>
                                </div>
                            </Step>
                            <Step label="Step 2">
                                <div className="h-40 flex items-center justify-center my-4 border bg-secondary text-primary rounded-md">
                                    <h1 className="text-xl">Step 1</h1>
                                </div>
                            </Step>
                            <Step label="Step 3">
                                <div className="h-40 flex items-center justify-center my-4 border bg-secondary text-primary rounded-md">
                                    <h1 className="text-xl">Step 1</h1>
                                </div>
                            </Step>
                            <Footer />
                        </Stepper>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

const Footer = () => {
    const {
        nextStep,
        prevStep,
        resetSteps,
        isDisabledStep,
        hasCompletedAllSteps,
        isLastStep,
        isOptionalStep,
    } = useStepper()
    return (
        <>
            {hasCompletedAllSteps && (
                <div className="h-40 flex items-center justify-center my-4 border bg-secondary text-primary rounded-md">
                    <h1 className="text-xl">Woohoo! All steps completed! 🎉</h1>
                </div>
            )}
            <div className="w-full flex justify-end gap-2">
                {hasCompletedAllSteps ? (
                    <Button size="sm" onClick={resetSteps}>
                        Reset
                    </Button>
                ) : (
                    <>
                        <Button
                            disabled={isDisabledStep}
                            onClick={prevStep}
                            size="sm"
                            variant="secondary"
                        >
                            Prev
                        </Button>
                        <Button size="sm" onClick={nextStep}>
                            {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
                        </Button>
                    </>
                )}
            </div>
        </>
    )
}