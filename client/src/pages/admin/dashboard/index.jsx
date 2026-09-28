import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LuFileText, LuMessageSquare, LuUsers, LuPencil } from "react-icons/lu";
import toast from "react-hot-toast";
import { fetchAdminStats } from "../../../redux/slices/adminSlice";
import { deleteBlog, togglePublish, fetchAllBlogs } from "../../../redux/slices/blogSlice";
import { selectAdmin, selectBlog } from "../../../redux/store";
import Loader from "../../../components/Loader";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stats, loading } = useSelector(selectAdmin);
  const { blogs } = useSelector(selectBlog);

  useEffect(() => {
    dispatch(fetchAdminStats());
    dispatch(fetchAllBlogs());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    const res = await dispatch(deleteBlog(id));
    if (!res.error) { toast.success("Deleted"); dispatch(fetchAdminStats()); }
    else toast.error(res.payload || "Failed");
  };

  const handleToggle = async (id) => {
    const res = await dispatch(togglePublish(id));
    if (!res.error) toast.success("Status updated");
    else toast.error(res.payload || "Failed");
  };

  const statCards = [
    { label: "Total Blogs",    value: stats?.totalBlogs || 0,    icon: <LuFileText className="h-4 w-4" />,    bg: "bg-[#ede9fe] text-[#702ae1]" },
    { label: "Total Users",    value: stats?.totalUsers || 0,    icon: <LuUsers className="h-4 w-4" />,       bg: "bg-sky-50 text-sky-600" },
    { label: "Authors",        value: stats?.totalAuthors || 0,  icon: <LuPencil className="h-4 w-4" />,       bg: "bg-emerald-50 text-emerald-600" },
    { label: "Comments",       value: stats?.totalComments || 0, icon: <LuMessageSquare className="h-4 w-4" />, bg: "bg-amber-50 text-amber-600" },
  ];

  if (loading && !stats) return <Loader className="py-20" />;

  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="border-b border-slate-200/80 pb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#702ae1]">Overview</span>
          <h1 className="mt-1 font-[Manrope] text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Admin Dashboard</h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((s) => (
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
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-[Manrope] text-xl font-bold text-slate-900">Recent Blogs</h2>
            <button onClick={() => navigate("/admin/blogs")} className="text-xs font-bold text-[#702ae1] hover:underline">View all →</button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-3.5">#</th>
                    <th className="px-5 py-3.5">Title</th>
                    <th className="px-5 py-3.5 max-sm:hidden">Author</th>
                    <th className="px-5 py-3.5 max-sm:hidden">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {blogs.slice(0, 8).map((blog, i) => (
                    <tr key={blog._id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-4 text-slate-400">{i + 1}</td>
                      <td className="px-5 py-4 font-medium text-slate-900 max-w-xs truncate">{blog.title}</td>
                      <td className="px-5 py-4 max-sm:hidden text-slate-500">{blog.author?.name || "—"}</td>
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
                          <button onClick={() => handleDelete(blog._id)} className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
