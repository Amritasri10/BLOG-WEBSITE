import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchProfile, updateProfile, updatePassword } from "../../redux/slices/authSlice";
import { selectAuth } from "../../redux/store";

const AuthorProfileEdit = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector(selectAuth);
  const [profile, setProfile] = useState({ name: "", bio: "", username: "" });
  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  useEffect(() => { dispatch(fetchProfile()); }, [dispatch]);
  useEffect(() => { if (user) setProfile({ name: user.name || "", bio: user.bio || "", username: user.username || "" }); }, [user]);

  const handleProfile = async (e) => {
    e.preventDefault();
    const res = await dispatch(updateProfile(profile));
    if (!res.error) toast.success("Profile updated");
    else toast.error(res.payload || "Failed");
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (pwd.newPassword !== pwd.confirmPassword) { toast.error("Passwords don't match"); return; }
    const res = await dispatch(updatePassword({ currentPassword: pwd.currentPassword, newPassword: pwd.newPassword }));
    if (!res.error) { toast.success("Password updated"); setPwd({ currentPassword: "", newPassword: "", confirmPassword: "" }); }
    else toast.error(res.payload || "Failed");
  };

  const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-[#702ae1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#702ae1]/10";

  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="border-b border-slate-200/80 pb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#702ae1]">Settings</span>
          <h1 className="mt-1 font-[Manrope] text-3xl font-extrabold tracking-tight text-slate-900">Author Profile</h1>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleProfile} className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm space-y-4">
          <h2 className="font-[Manrope] text-lg font-bold text-slate-900">Edit Profile</h2>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Name</label>
            <input value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} placeholder="Your name" className={inputCls} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Username</label>
            <input value={profile.username} onChange={(e) => setProfile((p) => ({ ...p, username: e.target.value }))} placeholder="Username" className={inputCls} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Bio</label>
            <textarea value={profile.bio} onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))} placeholder="Short bio about yourself" rows={3} className={`${inputCls} h-24 resize-none`} />
          </div>
          <button type="submit" disabled={loading} className="rounded-full bg-[#702ae1] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#5e21c2] disabled:opacity-60">
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {/* Password Form */}
        <form onSubmit={handlePassword} className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm space-y-4">
          <h2 className="font-[Manrope] text-lg font-bold text-slate-900">Change Password</h2>
          {[["currentPassword", "Current Password"], ["newPassword", "New Password"], ["confirmPassword", "Confirm Password"]].map(([key, label]) => (
            <div key={key}>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">{label}</label>
              <input type="password" value={pwd[key]} onChange={(e) => setPwd((p) => ({ ...p, [key]: e.target.value }))} placeholder={label} className={inputCls} />
            </div>
          ))}
          <button type="submit" disabled={loading} className="rounded-full bg-slate-900 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-700 disabled:opacity-60">
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthorProfileEdit;
