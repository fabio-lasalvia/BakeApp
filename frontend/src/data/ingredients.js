import axios from "./axiosInstance";

/////////////////////////////////
///// GET - ALL INGREDIENTS /////
/////////////////////////////////
export async function indexIngredients() {
  try {
    const response = await axios.get("/ingredients");
    return response.data;
  } catch (error) {
    console.error("Error fetching ingredients:", error.response?.data || error.message);
    throw error;
  }
}

///////////////////////////////////
///// GET - SINGLE INGREDIENT /////
///////////////////////////////////
export async function showIngredient(id) {
  try {
    const response = await axios.get(`/ingredients/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ingredient:", error.response?.data || error.message);
    throw error;
  }
}

////////////////////////////////////
///// POST - CREATE INGREDIENT /////
////////////////////////////////////
export async function createIngredient(data) {
  try {
    const response = await axios.post("/ingredients", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating ingredient:", error.response?.data || error.message);
    throw error;
  }
}

///////////////////////////////////
///// PUT - UPDATE INGREDIENT /////
///////////////////////////////////
export async function updateIngredient(id, data) {
  try {
    const response = await axios.put(`/ingredients/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating ingredient:", error.response?.data || error.message);
    throw error;
  }
}

///////////////////////////////
///// DELETE - INGREDIENT /////
///////////////////////////////
export async function deleteIngredient(id) {
  try {
    const response = await axios.delete(`/ingredients/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting ingredient:", error.response?.data || error.message);
    throw error;
  }
}
