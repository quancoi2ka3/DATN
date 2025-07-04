"use client";

import { cn } from "@/lib/utils";
import { CheckCircle, Clock, Package, Truck, XCircle } from "lucide-react";

interface TimelineStep {
  status: string;
  label: string;
  description: string;
  isCompleted: boolean;
  isCurrent: boolean;
  date?: string | null;
}

interface OrderTimelineProps {
  timeline: TimelineStep[];
  className?: string;
}

const getIcon = (status: string, isCompleted: boolean, isCurrent: boolean) => {
  const iconClass = cn(
    "w-5 h-5",
    isCompleted ? "text-green-600" : isCurrent ? "text-blue-600" : "text-gray-400"
  );

  switch (status) {
    case 'pending':
      return <Clock className={iconClass} />;
    case 'processing':
      return <Package className={iconClass} />;
    case 'awaitingfulfillment':
      return <Package className={iconClass} />;
    case 'shipped':
      return <Truck className={iconClass} />;
    case 'delivered':
      return <CheckCircle className={iconClass} />;
    case 'cancelled':
      return <XCircle className={iconClass} />;
    default:
      return <Clock className={iconClass} />;
  }
};

export function OrderTimeline({ timeline, className }: OrderTimelineProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-semibold text-gray-900">Trạng thái đơn hàng</h3>
      
      <div className="relative">
        {timeline.map((step, index) => (
          <div key={step.status} className="relative flex items-start pb-6 last:pb-0">
            {/* Vertical line */}
            {index < timeline.length - 1 && (
              <div 
                className={cn(
                  "absolute left-4 top-8 w-0.5 h-6 -ml-px",
                  step.isCompleted ? "bg-green-300" : "bg-gray-200"
                )}
              />
            )}
            
            {/* Icon circle */}
            <div 
              className={cn(
                "relative flex items-center justify-center w-8 h-8 rounded-full border-2",
                step.isCompleted 
                  ? "bg-green-50 border-green-300" 
                  : step.isCurrent 
                    ? "bg-blue-50 border-blue-300" 
                    : "bg-gray-50 border-gray-200"
              )}
            >
              {getIcon(step.status, step.isCompleted, step.isCurrent)}
            </div>
            
            {/* Content */}
            <div className="ml-4 min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h4 
                  className={cn(
                    "text-sm font-medium",
                    step.isCompleted 
                      ? "text-green-800" 
                      : step.isCurrent 
                        ? "text-blue-800" 
                        : "text-gray-500"
                  )}
                >
                  {step.label}
                </h4>
                {step.date && (
                  <span className="text-xs text-gray-500 ml-2">
                    {new Date(step.date).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                )}
              </div>
              <p 
                className={cn(
                  "mt-1 text-xs",
                  step.isCompleted 
                    ? "text-green-600" 
                    : step.isCurrent 
                      ? "text-blue-600" 
                      : "text-gray-400"
                )}
              >
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
