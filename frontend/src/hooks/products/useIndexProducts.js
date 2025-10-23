import { useState, useEffect } from "react";
import { indexProducts } from "../../data/products";

export default function useIndexProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchProducts() {
    try {
      setLoading(true);
      const data = await indexProducts();
      setProducts(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, refetch: fetchProducts };
}
