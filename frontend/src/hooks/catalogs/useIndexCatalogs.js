import { useState, useEffect } from "react";
import { indexCatalogs } from "../../data/catalogs";

export default function useIndexCatalogs() {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchCatalogs() {
    try {
      setLoading(true);
      const data = await indexCatalogs();
      setCatalogs(data);
    } catch (error) {
      console.error("Error fetching catalogs:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCatalogs();
  }, []);

  return { catalogs, loading, error, refetch: fetchCatalogs };
}
