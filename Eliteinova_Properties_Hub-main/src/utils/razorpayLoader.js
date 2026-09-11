
let razorpayPromise = null;
let isRazorpayLoaded = false;

export const loadRazorpayScript = () => {
  // Return cached promise if already loading
  if (razorpayPromise) {
    return razorpayPromise;
  }

  // Return resolved promise if already loaded
  if (isRazorpayLoaded && window.Razorpay) {
    return Promise.resolve(true);
  }

  razorpayPromise = new Promise((resolve) => {
    try {
      // Check if already loaded
      if (window.Razorpay) {
        isRazorpayLoaded = true;
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        isRazorpayLoaded = true;
        resolve(true);
      };
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        razorpayPromise = null;
        resolve(false);
      };
      document.head.appendChild(script);
    } catch (error) {
      console.error('Error loading Razorpay script:', error);
      razorpayPromise = null;
      resolve(false);
    }
  });

  return razorpayPromise;
};

export const isRazorpayReady = () => {
  return !!(window.Razorpay && isRazorpayLoaded);
};

export default loadRazorpayScript;