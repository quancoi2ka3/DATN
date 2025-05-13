"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const AccordionContext = React.createContext<{
  expandedValue: string | null;
  setExpandedValue: React.Dispatch<React.SetStateAction<string | null>>;
}>({
  expandedValue: null,
  setExpandedValue: () => null
});

export type AccordionProps = {
  type?: 'single' | 'multiple';
  defaultValue?: string | null;
  children: React.ReactNode;
  className?: string;
}

export function Accordion({
  type = 'single',
  defaultValue = null,
  children,
  className
}: AccordionProps) {
  const [expandedValue, setExpandedValue] = React.useState<string | null>(defaultValue);

  return (
    <AccordionContext.Provider value={{ expandedValue, setExpandedValue }}>
      <div className={cn("divide-y divide-gray-200 rounded-md", className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export type AccordionItemProps = {
  value: string;
  trigger: React.ReactNode;
  children: React.ReactNode;
}

export function AccordionItem({ value, trigger, children }: AccordionItemProps) {
  const { expandedValue, setExpandedValue } = React.useContext(AccordionContext);
  const isOpen = expandedValue === value;
  
  const handleToggle = () => {
    setExpandedValue(isOpen ? null : value);
  };

  return (
    <div className="border-b border-gray-700">
      <button
        className="flex w-full items-center justify-between py-4 text-left font-medium transition-all hover:text-red-400"
        onClick={handleToggle}
        aria-expanded={isOpen}
      >
        <span className="text-lg text-white">{trigger}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-gray-300 transition-transform duration-200",
            isOpen && "rotate-180 text-red-400"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="pb-4 pt-2 text-slate-200">{children}</div>
      </div>
    </div>
  );
}