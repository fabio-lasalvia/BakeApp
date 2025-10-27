import axios from "./axiosInstance";

//////////////////////////////
///// GET - ALL PRODUCTS /////
//////////////////////////////
export async function indexProducts() {
  try {
    const response = await axios.get("/products");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error.response?.data || error.message);
    throw error;
  }
}

////////////////////////////////
///// GET - SINGLE PRODUCT /////
////////////////////////////////
export async function showProduct(id) {
  try {
    const response = await axios.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error.response?.data || error.message);
    throw error;
  }
}

/////////////////////////////////
///// POST - CREATE PRODUCT /////
/////////////////////////////////
export async function createProduct(data) {
  try {
    const response = await axios.post("/products", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error.response?.data || error.message);
    throw error;
  }
}

////////////////////////////////
///// PUT - UPDATE PRODUCT /////
////////////////////////////////
export async function updateProduct(id, data) {
  try {
    const response = await axios.put(`/products/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error.response?.data || error.message);
    throw error;
  }
}

////////////////////////////
///// DELETE - PRODUCT /////
////////////////////////////
export async function deleteProduct(id) {
  try {
    const response = await axios.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error.response?.data || error.message);
    throw error;
  }
}
