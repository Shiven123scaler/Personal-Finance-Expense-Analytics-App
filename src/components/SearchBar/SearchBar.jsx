import { MdSearch, MdClose } from 'react-icons/md';

const SearchBar = ({ value, onChange, resultCount, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xl" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search transactions..."
        className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-800 dark:bg-gray-800 transition-colors duration-200 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5] transition-all"
        id="search-transactions"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:text-gray-500 cursor-pointer"
        >
          <MdClose className="text-lg" />
        </button>
      )}
      {value && resultCount !== undefined && (
        <p className="absolute -bottom-5 left-0 text-xs text-gray-400 dark:text-gray-500">
          {resultCount} result{resultCount !== 1 ? 's' : ''} for &ldquo;{value}&rdquo;
        </p>
      )}
    </div>
  );
};

export default SearchBar;
