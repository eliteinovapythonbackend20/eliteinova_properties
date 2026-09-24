import { useCallback, useEffect, useState } from 'react';
import adminDashboardService from '../services/adminDashboardService';

export const LISTING_TYPE_FROM_BACKEND = { SELL: 'Buy', RENT: 'Rent', LEASE: 'Lease' };
export const LISTING_TYPE_TO_BACKEND = { Buy: 'SELL', Rent: 'RENT', Lease: 'LEASE' };

export function useAdminPropertyList({
  propertyCategory,
  fixedPropertyType,
  fixedListingType,
  fixedSubCategory,
  mapCard,
  initialSortField = 'propertyTitle',
  initialSortDirection = 'asc',
  initialPageSize = 10,
}) {
  const [properties, setProperties] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortField, setSortField] = useState(initialSortField);
  const [sortDirection, setSortDirection] = useState(initialSortDirection);
  const [activePropertyType, setActivePropertyType] = useState('all');
  const [activeListingType, setActiveListingType] = useState('all');
  const [activeSubCategory, setActiveSubCategory] = useState('all');
  const [filterCount, setFilterCount] = useState(0);

  // The type actually sent with every list request - either the page's
  // fixed subtype, or whatever's currently picked in an Overview page's
  // subtype filter dropdown.
  const effectivePropertyType = fixedPropertyType || (activePropertyType !== 'all' ? activePropertyType : undefined);
  // Same idea for listing purpose - a page like Rental/Lease Apartment
  // fixes both dimensions at once (fixedPropertyType AND fixedListingType),
  // since propertyType alone isn't enough to scope those pages correctly.
  const effectiveListingType = fixedListingType || (activeListingType !== 'all' ? activeListingType : undefined);
  // Same idea again for sub_category - Land & Plots subtype pages (e.g.
  // "Residential Land / Plots") fix this instead of propertyType, since
  // property_type there is the fine-grained landType (Villa Plot, Farm
  // House Plot, ...) and is the page's own dynamic filter dimension, not
  // its fixed one.
  const effectiveSubCategory = fixedSubCategory || (activeSubCategory !== 'all' ? activeSubCategory : undefined);

  // ============ DEBOUNCE SEARCH (1500ms, matches AllProperties.jsx) ============
  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 1500);
    return () => clearTimeout(handle);
  }, [searchQuery]);

  useEffect(() => {
    let count = 0;
    if (!fixedPropertyType && activePropertyType !== 'all') count++;
    if (!fixedListingType && activeListingType !== 'all') count++;
    if (!fixedSubCategory && activeSubCategory !== 'all') count++;
    if (searchQuery) count++;
    setFilterCount(count);
  }, [fixedPropertyType, fixedListingType, fixedSubCategory, activePropertyType, activeListingType, activeSubCategory, searchQuery]);

  // ============ FETCH GLOBAL STATS ============
  // Always scoped to fixedPropertyType/fixedSubCategory only (never the
  // dynamic activePropertyType/activeSubCategory filter) - stats must
  // reflect the complete dataset for this page's scope, not whatever
  // subtype/listing filter is active.
  const fetchStats = useCallback(async () => {
    try {
      const response = await adminDashboardService.getPropertyStats({
        propertyCategory,
        propertyType: fixedPropertyType,
        subCategory: fixedSubCategory,
      });
      setStats(response?.data || {});
    } catch (error) {
      console.error('Error fetching property stats:', error);
    }
  }, [propertyCategory, fixedPropertyType, fixedSubCategory]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  // ============ FETCH THE CURRENT PAGE ============
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminDashboardService.listProperties({
        page: currentPage,
        limit: pageSize,
        propertyCategory,
        propertyType: effectivePropertyType,
        subCategory: effectiveSubCategory,
        listingPurpose: effectiveListingType ? LISTING_TYPE_TO_BACKEND[effectiveListingType] : undefined,
        search: debouncedSearchQuery || undefined,
      });
      const mapped = (response?.data || []).map(mapCard);
      setProperties(mapped);
      setTotalCount(response?.pagination?.total ?? mapped.length);
      return mapped;
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, propertyCategory, effectivePropertyType, effectiveListingType, effectiveSubCategory, debouncedSearchQuery, mapCard]);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  // ============ SORT (client-side, current page only - no backend sort) ============
  const handleSort = useCallback((field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  const sortedProperties = [...properties].sort((a, b) => {
    let aVal = a[sortField] || '';
    let bVal = b[sortField] || '';
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // ============ FILTER CHANGE HELPERS (reset to page 1 together) ============
  const changePropertyType = useCallback((value) => {
    setActivePropertyType(value);
    setCurrentPage(1);
  }, []);

  const changeListingType = useCallback((value) => {
    setActiveListingType(value);
    setCurrentPage(1);
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setActivePropertyType('all');
    setActiveListingType('all');
    setCurrentPage(1);
  }, []);

  // A deliberate clear (the search box's "X" button), not the user still
  // typing - skips the debounce wait so the backend request fires
  // immediately, unlike setSearchQuery itself which is meant for onChange.
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setCurrentPage(1);
  }, []);

  // ============ FETCH EVERY PAGE MATCHING CURRENT FILTERS (for Export) ============
  const fetchAllFiltered = useCallback(async () => {
    const baseParams = {
      propertyCategory,
      propertyType: effectivePropertyType,
      listingPurpose: effectiveListingType ? LISTING_TYPE_TO_BACKEND[effectiveListingType] : undefined,
      search: debouncedSearchQuery || undefined,
    };
    let all = [];
    let page = 1;
    let total = Infinity;
    while (all.length < total) {
      const response = await adminDashboardService.listProperties({ ...baseParams, page, limit: 100 });
      const mapped = (response?.data || []).map(mapCard);
      if (mapped.length === 0) break;
      all = all.concat(mapped);
      total = response?.pagination?.total ?? all.length;
      page += 1;
    }
    return all;
  }, [propertyCategory, effectivePropertyType, effectiveListingType, debouncedSearchQuery, mapCard]);

  return {
    // data
    properties: sortedProperties,
    totalCount,
    loading,
    stats,
    // pagination
    currentPage, setCurrentPage,
    pageSize, setPageSize,
    totalPages,
    // sort
    sortField, sortDirection, handleSort,
    // filters
    searchQuery, setSearchQuery,
    clearSearch,
    activePropertyType, setActivePropertyType: changePropertyType,
    activeListingType, setActiveListingType: changeListingType,
    filterCount,
    clearAllFilters,
    // actions
    fetchProperties,
    fetchStats,
    fetchAllFiltered,
    refetchAll: useCallback(async () => { await fetchProperties(); await fetchStats(); }, [fetchProperties, fetchStats]),
  };
}

export default useAdminPropertyList;
