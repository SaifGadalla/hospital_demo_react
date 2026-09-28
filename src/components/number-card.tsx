import React from 'react';

type NumberCardProps = {
  title: string;
  icon: React.ReactNode;
  value: string | number;
  subtitle?: string;
};

export default function NumberCard({ title, icon, value, subtitle }: NumberCardProps) {
  return (
    <div className="w-full h-full p-6 rounded-2xl border border-border-theme bg-surface shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-start items-start">
      <div className="flex w-full items-start justify-between gap-4">
        <span className="flex-1 text-bodyMedium font-medium text-text-secondary">
          {title}
        </span>
        <div className="p-2 rounded-xl bg-primary-light/10 text-primary text-xl flex items-center justify-center">
          {icon}
        </div>
      </div>
      
      <div className="mt-4">
        <h2 className="text-h1 text-text-primary">
          {value}
        </h2>
        {subtitle && (
          <p className="mt-1 text-caption text-text-secondary">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
