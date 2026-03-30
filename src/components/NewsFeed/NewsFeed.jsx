import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdOpenInNew, MdRefresh, MdNewspaper } from 'react-icons/md';
import { formatDistanceToNow } from 'date-fns';

import { fetchFinanceNewsCached } from '../../services/newsService';
import SkeletonLoader from '../UI/SkeletonLoader';

const NewsFeed = ({ className = '' }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const articles = await fetchFinanceNewsCached();
      setNews(articles);
    } catch (err) {
      setError('Could not load news.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 transition-colors duration-200 rounded-xl p-5 border border-gray-100 dark:border-gray-800 ${className}`}>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Finance News</h3>
        <SkeletonLoader count={3} type="line" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white dark:bg-gray-800 transition-colors duration-200 rounded-xl p-5 border border-gray-100 dark:border-gray-800 ${className}`}>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Finance News</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-3">{error}</p>
        <button
          onClick={fetchNews}
          className="flex items-center gap-1 text-sm text-[#185FA5] hover:underline cursor-pointer"
        >
          <MdRefresh className="text-base" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 transition-colors duration-200 rounded-xl p-5 border border-gray-100 dark:border-gray-800 ${className}`}>
      <div className="flex items-center gap-2 mb-4 shrink-0">
        <MdNewspaper className="text-lg text-[#185FA5]" />
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Finance News</h3>
      </div>
      <div className="space-y-3 overflow-y-auto flex-1 pr-1">
        {news.slice(0, 5).map((article, i) => (
          <motion.a
            key={i}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="block px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 dark:bg-gray-900 transition-colors duration-200 transition-colors group"
          >
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2 group-hover:text-[#185FA5] transition-colors">
                  {article.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-gray-400 dark:text-gray-500">{article.source}</span>
                  {article.publishedAt && (
                    <>
                      <span className="text-gray-300">·</span>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500">
                        {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <MdOpenInNew className="text-gray-300 group-hover:text-[#185FA5] shrink-0 mt-0.5 text-sm" />
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;
