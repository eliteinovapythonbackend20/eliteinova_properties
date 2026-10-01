import { useState, useEffect, useMemo } from 'react';

// Client-side pagination over whatever list a page is currently showing
// (e.g. the `properties` array from useNavigation/usePropertyFilter).
// Resets to page 1 whenever the underlying list changes (new category,
// new filters, etc.) and, if a `scrollRef` is given, scrolls that element
// into view on every page change instead of jumping to the window top.
export function usePagination({ items = [], pageSize = 10, scrollRef } = {}) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [items]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  const goToPage = (page) => {
    const clamped = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(clamped);
    scrollRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return { currentPage, totalPages, paginatedItems, goToPage };
}

export default usePagination;
