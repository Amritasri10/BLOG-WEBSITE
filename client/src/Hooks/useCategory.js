import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategories } from "../redux/slices/categorySlice";
import { selectCategory } from "../redux/store";

const useCategory = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector(selectCategory);

  const getCategories = () => dispatch(fetchAllCategories());

  return { categories, loading, getCategories };
};

export default useCategory;
