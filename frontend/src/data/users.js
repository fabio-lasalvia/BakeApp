import axios from "./axiosInstance";

///////////////////////////
///// GET - ALL USERS /////
///////////////////////////
export async function indexUsers() {
  try {
    const response = await axios.get("/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error.response?.data || error.message);
    throw error;
  }
}

/////////////////////////////
///// GET - SINGLE USER /////
/////////////////////////////
export async function showUser(id) {
  try {
    const response = await axios.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error.response?.data || error.message);
    throw error;
  }
}

//////////////////////////////
///// POST - CREATE USER /////
//////////////////////////////
export async function createUser(newUser) {
  try {
    const response = await axios.post("/users", newUser);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error.response?.data || error.message);
    throw error;
  }
}

/////////////////////////////
///// PUT - UPDATE USER /////
/////////////////////////////
export async function updateUser(id, updatedUser) {
  try {
    const response = await axios.put(`/users/${id}`, updatedUser);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error.response?.data || error.message);
    throw error;
  }
}

////////////////////////////////
///// DELETE - REMOVE USER /////
////////////////////////////////
export async function deleteUser(id) {
  try {
    const response = await axios.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error.response?.data || error.message);
    throw error;
  }
}

////////////////////////////////
///// PATCH - UPDATE USER //////
////////////////////////////////
export async function updateUserRole(id, role) {
  try {
    const response = await axios.patch(`/users/${id}/role`, { role });
    return response.data;
  } catch (error) {
    console.error("Error updating user role:", error.response?.data || error.message);
    throw error;
  }
}
