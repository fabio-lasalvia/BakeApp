import { useState, useEffect } from "react";
import { showInvoice } from "../../data/invoices";

function useShowInvoice(id) {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        const data = await showInvoice(id);
        setInvoice(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  return { invoice, loading, error };
}

export default useShowInvoice;
