import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchAllBlogs, togglePublish, deleteBlog } from "../../redux/slices/blogSlice";
import { selectBlog } from "../../redux/store";
import Loader from "../../components/Loader";

const AdminListBlog = () => {
  const dispatch = useDispatch();
  const { blogs, loading } = useSelector(selectBlog);

  useEffect(() => { dispatch(fetchAllBlogs()); }, [dispatch]);

  const handleToggle = async (id) => {
    const res = await dispatch(togglePublish(id));
    if (!res.error) toast.success("Status updated");
    else toast.error(res.payload || "Failed");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    const res = await dispatch(deleteBlog(id));
    if (!res.error) toast.success("Deleted");
    else toast.error(res.payload || "Failed");
  };

  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 border-b border-slate-200/80 pb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#702ae1]">Content</span>
          <h1 className="mt-1 font-[Manrope] text-3xl font-extrabold tracking-tight text-slate-900">All Blogs</h1>
          <p className="mt-1 text-sm text-slate-500">{blogs.length} total stories</p>
        </div>

        {loading ? <Loader className="py-20" /> : (
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-3.5">#</th>
                    <th className="px-5 py-3.5">Title</th>
                    <th className="px-5 py-3.5 max-sm:hidden">Author</th>
                    <th className="px-5 py-3.5 max-sm:hidden">Category</th>
                    <th className="px-5 py-3.5 max-sm:hidden">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {blogs.length ? blogs.map((blog, i) => (
                    <tr key={blog._id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-4 text-slate-400">{i + 1}</td>
                      <td className="px-5 py-4 font-medium text-slate-900 max-w-[200px] truncate">{blog.title}</td>
                      <td className="px-5 py-4 max-sm:hidden text-slate-500">{blog.author?.name || "—"}</td>
                      <td className="px-5 py-4 max-sm:hidden text-slate-500">{blog.category}</td>
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
                  )) : (
                    <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-400">No blogs found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminListBlog;
