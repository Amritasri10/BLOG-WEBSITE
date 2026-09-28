import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LuArrowUpRight, LuCalendar, LuSearch } from "react-icons/lu";
import { fetchAllBlogs, setSearchInput } from "../../redux/slices/blogSlice";
import { selectBlog } from "../../redux/store";
import { BLOG_CATEGORIES } from "../../constants/staticData";
import Navbar from "../../components/Navbar";
import BlogCard from "../../components/BlogCard";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";
import { useState } from "react";

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blogs, searchInput, loading } = useSelector(selectBlog);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => { dispatch(fetchAllBlogs()); }, [dispatch]);

  const latestBlog = useMemo(() => {
    if (!blogs.length) return null;
    return [...blogs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      if (activeCategory === "All" && !searchInput && blogs.length > 1 && b._id === latestBlog?._id) return false;
      const matchSearch = !searchInput ||
        b.title?.toLowerCase().includes(searchInput.toLowerCase()) ||
        b.category?.toLowerCase().includes(searchInput.toLowerCase());
      const matchCategory = activeCategory === "All" || b.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [blogs, searchInput, activeCategory, latestBlog]);

  const visibleCategories = useMemo(() => {
    const fromBlogs = blogs.map((b) => b.category).filter(Boolean).filter((c, i, a) => a.indexOf(c) === i);
    return ["All", ...BLOG_CATEGORIES.filter((c) => fromBlogs.includes(c)), ...fromBlogs.filter((c) => !BLOG_CATEGORIES.includes(c))].filter((c, i, a) => a.indexOf(c) === i);
  }, [blogs]);

  return (
    <div className="ethereal-shell min-h-screen overflow-x-clip">
      <div className="ethereal-orb ethereal-orb-primary" />
      <div className="ethereal-orb ethereal-orb-secondary" />

      <Navbar containerClassName="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10" />

      {/* Hero */}
      <section className="relative mx-auto w-full max-w-7xl px-4 pt-10 pb-10 sm:px-6 lg:px-10">
        <div className="mb-8 space-y-3">
          <h1 className="font-[Manrope] text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Read Stories & Share Ideas
          </h1>
          <p className="text-base text-slate-500 sm:text-lg">
            A platform where passionate writers publish their stories and readers explore fresh perspectives.
          </p>
        </div>

        {loading && !blogs.length ? (
          <Loader className="min-h-[380px]" />
        ) : latestBlog ? (
          <div
            onClick={() => navigate(`/blog/${latestBlog._id}`)}
            className="group relative min-h-[380px] sm:min-h-[460px] w-full cursor-pointer overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.14)] transition duration-500 hover:shadow-[0_28px_80px_rgba(112,42,225,0.18)]"
          >
            <img src={latestBlog.image} alt={latestBlog.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/15" />
            <div className="relative flex h-full min-h-[380px] sm:min-h-[460px] flex-col justify-end p-6 sm:p-10">
              <div className="flex items-start justify-between gap-4">
                <h2 className="max-w-4xl font-[Manrope] text-2xl font-extrabold leading-tight text-white group-hover:text-[#c4b5fd] sm:text-3xl lg:text-4xl">
                  {latestBlog.title}
                </h2>
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:bg-white group-hover:text-[#702ae1]">
                  <LuArrowUpRight className="text-2xl" />
                </div>
              </div>
              {latestBlog.subTitle && (
                <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-relaxed text-slate-200">{latestBlog.subTitle}</p>
              )}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-5">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-white">{latestBlog.author?.name || "Author"}</span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <LuCalendar className="text-slate-400" />
                    <span>{formatDate(latestBlog.createdAt)}</span>
                  </div>
                </div>
                <span className="rounded-full border border-white/25 bg-white/15 px-3.5 py-1 text-xs font-semibold text-white">
                  {latestBlog.category || "General"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[380px] flex-col items-center justify-center rounded-3xl bg-[#ede9fe]/40 text-center">
            <p className="text-slate-500">No stories yet. Be the first to write!</p>
            <button onClick={() => navigate("/author")} className="mt-4 rounded-full bg-[#702ae1] px-6 py-2.5 text-sm font-bold text-white">Start Writing</button>
          </div>
        )}
      </section>

      {/* Blog List */}
      <main className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-10">
        {/* Category + Search */}
        <div className="mb-10 flex flex-col gap-5 border-b border-slate-200/80 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6 overflow-x-auto pb-px scrollbar-hide">
            {visibleCategories.map((cat) => {
              const count = cat === "All" ? blogs.length : blogs.filter((b) => b.category === cat).length;
              const active = activeCategory === cat;
              return (
                <button key={cat} type="button" onClick={() => setActiveCategory(cat)}
                  className={`relative flex items-center gap-2 whitespace-nowrap pb-3.5 pt-1 text-sm font-semibold transition-colors ${active ? "text-slate-950" : "text-slate-500 hover:text-slate-800"}`}>
                  <span>{cat}</span>
                  {count > 0 && <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${active ? "bg-[#702ae1] text-white" : "bg-slate-100 text-slate-500"}`}>{count}</span>}
                  {active && <span className="absolute bottom-0 left-0 h-[2.5px] w-full rounded-full bg-[#702ae1]" />}
                </button>
              );
            })}
          </div>
          <div className="relative mb-3 w-full md:mb-2 md:w-72 flex-shrink-0">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => dispatch(setSearchInput(e.target.value))}
              placeholder="Search blogs..."
              className="w-full rounded-full border border-slate-200/90 bg-white/90 py-2.5 pl-4 pr-11 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm transition focus:border-[#702ae1] focus:outline-none focus:ring-2 focus:ring-[#702ae1]/10"
            />
            <LuSearch className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {loading ? (
          <Loader className="py-20" />
        ) : filteredBlogs.length ? (
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
          </div>
        ) : (
          <div className="rounded-3xl bg-slate-50/80 px-8 py-16 text-center border border-slate-100">
            <h3 className="font-[Manrope] text-2xl font-extrabold text-slate-900">No stories match your criteria</h3>
            <p className="mt-2 text-sm text-slate-500">Try a different keyword or category.</p>
            <button onClick={() => { dispatch(setSearchInput("")); setActiveCategory("All"); }}
              className="mt-6 rounded-full bg-[#702ae1] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#5e21c2]">
              Reset Filters
            </button>
          </div>
        )}
      </main>

      <Footer containerClassName="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10" />
    </div>
  );
};

export default HomePage;
