import { useState, useEffect } from "react";
import { indexCustomerOrders } from "../../data/customerOrders";

export default function useIndexCustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchOrders() {
    try {
      setLoading(true);
      const data = await indexCustomerOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, error, refetch: fetchOrders };
}
