import { useState, useEffect } from "react";
import { showSupplier } from "../../data/suppliers";

function useShowSupplier(id) {
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchSupplier = async () => {
      try {
        const data = await showSupplier(id);
        setSupplier(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSupplier();
  }, [id]);

  return { supplier, loading, error };
}

export default useShowSupplier;
