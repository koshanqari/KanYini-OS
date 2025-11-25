import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  format?: 'currency' | 'number';
  trend?: {
    value: number;
    positive: boolean;
  };
  color?: 'green' | 'blue' | 'orange' | 'indigo' | 'red';
}

export function StatsCard({ title, value, icon: Icon, format = 'number', trend, color = 'blue' }: StatsCardProps) {
  const colorClasses = {
    green: 'text-green-600',
    blue: 'text-blue-600',
    orange: 'text-orange-600',
    indigo: 'text-indigo-600',
    red: 'text-red-600',
  };

  const formattedValue = format === 'currency' ? formatCurrency(value) : formatNumber(value);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${colorClasses[color]}`}>
            {formattedValue}
          </p>
          {trend && (
            <p className={`text-xs mt-1 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 ${colorClasses[color]}`} />
        </div>
      </div>
    </Card>
  );
}

