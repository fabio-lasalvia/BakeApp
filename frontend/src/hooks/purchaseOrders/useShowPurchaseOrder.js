import { useState, useEffect } from "react";
import { showPurchaseOrder } from "../../data/purchaseOrders";

function useShowPurchaseOrder(id) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        const data = await showPurchaseOrder(id);
        setOrder(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  return { order, loading, error };
}

export default useShowPurchaseOrder;
