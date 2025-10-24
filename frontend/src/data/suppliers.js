import axios from "./axiosInstance";

///////////////////////////////
///// GET - ALL SUPPLIERS /////
///////////////////////////////
export async function indexSuppliers() {
  try {
    const response = await axios.get("/suppliers");
    return response.data;
  } catch (error) {
    console.error("Error fetching suppliers:", error.response?.data || error.message);
    throw error;
  }
}

/////////////////////////////////
///// GET - SINGLE SUPPLIER /////
/////////////////////////////////
export async function showSupplier(id) {
  try {
    const response = await axios.get(`/suppliers/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching supplier:", error.response?.data || error.message);
    throw error;
  }
}

//////////////////////////////////
///// POST - CREATE SUPPLIER /////
//////////////////////////////////
export async function createSupplier(data) {
  try {
    const response = await axios.post("/suppliers", data);
    return response.data;
  } catch (error) {
    console.error("Error creating supplier:", error.response?.data || error.message);
    throw error;
  }
}

/////////////////////////////////
///// PUT - UPDATE SUPPLIER /////
/////////////////////////////////
export async function updateSupplier(id, data) {
  try {
    const response = await axios.put(`/suppliers/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating supplier:", error.response?.data || error.message);
    throw error;
  }
}

/////////////////////////////
///// DELETE - SUPPLIER /////
/////////////////////////////
export async function deleteSupplier(id) {
  try {
    const response = await axios.delete(`/suppliers/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting supplier:", error.response?.data || error.message);
    throw error;
  }
}
