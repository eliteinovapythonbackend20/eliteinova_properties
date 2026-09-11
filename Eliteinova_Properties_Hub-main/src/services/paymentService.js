// PaymentService.js
import axiosInstance from '../api/axiosInstance.js';

const API_BASE_URL = 'http://localhost:8000';

export const paymentService = {
    createOrder: async (propertyData) => {
        try {
            const response = await axiosInstance.post(
                `${API_BASE_URL}/api/v1/payments/create-order`,
                {
                    property_category: propertyData.category,
                    listing_purpose: propertyData.purpose,
                    expected_price: propertyData.expectedPrice,
                    ground_size: propertyData.groundSize || null,
                    currency: "INR",
                    user_id: propertyData.userId,
                    property_id: propertyData.propertyId || null  // ← Must be null
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            
            return response.data;
        } catch (error) {
            console.error('Order creation error:', error);
            throw error;
        }
    },
    
    verifyPayment: async (paymentData) => {
        try {
            const response = await axiosInstance.post(
                `${API_BASE_URL}/api/v1/payments/verify-payment`,
                {
                    order_id: paymentData.razorpay_order_id,
                    payment_id: paymentData.razorpay_payment_id,
                    razorpay_signature: paymentData.razorpay_signature
                }
            );
            
            return response.data;
        } catch (error) {
            console.error('Payment verification error:', error);
            throw error;
        }
    },
    
    getTransaction: async (orderId) => {
        try {
            const response = await axiosInstance.get(
                `${API_BASE_URL}/api/v1/payments/transaction/${orderId}`
            );
            return response.data;
        } catch (error) {
            console.error('Transaction fetch error:', error);
            throw error;
        }
    }
};