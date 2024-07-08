import { NotebookPen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { useSelector } from "react-redux";
const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  return (
    <nav className="border-b border-gray-200 shadow-md sticky top-0 z-50 bg-white  px-2 md:px-10">
      <div className="container mx-auto h-14  flex text-xl md:text-2xl justify-between items-center sticky top-0 left-0  font-semibold  ">
        <div
          className=" flex justify-center items-center text-blue-600 cursor-pointer hover:opacity-75  "
          onClick={() => navigate("/")}
        >
          <span>
            <NotebookPen />
          </span>
          BlogLogo
        </div>
        {user._id ? (
          <div className="flex justify-between  items-center gap-3 md:gap-5 ">
            <Link to={"/addblog"}>
              <Button
                type="primary"
                // className="px-2 md:px-5 py-1 bg-blue-600 text-white text-base rounded hover:opacity-75  md:text-lg "
              >
                Add Blog
              </Button>
            </Link>
            <Link to={"/profile/me"}>
              <div className="relative w-8 h-8 self-center cursor-pointer shadow-md overflow-hidden rounded-full mx-auto   ">
                <img
                  src={user.profile_image}
                  alt="profile image"
                  className="`rounded-full w-full h-full object-cover     "
                />
              </div>
            </Link>
          </div>
        ) : (
          <div className="flex justify-between  items-center gap-2 md:gap-5">
            <Link to={"/login"}>
              <Button type="primary">Login</Button>
            </Link>
            <Link to={"/signup"}>
              <Button type="text" className="border-black/40 border">
                Signup
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
