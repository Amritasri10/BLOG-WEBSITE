import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { KeyRound, Mail, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { loginUser, clearError } from "../../redux/slices/authSlice";
import { selectAuth } from "../../redux/store";

const AdminLoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLogin, user, loading, error } = useSelector(selectAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isLogin && user?.role === "admin") navigate("/admin");
  }, [isLogin, user, navigate]);

  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(loginUser({ email: email.trim().toLowerCase(), password }));
    if (!res.error) {
      if (res.payload?.role !== "admin") { toast.error("Not an admin account"); return; }
      toast.success("Welcome, Admin!");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f6ff] px-4">
      <div className="w-full max-w-sm rounded-3xl border border-[#702ae1]/20 bg-white p-8 shadow-[0_20px_60px_rgba(112,42,225,0.12)]">
        <div className="flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ede9fe]">
            <ShieldCheck className="h-7 w-7 text-[#702ae1]" />
          </div>
          <h1 className="mt-5 font-[Manrope] text-3xl font-extrabold text-slate-900">
            <span className="text-[#702ae1]">Admin</span> Login
          </h1>
          <p className="mt-2 text-sm text-slate-500">Enter your credentials to access the admin panel</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Admin email" required
                className="w-full rounded-xl bg-[#f3f1ff] py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:shadow-[0_0_0_3px_rgba(112,42,225,0.14)]" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Password</label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required
                className="w-full rounded-xl bg-[#f3f1ff] py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:shadow-[0_0_0_3px_rgba(112,42,225,0.14)]" />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full rounded-xl bg-[linear-gradient(135deg,#702ae1,#b28cff)] py-3 text-sm font-bold text-white shadow-[0_16px_34px_rgba(112,42,225,0.24)] transition hover:opacity-95 disabled:opacity-60">
            {loading ? "Please wait..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
