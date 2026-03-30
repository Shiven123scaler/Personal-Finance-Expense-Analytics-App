import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { MdArrowBack } from 'react-icons/md';

import { useFinance } from '../../context/FinanceContext';
import useCurrency from '../../hooks/useCurrency';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../utils/categoryColors';
import { SUPPORTED_CURRENCIES } from '../../services/currencyService';
import { formatCurrency } from '../../utils/currencyFormatter';

const schema = yup.object({
  title: yup.string().min(2, 'Min 2 characters').max(60, 'Max 60 characters').required('Title is required'),
  amount: yup.number().typeError('Enter a valid number').positive('Must be positive').required('Amount is required'),
  category: yup.string().required('Category is required'),
  type: yup.string().oneOf(['income', 'expense']).required('Type is required'),
  date: yup.string().required('Date is required').test('not-future', 'Cannot be a future date', (value) => {
    if (!value) return false;
    return new Date(value) <= new Date();
  }),
  notes: yup.string().max(200, 'Max 200 characters'),
  currency: yup.string().required(),
});

const AddTransaction = () => {
  const navigate = useNavigate();
  const { addTransaction } = useFinance();
  const { convert, rates, loading: ratesLoading } = useCurrency();
  const [selectedType, setSelectedType] = useState('expense');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      amount: '',
      category: '',
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      recurring: false,
      currency: 'INR',
    },
  });

  const watchCurrency = watch('currency');
  const watchAmount = watch('amount');

  const categories = selectedType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setValue('type', type);
    setValue('category', '');
  };

  const onSubmit = async (data) => {
    let finalAmount = Number(data.amount);
    const originalAmount = Number(data.amount);
    const originalCurrency = data.currency;

    if (data.currency !== 'INR' && rates) {
      finalAmount = convert(originalAmount, data.currency);
    }

    const transaction = {
      id: uuidv4(),
      title: data.title,
      amount: finalAmount,
      originalAmount,
      originalCurrency,
      category: data.category,
      type: data.type,
      date: data.date,
      notes: data.notes || '',
      recurring: data.recurring || false,
      createdAt: new Date().toISOString(),
    };

    addTransaction(transaction);
    toast.success('Transaction added ✓');
    navigate('/transactions');
  };

  const convertedPreview =
    watchCurrency && watchCurrency !== 'INR' && watchAmount && rates
      ? convert(Number(watchAmount), watchCurrency)
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-lg mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 dark:text-gray-500 transition-colors cursor-pointer"
        >
          <MdArrowBack className="text-xl" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Add Transaction</h1>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 transition-colors duration-200 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
        {/* Type toggle */}
        <div className="flex gap-2 mb-6">
          {['expense', 'income'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleTypeChange(type)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                selectedType === type
                  ? type === 'expense'
                    ? 'bg-[#FCEBEB] text-[#791F1F]'
                    : 'bg-[#EAF3DE] text-[#27500A]'
                  : 'bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 dark:bg-gray-700'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input
              {...register('title')}
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5]"
              placeholder="e.g., Swiggy dinner"
              id="transaction-title"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          {/* Amount + Currency */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
              <input
                {...register('amount')}
                type="number"
                step="0.01"
                className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5]"
                placeholder="0.00"
                id="transaction-amount"
              />
              {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
            </div>
            <div className="w-28">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Currency</label>
              <select
                {...register('currency')}
                className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5] bg-white dark:bg-gray-800 transition-colors duration-200"
                id="transaction-currency"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Conversion preview */}
          {convertedPreview !== null && (
            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 -mt-2">
              ≈ ₹{convertedPreview.toLocaleString('en-IN')} INR
              {ratesLoading && ' (fetching rates...)'}
            </p>
          )}

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select
              {...register('category')}
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5] bg-white dark:bg-gray-800 transition-colors duration-200"
              id="transaction-category"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
            <input
              {...register('date')}
              type="date"
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5]"
              id="transaction-date"
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes (optional)</label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5] resize-none"
              placeholder="Add a note..."
              id="transaction-notes"
            />
            {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes.message}</p>}
          </div>

          {/* Recurring */}
          <div className="flex items-center justify-between py-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Recurring transaction</label>
            <input
              type="checkbox"
              {...register('recurring')}
              className="w-4 h-4 text-[#185FA5] rounded focus:ring-[#185FA5] cursor-pointer"
              id="transaction-recurring"
            />
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-3 bg-[#185FA5] text-white rounded-xl font-semibold text-sm hover:bg-[#0C447C] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? 'Adding...' : 'Add Transaction'}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default AddTransaction;
