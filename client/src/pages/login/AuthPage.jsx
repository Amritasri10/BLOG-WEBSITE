import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { KeyRound, Mail, Phone, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { loginUser, registerUser, clearError } from "../../redux/slices/authSlice";
import { selectAuth } from "../../redux/store";

const AuthPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLogin, loading, error } = useSelector(selectAuth);
  const [mode, setMode] = useState("login"); // login | signup
  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "" });

  const redirectPath = location.state?.from || "/";

  useEffect(() => { if (isLogin) navigate(redirectPath); }, [isLogin, navigate, redirectPath]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  const update = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "login") {
      const res = await dispatch(loginUser({ email: form.email.trim().toLowerCase(), password: form.password }));
      if (!res.error) toast.success("Welcome back!");
    } else {
      const res = await dispatch(registerUser({ name: form.name.trim(), email: form.email.trim().toLowerCase(), mobile: form.mobile.trim(), password: form.password }));
      if (!res.error) toast.success("Account created!");
    }
  };

  const inputCls = "w-full rounded-xl bg-[#f3f1ff] py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:shadow-[0_0_0_3px_rgba(112,42,225,0.14)]";

  return (
    <div className="ethereal-shell flex min-h-screen items-center justify-center overflow-x-hidden bg-[#f6f6ff] px-4 py-10">
      <div className="ethereal-orb ethereal-orb-primary" />
      <div className="ethereal-orb ethereal-orb-secondary" />

      <div className="relative z-10 w-full max-w-[1040px] overflow-hidden rounded-[30px] bg-white shadow-[0_30px_80px_rgba(39,46,66,0.12)]">
        <div className="relative grid min-h-[580px] lg:grid-cols-2">
          {/* Form side */}
          <div className={`flex items-center justify-center px-8 py-12 sm:px-14 ${mode === "login" ? "lg:col-start-1" : "lg:col-start-2"}`}>
            <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-[340px] flex-col items-center">
              <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.24em] text-[#702ae1]">
                <UserRound className="h-4 w-4" />
                {mode === "login" ? "Reader Login" : "Create Account"}
              </div>
              <h1 className="mt-4 text-center font-[Manrope] text-5xl font-extrabold tracking-[-0.05em] text-slate-900">
                {mode === "login" ? "Sign In" : "Sign Up"}
              </h1>
              <p className="mt-5 text-center text-sm text-slate-500">
                {mode === "login" ? "Sign in to save blogs and join discussions." : "Create your reader profile."}
              </p>

              <div className="mt-6 w-full space-y-3">
                {mode === "signup" && (
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input name="name" type="text" value={form.name} onChange={update} placeholder="Full Name" required className={inputCls} />
                  </div>
                )}
                {mode === "signup" && (
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input name="mobile" type="text" value={form.mobile} onChange={update} placeholder="Mobile Number" required className={inputCls} />
                  </div>
                )}
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input name="email" type="email" value={form.email} onChange={update} placeholder="Email" required className={inputCls} />
                </div>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input name="password" type="password" value={form.password} onChange={update} placeholder="Password" required className={inputCls} />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="mt-7 w-full max-w-[230px] rounded-xl bg-[linear-gradient(135deg,#702ae1,#b28cff)] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_16px_34px_rgba(112,42,225,0.24)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Sign Up"}
              </button>
            </form>
          </div>

          {/* Promo panel */}
          <div className={`hidden lg:flex lg:absolute lg:top-0 lg:h-full lg:w-1/2 lg:items-center lg:justify-center lg:rounded-[30px] lg:bg-[linear-gradient(135deg,#702ae1,#57d2d0)] lg:px-10 lg:py-12 lg:text-white lg:transition-transform lg:duration-700 ${mode === "signup" ? "lg:translate-x-0" : "lg:translate-x-full"}`}>
            <div className="max-w-[330px] text-center">
              <h2 className="font-[Manrope] text-5xl font-extrabold leading-tight tracking-[-0.05em]">
                {mode === "login" ? "Build Your Reading Space" : "Welcome Back"}
              </h2>
              <p className="mt-6 text-base leading-8 text-white/85">
                {mode === "login" ? "Create an account to bookmark, react, and join every conversation." : "Sign in to return to your saved blogs."}
              </p>
              <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="mt-8 rounded-xl border border-white/70 px-10 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-white/10">
                {mode === "login" ? "Sign Up" : "Sign In"}
              </button>
            </div>
          </div>

          {/* Mobile toggle */}
          <div className="border-t border-slate-100 px-8 py-8 lg:hidden">
            <div className="rounded-[24px] bg-[linear-gradient(135deg,#702ae1,#57d2d0)] px-6 py-8 text-center text-white">
              <h2 className="font-[Manrope] text-3xl font-extrabold tracking-[-0.05em]">
                {mode === "login" ? "Need an account?" : "Already registered?"}
              </h2>
              <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="mt-6 rounded-xl border border-white/70 px-8 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white">
                {mode === "login" ? "Sign Up" : "Sign In"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
