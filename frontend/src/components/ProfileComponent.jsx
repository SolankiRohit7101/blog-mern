import { Button, Input } from "antd";
import { Clover, User } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import fetcher from "../utils/fetcher";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setError, setLoading, setUser } from "../Redux/user/userSlice";
import TextArea from "antd/es/input/TextArea";

const ProfileComponent = () => {
  const [profileImage, setProfileImage] = useState("");
  const [imageLocalUrl, setImageLocalUrl] = useState();
  const imageRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useSelector((state) => state.user.user);
  const [userData, setUserData] = useState(currentUser);
  const [editData, setEditData] = useState(false);
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
    setIsLoading(true);
    dispatch(setLoading());
    try {
      let updatedUserData,
        file = profileImage;
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
            updatedUserData = { ...userData, profile_image: res.url };
          });
      }
      await fetcher("/api/user/profile", {
        method: "put",
        data: { ...updatedUserData },
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
      dispatch(setLoading());
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      setIsLoading(false);
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
    <section className="w-full flex items-center justify-center  rounded-lg px-2 md:px-10 bg-white">
      <div className="container mx-auto min-h-[85vh] flex items-center justify-center">
        <div className="w-full md:max-w-md p-2 md:p-5 transition-all shadow-sm ">
          <p className="text-center  font-bold text-lg md:text-2xl mb-10 text-balance truncate mx-auto break-words">
            {userData.email}
          </p>
          <div
            className="w-full "
            onClick={() => imageRef.current.click()}
            disabled={editData ? false : true}
          >
            <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full mx-auto mb-5  ">
              <input
                type="file"
                className="hidden "
                disabled={editData ? false : true}
                ref={imageRef}
                onChange={hanldeProfile}
              />
              <img
                src={imageLocalUrl || userData.profile_image}
                alt="profile image"
                className={`rounded-full w-full h-full object-cover     ${
                  editData ? "cursor-pointer" : "cursor-not-allowed"
                } `}
              />
            </div>
          </div>
          <form className="flex flex-col space-y-5">
            <div className="relative w-full px-2 flex items-center hover:text-blue-600">
              <Input
                placeholder="Please enter your name "
                size="large"
                type="text"
                className="outline-none w-full md:text-lg ring-0 bg-transparent break-words"
                name="name"
                disabled={editData ? false : true}
                onChange={handleInput}
                value={userData.name}
              />
              <User
                className={`absolute right-5  ${editData && "text-green-700"} `}
              />
            </div>
            <div className="relative w-full px-2 flex items-center hover:text-blue-600">
              <TextArea
                rows={5}
                placeholder="My Bio"
                size="large"
                value={userData.bio}
                className="outline-none  md:text-lg ring-0 bg-transparent disabled:cursor-not-allowed break-words"
                name="bio"
                onChange={handleInput}
                disabled={editData ? false : true}
              />
              <Clover
                className={`absolute right-5  ${editData && "text-green-700"} `}
              />
            </div>
            <div className="flex items-center justify-end flex-col md:flex-row w-full gap-y-5 md:px-2">
              {editData ? (
                <div className="flex justify-center items-center gap-5">
                  <Button
                    type="primary"
                    onClick={handleSubmit}
                    disabled={isLoading ? true : false}
                    className={editData && "bg-green-600"}
                  >
                    {isLoading ? (
                      <div className="border-gray-300 h-5 w-5 animate-spin rounded-full border-2 border-t-blue-600" />
                    ) : (
                      <>Save</>
                    )}
                  </Button>
                  <Button
                    type="text"
                    className={editData && "bg-red-700 text-white"}
                    onClick={() => setEditData(false)}
                  >
                    Close
                  </Button>
                </div>
              ) : (
                <Button type="primary" onClick={() => setEditData(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ProfileComponent;
