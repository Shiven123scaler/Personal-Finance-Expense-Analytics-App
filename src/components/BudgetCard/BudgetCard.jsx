import ProgressBar from '../UI/ProgressBar';
import { formatINR } from '../../utils/currencyFormatter';

const BudgetCard = ({ totalBudget, totalSpent, remaining, percentUsed, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 transition-colors duration-200 rounded-xl p-6 border border-gray-100 dark:border-gray-800 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Monthly Budget</h3>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500">Budget</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">{formatINR(totalBudget)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500">Spent</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">{formatINR(totalSpent)}</span>
        </div>
        <ProgressBar percent={percentUsed} size="lg" />
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400 dark:text-gray-500">Remaining</span>
          <span className={`font-semibold ${remaining >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {remaining >= 0 ? formatINR(remaining) : `-${formatINR(Math.abs(remaining))}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
