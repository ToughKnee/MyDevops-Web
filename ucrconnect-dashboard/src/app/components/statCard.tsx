import { FC } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  route?: string;
  bgStyle?: string;
  iconSize?: string; // Customizable icon size
}

const StatCard: FC<StatCardProps> = ({
  title,
  value,
  change,
  route,
  bgStyle,
  iconSize = 'w-3 h-3', // Default icon size
}) => {
  const isPositive = change >= 0;
  const ArrowIcon = isPositive ? ArrowUp : ArrowDown;
  const changeBg = isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

  const defaultBgStyle = 'bg-white border border-gray-300 text-gray-900'; // Default background color

  const content = (
    <div
      className={`p-6 rounded-[25px] flex flex-col justify-between ${bgStyle || defaultBgStyle}`}
      role="region"
      aria-labelledby={`${title}-stat`}
    >
      <h3 id={`${title}-stat`} className="text-lg font-medium">{title}</h3>
      <div className="flex items-start">
        <p className="text-5xl font-bold">{value}</p>
        <div className={`flex items-center px-2 py-0.5 rounded-md ml-2 text-sm font-medium ${changeBg}`}>
          <ArrowIcon className={iconSize} />
          <span className="ml-1">{isPositive ? '+' : ''}{change}%</span>
        </div>
      </div>
    </div>
  );

  if (route) {
    return (
      <div
        className="block cursor-pointer"
        onClick={() => window.location.href = route}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && (window.location.href = route)}
      >
        {content}
      </div>
    );
  }

  return content;
};

export default StatCard;