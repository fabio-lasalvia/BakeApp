import axios from "./axiosInstance";

///////////////////////////////
///// GET - ALL CUSTOMERS /////
///////////////////////////////
export async function indexCustomers() {
    try {
        const response = await axios.get("/customers");
        return response.data;
    } catch (error) {
        console.error("Error in indexCustomers:", error.response?.data || error.message);
        throw error;
    }
}

/////////////////////////////////
///// GET - SINGLE CUSTOMER /////
/////////////////////////////////
export async function showCustomer(id) {
    try {
        const response = await axios.get(`/customers/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error in showCustomer:", error.response?.data || error.message);
        throw error;
    }
}

//////////////////////////////////
///// POST - CREATE CUSTOMER /////
//////////////////////////////////
export async function createCustomer(newCustomer) {
    try {
        const response = await axios.post("/customers", newCustomer);
        return response.data;
    } catch (error) {
        console.error("Error in createCustomer:", error.response?.data || error.message);
        throw error;
    }
}

/////////////////////////////////
///// PUT - UPDATE CUSTOMER /////
/////////////////////////////////
export async function updateCustomer(id, updatedCustomer) {
    try {
        const response = await axios.put(`/customers/${id}`, updatedCustomer);
        return response.data;
    } catch (error) {
        console.error("Error in updateCustomer:", error.response?.data || error.message);
        throw error;
    }
}

////////////////////////////////////
///// DELETE - REMOVE CUSTOMER /////
////////////////////////////////////
export async function deleteCustomer(id) {
    try {
        const response = await axios.delete(`/customers/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error in deleteCustomer:", error.response?.data || error.message);
        throw error;
    }
}
