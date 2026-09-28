import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LuLayoutDashboard, LuList, LuLogOut, LuMenu, LuMessageSquare, LuUsers, LuX } from "react-icons/lu";
import { logout } from "../../redux/slices/authSlice";
import { selectAuth } from "../../redux/store";

const navItems = [
  { to: "/admin",          label: "Dashboard", icon: <LuLayoutDashboard className="h-4 w-4" />, end: true },
  { to: "/admin/blogs",    label: "All Blogs",  icon: <LuList className="h-4 w-4" /> },
  { to: "/admin/comments", label: "Comments",   icon: <LuMessageSquare className="h-4 w-4" /> },
  { to: "/admin/users",    label: "Users",      icon: <LuUsers className="h-4 w-4" /> },
];

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(selectAuth);
  const [open, setOpen] = useState(false);

  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);

  const handleLogout = () => { dispatch(logout()); navigate("/"); };

  const Sidebar = () => (
    <aside className={`fixed left-0 top-0 z-50 flex h-full w-[80%] max-w-[260px] flex-col border-r border-slate-200/80 bg-white/95 p-5 backdrop-blur-xl transition-transform duration-300 md:sticky md:top-[72px] md:z-30 md:h-[calc(100vh-72px)] md:w-64 md:flex-shrink-0 md:translate-x-0 md:overflow-y-auto md:bg-white/90 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4 md:hidden">
        <span className="text-xs font-bold uppercase tracking-widest text-[#702ae1]">Admin Menu</span>
        <button onClick={() => setOpen(false)} className="flex h-8 w-8 items-center justify-center border border-slate-200 bg-slate-50 text-slate-600"><LuX className="h-4 w-4" /></button>
      </div>
      <nav className="space-y-1.5 pt-2">
        {navItems.map((item) => (
          <NavLink key={item.to} end={item.end} to={item.to} onClick={() => setOpen(false)}
            className={({ isActive }) => `flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive ? "bg-[#ede9fe] text-[#702ae1] shadow-sm" : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"}`}>
            <span className="flex-shrink-0">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto border-t border-slate-100 pt-4">
        <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 shadow-sm transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600">
          <LuLogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#f6f6ff]">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
        <div className="flex h-[72px] items-center justify-between px-4 sm:px-8 lg:px-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setOpen(true)} className="flex h-10 w-10 items-center justify-center border border-slate-200 bg-white text-slate-700 md:hidden">
              <LuMenu className="h-5 w-5" />
            </button>
            <button onClick={() => navigate("/")} className="text-2xl font-black tracking-tight">
              <span className="font-[Manrope] font-extrabold text-slate-900">Blog</span>
              <span className="ml-1 font-[Manrope] font-extrabold italic text-[#702ae1]">App</span>
            </button>
            <span className="hidden sm:inline-flex items-center rounded-full border border-[#702ae1]/25 bg-[#ede9fe] px-3 py-1 text-xs font-bold text-[#702ae1]">Admin Panel</span>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-[#702ae1] to-[#a855f7] text-xs font-bold text-white">
            {(user?.name || "A").charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-72px)]">
        {open && <button onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden" />}
        <Sidebar />
        <main className="min-w-0 flex-1"><Outlet /></main>
      </div>
    </div>
  );
};

export default AdminLayout;
