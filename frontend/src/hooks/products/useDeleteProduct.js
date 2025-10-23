import { deleteProduct } from "../../data/products";

export default function useDeleteProduct() {
  async function remove(id) {
    try {
      const result = await deleteProduct(id);
      return result;
    } catch (error) {
      console.error("Error deleting product:", error.response?.data || error.message);
      throw error;
    }
  }

  return { remove };
}
