import { useState } from "react";
import { updateMyProfile } from "../../data/users";

export default function useUpdateMyProfile() {
  const [loading, setLoading] = useState(false);

  const update = async (formData) => {
    try {
      setLoading(true);
      const result = await updateMyProfile(formData);
      return result;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading };
}
