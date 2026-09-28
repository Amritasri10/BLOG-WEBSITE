import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LuFileText, LuMessageSquare, LuClock, LuPlus } from "react-icons/lu";
import toast from "react-hot-toast";
import { fetchAuthorDashboard } from "../../redux/slices/authorSlice";
import { togglePublish, deleteBlog } from "../../redux/slices/blogSlice";
import { selectAuthor } from "../../redux/store";
import Loader from "../../components/Loader";

const AuthorDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dashboard, loading } = useSelector(selectAuthor);

  useEffect(() => { dispatch(fetchAuthorDashboard()); }, [dispatch]);

  const handleToggle = async (id) => {
    const res = await dispatch(togglePublish(id));
    if (!res.error) { toast.success("Status updated"); dispatch(fetchAuthorDashboard()); }
    else toast.error(res.payload || "Failed");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    const res = await dispatch(deleteBlog(id));
    if (!res.error) { toast.success("Deleted"); dispatch(fetchAuthorDashboard()); }
    else toast.error(res.payload || "Failed");
  };

  if (loading && !dashboard) return <Loader className="py-20" />;

  const stats = [
    { label: "Total Stories", value: dashboard?.totalBlogs || 0, icon: <LuFileText className="h-4 w-4" />, bg: "bg-[#ede9fe] text-[#702ae1]" },
    { label: "Comments",      value: dashboard?.totalComments || 0, icon: <LuMessageSquare className="h-4 w-4" />, bg: "bg-emerald-50 text-emerald-600" },
    { label: "Drafts",        value: dashboard?.totalDrafts || 0,   icon: <LuClock className="h-4 w-4" />, bg: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#702ae1]">Dashboard</span>
            <h1 className="mt-1 font-[Manrope] text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Workspace Overview</h1>
          </div>
          <button onClick={() => navigate("/author/add-blog")}
            className="inline-flex items-center gap-2 rounded-full bg-[#702ae1] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#5e21c2]">
            <LuPlus className="h-4 w-4" /> New Story
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{s.label}</span>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${s.bg}`}>{s.icon}</div>
              </div>
              <p className="mt-3 font-[Manrope] text-3xl font-extrabold tracking-tight text-slate-900">{s.value}</p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="mb-4 font-[Manrope] text-xl font-bold text-slate-900">Recent Stories</h2>
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-3.5">#</th>
                    <th className="px-5 py-3.5">Title</th>
                    <th className="px-5 py-3.5 max-sm:hidden">Date</th>
                    <th className="px-5 py-3.5 max-sm:hidden">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dashboard?.recentBlogs?.length ? dashboard.recentBlogs.map((blog, i) => (
                    <tr key={blog._id}>
                      <td className="px-5 py-4 text-slate-400">{i + 1}</td>
                      <td className="px-5 py-4 font-medium text-slate-900">{blog.title}</td>
                      <td className="px-5 py-4 max-sm:hidden text-slate-400">{new Date(blog.createdAt).toDateString()}</td>
                      <td className="px-5 py-4 max-sm:hidden">
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${blog.isPublished ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                          {blog.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleToggle(blog._id)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                            {blog.isPublished ? "Unpublish" : "Publish"}
                          </button>
                          <button onClick={() => handleDelete(blog._id)} className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-400">No stories yet. Write your first!</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorDashboard;
