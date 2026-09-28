import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LuBookmark, LuHeart, LuUser, LuLogOut } from "react-icons/lu";
import toast from "react-hot-toast";
import { fetchProfile, updateProfile, logout } from "../../redux/slices/authSlice";
import { fetchSavedBlogs, fetchLikedBlogs } from "../../redux/slices/userSlice";
import { selectAuth, selectUser } from "../../redux/store";
import Navbar from "../../components/Navbar";
import BlogCard from "../../components/BlogCard";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLogin, loading } = useSelector(selectAuth);
  const { savedBlogs, likedBlogs } = useSelector(selectUser);
  const [tab, setTab] = useState("saved");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", bio: "" });

  useEffect(() => {
    if (!isLogin) { navigate("/auth"); return; }
    dispatch(fetchProfile());
    dispatch(fetchSavedBlogs());
    dispatch(fetchLikedBlogs());
  }, [dispatch, isLogin, navigate]);

  useEffect(() => {
    if (user) setForm({ name: user.name || "", bio: user.bio || "" });
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await dispatch(updateProfile(form));
    if (!res.error) { toast.success("Profile updated"); setEditing(false); }
    else toast.error(res.payload || "Failed");
  };

  const handleLogout = () => { dispatch(logout()); navigate("/"); };

  if (!user) return <div className="flex min-h-screen items-center justify-center"><Loader /></div>;

  return (
    <div className="min-h-screen bg-[#f6f6ff]">
      <Navbar containerClassName="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10" />

      <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-10">
        {/* Profile Card */}
        <div className="mb-8 rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-[#702ae1] to-[#a855f7] text-3xl font-bold text-white">
              {(user.name || "U").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              {editing ? (
                <form onSubmit={handleUpdate} className="space-y-3">
                  <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Name"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-[#702ae1] focus:outline-none" />
                  <textarea value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} placeholder="Short bio" rows={2}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-[#702ae1] focus:outline-none" />
                  <div className="flex gap-3">
                    <button type="submit" disabled={loading} className="rounded-full bg-[#702ae1] px-5 py-2 text-xs font-bold text-white hover:bg-[#5e21c2] disabled:opacity-60">Save</button>
                    <button type="button" onClick={() => setEditing(false)} className="rounded-full border border-slate-200 px-5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <h1 className="font-[Manrope] text-2xl font-extrabold text-slate-900">{user.name}</h1>
                  <p className="mt-1 text-sm text-slate-500">{user.email}</p>
                  {user.bio && <p className="mt-1 text-sm text-slate-500">{user.bio}</p>}
                  <span className="mt-2 inline-block rounded-full bg-[#ede9fe] px-3 py-1 text-xs font-bold text-[#702ae1] capitalize">{user.role}</span>
                </>
              )}
            </div>
            {!editing && (
              <div className="flex gap-2">
                <button onClick={() => setEditing(true)} className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">
                  <LuUser className="h-3.5 w-3.5" /> Edit
                </button>
                <button onClick={handleLogout} className="flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100">
                  <LuLogOut className="h-3.5 w-3.5" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex border-b border-slate-200">
          {[{ key: "saved", icon: <LuBookmark className="h-4 w-4" />, label: `Saved (${savedBlogs.length})` },
            { key: "liked", icon: <LuHeart className="h-4 w-4" />, label: `Liked (${likedBlogs.length})` }].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`relative flex items-center gap-2 px-5 py-3 text-sm font-semibold transition ${tab === t.key ? "text-slate-900" : "text-slate-500 hover:text-slate-800"}`}>
              {t.icon} {t.label}
              {tab === t.key && <span className="absolute bottom-0 left-0 h-[2.5px] w-full bg-[#702ae1]" />}
            </button>
          ))}
        </div>

        {tab === "saved" && (
          savedBlogs.length ? (
            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {savedBlogs.map((b) => <BlogCard key={b._id} blog={b} />)}
            </div>
          ) : <p className="text-center text-slate-400 py-12">No saved blogs yet.</p>
        )}
        {tab === "liked" && (
          likedBlogs.length ? (
            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {likedBlogs.map((b) => <BlogCard key={b._id} blog={b} />)}
            </div>
          ) : <p className="text-center text-slate-400 py-12">No liked blogs yet.</p>
        )}
      </div>

      <Footer containerClassName="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10" />
    </div>
  );
};

export default ProfilePage;
