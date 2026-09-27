import Category from "../../models/blog/Category.modal.js";
import { createCRUD } from "../../utils/crudFactory.js";

const { getAll, getById, create, update, remove } = createCRUD(Category, "Category");

export {
  getAll as getAllCategories,
  getById as getCategoryById,
  create as createCategory,
  update as updateCategory,
  remove as deleteCategory,
};
