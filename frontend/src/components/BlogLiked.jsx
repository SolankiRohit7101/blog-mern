import { useEffect, useState } from "react";
import Card from "./Card";
import fetcher from "../utils/fetcher";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
const BlogLiked = () => {
  const [blogs, setBlogs] = useState([]);
  const [likeChange, setLikeChange] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        await fetcher("/api/blog/me/blogliked", { method: "get" }).then(
          (res) => {
            setBlogs(res.blogLiked);
          }
        );
      } catch (error) {
        console.log(error);
      }
    })();
  }, [likeChange]);
  const navigate = useNavigate();
  return (
    <div className=" h-full">
      <div className="bg-white rounded-2xl h-full overflow-scroll">
        <h1 className="text-lg sm:text-2xl w-40 mx-auto font-semibold mb-10 text-center">
          Liked Blogs
        </h1>
        <div className=" lg:grid flex flex-col grid-cols-2  justify-center items-center place-items-center w-full   lg:gap-5   px-4 ">
          {!blogs || !blogs[0] ? (
            <div className="my-20 text-center  col-span-2 w-full text-xl ">
              <p>No Blogs Liked.</p>
              <Button onClick={() => navigate("/")} className="mt-5">
                Explore
              </Button>
            </div>
          ) : (
            blogs.map((blog) => (
              <Card
                key={blog._id}
                blog={blog}
                author={true}
                setLikeChange={setLikeChange}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogLiked;
