import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchComments, addComment, removeComment, clearComments } from "../redux/slices/commentSlice";
import { recordComment } from "../redux/slices/profileSlice";
import { selectComment, selectAuth } from "../redux/store";

const useComment = () => {
  const dispatch = useDispatch();
  const { comments, loading, submitting } = useSelector(selectComment);
  const { isLogin } = useSelector(selectAuth);

  const getComments = (blogId) => dispatch(fetchComments(blogId));

  const handleAddComment = async ({ blogId, content, blogMeta }) => {
    if (!isLogin) {
      toast.error("Please register or login to comment");
      return false;
    }
    const result = await dispatch(addComment({ blogId, content }));
    if (addComment.fulfilled.match(result)) {
      toast.success("Comment added!");
      // record in profile activity
      if (blogMeta) dispatch(recordComment(blogMeta));
      return true;
    } else {
      toast.error(result.payload || "Failed to add comment");
      return false;
    }
  };

  const handleDeleteComment = async (commentId) => {
    const result = await dispatch(removeComment(commentId));
    if (removeComment.fulfilled.match(result)) {
      toast.success("Comment deleted");
    } else {
      toast.error(result.payload || "Failed to delete comment");
    }
  };

  const resetComments = () => dispatch(clearComments());

  return { comments, loading, submitting, getComments, handleAddComment, handleDeleteComment, resetComments };
};

export default useComment;
