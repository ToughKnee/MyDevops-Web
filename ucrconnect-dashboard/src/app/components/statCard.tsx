import { FC } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  route?: string;
  bgStyle?: string;
}

const StatCard: FC<StatCardProps> = ({ title, value, change, route, bgStyle }) => {
  const isPositive = change >= 0;
  const ArrowIcon = isPositive ? ArrowUp : ArrowDown;
  const changeBg = isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

  const defaultBgStyle = 'bg-white border border-gray-300 text-gray-900';  // Default background color

  return (
    <div className={`p-6 rounded-[25px] flex flex-col justify-between h-[150px] ${bgStyle || defaultBgStyle}`}>
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="flex items-start">
        <p className="text-5xl font-bold">{value}</p>
        <div className={`flex items-center px-2 py-0.5 rounded-md ml-2 text-sm font-medium ${changeBg}`}>
          <ArrowIcon className="w-3 h-3" />
          <span className="ml-1">{isPositive ? '+' : ''}{change}%</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
