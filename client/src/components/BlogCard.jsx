import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart, Bookmark } from "lucide-react";
import toast from "react-hot-toast";
import { toggleLike, toggleSave } from "../redux/slices/blogSlice";
import { selectAuth } from "../redux/store";

const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLogin } = useSelector(selectAuth);

  const handleLike = (e) => {
    e.stopPropagation();
    if (!isLogin) { toast.error("Login to like"); navigate("/auth"); return; }
    dispatch(toggleLike(blog._id));
  };

  const handleSave = (e) => {
    e.stopPropagation();
    if (!isLogin) { toast.error("Login to save"); navigate("/auth"); return; }
    dispatch(toggleSave(blog._id));
  };

  return (
    <article
      onClick={() => navigate(`/blog/${blog._id}`)}
      className="group flex cursor-pointer flex-col transition duration-300"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
        <img
          src={blog.image || "/images/placeholder.jpg"}
          alt={blog.title}
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col pt-3.5">
        <span className="text-xs font-bold uppercase tracking-wider text-[#702ae1]">
          {blog.category?.name || blog.category || "General"}
        </span>

        <h3 className="mt-1.5 font-[Manrope] text-xl font-bold leading-snug tracking-tight text-slate-900 transition-colors group-hover:text-[#702ae1]">
          {blog.title}
        </h3>

        {blog.subTitle && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">{blog.subTitle}</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-4 text-xs font-medium text-slate-400">
          <div className="flex items-center gap-2 truncate">
            <span className="truncate font-semibold text-slate-700">
              {blog.author?.name || blog.authorName || "Author"}
            </span>
            <span>•</span>
            <span>{formatDate(blog.createdAt)}</span>
          </div>
          <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <button onClick={handleLike} className={`flex items-center gap-1 transition ${blog.isLiked ? "text-rose-500" : "hover:text-rose-500"}`}>
              <Heart className={`h-3.5 w-3.5 ${blog.isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
              <span>{blog.likes?.length || 0}</span>
            </button>
            <button onClick={handleSave} className={`flex items-center gap-1 transition ${blog.isSaved ? "text-[#702ae1]" : "hover:text-[#702ae1]"}`}>
              <Bookmark className={`h-3.5 w-3.5 ${blog.isSaved ? "fill-[#702ae1] text-[#702ae1]" : ""}`} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
