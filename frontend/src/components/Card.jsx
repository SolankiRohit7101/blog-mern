import { useSelector } from "react-redux";
import { HeartIcon, Pencil, Trash2 } from "lucide-react";
import fetcher from "../utils/fetcher";
import { lazy, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const Avatar = lazy(() => import("./Avatar"));
const CardComponent = (prop) => {
  const { user } = useSelector((state) => state.user);
  const { blog, author, setBlogs, setLikeChange } = prop;
  const { title, description, likes, thumbnailUrl, authorDetails } = blog;
  const [userLiked, setUserLiked] = useState(false);
  const [numOfLike, setNumOfLike] = useState(likes.numOfLike);
  const navigate = useNavigate();
  const handleLike = async () => {
    if (user.email !== "") {
      setLoading(true);
      await fetcher(`/api/blog/like/${blog._id}`, { method: "put" }).then(
        (res) => {
          setUserLiked(!userLiked);
          setNumOfLike(res.likes.numOfLike);
          setLoading(false);
          if (setLikeChange) setLikeChange(true);
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
  const [isLoading, setLoading] = useState(false);
  const handleDelete = async () => {
    await fetcher(`/api/blog/delete/${blog._id} `, { method: "delete" }).then(
      (res) => {
        setBlogs(res.myBlog);
        console.log(res.myBlog);
      }
    );
  };

  useEffect(() => {
    likes.likedBy.map((like) => {
      if (like.userId === user._id) {
        setUserLiked(true);
      }
    });
  }, []);
  return (
    <div className=" min-w-full border  mq400:w-2/5 px-2   md:px-10 my-4 lg:my-0 overflow-hidden  hover:shadow-lg rounded-md ">
      <div onClick={() => navigate(`/blog/${blog?._id}`)} className="">
        {author && <Avatar author={authorDetails[0]} />}
        <div className="flex w-full justify-between items-center  text-wrap gap-5 py-2 ">
          <div className="py-2  px-2  min-w-[100px] overflow-hidden ">
            <p className=" md:text-xl pb-2 font-semibold line-clamp-1 text-black/70">
              {title}
            </p>
            <p className="text-xs line-clamp-3 ">{description}</p>
          </div>
          <div className=" hidden mq400:block w-24  h-24 rounded ">
            <div className="w-24 h-24 overflow-hidden cursor-pointer">
              <img
                src={thumbnailUrl}
                alt="thumbnail"
                className=" w-full h-full object-cover "
              />
            </div>
          </div>
        </div>
        <div className="!border-b border w-full min-h-px" />
      </div>
      <div className=" flex justify-start items-center  my-2 gap-3">
        <HeartIcon
          fill={userLiked ? "red" : "rgb(133 114 114) "}
          stroke="none"
          className={isLoading ? "cursor-not-allowed" : "cursor-pointer"}
          onClick={handleLike}
        />
        <p
          className={`
            ${userLiked ? "text-red-700" : " text-[rgb(133 114 114)]"} 
            `}
        >
          {numOfLike}
          <span className="pl-1">Liked</span>
        </p>
        {isLoading && (
          <div className="border-gray-300 h-5 w-5 animate-spin rounded-full border-2 border-t-blue-600" />
        )}
        {!author && (
          <div className="w-full mx-auto flex justify-end items-center gap-4 ">
            <button
              className="
                  rounded hover:shadow-md  py-2 px-5 text-green-600 hover:text-white hover:bg-green-600   border "
            >
              <Pencil
                className="h-4 w-4"
                onClick={() => navigate(`edit/${blog._id}`, { state: blog })}
              />
            </button>
            <button className="-red-600 border rounded hover:shadow-md text-red-700 py-2 px-5 hover:bg-red-600 hover:text-white transition-all">
              <Trash2 className="h-4 w-4" onClick={handleDelete} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardComponent;
