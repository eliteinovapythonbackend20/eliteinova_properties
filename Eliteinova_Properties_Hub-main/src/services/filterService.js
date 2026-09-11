import axiosInstance from '../api/axiosInstance';

export const searchProperties = async (filters = {}) => {
  try {
    console.log('📤 Sending to backend:', filters);

    const response = await axiosInstance.post('/filters/search', filters);
    return response.data;
  } catch (error) {
    console.error('❌ Search Error:', error.response?.data);
    throw error.response?.data || error.message;
  }
};

export const searchPropertiesSimple = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/filters/search', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const searchByCategory = async (category, params = {}) => {
  try {
    const response = await axiosInstance.get('/properties/by-category', {
      params: { property_category: category, ...params },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const searchByPurpose = async (purpose, params = {}) => {
  try {
    const response = await axiosInstance.get('/properties/by-purpose', {
      params: { listing_purpose: purpose, ...params },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const searchByPropertyType = async (type, params = {}) => {
  try {
    const response = await axiosInstance.get('/properties/by-property-type', {
      params: { property_type: type, ...params },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const searchBySubCategory = async (subCategory,params ={}) =>{
    try{
      // console.log("Applied filter: ",{property_type:type,property_category:category,sub_category:subCategory});
      const response = await axiosInstance.get("/filters/category/sub_category",{
        params: {sub_category:subCategory, ...params},
      });
      return response?.data;
    }
    catch(error){
      throw error.response?.data || error.message;
    }
};