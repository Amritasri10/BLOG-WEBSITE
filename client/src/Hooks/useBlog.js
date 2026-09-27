import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  fetchAllBlogs,
  fetchSingleBlog,
  fetchUserBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../redux/slices/blogSlice";
import { selectBlog } from "../redux/store";

/**
 * useBlog — wraps all blog actions with toast feedback and navigation.
 */
const useBlog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blogs, userBlogs, currentBlog, loading, error } = useSelector(selectBlog);

  const getAllBlogs = () => dispatch(fetchAllBlogs());

  const getSingleBlog = (id) => dispatch(fetchSingleBlog(id));

  const getMyBlogs = (userId) => dispatch(fetchUserBlogs(userId));

  const handleCreateBlog = async (formData) => {
    const result = await dispatch(createBlog(formData));
    if (createBlog.fulfilled.match(result)) {
      toast.success("Blog created successfully!");
      navigate("/my-blogs");
    } else {
      toast.error(result.payload || "Failed to create blog");
    }
  };

  const handleUpdateBlog = async (id, formData) => {
    const result = await dispatch(updateBlog({ id, payload: formData }));
    if (updateBlog.fulfilled.match(result)) {
      toast.success("Blog updated successfully!");
      navigate("/my-blogs");
    } else {
      toast.error(result.payload || "Failed to update blog");
    }
  };

  const handleDeleteBlog = async (id) => {
    const result = await dispatch(deleteBlog(id));
    if (deleteBlog.fulfilled.match(result)) {
      toast.success("Blog deleted successfully!");
    } else {
      toast.error(result.payload || "Failed to delete blog");
    }
  };

  return {
    blogs,
    userBlogs,
    currentBlog,
    loading,
    error,
    getAllBlogs,
    getSingleBlog,
    getMyBlogs,
    handleCreateBlog,
    handleUpdateBlog,
    handleDeleteBlog,
  };
};

export default useBlog;
