import axios from "./axiosInstance";

///////////////////////////////////////
///// GET - ALL CUSTOMER ORDERS  //////
///////////////////////////////////////
export async function indexCustomerOrders() {
  try {
    const response = await axios.get("/customer-orders");
    return response.data;
  } catch (error) {
    console.error("Error fetching customer orders:", error.response?.data || error.message);
    throw error;
  }
}

////////////////////////////////////////
///// GET - SINGLE CUSTOMER ORDER  /////
////////////////////////////////////////
export async function showCustomerOrder(id) {
  try {
    const response = await axios.get(`/customer-orders/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching customer order:", error.response?.data || error.message);
    throw error;
  }
}

////////////////////////////////////////
///// POST - CREATE CUSTOMER ORDER /////
////////////////////////////////////////
export async function createCustomerOrder(data) {
  try {
    const response = await axios.post("/customer-orders", data);
    return response.data;
  } catch (error) {
    console.error("Error creating customer order:", error.response?.data || error.message);
    throw error;
  }
}

////////////////////////////////////////
///// PUT - UPDATE CUSTOMER ORDER  /////
////////////////////////////////////////
export async function updateCustomerOrder(id, data) {
  try {
    const response = await axios.put(`/customer-orders/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating customer order:", error.response?.data || error.message);
    throw error;
  }
}

////////////////////////////////////////
///// DELETE - CUSTOMER ORDER  /////////
////////////////////////////////////////
export async function deleteCustomerOrder(id) {
  try {
    const response = await axios.delete(`/customer-orders/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting customer order:", error.response?.data || error.message);
    throw error;
  }
}
