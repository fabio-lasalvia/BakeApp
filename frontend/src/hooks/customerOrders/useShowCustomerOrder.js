import { useState, useEffect } from "react";
import { showCustomerOrder } from "../../data/customerOrders";

export default function useShowCustomerOrder(id) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchOrder() {
    if (!id) return;
    try {
      setLoading(true);
      const data = await showCustomerOrder(id);
      setOrder(data);
    } catch (error) {
      console.error("Error fetching order:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrder();
  }, [id]);

  return { order, loading, error, refetch: fetchOrder };
}
