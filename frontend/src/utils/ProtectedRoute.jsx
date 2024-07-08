import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = () => {
  const user = useSelector((state) => state.user.user);
  return (
    <>
      {user._id ? (
        <Outlet />
      ) : (
        <>
          {toast.error("Please Login.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          })}
          <Navigate to={"/login"} />
        </>
      )}
    </>
  );
};

export default ProtectedRoute;
