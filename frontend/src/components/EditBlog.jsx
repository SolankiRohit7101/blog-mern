import { EditOutlined } from "@ant-design/icons";
import { PlusIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { setLoading, setError } from "../Redux/user/userSlice";
import fetcher from "../utils/fetcher";

const EditBlog = () => {
  const { blogId } = useParams();
  const { state } = useLocation();
  const [thumbnailLocalUrl, setThumbnailLocalUrl] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.blog.blog);
  const navigate = useNavigate();
  const [blog, setBlogData] = useState({ ...state });

  const thumbnailRef = useRef();
  const handleInput = (e) => {
    const { name, value } = e.target;
    setBlogData({ ...blog, [name]: value });
  };
  const handleThumbnail = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailImage(file);
      const newUrlImage = URL.createObjectURL(file);
      setThumbnailLocalUrl(newUrlImage);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading());
    try {
      let file = thumbnailImage;
      let updatedBlogData = { ...blog };
      const formdata = new FormData();
      formdata.append("file", file);
      formdata.append("upload_preset", "blog_profile");
      if (file) {
        await fetch(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUD_NAME
          }/auto/upload`,
          {
            method: "POST",
            body: formdata,
          }
        )
          .then((res) => res.json())
          .then((res) => {
            updatedBlogData.thumbnailUrl = res.url;
          });
      }
      await fetcher(`/api/blog/edit/${blogId}`, {
        method: "put",
        data: { ...updatedBlogData },
      }).then((data) => {
        toast.success(data.message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      });
      dispatch(setLoading());
      navigate("/profile/myblogs");
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
    <section className=" py-5  bg-white">
      <div className="  mx-auto w-full md:min-h-[90vh]">
        <div className="flex justify-center  items-center mx-auto text-blue-500 font-semibold py-10">
          <h1 className=" text-lg md:text-2xl  text-center w-2/5   ">
            <EditOutlined />
            Edit Blog
          </h1>
        </div>
        <div className=" max-w-5xl mx-auto  px-4   flex justify-center items-start   flex-col gap-5 overflow-auto  text-wrap ">
          <input
            type="text"
            className="break-words outline-none rounded-lg w-full md:w-3/5  mx-auto  text-xl text-center  shadow tracking-wide bg-transparent h-10 font-mono text-wrap "
            placeholder="TITLE"
            onChange={handleInput}
            value={blog.title}
            name="title"
          />
          <div className="w-full h-full flex justify-center items-center gap-5 flex-col md:flex-row  ">
            <textarea
              type="text"
              className=" border  p-2 rounded overflow-y-scroll outline-none rounded-base    w-full mx-auto   text-lg overflow-scroll   bg-transparent   font-mono  "
              placeholder="description"
              rows={10}
              onChange={handleInput}
              name="description"
              value={blog.description}
            />
            <div
              className="w-full  relative overflow-hidden hover:bg-black/20 hover:z-40  -order-1 md:order-2  "
              onClick={() => thumbnailRef.current.click()}
            >
              <img
                src={thumbnailLocalUrl || blog.thumbnailUrl}
                alt="thumbnail"
                className=" w-full h-[315px] overflow-hidden  object-top rounded   opacity-100 "
              />
              <PlusIcon
                title="thumnail"
                className=" rounded-full bg-blue-700 text-white  transition-shadow absolute  opacity-80  top-1/2 left-1/2  hover:animate-pulse"
                onClick={handleThumbnail}
              />
              <input
                type="file"
                hidden
                ref={thumbnailRef}
                onChange={handleThumbnail}
              />
            </div>
          </div>
          <div className="flex justify-center items-center w-full gap-10 ">
            <button
              className={`w-full ${
                !isLoading && "cursor-not-allowed "
              }  bg-green-600 text-white rounded hover:shadow-md  py-2  hover:opacity-90 `}
              type="primary"
              disabled={!isLoading ? true : false}
              onClick={handleSubmit}
            >
              Save
            </button>
            <button
              className="w-full  hover:ring-0 transition-all  py-2 text-black/70 bg-white/70 shadow-md border hover:text-white hover:bg-red-700 capitalize   "
              onClick={() => navigate("/profile/myblogs")}
            >
              close
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditBlog;
