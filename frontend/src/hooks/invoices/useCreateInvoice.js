import { useState } from "react";
import { createInvoice } from "../../data/invoices";

function useCreateInvoice() {
  const [loading, setLoading] = useState(false);

  const create = async (data) => {
    setLoading(true);
    try {
      return await createInvoice(data);
    } finally {
      setLoading(false);
    }
  };

  return { create, loading };
}

export default useCreateInvoice;
