"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { PersonalInfoStep } from "./steps/personal-info-step";
import { AddressStep } from "./steps/address-step";
import { AccountStep } from "./steps/account-step";
import { WizardProgressBar } from "./wizard-progress-bar";

// Define the schema for each step
const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  age: z.coerce
    .number()
    .min(18, { message: "You must be at least 18 years old" }),
});

const addressSchema = z.object({
  street: z.string().min(5, { message: "Street address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  zipCode: z.string().min(5, { message: "Valid zip code is required" }),
});

const accountSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Combine all schemas for the final form
// const formSchema = z.object({
//   ...personalInfoSchema.shape,
//   ...addressSchema.shape,
//   ...accountSchema.shape,
// });

// type FormValues = z.infer<typeof formSchema>;

// const steps = [
//   { id: "personal", title: "Personal Info", schema: personalInfoSchema },
//   { id: "address", title: "Address", schema: addressSchema },
//   { id: "account", title: "Account", schema: accountSchema },
// ];

export function Wizard({ steps, form }) {
  const [currentStep, setCurrentStep] = useState(0);

  const { trigger, getValues, formState } = form;

  // Function to handle going to the next step
  const handleNext = async () => {
    // Get the fields for the current step
    const currentStepSchema = steps[currentStep].schema;
    const fields = Object.keys(currentStepSchema.shape);
    console.log({ fields });

    // Only validate the fields in the current step
    const isValid = await trigger(fields as any, { shouldFocus: true });

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  // Function to handle going to the previous step
  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // Function to handle form submission
  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    // Here you would typically send the data to your server
    alert("Form submitted successfully!");
  };

  // Determine which step component to render
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{steps[currentStep].title}</CardTitle>
        {/* <WizardProgressBar
          currentStep={currentStep}
          totalSteps={steps.length}
          stepTitles={steps.map((step) => step.title)}
        /> */}
      </CardHeader>
      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="pb-6">{renderStepContent()}</CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="cursor-pointer"
              >
                Previous
              </Button>
              {currentStep === steps.length - 1 ? (
                <Button type="submit">Submit</Button>
              ) : (
                <Button
                  className="cursor-pointer"
                  type="button"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </CardFooter>
          </form>
        </Form>
      </FormProvider>
    </Card>
  );
}
