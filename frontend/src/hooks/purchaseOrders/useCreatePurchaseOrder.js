import { useState } from "react";
import { createPurchaseOrder } from "../../data/purchaseOrders";

function useCreatePurchaseOrder() {
  const [loading, setLoading] = useState(false);

  const create = async (data) => {
    setLoading(true);
    try {
      return await createPurchaseOrder(data);
    } finally {
      setLoading(false);
    }
  };

  return { create, loading };
}

export default useCreatePurchaseOrder;
