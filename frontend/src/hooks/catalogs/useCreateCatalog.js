import { useState } from "react";
import { createCatalog } from "../../data/catalogs";

export default function useCreateCatalog() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function create(data) {
    try {
      setLoading(true);
      const response = await createCatalog(data);
      return response;
    } catch (error) {
      console.error("Error creating catalog:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return { create, loading, error };
}
