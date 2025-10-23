import { useState } from "react";
import { updateCustomer } from "../../data/customers";

export default function useUpdateCustomer() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleUpdateCustomer(id, updatedCustomer) {
        try {
            setLoading(true);
            const response = await updateCustomer(id, updatedCustomer);
            return response;
        } catch (error) {
            console.error("Error updating customer:", error.response?.data || error.message);
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    return { handleUpdateCustomer, loading, error };
}
