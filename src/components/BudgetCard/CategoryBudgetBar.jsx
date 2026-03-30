import ProgressBar from '../UI/ProgressBar';
import { formatINR } from '../../utils/currencyFormatter';
import { getCategoryColor } from '../../utils/categoryColors';

const CategoryBudgetBar = ({ category, budget, spent, percentUsed }) => {
  const color = getCategoryColor(category);

  return (
    <div className="py-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium"
            style={{ backgroundColor: color.bg, color: color.text }}
          >
            {category}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500">{formatINR(spent)} / {formatINR(budget)}</span>
        </div>
      </div>
      <ProgressBar percent={percentUsed} size="sm" showLabel={false} />
    </div>
  );
};

export default CategoryBudgetBar;
