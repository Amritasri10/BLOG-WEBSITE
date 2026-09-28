import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LuCalendar, LuHeart, LuBookmark, LuMessageSquare } from "react-icons/lu";
import toast from "react-hot-toast";
import { fetchSingleBlog, toggleLike, toggleSave } from "../../redux/slices/blogSlice";
import { fetchComments, addComment } from "../../redux/slices/commentSlice";
import { recordView } from "../../redux/slices/profileSlice";
import { selectBlog, selectComment, selectAuth } from "../../redux/store";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";
import { useState } from "react";

const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "";

const BlogPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentBlog, loading } = useSelector(selectBlog);
  const { comments, loading: cLoading, submitting } = useSelector(selectComment);
  const { isLogin } = useSelector(selectAuth);
  const [comment, setComment] = useState("");

  useEffect(() => {
    dispatch(fetchSingleBlog(id));
    dispatch(fetchComments(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentBlog) dispatch(recordView({ _id: currentBlog._id, title: currentBlog.title, image: currentBlog.image, category: currentBlog.category }));
  }, [currentBlog, dispatch]);

  const handleLike = () => {
    if (!isLogin) { toast.error("Login to like"); navigate("/auth"); return; }
    dispatch(toggleLike(id));
  };

  const handleSave = () => {
    if (!isLogin) { toast.error("Login to save"); navigate("/auth"); return; }
    dispatch(toggleSave(id));
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!isLogin) { toast.error("Login to comment"); navigate("/auth"); return; }
    if (!comment.trim()) return;
    const res = await dispatch(addComment({ blogId: id, content: comment.trim() }));
    if (!res.error) { toast.success("Comment added"); setComment(""); }
    else toast.error(res.payload || "Failed");
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Loader /></div>;
  if (!currentBlog) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center"><p className="text-slate-500">Blog not found.</p><button onClick={() => navigate("/")} className="mt-4 text-[#702ae1] font-semibold">Go Home</button></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f6f6ff]">
      <Navbar containerClassName="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10" />

      <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        {/* Category */}
        <span className="text-xs font-bold uppercase tracking-wider text-[#702ae1]">{currentBlog.category || "General"}</span>

        {/* Title */}
        <h1 className="mt-3 font-[Manrope] text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
          {currentBlog.title}
        </h1>

        {currentBlog.subTitle && (
          <p className="mt-4 text-lg text-slate-500">{currentBlog.subTitle}</p>
        )}

        {/* Meta */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-slate-200 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-[#702ae1] to-[#a855f7] text-xs font-bold text-white">
              {(currentBlog.author?.name || "A").charAt(0).toUpperCase()}
            </div>
            <div>
              <button onClick={() => navigate(`/authors/${currentBlog.author?._id}`)} className="text-sm font-semibold text-slate-900 hover:text-[#702ae1]">
                {currentBlog.author?.name || "Author"}
              </button>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <LuCalendar className="h-3 w-3" />
                <span>{formatDate(currentBlog.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleLike} className="flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-rose-500">
              <LuHeart className="h-4 w-4" /> {currentBlog.likes?.length || 0}
            </button>
            <button onClick={handleSave} className="flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-[#702ae1]">
              <LuBookmark className="h-4 w-4" /> Save
            </button>
          </div>
        </div>

        {/* Cover Image */}
        {currentBlog.image && (
          <div className="mt-8 overflow-hidden rounded-2xl">
            <img src={currentBlog.image} alt={currentBlog.title} className="w-full object-cover" />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-slate mt-8 max-w-none prose-headings:font-[Manrope] prose-headings:font-extrabold prose-a:text-[#702ae1]"
          dangerouslySetInnerHTML={{ __html: currentBlog.description || currentBlog.content || "" }}
        />

        {/* Comments */}
        <section className="mt-14 border-t border-slate-200 pt-10">
          <h2 className="flex items-center gap-2 font-[Manrope] text-xl font-extrabold text-slate-900">
            <LuMessageSquare className="h-5 w-5 text-[#702ae1]" />
            Comments ({comments.length})
          </h2>

          <form onSubmit={handleComment} className="mt-6 flex gap-3">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={isLogin ? "Write a comment..." : "Login to comment"}
              disabled={!isLogin}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#702ae1] focus:outline-none focus:ring-2 focus:ring-[#702ae1]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
            />
            <button type="submit" disabled={submitting || !isLogin}
              className="rounded-xl bg-[#702ae1] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#5e21c2] disabled:opacity-60">
              {submitting ? "..." : "Post"}
            </button>
          </form>

          <div className="mt-8 space-y-5">
            {cLoading ? <Loader className="py-6" /> : comments.map((c) => (
              <div key={c._id} className="rounded-2xl border border-slate-100 bg-white p-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ede9fe] text-xs font-bold text-[#702ae1]">
                    {(c.author?.name || c.user?.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{c.author?.name || c.user?.name || "User"}</span>
                  <span className="text-xs text-slate-400">{formatDate(c.createdAt)}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{c.content}</p>
              </div>
            ))}
          </div>
        </section>
      </article>

      <Footer containerClassName="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10" />
    </div>
  );
};

export default BlogPage;
