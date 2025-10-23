import { useState } from "react";
import { createUser } from "../../data/users";

export default function useCreateUser() {
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);


const create = async (newUser) => {
try {
setLoading(true);
const data = await createUser(newUser);
return data;
} catch (error) {
console.error("Error creating user:", error);
setError(error);
throw error;
} finally {
setLoading(false);
}
};


return { create, loading, error };
}
