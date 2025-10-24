import { useState } from "react";
import { deleteInvoice } from "../../data/invoices";

function useDeleteInvoice() {
  const [loading, setLoading] = useState(false);

  const remove = async (id) => {
    setLoading(true);
    try {
      return await deleteInvoice(id);
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading };
}

export default useDeleteInvoice;
