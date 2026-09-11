// More robust version with type checking
export const cleanFilters = (filters) => {
  const cleaned = {};
  
  Object.keys(filters).forEach(key => {
    const value = filters[key];
    
    // Skip if value is null, undefined, or empty string
    if (value === null || value === undefined || value === '') {
      return;
    }
    
    // Skip empty arrays
    if (Array.isArray(value) && value.length === 0) {
      return;
    }
    
    // Skip empty objects
    if (typeof value === 'object' && 
        !Array.isArray(value) && 
        Object.keys(value).length === 0) {
      return;
    }
    
    // Recursively clean nested objects
    if (typeof value === 'object' && !Array.isArray(value)) {
      const nestedCleaned = cleanFilters(value);
      if (Object.keys(nestedCleaned).length > 0) {
        cleaned[key] = nestedCleaned;
      }
    } else {
      // Keep the value if it passes all checks
      cleaned[key] = value;
    }
  });
  
  return cleaned;
};