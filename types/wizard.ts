import { FieldValues, UseFormReturn } from "react-hook-form";
import { ZodObject, ZodRawShape } from "zod";

export interface WizardHandle {
  goNext: () => void;
  goBack: () => void;
  submit: () => void;
}

export interface WizardStep {
  id: string;
  title: string;
  schema: ZodObject<ZodRawShape> | null;
  content: React.ReactNode;
}

export interface WizardProps<T extends FieldValues> {
  steps: WizardStep[];
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  ref: React.Ref<WizardHandle>;
}
