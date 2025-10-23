import { useState, useEffect } from "react";
import { showCustomer } from "../../data/customers";

export default function useShowCustomer(id) {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function fetchCustomer() {
        try {
            setLoading(true);
            const data = await showCustomer(id);
            setCustomer(data);
        } catch (error) {
            console.error("Error fetching customer:", error.response?.data || error.message);
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (id) {
            fetchCustomer();
        }
    }, [id]);

    return { customer, loading, error, refetch: fetchCustomer };
}
