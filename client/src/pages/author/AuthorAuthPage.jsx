import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AtSign, FileText, KeyRound, Mail, Phone, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { loginUser, registerAuthor, clearError } from "../../redux/slices/authSlice";
import { selectAuth } from "../../redux/store";

const AuthorAuthPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLogin, user, loading, error } = useSelector(selectAuth);
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", username: "", email: "", mobile: "", bio: "", password: "" });

  useEffect(() => {
    if (isLogin && user && (user.role === "author" || user.role === "admin")) navigate("/author");
  }, [isLogin, user, navigate]);

  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  const update = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const inputCls = "w-full rounded-xl bg-[#f3f1ff] py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:shadow-[0_0_0_3px_rgba(112,42,225,0.14)]";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "login") {
      const res = await dispatch(loginUser({ email: form.email.trim().toLowerCase(), password: form.password }));
      if (!res.error) toast.success("Welcome to your dashboard!");
    } else {
      const res = await dispatch(registerAuthor({ name: form.name.trim(), username: form.username.trim().toLowerCase(), email: form.email.trim().toLowerCase(), mobile: form.mobile.trim(), bio: form.bio.trim(), password: form.password }));
      if (!res.error) toast.success("Author account created!");
    }
  };

  return (
    <div className="ethereal-shell flex min-h-screen items-center justify-center overflow-x-hidden bg-[#f6f6ff] px-4 py-10">
      <div className="ethereal-orb ethereal-orb-primary" />
      <div className="ethereal-orb ethereal-orb-secondary" />

      <div className="relative z-10 w-full max-w-[1100px] overflow-hidden rounded-[30px] bg-white shadow-[0_30px_80px_rgba(39,46,66,0.12)]">
        <div className="relative grid min-h-[640px] lg:grid-cols-2">
          <div className={`flex items-center justify-center px-8 py-12 sm:px-14 ${mode === "login" ? "lg:col-start-1" : "lg:col-start-2"}`}>
            <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-[340px] flex-col items-center">
              <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.24em] text-[#702ae1]">
                <FileText className="h-4 w-4" />
                {mode === "login" ? "Author Login" : "Author Register"}
              </div>
              <h1 className="mt-4 text-center font-[Manrope] text-5xl font-extrabold tracking-[-0.05em] text-slate-900">
                {mode === "login" ? "Sign In" : "Sign Up"}
              </h1>
              <p className="mt-5 text-center text-sm text-slate-500">
                {mode === "login" ? "Access your author dashboard." : "Create your author profile and start publishing."}
              </p>

              <div className="mt-6 w-full space-y-3">
                {mode === "register" && <>
                  <div className="relative"><UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input name="name" value={form.name} onChange={update} type="text" placeholder="Full name" required className={inputCls} /></div>
                  <div className="relative"><AtSign className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input name="username" value={form.username} onChange={update} type="text" placeholder="Unique username" required className={inputCls} /></div>
                  <div className="relative"><Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input name="mobile" value={form.mobile} onChange={update} type="text" placeholder="Mobile number" required className={inputCls} /></div>
                </>}
                <div className="relative"><Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input name="email" value={form.email} onChange={update} type="email" placeholder="Email" required className={inputCls} /></div>
                {mode === "register" && (
                  <div className="relative"><FileText className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-400" /><textarea name="bio" value={form.bio} onChange={update} placeholder="Short bio" rows={3} className={`h-24 w-full rounded-xl bg-[#f3f1ff] py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:shadow-[0_0_0_3px_rgba(112,42,225,0.14)]`} /></div>
                )}
                <div className="relative"><KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input name="password" value={form.password} onChange={update} type="password" placeholder="Password" required className={inputCls} /></div>
              </div>

              <button type="submit" disabled={loading}
                className="mt-7 w-full max-w-[230px] rounded-xl bg-[linear-gradient(135deg,#702ae1,#b28cff)] px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_16px_34px_rgba(112,42,225,0.24)] transition hover:opacity-95 disabled:opacity-60">
                {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
              </button>
            </form>
          </div>

          <div className={`hidden lg:flex lg:absolute lg:top-0 lg:h-full lg:w-1/2 lg:items-center lg:justify-center lg:rounded-[30px] lg:bg-[linear-gradient(135deg,#702ae1,#57d2d0)] lg:px-10 lg:py-12 lg:text-white lg:transition-transform lg:duration-700 ${mode === "register" ? "lg:translate-x-0" : "lg:translate-x-full"}`}>
            <div className="max-w-[330px] text-center">
              <h2 className="font-[Manrope] text-5xl font-extrabold leading-tight tracking-[-0.05em]">
                {mode === "login" ? "Open Your Writer Desk" : "Welcome Back to Publish"}
              </h2>
              <p className="mt-6 text-base leading-8 text-white/85">
                {mode === "login" ? "Register to draft stories, manage comments, and build your author identity." : "Sign in to return to your drafts and published blogs."}
              </p>
              <button type="button" onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="mt-8 rounded-xl border border-white/70 px-10 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-white/10">
                {mode === "login" ? "Sign Up" : "Sign In"}
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100 px-8 py-8 lg:hidden">
            <div className="rounded-[24px] bg-[linear-gradient(135deg,#702ae1,#57d2d0)] px-6 py-8 text-center text-white">
              <h2 className="font-[Manrope] text-3xl font-extrabold tracking-[-0.05em]">
                {mode === "login" ? "Need an author account?" : "Already an author?"}
              </h2>
              <button type="button" onClick={() => setMode(mode === "login" ? "register" : "login")}
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

export default AuthorAuthPage;
