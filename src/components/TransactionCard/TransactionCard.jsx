import { motion } from 'framer-motion';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { formatINR, formatCurrency } from '../../utils/currencyFormatter';
import { formatDate } from '../../utils/dateHelpers';
import { getCategoryColor } from '../../utils/categoryColors';

const TransactionCard = ({ transaction, onDelete }) => {
  const navigate = useNavigate();
  const { id, title, amount, originalAmount, originalCurrency, category, type, date, notes, recurring } = transaction;
  const catColor = getCategoryColor(category);
  const isExpense = type === 'expense';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white dark:bg-gray-800 transition-colors duration-200 rounded-xl p-4 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow group"
    >
      <div className="flex items-center gap-4">
        {/* Category badge */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
          style={{ backgroundColor: catColor.bg, color: catColor.text }}
        >
          {category.slice(0, 2).toUpperCase()}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {title}
            </h4>
            {recurring && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#EEEDFE] text-[#3C3489]">
                ↻
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium"
              style={{ backgroundColor: catColor.bg, color: catColor.text }}
            >
              {category}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(date)}</span>
          </div>
          {notes && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">{notes}</p>
          )}
        </div>

        {/* Amount + actions */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p
              className={`text-sm font-bold ${
                isExpense ? 'text-[#791F1F]' : 'text-[#27500A]'
              }`}
            >
              {isExpense ? '-' : '+'}{formatINR(amount)}
            </p>
            {originalCurrency !== 'INR' && (
              <p className="text-[10px] text-gray-400 dark:text-gray-500">
                {formatCurrency(originalAmount, originalCurrency)}
              </p>
            )}
          </div>

          {/* Action buttons — visible on hover */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => navigate(`/transactions/${id}/edit`)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 hover:text-[#185FA5] transition-colors cursor-pointer"
              title="Edit"
            >
              <MdEdit className="text-base" />
            </button>
            <button
              onClick={() => onDelete && onDelete(id)}
              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
              title="Delete"
            >
              <MdDelete className="text-base" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionCard;
