// src/hooks/useToast.js
// Extracted from the toast state/logic duplicated across the admin dashboard
// (e.g. AgentsRegistration.jsx) into one reusable hook. Pair with
// <Toast toast={toast} /> (src/components/common/Toast.jsx) to render it.
import { useCallback, useRef, useState } from 'react';

export const useToast = () => {
  const [toast, setToast] = useState(null);
  const timeoutRef = useRef(null);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToast({ message, type });
    timeoutRef.current = setTimeout(() => setToast(null), duration);
  }, []);

  const hideToast = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setToast(null);
  }, []);

  return { toast, showToast, hideToast };
};

export default useToast;
