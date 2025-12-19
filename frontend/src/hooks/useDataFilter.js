import { useMemo } from 'react';

/**
 * Universal hook for filtering and sorting arrays of data.
 * * @param {Array} data - The raw list of items.
 * @param {Object} state - The current state values { searchQuery, sortBy, sortDirection }.
 * @param {Object} config - Configuration strategies { searchKeys, sortStrategies }.
 * @returns {Array} - The processed list.
 */
export const useDataFilter = (data, { searchQuery, sortBy, sortDirection }, config = {}) => {
  return useMemo(() => {
    if (!data) return [];
    
    let result = [...data];

    // --- 1. Filter Logic ---
    if (searchQuery && searchQuery.trim() !== '' && searchQuery !== 'show-all') {
      const query = searchQuery.toLowerCase().trim();
      
      result = result.filter(item => {
        // Use specific keys if provided (e.g., ['title', 'authorName'])
        if (config.searchKeys) {
          return config.searchKeys.some(key => {
            const val = item[key];
            return val && String(val).toLowerCase().includes(query);
          });
        }
        // Fallback: Check all string properties
        return Object.values(item).some(val => 
          val && String(val).toLowerCase().includes(query)
        );
      });
    }

    // --- 2. Sort Logic ---
    if (sortBy) {
      const strategy = config.sortStrategies?.[sortBy];

      result.sort((a, b) => {
        let comparison = 0;

        if (strategy) {
          // Use custom strategy if defined
          comparison = strategy(a, b);
        } else {
          // Default string fallback
          const valA = a[sortBy] ? String(a[sortBy]).toLowerCase() : '';
          const valB = b[sortBy] ? String(b[sortBy]).toLowerCase() : '';
          comparison = valA.localeCompare(valB);
        }

        // Apply Direction
        return sortDirection === 'asc' ? comparison : comparison * -1;
      });
    }

    return result;
  }, [data, searchQuery, sortBy, sortDirection, config]);
};