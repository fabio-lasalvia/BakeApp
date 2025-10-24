import { useState, useEffect } from "react";
import { indexInvoices } from "../../data/invoices";

function useIndexInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvoices = async () => {
    try {
      const data = await indexInvoices();
      setInvoices(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return { invoices, loading, error, refetch: fetchInvoices };
}

export default useIndexInvoices;
