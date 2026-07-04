import { Search, Heart } from "lucide-react";
import type { TPage } from "../types";

interface ToolbarProps {
  onPageChange: (page: TPage) => void;
}

export function Toolbar({ onPageChange }: ToolbarProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-300 bg-gray-100 p-4">
      <span
        className="cursor-pointer text-lg font-bold select-none"
        onClick={() => onPageChange("home")}
      >
        Movie List
      </span>
      <div className="flex gap-2">
        <button
          className="cursor-pointer rounded p-2 transition-colors hover:bg-gray-200"
          onClick={() => onPageChange("search")}
        >
          <Search className="h-6 w-6" />
        </button>
        <button
          className="cursor-pointer rounded p-2 transition-colors hover:bg-gray-200"
          onClick={() => onPageChange("favorite")}
        >
          <Heart className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
