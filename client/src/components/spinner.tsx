import { Loader2 } from "lucide-react";

export function Spinner() {
  return (
    <div className="my-4 flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    </div>
  );
}
