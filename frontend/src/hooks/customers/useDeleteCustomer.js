import { useState } from "react";
import { deleteCustomer } from "../../data/customers";

export default function useDeleteCustomer() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleDeleteCustomer(id) {
        try {
            setLoading(true);
            const response = await deleteCustomer(id);
            return response;
        } catch (error) {
            console.error("Error deleting customer:", error.response?.data || error.message);
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    return { handleDeleteCustomer, loading, error };
}
