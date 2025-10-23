import { useState, useEffect } from "react";
import { showCatalog } from "../../data/catalogs";

export default function useShowCatalog(id) {
  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchCatalog() {
    if (!id) return;
    try {
      setLoading(true);
      const data = await showCatalog(id);
      setCatalog(data);
    } catch (error) {
      console.error("Error fetching catalog:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCatalog();
  }, [id]);

  return { catalog, loading, error, refetch: fetchCatalog };
}
