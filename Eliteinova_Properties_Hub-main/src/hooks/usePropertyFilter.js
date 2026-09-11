// hooks/usePropertyFilter.js
import { useState, useCallback } from 'react';
import { searchProperties } from '../services/filterService';
import { cleanFilters } from './filterCleanUp';
import { toCanonicalFilter } from '../adapters/filterAdapters';

/**
 * @param {'apartment'|'commercial'|'land'|'hostel'|'individual'} [family]
 *   Which per-family adapter to run the panel's raw output through before it's
 *   sent to the backend. Omit to send filters through as-is (already-canonical).
 */
export const usePropertyFilter = (family) => {
  const [filteredData, setFilteredData] = useState([]);
  const [filterLoading, setFilterLoading] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);

  const handleFilterChange = useCallback(async (rawFilters, ctx) => {
    const canonical = family ? toCanonicalFilter(family, rawFilters, ctx) : rawFilters;
    const cleanedFilters = cleanFilters(canonical);
    const filters = {
      ...cleanedFilters,
      page: 1,
      limit: 20,
      sortBy: "created_at",
      sortOrder: "desc"
    };
    setAppliedFilters(filters);
    setFilterLoading(true);
    console.log("Applied Filters:", filters);

    try {
      const filteredResponse = await searchProperties(filters);
      console.log("Filtered Response:", filteredResponse);
      const data = filteredResponse?.data?.data || filteredResponse?.data || [];
      setFilteredData(data);
      return data;
    } catch (error) {
      console.error("Error fetching filtered properties:", error);
      setFilteredData([]);
      throw error;
    } finally {
      setFilterLoading(false);
    }
  }, [family]);

  const resetFilters = useCallback(() => {
    setAppliedFilters(null);
    setFilteredData([]);
  }, []);

  return {
    filteredData,
    filterLoading,
    appliedFilters,
    handleFilterChange,
    resetFilters
  };
};