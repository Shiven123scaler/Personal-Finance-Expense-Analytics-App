import { motion } from 'framer-motion';
import { MdInbox } from 'react-icons/md';

const EmptyState = ({
  icon: Icon = MdInbox,
  title = 'No data yet',
  description = 'Get started by adding your first item.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-16 px-6 ${className}`}
    >
      <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center mb-5">
        <Icon className="text-3xl text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 text-center max-w-sm mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="px-5 py-2.5 bg-[#185FA5] text-white rounded-lg font-medium text-sm hover:bg-[#0C447C] transition-colors shadow-sm cursor-pointer"
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;
