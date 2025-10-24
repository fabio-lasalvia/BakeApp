import { useState, useEffect } from "react";
import { indexSuppliers } from "../../data/suppliers";

function useIndexSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSuppliers = async () => {
    try {
      const data = await indexSuppliers();
      setSuppliers(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return { suppliers, loading, error, refetch: fetchSuppliers };
}

export default useIndexSuppliers;
