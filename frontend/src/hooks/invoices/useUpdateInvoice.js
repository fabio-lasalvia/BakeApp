import { useState } from "react";
import { updateInvoice } from "../../data/invoices";

function useUpdateInvoice() {
  const [loading, setLoading] = useState(false);

  const update = async (id, data) => {
    setLoading(true);
    try {
      return await updateInvoice(id, data);
    } finally {
      setLoading(false);
    }
  };

  return { update, loading };
}

export default useUpdateInvoice;
