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
import { recordView } from "../redux/slices/profileSlice";
import { selectBlog } from "../redux/store";

const useBlog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blogs, userBlogs, currentBlog, loading, error } = useSelector(selectBlog);

  // params: optional query string like "?category=<id>&sortBy=recent"
  const getAllBlogs = (params) => dispatch(fetchAllBlogs(params));

  const getSingleBlog = (id) => {
    const result = dispatch(fetchSingleBlog(id));
    return result;
  };

  // record a blog view in profile activity
  const trackView = (blog) => {
    if (!blog) return;
    dispatch(recordView({ _id: blog._id, title: blog.title, image: blog.image, category: blog.category?.name }));
  };

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
      toast.success("Blog deleted!");
    } else {
      toast.error(result.payload || "Failed to delete blog");
    }
  };

  return {
    blogs, userBlogs, currentBlog, loading, error,
    getAllBlogs, getSingleBlog, trackView,
    getMyBlogs, handleCreateBlog, handleUpdateBlog, handleDeleteBlog,
  };
};

export default useBlog;
