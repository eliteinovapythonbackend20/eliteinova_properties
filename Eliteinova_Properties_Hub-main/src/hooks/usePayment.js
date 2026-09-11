import { useState, useCallback, useRef } from 'react';
import {paymentService} from '../services/paymentService.js';
import { loadRazorpayScript, isRazorpayReady } from '../utils/razorpayLoader';

export const usePayment = (propertyData, onSuccess, onError) => {
  const [status, setStatus] = useState('idle'); // idle, processing, success, failed
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState({
    orderId: null,
    paymentId: null,
    signature: null,
    amount: null
  });
  
  const razorpayInstanceRef = useRef(null);


  const initiatePayment = useCallback(async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    setStatus('processing');
    setError(null);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error('Payment gateway failed to load. Please try again.');
      }

      // 2. Create order via backend
      const orderResult = await paymentService.createOrder({
        propertyCategory: propertyData.propertyCategory,
        listingPurpose: propertyData.listingPurpose,
        expectedPrice: propertyData.expectedPrice || null,
        groundSize: propertyData.groundSize || null,
        userId: propertyData.userId,
        propertyId: propertyData.propertyId || null,
        currency: 'INR'
      });

      if (!orderResult.order_id) {
        throw new Error('Failed to create payment order');
      }

      // Store order info
      setPaymentData(prev => ({
        ...prev,
        orderId: orderResult.order_id,
        amount: orderResult.amount
      }));

      const options = {
        key: orderResult.key_id,
        amount: orderResult.amount,
        currency: orderResult.currency || 'INR',
        name: 'Eliteinova Real Estate',
        description: `Property Listing Fee - ${propertyData.propertyCategory || 'Individual'} ${propertyData.listingPurpose || 'Rent'}`,
        order_id: orderResult.order_id,
        image: '', 
        prefill: {
          name: propertyData.fullName || propertyData.agencyName || 'Customer',
          email: propertyData.emailId || propertyData.agentEmail || 'customer@example.com',
          contact: propertyData.mobileNumber || propertyData.agentMobile || '9999999999'
        },
        theme: {
          color: '#00695C'
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setStatus('idle');
          }
        },
        handler: async (response) => {
          try {
            const verifyResult = await paymentService.verifyPayment({
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyResult.is_valid) {
              const paymentInfo = {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                amount: orderResult.amount
              };

              setPaymentData(paymentInfo);
              setStatus('success');
              setIsProcessing(false);

              if (onSuccess) {
                onSuccess(paymentInfo);
              }
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            setStatus('failed');
            setError(error.message || 'Payment verification failed');
            setIsProcessing(false);
            if (onError) onError(error);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpayInstanceRef.current = razorpay;
      razorpay.open();

    } catch (error) {
      setStatus('failed');
      setError(error.message || 'Payment initiation failed');
      setIsProcessing(false);
      if (onError) onError(error);
    }
  }, [propertyData, onSuccess, onError, isProcessing]);

  const resetPayment = useCallback(() => {
    setStatus('idle');
    setIsProcessing(false);
    setError(null);
    setPaymentData({
      orderId: null,
      paymentId: null,
      signature: null,
      amount: null
    });
    if (razorpayInstanceRef.current) {
      razorpayInstanceRef.current = null;
    }
  }, []);

  return {
    initiatePayment,
    resetPayment,
    status,
    isProcessing,
    error,
    paymentData 
  };
};

export default usePayment;