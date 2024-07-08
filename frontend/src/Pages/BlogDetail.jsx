import { useEffect, useState } from "react";
import Avatar from "../components/Avatar";
import { useParams } from "react-router-dom";
import fetcher from "../utils/fetcher";
import { HeartIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
const BlogDetail = () => {
  const { blogid } = useParams();
  const [userLiked, setUserLiked] = useState(false);
  const [blog, setBlog] = useState({});
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const handleLike = async () => {
    if (user.email !== "") {
      setLoading(true);
      await fetcher(`/api/blog/like/${blog._id}`, { method: "put" }).then(
        (data) => {
          setUserLiked(!userLiked);
          console.log(data);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
      toast.error("Please Login.  ", {
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

  useEffect(() => {
    (async () => {
      try {
        await fetcher(`/api/blog/${blogid}`, { method: "get" }).then((data) => {
          setBlog(data.Blog);
          data.Blog.likes.userLikeDetails.map((like) => {
            if (like._id === user._id) {
              setUserLiked(true);
            }
          });
        });
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  return (
    <>
      <div className=" w-full md:w-3/5 mx-auto md:py-20 py-10   px-10 md:px-20 flex flex-col  gap-5  bg-white   ">
        <div className="  px-5  md:px-14  border-b ">
          <Avatar author={blog.authorDetails} border={false} />
        </div>
        <div className=" flex justify-between items-start   gap-5  ">
          <h1 className="text-xl text-black/80 md:text-3xl">{blog?.title}</h1>
          <div className=" flex justify-between items-center  my-2 gap-3">
            {loading && (
              <div className="border-gray-300 h-5 w-5 animate-spin rounded-full border-2 border-t-blue-600" />
            )}
            <button disabled={loading}>
              <HeartIcon
                fill={userLiked ? "red" : "rgb(133 114 114)"}
                stroke="none"
                className={`
                ${loading ? "opacity-50" : ""}
                `}
                onClick={handleLike}
              />
            </button>
            <p
              className={`
          ${userLiked ? "text-red-700" : " text-[rgb(133 114 114)]       "} 
          cursor-pointer
          `}
            >
              {blog?.likes?.numOfLike}
              <span>Liked</span>
            </p>
          </div>
        </div>
        <img
          src={blog?.thumbnailUrl}
          alt="thumbnail"
          className="w-full  max-h-[500px] object-top  rounded-md  "
          loading="lazy"
        />
        <div className="mx-2  px-2  py-3  md:py-7  ">
          <p className="  text-pretty break-words  ">{blog.description}</p>
        </div>
      </div>
      <div className="w-full  border-t-8 py-4 border-zinc-200 border break-words flex justify-center items-center gap-2 md:gap-8 text-xl md:text-4xl">
        &copy;Copyright by
        <h1>{blog?.authorDetails?.email}</h1>
      </div>
    </>
  );
};
export default BlogDetail;
