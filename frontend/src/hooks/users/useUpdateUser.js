import { useState } from "react";
import { updateUser } from "../../data/users";

export default function useUpdateUser() {
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);


const update = async (id, updatedUser) => {
try {
setLoading(true);
const data = await updateUser(id, updatedUser);
return data;
} catch (error) {
console.error("Error updating user:", error);
setError(error);
throw error;
} finally {
setLoading(false);
}
};


return { update, loading, error };
}
