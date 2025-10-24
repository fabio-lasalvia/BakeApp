import axios from "./axiosInstance";

//////////////////////////////
///// GET - ALL INVOICES /////
//////////////////////////////
export async function indexInvoices() {
  try {
    const response = await axios.get("/invoices");
    return response.data;
  } catch (error) {
    console.error("Error fetching invoices:", error.response?.data || error.message);
    throw error;
  }
}

////////////////////////////////
///// GET - SINGLE INVOICE /////
////////////////////////////////
export async function showInvoice(id) {
  try {
    const response = await axios.get(`/invoices/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching invoice:", error.response?.data || error.message);
    throw error;
  }
}

/////////////////////////////////
///// POST - CREATE INVOICE /////
/////////////////////////////////
export async function createInvoice(data) {
  try {
    const response = await axios.post("/invoices", data);
    return response.data;
  } catch (error) {
    console.error("Error creating invoice:", error.response?.data || error.message);
    throw error;
  }
}

////////////////////////////////
///// PUT - UPDATE INVOICE /////
////////////////////////////////
export async function updateInvoice(id, data) {
  try {
    const response = await axios.put(`/invoices/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating invoice:", error.response?.data || error.message);
    throw error;
  }
}

////////////////////////////
///// DELETE - INVOICE /////
////////////////////////////
export async function deleteInvoice(id) {
  try {
    const response = await axios.delete(`/invoices/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting invoice:", error.response?.data || error.message);
    throw error;
  }
}
