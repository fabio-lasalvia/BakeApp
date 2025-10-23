import { useState } from "react";
import { createCustomer } from "../../data/customers";

export default function useCreateCustomer() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleCreateCustomer(newCustomer) {
        try {
            setLoading(true);
            const response = await createCustomer(newCustomer);
            return response;
        } catch (error) {
            console.error("Error creating customer:", error.response?.data || error.message);
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    return { handleCreateCustomer, loading, error };
}
