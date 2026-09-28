import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllAuthors } from "../../redux/slices/authorSlice";
import { selectAuthor } from "../../redux/store";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";

const AuthorsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authors, loading } = useSelector(selectAuthor);

  useEffect(() => { dispatch(fetchAllAuthors()); }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#f6f6ff]">
      <Navbar containerClassName="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10" />

      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#702ae1]">Community</span>
          <h1 className="mt-2 font-[Manrope] text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Our Writers</h1>
          <p className="mt-2 text-sm text-slate-500">Discover talented authors and follow their stories.</p>
        </div>

        {loading ? (
          <Loader className="py-20" />
        ) : authors.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {authors.map((author) => (
              <div key={author._id}
                onClick={() => navigate(`/authors/${author._id}`)}
                className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#702ae1] to-[#a855f7] text-xl font-bold text-white">
                  {(author.name || "A").charAt(0).toUpperCase()}
                </div>
                <h3 className="mt-4 font-[Manrope] text-lg font-bold text-slate-900 group-hover:text-[#702ae1]">{author.name}</h3>
                {author.bio && <p className="mt-1 line-clamp-2 text-sm text-slate-500">{author.bio}</p>}
                <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
                  <span>{author.blogCount || 0} stories</span>
                  <span>{author.followerCount || 0} followers</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-white py-16 text-center border border-slate-100">
            <p className="text-slate-500">No authors yet.</p>
          </div>
        )}
      </div>

      <Footer containerClassName="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10" />
    </div>
  );
};

export default AuthorsPage;
