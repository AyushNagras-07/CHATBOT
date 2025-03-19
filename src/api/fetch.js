/**
 * api/fetch.js
 * Contains all API functions for the chatbot
 */

// Base URL for your backend API - adjust this to match your backend server
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Fetch a response from the chatbot API
 * @param {string} message - User's message
 * @returns {Promise<Object>} - Response from backend
 */
export const fetchChatResponse = async (message) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in fetchChatResponse:', error);
    throw error;
  }
};

/**
 * Fetch order status information
 * @param {string} orderId - Order ID to look up
 * @returns {Promise<Object>} - Order status information
 */
export const fetchOrderStatus = async (orderId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in fetchOrderStatus:', error);
    throw error;
  }
};

/**
 * Request a refund
 * @param {string} orderId - Order ID to refund
 * @param {string} reason - Reason for refund
 * @returns {Promise<Object>} - Refund information
 */
export const requestRefund = async (orderId, reason) => {
  try {
    const response = await fetch(`${API_BASE_URL}/refunds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId, reason }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in requestRefund:', error);
    throw error;
  }
};

/**
 * Generate return label
 * @param {string} orderId - Order ID for return
 * @param {Object} returnInfo - Return information
 * @returns {Promise<Object>} - Return label information
 */
export const generateReturnLabel = async (orderId, returnInfo) => {
  try {
    const response = await fetch(`${API_BASE_URL}/returns/label`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId, ...returnInfo }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in generateReturnLabel:', error);
    throw error;
  }
};