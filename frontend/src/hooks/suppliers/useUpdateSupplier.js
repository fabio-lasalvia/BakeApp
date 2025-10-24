import { useState } from "react";
import { updateSupplier } from "../../data/suppliers";

function useUpdateSupplier() {
  const [loading, setLoading] = useState(false);

  const update = async (id, data) => {
    setLoading(true);
    try {
      return await updateSupplier(id, data);
    } finally {
      setLoading(false);
    }
  };

  return { update, loading };
}

export default useUpdateSupplier;
