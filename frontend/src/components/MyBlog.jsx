import { lazy, useEffect, useState } from "react";
const Card = lazy(() => import("./Card"));
import fetcher from "../utils/fetcher";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
const MyBlog = () => {
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        await fetcher("/api/blog/me/blogs", { method: "get" }).then((res) => {
          setBlogs(res.myblog);
        });
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  const navigate = useNavigate();
  return (
    <div className=" h-full">
      <div className="bg-white rounded-2xl h-full overflow-scroll">
        <h1 className="text-lg sm:text-2xl w-40 mx-auto font-semibold mb-10 text-center">
          My Blogs
        </h1>
        <div className=" lg:grid flex flex-col grid-cols-2  justify-center items-center    lg:gap-5   px-4 ">
          {!blogs || !blogs[0] ? (
            <div className="my-20 text-center text-xl col-span-2 ">
              <p>No Blogs added. Post your first Blog now.</p>
              <Button onClick={() => navigate("/addblog")} className="mt-5">
                Add Blog
              </Button>
            </div>
          ) : (
            blogs.map((blog) => (
              <Card
                key={blog._id}
                blog={blog}
                author={false}
                setBlogs={setBlogs}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBlog;
