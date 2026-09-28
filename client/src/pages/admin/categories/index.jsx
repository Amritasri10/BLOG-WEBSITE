import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { LuTag, LuPencil, LuTrash2, LuPlus, LuX, LuCheck } from "react-icons/lu";
import {
  fetchAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../redux/slices/categorySlice";
import { selectCategory } from "../../../redux/store";
import Loader from "../../../components/Loader";

const AdminCategories = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector(selectCategory);

  // ── form state ─────────────────────────────────────────────────────────────
  const [showForm, setShowForm]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [name, setName]           = useState("");
  const [isActive, setIsActive]   = useState(true);
  const [saving, setSaving]       = useState(false);

  useEffect(() => { dispatch(fetchAllCategories()); }, [dispatch]);

  // ── open edit ──────────────────────────────────────────────────────────────
  const openEdit = (cat) => {
    setEditTarget(cat);
    setName(cat.name);
    setIsActive(cat.isActive !== false);
    setShowForm(true);
  };

  const openCreate = () => {
    setEditTarget(null);
    setName("");
    setIsActive(true);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditTarget(null);
    setName("");
    setIsActive(true);
  };

  // ── submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);

    if (editTarget) {
      const res = await dispatch(updateCategory({ id: editTarget._id, payload: { name: name.trim(), isActive } }));
      if (!res.error) { toast.success("Category updated"); closeForm(); }
      else toast.error(res.payload || "Update failed");
    } else {
      const res = await dispatch(createCategory({ name: name.trim(), isActive }));
      if (!res.error) { toast.success("Category created"); closeForm(); }
      else toast.error(res.payload || "Create failed");
    }

    setSaving(false);
  };

  // ── delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    const res = await dispatch(deleteCategory(id));
    if (!res.error) toast.success("Category deleted");
    else toast.error(res.payload || "Delete failed");
  };

  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <div className="mx-auto max-w-3xl">

        {/* ── Page Header ── */}
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#702ae1]">Content</span>
            <h1 className="mt-1 font-[Manrope] text-3xl font-extrabold tracking-tight text-slate-900">Categories</h1>
            <p className="mt-1 text-sm text-slate-500">{categories.length} total categories</p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-[#702ae1] px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(112,42,225,0.22)] transition hover:opacity-90"
          >
            <LuPlus className="h-4 w-4" />
            Add Category
          </button>
        </div>

        {/* ── Inline Form (create / edit) ── */}
        {showForm && (
          <div className="mb-6 rounded-2xl border border-[#702ae1]/20 bg-white p-6 shadow-[0_8px_32px_rgba(112,42,225,0.08)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-[Manrope] text-lg font-bold text-slate-900">
                {editTarget ? "Edit Category" : "New Category"}
              </h2>
              <button
                onClick={closeForm}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50"
              >
                <LuX className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Category Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Technology"
                  required
                  autoFocus
                  className="w-full rounded-xl border border-slate-200 bg-[#f3f1ff] px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#702ae1] focus:shadow-[0_0_0_3px_rgba(112,42,225,0.12)]"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-sm font-semibold text-slate-700">Active</span>
                <button
                  type="button"
                  onClick={() => setIsActive((p) => !p)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isActive ? "bg-[#702ae1]" : "bg-slate-300"}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${isActive ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={closeForm}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving || !name.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#702ae1] px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50">
                  <LuCheck className="h-4 w-4" />
                  {saving ? "Saving..." : editTarget ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Categories List ── */}
        {loading ? (
          <Loader className="py-20" />
        ) : categories.length ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-3.5">#</th>
                    <th className="px-5 py-3.5">Name</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categories.map((cat, i) => (
                    <tr key={cat._id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-4 text-slate-400">{i + 1}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#ede9fe]">
                            <LuTag className="h-3.5 w-3.5 text-[#702ae1]" />
                          </div>
                          <span className="font-semibold text-slate-900">{cat.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${cat.isActive !== false ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                          {cat.isActive !== false ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(cat)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#702ae1]/30 hover:bg-[#ede9fe] hover:text-[#702ae1]"
                          >
                            <LuPencil className="h-3 w-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(cat._id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                          >
                            <LuTrash2 className="h-3 w-3" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-100 bg-white py-20 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ede9fe]">
              <LuTag className="h-6 w-6 text-[#702ae1]" />
            </div>
            <p className="font-semibold text-slate-700">No categories yet</p>
            <p className="mt-1 text-sm text-slate-400">Click "Add Category" to create your first one.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminCategories;
