import { UserRound, Heart, PenLine, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import fetcher from "../utils/fetcher";
import { useDispatch } from "react-redux";
import { logout } from "../Redux/user/userSlice";
const Slider = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await fetcher("/api/user/logout", { method: "get" }).then(() => {
      dispatch(logout());
      navigate("/login");
    });
  };

  let activeClassName =
    "flex justify-start items-center  text-blue-600 border  border-blue-600  text-xs   md:text-base rounded   sm:px-4 sm:py-2  w-full   transition-all ";
  let inActive =
    "flex justify-start items-center     text-base   sm:text-lg rounded   sm:px-4 sm:py-2  w-full  hover:text-blue-600 transition-all hover:ring-2";
  return (
    <div className="sm:w-56  shadow   flex justify-center items-center rounded bg-white  ">
      <div className="w-full h-full flex justify-center items-center flex-col ">
        <div className="flex justify-center items-center gap-y-5 flex-col w-full px-2  font-semibold transition-all">
          <NavLink
            to={"me"}
            className={({ isActive }) =>
              isActive ? activeClassName : inActive
            }
          >
            <UserRound />
            <span className="hidden sm:inline-block ml-2">Profile</span>
          </NavLink>
          <NavLink
            to={"myblogs"}
            className={({ isActive }) =>
              isActive ? activeClassName : inActive
            }
          >
            <PenLine />
            <span className="hidden sm:inline-block ml-2">My Blog</span>
          </NavLink>
          <NavLink
            to={"blogliked"}
            className={({ isActive }) =>
              isActive ? activeClassName : inActive
            }
          >
            <Heart />
            <span className="hidden sm:inline-block ml-2">Liked Blog</span>
          </NavLink>
          <div
            className={`text-red-500  flex justify-start items-center   text-base   sm:text-lg rounded   sm:px-4 sm:py-2  w-full  hover:bg-red-700   transition-all  hover:text-white`}
            onClick={handleLogout}
          >
            <LogOut />
            <span className="hidden sm:inline-block ml-2">Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Slider;
