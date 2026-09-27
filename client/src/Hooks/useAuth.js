import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser, registerUser, logout } from "../redux/slices/authSlice";
import { selectAuth } from "../redux/store";

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLogin, user, loading, error } = useSelector(selectAuth);

  const handleRegister = async (formData) => {
    const result = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(result)) {
      toast.success("Account created! Welcome 🎉");
      navigate("/");          // auto-login → go home
    } else {
      toast.error(result.payload || "Registration failed");
    }
  };

  const handleLogin = async (formData) => {
    const result = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(result)) {
      toast.success("Logged in successfully!");
      navigate("/");
    } else {
      toast.error(result.payload || "Login failed");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out");
    navigate("/login");
  };

  return { isLogin, user, loading, error, handleRegister, handleLogin, handleLogout };
};

export default useAuth;
