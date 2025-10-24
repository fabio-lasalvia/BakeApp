import { useState } from "react";
import { deleteIngredient } from "../../data/ingredients";

function useDeleteIngredient() {
  const [loading, setLoading] = useState(false);

  const remove = async (id) => {
    setLoading(true);
    try {
      const data = await deleteIngredient(id);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading };
}

export default useDeleteIngredient;
