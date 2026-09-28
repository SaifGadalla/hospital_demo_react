import React from 'react';

type StatisticsCardProps = {
  title: React.ReactNode;
  action: React.ReactNode;
  content: React.ReactNode;
  className?: string;
};

export default function StatisticsCard({ title, action, content, className = '' }: StatisticsCardProps) {
  return (
    <div className={`flex flex-col rounded-2xl border border-border-theme bg-surface shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden h-full ${className}`}>
      {/* Header Row */}
      <div className="p-4 flex items-center justify-between shrink-0">
        <div className="flex-1">
          {title}
        </div>
        <div className="ml-4">
          {action}
        </div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 w-full overflow-auto custom-scrollbar">
        {content}
      </div>
    </div>
  );
}
