import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchFollowingAuthors } from "../redux/slices/userSlice";
import { selectUser, selectAuth } from "../redux/store";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";

const FollowingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { followingAuthors, loading } = useSelector(selectUser);
  const { isLogin } = useSelector(selectAuth);

  useEffect(() => {
    if (!isLogin) { navigate("/auth", { state: { from: "/following" } }); return; }
    dispatch(fetchFollowingAuthors());
  }, [dispatch, isLogin, navigate]);

  return (
    <div className="min-h-screen bg-[#f6f6ff]">
      <Navbar containerClassName="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10" />

      <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-10">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#702ae1]">Your Network</span>
          <h1 className="mt-2 font-[Manrope] text-3xl font-extrabold tracking-tight text-slate-900">Following</h1>
        </div>

        {loading ? (
          <Loader className="py-20" />
        ) : followingAuthors.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {followingAuthors.map((author) => (
              <div key={author._id}
                onClick={() => navigate(`/authors/${author._id}`)}
                className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-[#702ae1] to-[#a855f7] text-lg font-bold text-white">
                  {(author.name || "A").charAt(0).toUpperCase()}
                </div>
                <h3 className="mt-4 font-[Manrope] text-base font-bold text-slate-900 group-hover:text-[#702ae1]">{author.name}</h3>
                {author.bio && <p className="mt-1 line-clamp-2 text-xs text-slate-500">{author.bio}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-white py-16 text-center border border-slate-100">
            <p className="text-slate-500">You're not following anyone yet.</p>
            <button onClick={() => navigate("/authors")} className="mt-4 rounded-full bg-[#702ae1] px-6 py-2.5 text-sm font-bold text-white">Discover Authors</button>
          </div>
        )}
      </div>

      <Footer containerClassName="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10" />
    </div>
  );
};

export default FollowingPage;
