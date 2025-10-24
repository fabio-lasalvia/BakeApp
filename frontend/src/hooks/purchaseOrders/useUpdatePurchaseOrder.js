import { useState } from "react";
import { updatePurchaseOrder } from "../../data/purchaseOrders";

function useUpdatePurchaseOrder() {
  const [loading, setLoading] = useState(false);

  const update = async (id, data) => {
    setLoading(true);
    try {
      return await updatePurchaseOrder(id, data);
    } finally {
      setLoading(false);
    }
  };

  return { update, loading };
}

export default useUpdatePurchaseOrder;
