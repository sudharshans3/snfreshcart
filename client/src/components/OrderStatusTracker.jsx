import React from 'react';
import { ClipboardList, Package, Truck, CheckCircle2 } from 'lucide-react';

const OrderStatusTracker = ({ currentStatus }) => {
  const statuses = [
    { label: 'Order Placed', icon: ClipboardList },
    { label: 'Packed', icon: Package },
    { label: 'Shipped', icon: Truck },
    { label: 'Delivered', icon: CheckCircle2 },
  ];

  const currentIdx = statuses.findIndex((s) => s.label === currentStatus);

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {statuses.map((step, idx) => {
          const StepIcon = step.icon;
          const isCompleted = idx <= currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <React.Fragment key={step.label}>
              {/* Step circle */}
              <div className="flex flex-col items-center relative z-10 flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-agricultural-100 border-agricultural-600 text-agricultural-800 dark:bg-agricultural-950/40 dark:border-agricultural-500 dark:text-agricultural-450 font-bold scale-110 shadow-md'
                      : 'bg-white border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500'
                  } ${isCurrent ? 'ring-4 ring-agricultural-100 dark:ring-agricultural-950/30' : ''}`}
                >
                  <StepIcon size={20} />
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={`text-xs font-semibold ${
                      isCompleted
                        ? 'text-slate-800 dark:text-slate-200'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              </div>

              {/* Connecting progress line */}
              {idx < statuses.length - 1 && (
                <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 self-center relative -top-3 -mx-6 z-0">
                  <div
                    className="h-full bg-agricultural-600 dark:bg-agricultural-500 transition-all duration-500"
                    style={{ width: idx < currentIdx ? '100%' : '0%' }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusTracker;
