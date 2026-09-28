import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LuUserCheck, LuUserPlus } from "react-icons/lu";
import toast from "react-hot-toast";
import { fetchPublicAuthorProfile } from "../../redux/slices/authorSlice";
import { fetchAuthorBlogs } from "../../redux/slices/blogSlice";
import { toggleFollowAuthor, fetchFollowingAuthors } from "../../redux/slices/userSlice";
import { selectAuthor, selectBlog, selectUser, selectAuth } from "../../redux/store";
import Navbar from "../../components/Navbar";
import BlogCard from "../../components/BlogCard";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";

const AuthorProfile = () => {
  const { authorId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { publicProfile, loading } = useSelector(selectAuthor);
  const { authorBlogs } = useSelector(selectBlog);
  const { followingAuthors } = useSelector(selectUser);
  const { isLogin } = useSelector(selectAuth);

  const isFollowing = followingAuthors.some((a) => a._id === authorId || a === authorId);

  useEffect(() => {
    dispatch(fetchPublicAuthorProfile(authorId));
    dispatch(fetchAuthorBlogs(authorId));
    if (isLogin) dispatch(fetchFollowingAuthors());
  }, [dispatch, authorId, isLogin]);

  const handleFollow = async () => {
    if (!isLogin) { toast.error("Login to follow"); navigate("/auth"); return; }
    const res = await dispatch(toggleFollowAuthor(authorId));
    if (!res.error) {
      dispatch(fetchFollowingAuthors());
      toast.success(isFollowing ? "Unfollowed" : "Following!");
    }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Loader /></div>;

  return (
    <div className="min-h-screen bg-[#f6f6ff]">
      <Navbar containerClassName="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10" />

      <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-10">
        {publicProfile && (
          <div className="mb-10 flex flex-col items-start gap-6 rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#702ae1] to-[#a855f7] text-3xl font-bold text-white">
              {(publicProfile.name || "A").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="font-[Manrope] text-2xl font-extrabold text-slate-900">{publicProfile.name}</h1>
              {publicProfile.bio && <p className="mt-1 text-sm text-slate-500">{publicProfile.bio}</p>}
              <div className="mt-3 flex items-center gap-5 text-xs text-slate-400">
                <span>{authorBlogs.length} stories</span>
                <span>{publicProfile.followerCount || 0} followers</span>
              </div>
            </div>
            <button onClick={handleFollow}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold transition ${isFollowing ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50" : "bg-[#702ae1] text-white hover:bg-[#5e21c2]"}`}>
              {isFollowing ? <><LuUserCheck className="h-4 w-4" /> Following</> : <><LuUserPlus className="h-4 w-4" /> Follow</>}
            </button>
          </div>
        )}

        <h2 className="mb-6 font-[Manrope] text-xl font-extrabold text-slate-900">Stories</h2>
        {authorBlogs.length ? (
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {authorBlogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
          </div>
        ) : (
          <div className="rounded-3xl bg-white py-12 text-center border border-slate-100">
            <p className="text-slate-500">No stories published yet.</p>
          </div>
        )}
      </div>

      <Footer containerClassName="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10" />
    </div>
  );
};

export default AuthorProfile;
