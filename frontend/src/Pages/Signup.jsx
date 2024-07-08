import { Button, Input } from "antd";
import { Mail, Eye, EyeOff, User } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import defaultUserImg from "../assets/defaultUser.png";
import fetcher from "../utils/fetcher";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setError, setLoading, setUser } from "../Redux/user/userSlice";
const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [imageLocalUrl, setImageLocalUrl] = useState();
  const imageRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.user.loading);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    name: "",
    profile_image: "",
  });
  const hanldeProfile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const newUrlImage = URL.createObjectURL(file);
      setImageLocalUrl(newUrlImage);
    }
  };
  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading());
    try {
      let file = profileImage;
      let updatedUserData = { ...userData };
      const formdata = new FormData();
      formdata.append("file", file);
      formdata.append("upload_preset", "blog_profile");
      if (file) {
        await fetch(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUD_NAME
          }/auto/upload`,
          {
            method: "post",
            body: formdata,
          }
        )
          .then((res) => res.json())
          .then((res) => {
            updatedUserData.profile_image = res.url;
          });
      }

      console.log(updatedUserData);
      await fetcher("/api/user/register", {
        method: "POST",
        data: { ...updatedUserData },
      }).then((data) => {
        console.log(data);
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
        dispatch(setLoading());
        navigate("/");
      });
    } catch (error) {
      dispatch(setLoading());
      dispatch(setError(error));
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
  return (
    <section className="w-full min-h-screen flex items-center justify-center px-2 md:px-10 ">
      <div className="container mx-auto min-h-screen flex items-center justify-center">
        <div className="w-full md:max-w-md border border-gray-200 p-5 transition-all shadow-sm">
          <h1 className="text-center md:text-left font-bold text-xl md:text-3xl mb-10">
            Sign Up
          </h1>
          <div className="w-full " onClick={() => imageRef.current.click()}>
            <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full mx-auto mb-5  ">
              <input
                type="file"
                className="hidden"
                ref={imageRef}
                onChange={hanldeProfile}
              />
              <img
                src={imageLocalUrl || defaultUserImg}
                alt="profile image"
                loading="lazy"
                className="`rounded-full w-full h-full object-cover     "
              />
            </div>
          </div>
          <form className="flex flex-col space-y-5" onSubmit={handleSubmit}>
            <div className="relative w-full px-2 flex items-center hover:text-blue-600">
              <Input
                placeholder="Please enter your name"
                size="large"
                type="text"
                className="outline-none w-full md:text-lg ring-0 bg-transparent"
                name="name"
                onChange={handleInput}
                required
                pattern="^[a-zA-Z\s'-]{5,}$"
              />
              <User className="absolute right-5" />
            </div>
            <div className="relative w-full px-2 flex items-center hover:text-blue-600">
              <Input
                placeholder="Please enter your email"
                size="large"
                type="email"
                className="outline-none w-full md:text-lg ring-0 bg-transparent"
                name="email"
                onChange={handleInput}
                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
                "
                required
              />
              <Mail className="absolute right-5" />
            </div>
            <div className="relative w-full px-2 flex items-center hover:text-blue-600">
              <Input
                placeholder="Please enter your password"
                required
                pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                type={showPassword ? "text" : "password"}
                size="large"
                className="outline-none w-full md:text-lg ring-0 bg-transparent"
                name="password"
                onChange={handleInput}
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
            <div className="flex items-center justify-between flex-col md:flex-row w-full gap-y-5 md:px-2">
              <Button type="link">Forget your password?</Button>
              <div className="flex gap-5">
                <Button onClick={() => navigate("/login")}> Login</Button>
                <button type="submit">
                  <Button type="primary" disabled={isLoading ? true : false}>
                    Sign Up
                  </Button>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Signup;
