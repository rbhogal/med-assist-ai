"use client";

import { useImperativeHandle, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Wizard({ steps, form, onSubmit, ref }) {
  const [currentStep, setCurrentStep] = useState(0);
  const { trigger } = form;

  const handleNext = async () => {
    const currentStepSchema = steps[currentStep].schema;
    const fields = Object.keys(currentStepSchema.shape);
    const isValid = await trigger(fields as any, { shouldFocus: true });

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return steps[0].content;
      case 1:
        return steps[1].content;
      case 2:
        return steps[2].content;
      default:
        return null;
    }
  };

  useImperativeHandle(ref, () => ({
    goNext: handleNext,
    goBack: handlePrevious,
    submit: () => form.handleSubmit(onSubmit)(),
  }));

  return (
    <Card className="sm:w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{steps[currentStep].title}</CardTitle>
      </CardHeader>
      <div>
        <CardContent className="pb-6">{renderStepContent()}</CardContent>
        <CardFooter className="flex justify-between">
          {currentStep > 0 && currentStep < steps.length - 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="cursor-pointer"
            >
              Previous
            </Button>
          ) : null}
          {currentStep === steps.length - 2 && (
            <Button
              className="cursor-pointer"
              type="button"
              onClick={form.handleSubmit(onSubmit)}
            >
              Submit
            </Button>
          )}
          {currentStep < steps.length - 2 && (
            <Button
              className="cursor-pointer ml-auto"
              type="button"
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </CardFooter>
      </div>
    </Card>
  );
}
