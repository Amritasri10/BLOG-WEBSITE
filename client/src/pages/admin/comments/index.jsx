import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchComments, approveComment, removeComment } from "../../../redux/slices/commentSlice";
import { fetchAllBlogs } from "../../../redux/slices/blogSlice";
import { selectComment, selectBlog } from "../../../redux/store";
import Loader from "../../../components/Loader";

const AdminComments = () => {
  const dispatch = useDispatch();
  const { comments, loading } = useSelector(selectComment);
  const { blogs } = useSelector(selectBlog);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchAllBlogs());
  }, [dispatch]);

  useEffect(() => {
    // Fetch comments for recent blogs
    blogs.slice(0, 10).forEach((b) => dispatch(fetchComments(b._id)));
  }, [blogs, dispatch]);

  const allComments = comments;

  const filtered = allComments.filter((c) => {
    if (filter === "approved") return c.isApproved === true;
    if (filter === "pending")  return c.isApproved === false;
    return true;
  });

  const handleApprove = async (id) => {
    const res = await dispatch(approveComment(id));
    if (!res.error) toast.success("Approved");
    else toast.error(res.payload || "Failed");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete comment?")) return;
    const res = await dispatch(removeComment(id));
    if (!res.error) toast.success("Deleted");
    else toast.error(res.payload || "Failed");
  };

  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#702ae1]">Moderation</span>
            <h1 className="mt-1 font-[Manrope] text-3xl font-extrabold tracking-tight text-slate-900">Comments</h1>
          </div>
          <div className="flex items-center gap-2">
            {["all", "approved", "pending"].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold capitalize transition ${filter === f ? "bg-[#702ae1] text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? <Loader className="py-20" /> : filtered.length ? (
          <div className="space-y-4">
            {filtered.map((c) => (
              <div key={c._id} className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${c.isApproved ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                        {c.isApproved ? "Approved" : "Pending"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-700">{c.content}</p>
                    <p className="mt-2 text-xs text-slate-400">
                      by <span className="font-semibold text-slate-600">{c.author?.name || c.user?.name || "User"}</span>
                      {" · "}{new Date(c.createdAt).toDateString()}
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 gap-2">
                    {!c.isApproved && <button onClick={() => handleApprove(c._id)} className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100">Approve</button>}
                    <button onClick={() => handleDelete(c._id)} className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-white py-16 text-center border border-slate-100">
            <p className="text-slate-500">No comments found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComments;
