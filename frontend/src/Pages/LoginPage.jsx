import { Button, Input } from "antd";
import { Mail, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setError, setUser } from "../Redux/user/userSlice";
import fetcher from "../utils/fetcher";
import { useDispatch, useSelector } from "react-redux";
const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetcher("/api/user/login", {
        method: "post",
        data: { ...userData },
      }).then((data) => {
        dispatch(setUser(data.decode));
        toast.success(data.message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      dispatch(setError({ ...error }));
      toast.error(error.message, {
        position: "top-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  const currentUser = useSelector((state) => state.user.user);
  return (
    <>
      {currentUser._id ? (
        <Navigate to={"/"} />
      ) : (
        <section className="w-full min-h-screen flex items-center justify-center px-2 md:px-10 fixed">
          <div className="container mx-auto min-h-screen flex items-center justify-center">
            <div className="w-full md:max-w-md border border-gray-200 p-5">
              <h1 className="text-center md:text-left font-bold text-xl md:text-3xl mb-10">
                Log In
              </h1>
              <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
                <div className="relative w-full px-2 flex items-center hover:text-blue-600">
                  <Input
                    placeholder="Please enter your email"
                    pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$
                    "
                    required
                    size="large"
                    type="email"
                    className="outline-none w-full md:text-lg ring-0 bg-transparent"
                    onChange={handleInput}
                    name="email"
                  />

                  <Mail className="absolute right-5" />
                </div>
                <div className="relative w-full px-2 flex items-center hover:text-blue-600">
                  <Input
                    placeholder="Please enter your password"
                    name="password"
                    onChange={handleInput}
                    type={showPassword ? "text" : "password"}
                    size="large"
                    className="outline-none w-full md:text-lg ring-0 bg-transparent"
                    required
                    pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                  />
                  {showPassword ? (
                    <Eye
                      className="absolute right-5 "
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  ) : (
                    <EyeOff
                      className="absolute right-5 "
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  )}
                </div>

                <div className="flex items-center justify-between w-full px-2 md:flex-row flex-col gap-y-5">
                  <Button type="link">Forget your password?</Button>
                  <div className="flex gap-5">
                    <Button onClick={() => navigate("/signup")}>Sign Up</Button>
                    <Button type="primary" htmlType="submit">
                      {isLoading ? (
                        <div className="border-gray-300 h-5 w-5 animate-spin rounded-full border-2 border-t-blue-600" />
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default LoginPage;
