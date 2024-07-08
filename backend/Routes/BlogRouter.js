import express from "express";

import {
  addBlog,
  deleteBlog,
  editBlog,
  getAllBlogs,
  getBlogById,
  likesFunctionalityUsingPipeline,
  BlogLikedByme,
  myBlogs,
} from "../Controller/blogController.js";
import auth from "../middleware/Auth.js";
const blogRouter = express.Router();
blogRouter.post("/add", auth, addBlog);
blogRouter.put("/edit/:blogId", auth, editBlog);
blogRouter.delete("/delete/:blogId", auth, deleteBlog);
blogRouter.get("/", getAllBlogs);
blogRouter.get("/:blogid", getBlogById);
blogRouter.put("/like/:blogId", auth, likesFunctionalityUsingPipeline);
blogRouter.get("/me/blogs", auth, myBlogs);
blogRouter.get("/me/BlogLiked", auth, BlogLikedByme);
export default blogRouter;
