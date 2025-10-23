import { useState } from "react";
import { updateCatalog } from "../../data/catalogs";

export default function useUpdateCatalog() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function update(id, data) {
    try {
      setLoading(true);
      const response = await updateCatalog(id, data);
      return response;
    } catch (error) {
      console.error("Error updating catalog:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return { update, loading, error };
}
