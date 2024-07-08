import { lazy } from "react";
import { Outlet } from "react-router-dom";
const Slider = lazy(() => import("../components/Slider"));

const ProfilePage = () => {
  return (
    <div className=" w-full h-[91.2vh]  flex   overflow-hidden bg-[#F6F5F2]    ">
      <Slider />
      <div className="m-5 rounded-lg w-full   overflow-scroll  ">
        <Outlet />
      </div>
    </div>
  );
};

export default ProfilePage;
