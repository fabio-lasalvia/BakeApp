import { useState } from "react";
import { updateProduct } from "../../data/products";

export default function useUpdateProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function update(id, data) {
    try {
      setLoading(true);
      const result = await updateProduct(id, data);
      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return { update, loading, error };
}
