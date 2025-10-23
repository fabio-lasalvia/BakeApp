import { useState } from "react";
import { deleteCatalog } from "../../data/catalogs";

export default function useDeleteCatalog() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function remove(id) {
    try {
      setLoading(true);
      const response = await deleteCatalog(id);
      return response;
    } catch (error) {
      console.error("Error deleting catalog:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return { remove, loading, error };
}
