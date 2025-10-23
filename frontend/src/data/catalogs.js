import axios from "./axiosInstance";

//////////////////////////////
///// GET - ALL CATALOGS /////
//////////////////////////////
export async function indexCatalogs() {
  try {
    const response = await axios.get("/catalogs");
    return response.data;
  } catch (error) {
    console.error("Error fetching catalogs:", error.response?.data || error.message);
    throw error;
  }
}

////////////////////////////////
///// GET - SINGLE CATALOG /////
////////////////////////////////
export async function showCatalog(id) {
  try {
    const response = await axios.get(`/catalogs/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching catalog:", error.response?.data || error.message);
    throw error;
  }
}

/////////////////////////////////
///// POST - CREATE CATALOG /////
/////////////////////////////////
export async function createCatalog(data) {
  try {
    const response = await axios.post("/catalogs", data);
    return response.data;
  } catch (error) {
    console.error("Error creating catalog:", error.response?.data || error.message);
    throw error;
  }
}

////////////////////////////////
///// PUT - UPDATE CATALOG /////
////////////////////////////////
export async function updateCatalog(id, data) {
  try {
    const response = await axios.put(`/catalogs/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating catalog:", error.response?.data || error.message);
    throw error;
  }
}

////////////////////////////
///// DELETE - CATALOG /////
////////////////////////////
export async function deleteCatalog(id) {
  try {
    const response = await axios.delete(`/catalogs/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting catalog:", error.response?.data || error.message);
    throw error;
  }
}
