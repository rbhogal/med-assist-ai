import Link from "next/link";
import { ClipboardPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col h-screen w-full justify-center items-center gap-8">
      <div className="flex flex-col items-center gap-1">
        <span className="font-semibold text-xl">MedAssist</span>
        <span className="text-muted-foreground text-sm">
          Your care, simplified.
        </span>
        <ClipboardPlus className="text-blue-600 w-6 h-6" />
      </div>
      <Link className="mx-auto" href="/demo">
        <Button className="cursor-pointer">Try Demo</Button>
      </Link>
    </div>
  );
}
