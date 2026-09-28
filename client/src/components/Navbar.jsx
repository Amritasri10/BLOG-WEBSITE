import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Menu, X } from "lucide-react";
import { logout } from "../redux/slices/authSlice";
import { selectAuth } from "../redux/store";

const Navbar = ({ containerClassName = "" }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { isLogin, user } = useSelector(selectAuth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isSidebarOpen]);

  const handleNavigate = (path) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  const isCurrent = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setIsSidebarOpen(false);
  };

  const getDashboardPath = () => {
    if (!user) return "/auth";
    if (user.role === "admin") return "/admin";
    if (user.role === "author") return "/author";
    return "/profile";
  };

  const getDashboardLabel = () => {
    if (!user) return "Sign In";
    if (user.role === "admin") return "Admin Panel";
    if (user.role === "author") return "Dashboard";
    return user.name?.split(" ")[0] || "Profile";
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
        <div className={`flex h-16 items-center justify-between ${containerClassName}`}>
          {/* Left: Hamburger + Logo + Nav */}
          <div className="flex items-center gap-6 lg:gap-10">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center text-2xl font-black tracking-tight text-slate-950"
            >
              <span className="font-[Manrope] font-extrabold text-slate-900">Blog</span>
              <span className="ml-1 font-[Manrope] font-extrabold italic text-[#702ae1]">App</span>
            </button>

            <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
              {[
                { label: "Explore", path: "/" },
                { label: "Authors", path: "/authors" },
                ...(isLogin ? [{ label: "Following", path: "/following" }] : []),
              ].map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`relative py-1 transition hover:text-slate-950 ${
                    isCurrent(item.path) ? "font-bold text-slate-950" : ""
                  }`}
                >
                  {item.label}
                  {isCurrent(item.path) && (
                    <span className="absolute bottom-0 left-0 h-[2.5px] w-full bg-[#702ae1]" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Right */}
          <div className="hidden items-center gap-3 lg:flex">
            {isLogin ? (
              <>
                <button
                  type="button"
                  onClick={() => navigate(getDashboardPath())}
                  className="rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  {getDashboardLabel()}
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full bg-[linear-gradient(135deg,#702ae1,#9854f7)] px-5 py-2 text-sm font-bold text-white shadow-md transition hover:brightness-110"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => navigate("/auth")}
                  className="rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/author")}
                  className="rounded-full bg-[linear-gradient(135deg,#702ae1,#9854f7)] px-5 py-2 text-sm font-bold text-white shadow-md transition hover:brightness-110"
                >
                  Write
                </button>
              </>
            )}
          </div>

          {/* Mobile right */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => handleNavigate(isLogin ? getDashboardPath() : "/auth")}
              className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-sm"
            >
              {isLogin ? getDashboardLabel() : "Login"}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-[70] transition-opacity duration-300 ${
          isSidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={() => setIsSidebarOpen(false)}
          className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm"
          aria-label="Close overlay"
        />
        <aside
          className={`absolute left-0 top-0 flex h-full w-[85%] max-w-xs flex-col border-r border-slate-200 bg-white px-6 py-6 shadow-2xl transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <button type="button" onClick={() => handleNavigate("/")} className="text-xl font-black text-slate-950">
              <span className="font-[Manrope] text-slate-900">Blog</span>
              <span className="ml-1 font-[Manrope] italic text-[#702ae1]">App</span>
            </button>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="flex h-9 w-9 items-center justify-center border border-slate-200 bg-slate-50 text-slate-700"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 flex flex-col divide-y divide-slate-100">
            {[
              { label: "Explore", path: "/" },
              { label: "Authors", path: "/authors" },
              ...(isLogin ? [{ label: "Following", path: "/following" }, { label: "Profile", path: "/profile" }] : []),
            ].map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNavigate(item.path)}
                className="flex w-full items-center py-3.5 text-left text-sm font-medium text-slate-700 transition hover:text-[#702ae1]"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-auto space-y-3 border-t border-slate-100 pt-5">
            {isLogin ? (
              <>
                <button
                  type="button"
                  onClick={() => handleNavigate(getDashboardPath())}
                  className="w-full rounded-xl border border-[#702ae1] py-2.5 text-sm font-bold text-[#702ae1] transition hover:bg-[#702ae1] hover:text-white"
                >
                  {getDashboardLabel()}
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-xl bg-rose-50 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleNavigate("/auth")}
                  className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Login / Sign Up
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate("/author")}
                  className="w-full rounded-xl bg-[#702ae1] py-2.5 text-sm font-bold text-white"
                >
                  Become a Writer
                </button>
              </>
            )}
          </div>
        </aside>
      </div>
    </>
  );
};

export default Navbar;
