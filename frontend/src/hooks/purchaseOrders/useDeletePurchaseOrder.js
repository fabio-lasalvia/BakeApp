import { useState } from "react";
import { deletePurchaseOrder } from "../../data/purchaseOrders";

function useDeletePurchaseOrder() {
  const [loading, setLoading] = useState(false);

  const remove = async (id) => {
    setLoading(true);
    try {
      return await deletePurchaseOrder(id);
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading };
}

export default useDeletePurchaseOrder;
