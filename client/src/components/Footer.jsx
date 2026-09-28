import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = ({ containerClassName = "" }) => {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-slate-200 bg-white py-10">
      <div className={`${containerClassName} flex flex-col items-center justify-between gap-6 sm:flex-row`}>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-2xl font-black tracking-tight"
        >
          <span className="font-[Manrope] font-extrabold text-slate-900">Blog</span>
          <span className="ml-1 font-[Manrope] font-extrabold italic text-[#702ae1]">App</span>
        </button>

        <div className="flex items-center gap-6 text-sm text-slate-500">
          <button onClick={() => navigate("/")} className="transition hover:text-[#702ae1]">Explore</button>
          <button onClick={() => navigate("/authors")} className="transition hover:text-[#702ae1]">Authors</button>
          <button onClick={() => navigate("/auth")} className="transition hover:text-[#702ae1]">Login</button>
        </div>

        <p className="text-xs text-slate-400">© {new Date().getFullYear()} BlogApp. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
