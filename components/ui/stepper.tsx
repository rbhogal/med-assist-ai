import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Stepper({ steps, form }) {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const goNext = async () => {
    const isDateValid = await form.trigger(["slotDate"]);
    console.log(isDateValid);
    if (!isDateValid) return;
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const goBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card className="mb-4">
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{steps[currentStep].title}</h2>
          <div className="text-gray-700">{steps[currentStep].content}</div>
        </CardContent>
      </Card>

      <div className="flex">
        {currentStep !== 0 && (
          <Button
            className="cursor-pointer"
            onClick={goBack}
            disabled={currentStep === 0}
          >
            Back
          </Button>
        )}
        <Button
          className="ml-auto cursor-pointer"
          onClick={goNext}
          disabled={currentStep === steps.length - 1}
        >
          {currentStep === steps.length - 2 ? "Submit" : "Next"}
        </Button>
      </div>
    </div>
  );
}
