import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchPendingComments } from "../../redux/slices/authorSlice";
import { approveComment, removeComment } from "../../redux/slices/commentSlice";
import { selectAuthor } from "../../redux/store";
import Loader from "../../components/Loader";

const AuthorComments = () => {
  const dispatch = useDispatch();
  const { pendingComments, loading } = useSelector(selectAuthor);

  useEffect(() => { dispatch(fetchPendingComments()); }, [dispatch]);

  const handleApprove = async (id) => {
    const res = await dispatch(approveComment(id));
    if (!res.error) { toast.success("Approved"); dispatch(fetchPendingComments()); }
    else toast.error(res.payload || "Failed");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete comment?")) return;
    const res = await dispatch(removeComment(id));
    if (!res.error) { toast.success("Deleted"); dispatch(fetchPendingComments()); }
    else toast.error(res.payload || "Failed");
  };

  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 border-b border-slate-200/80 pb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#702ae1]">Moderation</span>
          <h1 className="mt-1 font-[Manrope] text-3xl font-extrabold tracking-tight text-slate-900">Pending Comments</h1>
        </div>

        {loading ? (
          <Loader className="py-20" />
        ) : pendingComments.length ? (
          <div className="space-y-4">
            {pendingComments.map((c) => (
              <div key={c._id} className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#702ae1]">{c.blog?.title || "Blog"}</p>
                    <p className="mt-2 text-sm text-slate-700">{c.content}</p>
                    <p className="mt-2 text-xs text-slate-400">
                      by <span className="font-semibold text-slate-600">{c.author?.name || c.user?.name || "User"}</span>
                      {" · "}{new Date(c.createdAt).toDateString()}
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 gap-2">
                    <button onClick={() => handleApprove(c._id)} className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100">Approve</button>
                    <button onClick={() => handleDelete(c._id)} className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-white py-16 text-center border border-slate-100">
            <p className="text-slate-500">No pending comments.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorComments;
