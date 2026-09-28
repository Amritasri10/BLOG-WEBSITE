import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuGlobe, LuLoader, LuUpload } from "react-icons/lu";
import toast from "react-hot-toast";
import Quill from "quill";
import { createBlog } from "../../redux/slices/blogSlice";
import { BLOG_CATEGORIES } from "../../constants/staticData";
import { selectBlog } from "../../redux/store";

const AuthorAddBlog = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector(selectBlog);
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("Technology");
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: "snow" });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) { toast.error("Please upload a cover image"); return; }
    const description = quillRef.current?.root.innerHTML || "";
    if (!description || description === "<p><br></p>") { toast.error("Please write some content"); return; }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subTitle", subTitle);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("isPublished", isPublished);
    formData.append("image", image);

    const res = await dispatch(createBlog(formData));
    if (!res.error) {
      toast.success("Story saved!");
      setImage(null); setTitle(""); setSubTitle(""); setCategory("Technology"); setIsPublished(false);
      if (quillRef.current) quillRef.current.root.innerHTML = "";
    } else {
      toast.error(res.payload || "Failed to save");
    }
  };

  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 border-b border-slate-200/80 pb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#702ae1]">Creator Suite</span>
          <h1 className="mt-1 font-[Manrope] text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Create New Story</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm sm:p-8">
          {/* Cover Image */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">Cover Image <span className="text-rose-500">*</span></label>
            <label htmlFor="image" className="group flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center transition hover:border-[#702ae1] hover:bg-[#ede9fe]/20">
              {!image ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#702ae1] shadow-sm"><LuUpload className="h-5 w-5" /></div>
                  <p className="text-sm font-semibold text-slate-700">Click to upload cover image</p>
                  <p className="text-xs text-slate-400">PNG, JPG, WEBP (max 5MB)</p>
                </div>
              ) : (
                <div className="flex w-full max-w-md items-center justify-between rounded-xl bg-white p-3 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-3">
                    <img src={URL.createObjectURL(image)} alt="preview" className="h-14 w-20 rounded-lg object-cover" />
                    <div className="text-left"><p className="max-w-[180px] truncate text-xs font-bold text-slate-900">{image.name}</p><p className="text-[10px] text-slate-400">{(image.size / (1024 * 1024)).toFixed(2)} MB</p></div>
                  </div>
                  <span className="rounded-full bg-[#ede9fe] px-3 py-1 text-xs font-bold text-[#702ae1]">Change</span>
                </div>
              )}
              <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" accept="image/*" hidden />
            </label>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Title <span className="text-rose-500">*</span></label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give your story a headline..." required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-[#702ae1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#702ae1]/10" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Subtitle</label>
              <input type="text" value={subTitle} onChange={(e) => setSubTitle(e.target.value)} placeholder="Brief summary for the feed..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-[#702ae1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#702ae1]/10" />
            </div>
          </div>

          {/* Content Editor */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">Content <span className="text-rose-500">*</span></label>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div ref={editorRef} className="min-h-[260px] text-slate-800" />
            </div>
          </div>

          {/* Category & Publish */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Category <span className="text-rose-500">*</span></label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-800 focus:border-[#702ae1] focus:outline-none focus:ring-2 focus:ring-[#702ae1]/10">
                {BLOG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Status</label>
              <label className="flex h-[42px] cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 px-4 transition hover:bg-slate-100">
                <div className="flex items-center gap-2">
                  <LuGlobe className="h-4 w-4 text-[#702ae1]" />
                  <span className="text-xs font-semibold text-slate-700">Publish immediately</span>
                </div>
                <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="h-4 w-4 rounded accent-[#702ae1]" />
              </label>
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" disabled={loading}
              className="rounded-full bg-[#702ae1] px-8 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#5e21c2] disabled:opacity-60">
              {loading ? <span className="flex items-center gap-2"><LuLoader className="h-4 w-4 animate-spin" /> Saving...</span> : isPublished ? "Publish Story" : "Save as Draft"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthorAddBlog;
