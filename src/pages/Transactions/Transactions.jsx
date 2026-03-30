import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { MdAdd, MdSort, MdArrowUpward, MdArrowDownward } from 'react-icons/md';

import { useFinance } from '../../context/FinanceContext';
import useTransactions from '../../hooks/useTransactions';
import TransactionCard from '../../components/TransactionCard/TransactionCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import Filters from '../../components/Filters/Filters';
import ConfirmModal from '../../components/UI/ConfirmModal';
import EmptyState from '../../components/UI/EmptyState';

const ITEMS_PER_PAGE = 15;

const Transactions = () => {
  const navigate = useNavigate();
  const { deleteTransaction } = useFinance();
  const { filtered, search, setSearch, filters, setFilters, sort, setSort } = useTransactions();

  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteTransaction(deleteId);
      toast.error('Deleted');
      setDeleteId(null);
    }
  };

  const handleSort = (field) => {
    setSort((prev) => ({
      by: field,
      direction: prev.by === field && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Transactions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">
            {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/transactions/new')}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#185FA5] text-white rounded-xl font-medium text-sm hover:bg-[#0C447C] transition-colors shadow-sm cursor-pointer"
        >
          <MdAdd className="text-lg" />
          Add Transaction
        </motion.button>
      </div>

      {/* Search + Filters */}
      <div className="space-y-3 mb-6">
        <SearchBar value={search} onChange={setSearch} resultCount={search ? filtered.length : undefined} />
        <div className="flex flex-wrap items-center gap-3">
          <Filters filters={filters} setFilters={setFilters} />

          {/* Sort buttons */}
          <div className="flex items-center gap-1 ml-auto">
            <span className="text-xs text-gray-400 dark:text-gray-500 mr-1"><MdSort className="inline text-base" /> Sort:</span>
            {['date', 'amount', 'category'].map((field) => (
              <button
                key={field}
                onClick={() => handleSort(field)}
                className={`flex items-center gap-0.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  sort.by === field
                    ? 'bg-[#E6F1FB] text-[#0C447C]'
                    : 'text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/50 dark:bg-gray-700/50'
                }`}
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
                {sort.by === field && (
                  sort.direction === 'asc'
                    ? <MdArrowUpward className="text-xs" />
                    : <MdArrowDownward className="text-xs" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction list */}
      {filtered.length === 0 ? (
        <EmptyState
          title={search || Object.values(filters).some((v) => v && (Array.isArray(v) ? v.length : true))
            ? 'No transactions match your search'
            : 'No transactions yet'}
          description={search ? `No results for "${search}"` : 'Add your first transaction to get started!'}
          actionLabel={!search ? 'Add Transaction' : undefined}
          onAction={!search ? () => navigate('/transactions/new') : undefined}
        />
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {paginated.map((tx) => (
              <TransactionCard
                key={tx.id}
                transaction={tx}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 py-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Showing {startIdx + 1}–{Math.min(startIdx + ITEMS_PER_PAGE, filtered.length)} of {filtered.length} transactions
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700/30 dark:bg-gray-900 transition-colors duration-200 transition-colors cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700/30 dark:bg-gray-900 transition-colors duration-200 transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Transaction?"
        message="This action cannot be undone. The transaction will be permanently removed."
      />
    </motion.div>
  );
};

export default Transactions;
