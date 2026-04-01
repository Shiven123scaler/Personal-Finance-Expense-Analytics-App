import { createContext, useContext, useReducer, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { getCurrentMonth } from '../utils/dateHelpers';

const FinanceContext = createContext(null);

// Default budget structure
const defaultBudget = {
  monthlyTotal: 30000,
  categories: {
    Food: 8000,
    Travel: 3000,
    Rent: 10000,
    Shopping: 3000,
    Entertainment: 2000,
    Health: 2000,
    Utilities: 1500,
    Subscriptions: 500,
  },
  month: getCurrentMonth(),
};

// Reducer action types
const ACTIONS = {
  SET_TRANSACTIONS: 'SET_TRANSACTIONS',
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
  DELETE_TRANSACTION: 'DELETE_TRANSACTION',
  SET_BUDGET: 'SET_BUDGET',
};

const financeReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_TRANSACTIONS:
      return { ...state, transactions: action.payload };

    case ACTIONS.ADD_TRANSACTION:
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };

    case ACTIONS.UPDATE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };

    case ACTIONS.DELETE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };

    case ACTIONS.SET_BUDGET:
      return { ...state, budget: { ...state.budget, ...action.payload } };

    default:
      return state;
  }
};

export const FinanceProvider = ({ children }) => {
  const [savedTransactions, setSavedTransactions] = useLocalStorage(
    'fintrack_transactions',
    null
  );
  const [savedBudget, setSavedBudget] = useLocalStorage(
    'fintrack_budget',
    null
  );

  // Seed from localStorage or start empty
  const initialState = {
    transactions: savedTransactions || [],
    budget: savedBudget || defaultBudget,
  };

  const [state, dispatch] = useReducer(financeReducer, initialState);

  // Persist transactions to localStorage whenever they change
  useEffect(() => {
    setSavedTransactions(state.transactions);
  }, [state.transactions, setSavedTransactions]);

  // Persist budget to localStorage whenever it changes
  useEffect(() => {
    setSavedBudget(state.budget);
  }, [state.budget, setSavedBudget]);

  const addTransaction = (transaction) => {
    dispatch({ type: ACTIONS.ADD_TRANSACTION, payload: transaction });
  };

  const updateTransaction = (transaction) => {
    dispatch({ type: ACTIONS.UPDATE_TRANSACTION, payload: transaction });
  };

  const deleteTransaction = (id) => {
    dispatch({ type: ACTIONS.DELETE_TRANSACTION, payload: id });
  };

  const setBudget = (budgetData) => {
    dispatch({ type: ACTIONS.SET_BUDGET, payload: budgetData });
  };

  const value = {
    transactions: state.transactions,
    budget: state.budget,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setBudget,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

export default FinanceContext;
