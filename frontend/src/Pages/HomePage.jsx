import fetcher from "../utils/fetcher";
import { lazy, useEffect, useState } from "react";
const Card = lazy(() => import("../components/Card"));
const HomePage = () => {
  const [Blogs, setBlogs] = useState();
  useEffect(() => {
    (async () => {
      try {
        await fetcher("/api/blog/", { method: "get" }).then((res) => {
          setBlogs(res.allBlogs);
        });
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  return (
    <section className="flex justify-center items-center ">
      <div className="w-full h-full py-24  md:py-10 mx-auto px-5">
        <div className="lg:grid  grid-cols-2   md:gap-10    w-full ">
          {Blogs ? (
            Blogs.map((blog) => (
              <Card key={blog._id} blog={blog} author={true} />
            ))
          ) : (
            <p className="text-xl col-span-2 text-center w-full">
              No Blogs added be the first one to add a blog
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
export default HomePage;
