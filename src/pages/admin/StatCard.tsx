import type { ReactNode } from 'react';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from '@heroicons/react/20/solid';

type TrendType = 'up' | 'down' | 'neutral';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  trend?: TrendType;
  change?: string;
  bgColor?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  trend,
  change,
  bgColor = 'bg-neutral-800',
}: StatCardProps) {
  return (
    <div
      className={`${bgColor} rounded-xl p-5 shadow-sm border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-neutral-400">{title}</p>
          <h3 className="text-2xl font-semibold text-white mt-1">{value}</h3>
        </div>
        <div className="p-2 rounded-lg bg-neutral-700/50">{icon}</div>
      </div>

      {trend && change && (
        <div
          className={`mt-3 inline-flex items-center text-xs font-medium rounded-full px-2 py-1 ${trend === 'up'
            ? 'bg-green-900/30 text-green-400'
            : trend === 'down'
              ? 'bg-red-900/30 text-red-400'
              : 'bg-neutral-700 text-neutral-400'
            }`}
        >
          {trend === 'up' ? (
            <ArrowUpIcon className="h-3 w-3 mr-1" />
          ) : trend === 'down' ? (
            <ArrowDownIcon className="h-3 w-3 mr-1" />
          ) : (
            <MinusIcon className="h-3 w-3 mr-1" />
          )}
          {change}
        </div>
      )}
    </div>
  );
}
