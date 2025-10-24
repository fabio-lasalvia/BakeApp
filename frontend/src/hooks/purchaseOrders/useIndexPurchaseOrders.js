import { useState, useEffect } from "react";
import { indexPurchaseOrders } from "../../data/purchaseOrders";

function useIndexPurchaseOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const data = await indexPurchaseOrders();
      setOrders(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, error, refetch: fetchOrders };
}

export default useIndexPurchaseOrders;
