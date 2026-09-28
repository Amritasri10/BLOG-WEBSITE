import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchAllUsers, updateUserRole, deleteUser } from "../../redux/slices/adminSlice";
import { selectAdmin } from "../../redux/store";
import Loader from "../../components/Loader";

const ROLES = ["reader", "author", "admin"];

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector(selectAdmin);
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => { dispatch(fetchAllUsers(roleFilter)); }, [dispatch, roleFilter]);

  const handleRoleChange = async (userId, role) => {
    const res = await dispatch(updateUserRole({ userId, role }));
    if (!res.error) toast.success(`Role updated to ${role}`);
    else toast.error(res.payload || "Failed");
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user?")) return;
    const res = await dispatch(deleteUser(userId));
    if (!res.error) toast.success("User deleted");
    else toast.error(res.payload || "Failed");
  };

  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#702ae1]">Management</span>
            <h1 className="mt-1 font-[Manrope] text-3xl font-extrabold tracking-tight text-slate-900">Users</h1>
            <p className="mt-1 text-sm text-slate-500">{users.length} users</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setRoleFilter("")} className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${roleFilter === "" ? "bg-[#702ae1] text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>All</button>
            {ROLES.map((r) => (
              <button key={r} onClick={() => setRoleFilter(r)} className={`rounded-full px-4 py-1.5 text-xs font-bold capitalize transition ${roleFilter === r ? "bg-[#702ae1] text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{r}</button>
            ))}
          </div>
        </div>

        {loading ? <Loader className="py-20" /> : (
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-3.5">#</th>
                    <th className="px-5 py-3.5">Name</th>
                    <th className="px-5 py-3.5 max-sm:hidden">Email</th>
                    <th className="px-5 py-3.5">Role</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.length ? users.map((u, i) => (
                    <tr key={u._id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-4 text-slate-400">{i + 1}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#702ae1] to-[#a855f7] text-xs font-bold text-white">
                            {(u.name || "U").charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 max-sm:hidden text-slate-500">{u.email}</td>
                      <td className="px-5 py-4">
                        <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 focus:border-[#702ae1] focus:outline-none">
                          {ROLES.map((r) => <option key={r} value={r} className="capitalize">{r}</option>)}
                        </select>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button onClick={() => handleDelete(u._id)} className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50">Delete</button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-400">No users found.</td></tr>
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

export default AdminUsers;
