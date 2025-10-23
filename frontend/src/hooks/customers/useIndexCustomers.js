import { useState, useEffect } from "react";
import { indexCustomers } from "../../data/customers";

export default function useIndexCustomers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function fetchCustomers() {
        try {
            setLoading(true);
            const data = await indexCustomers();
            setCustomers(data);
        } catch (error) {
            console.error("Error fetching customers:", error.response?.data || error.message);
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCustomers();
    }, []);

    return { customers, loading, error, refetch: fetchCustomers };
}
