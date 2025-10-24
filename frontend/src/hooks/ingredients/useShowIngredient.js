import { useEffect, useState } from "react";
import { showIngredient } from "../../data/ingredients";

function useShowIngredient(id) {
  const [ingredient, setIngredient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchIngredient = async () => {
      try {
        setLoading(true);
        const data = await showIngredient(id);
        setIngredient(data);
      } catch (error) {
        setError(error.response?.data?.message || "Error loading ingredient");
      } finally {
        setLoading(false);
      }
    };
    fetchIngredient();
  }, [id]);

  return { ingredient, loading, error };
}

export default useShowIngredient;
