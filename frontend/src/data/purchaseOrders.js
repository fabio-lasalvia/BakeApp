import axios from "./axiosInstance";

/////////////////////////////////////
///// GET - ALL PURCHASE ORDERS /////
/////////////////////////////////////
export async function indexPurchaseOrders() {
  try {
    const response = await axios.get("/purchase-orders");
    return response.data;
  } catch (error) {
    console.error("Error fetching purchase orders:", error.response?.data || error.message);
    throw error;
  }
}

///////////////////////////////////////
///// GET - SINGLE PURCHASE ORDER /////
///////////////////////////////////////
export async function showPurchaseOrder(id) {
  try {
    const response = await axios.get(`/purchase-orders/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching purchase order:", error.response?.data || error.message);
    throw error;
  }
}

////////////////////////////////////////
///// POST - CREATE PURCHASE ORDER /////
////////////////////////////////////////
export async function createPurchaseOrder(data) {
  try {
    const response = await axios.post("/purchase-orders", data);
    return response.data;
  } catch (error) {
    console.error("Error creating purchase order:", error.response?.data || error.message);
    throw error;
  }
}

///////////////////////////////////////
///// PUT - UPDATE PURCHASE ORDER /////
///////////////////////////////////////
export async function updatePurchaseOrder(id, data) {
  try {
    const response = await axios.put(`/purchase-orders/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating purchase order:", error.response?.data || error.message);
    throw error;
  }
}

///////////////////////////////////
///// DELETE - PURCHASE ORDER /////
///////////////////////////////////
export async function deletePurchaseOrder(id) {
  try {
    const response = await axios.delete(`/purchase-orders/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting purchase order:", error.response?.data || error.message);
    throw error;
  }
}
