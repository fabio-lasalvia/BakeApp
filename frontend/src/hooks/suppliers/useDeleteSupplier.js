import { useState } from "react";
import { deleteSupplier } from "../../data/suppliers";

function useDeleteSupplier() {
  const [loading, setLoading] = useState(false);

  const remove = async (id) => {
    setLoading(true);
    try {
      return await deleteSupplier(id);
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading };
}

export default useDeleteSupplier;
