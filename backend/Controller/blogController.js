import blogModel from "../Model/blogModel.js";
import userModel from "../Model/userModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { Types } from "mongoose";
import { BlogSchema } from "../utils/ValidbotSchema.js";
import { ZodError } from "zod";

export const addBlog = async (req, res, next) => {
  try {
    const validateBlog = BlogSchema.parse(req.body);
    const user = req.user;
    let { title, description } = validateBlog;
    let { thumbnailUrl } = req.body;
    if (!thumbnailUrl || thumbnailUrl.length < 1) {
      thumbnailUrl =
        "https://res.cloudinary.com/dyxijouqy/image/upload/f_auto,q_auto/v1/blog_profile/dfanyr2nh3h4pwbkecmp";
    }
    const newBlog = await blogModel.create({
      title,
      description,
      author: user,
      thumbnailUrl,
    });
    await newBlog.save();
    const userBlog = await userModel
      .findByIdAndUpdate(
        { _id: user },
        {
          $push: {
            post: newBlog._id,
          },
        },
        {
          new: true,
        }
      )
      .select("-password");
    await userBlog.save();
    return res
      .json({
        success: true,
        messge: "Blog Added Successfully",
        userBlog,
        test: newBlog,
      })
      .status(200);
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new ErrorHandler(400, error.errors[0].message));
    }
    next(error);
  }
};
export const editBlog = async (req, res, next) => {
  try {
    const validateBlog = BlogSchema.parse(req.body);
    const { blogId } = req.params;
    let { title, description, thumbnailUrl } = validateBlog;
    const editblog = await blogModel.findByIdAndUpdate(
      blogId,
      { title, description, thumbnailUrl },
      { new: true }
    );

    if (!editblog) return next(new ErrorHandler(404, "Blog Not Found"));
    return res.json({
      success: true,
      message: "blog edited successfully",
      editBlog,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new ErrorHandler(400, error.errors[0].message));
    }
    next(error);
  }
};

export const deleteBlog = async (req, res, next) => {
  const { blogId } = req.params;
  const userId = req.user;
  let valid = false;
  async function deletingPost() {
    valid = true;
    const del = await blogModel.deleteOne({ _id: blogId });
    if (del.deletedCount === 0) {
      return next(new ErrorHandler(404, "Blog Not Found"));
    }
    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        $pull: { post: blogId },
      },
      { new: true }
    );
    const myBlog = await blogModel.find({ author: userId });
    return res.json({ success: true, message: "Deleted successfully", myBlog });
  }
  try {
    const isAuthor = await userModel.findById(userId).select("-password");
    if (isAuthor.post.includes(blogId.toString())) return deletingPost();
    if (!valid) {
      return res
        .status(403)
        .json({ success: false, message: "blog is not posted by you" });
    }
  } catch (error) {
    return next(error);
  }
};
export const getBlogById = async (req, res, next) => {
  let { blogid } = req.params;
  const Blog = await blogModel.aggregate([
    {
      $match: { _id: new Types.ObjectId(blogid) },
    },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "authorDetails",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "likes.likedBy.userId",
        foreignField: "_id",
        as: "likedByUserDetails",
      },
    },
    {
      $addFields: {
        authorDetails: { $arrayElemAt: ["$authorDetails", 0] },
        "likes.userLikeDetails": {
          $map: {
            input: "$likedByUserDetails",
            as: "user",
            in: {
              _id: "$$user._id",
              name: "$$user.name",
              email: "$$user.email",
              profile_image: "$$user.profile_image",
              bio: "$$user.bio",
            },
          },
        },
      },
    },
    {
      $project: {
        title: 1,
        thumbnailUrl: 1,
        description: 1,
        likes: {
          numOfLike: 1,
          userLikeDetails: 1,
        },
        authorDetails: {
          _id: 1,
          name: 1,
          email: 1,
          profile_image: 1,
          bio: 1,
        },
      },
    },
  ]);

  if (!Blog) return next(new ErrorHandler(401, "Invalid Blog Id"));
  res.status(200).json({
    success: true,
    message: "Successfully Fetched The Blog Data.",
    Blog: Blog[0],
  });
};

export const getAllBlogs = async (req, res, next) => {
  try {
    const allBlogs = await blogModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      {
        $project: {
          title: 1,
          _id: 1,
          description: 1,
          likes: 1,
          thumbnailUrl: 1,
          "authorDetails.name": 1,
          "authorDetails.email": 1,
          "authorDetails.profile_image": 1,
        },
      },
    ]);
    if (!allBlogs || !allBlogs[0])
      return next(
        new ErrorHandler(
          404,
          "Resource Not Found or No Resourse has been added"
        )
      );
    return res.json({
      success: true,
      message: "fetcher successfully",
      allBlogs,
    });
  } catch (error) {
    next(error);
  }
};
export const likesFunctionalityUsingPipeline = async (req, res, next) => {
  let { blogId } = req.params;
  const userId = req.user;
  let userObjectId = new Types.ObjectId(userId);
  blogId = new Types.ObjectId(blogId);

  try {
    let pipeline = [
      { $match: { _id: blogId } },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          author: 1,
          createdAt: 1,
          updatedAt: 1,
          likes: 1,
          userAlreadyLiked: {
            $in: [userObjectId, "$likes.likedBy.userId"],
          },
        },
      },
      {
        $addFields: {
          likes: {
            likedBy: {
              $cond: {
                if: { $eq: ["$userAlreadyLiked", true] },
                then: {
                  $filter: {
                    input: "$likes.likedBy",
                    cond: { $ne: ["$$this.userId", userObjectId] },
                  },
                },
                else: {
                  $concatArrays: ["$likes.likedBy", [{ userId: userObjectId }]],
                },
              },
            },
            numOfLike: {
              $cond: {
                if: { $eq: ["$userAlreadyLiked", true] },
                then: { $subtract: ["$likes.numOfLike", 1] },
                else: { $add: ["$likes.numOfLike", 1] },
              },
            },
          },
        },
      },
      {
        $merge: {
          into: "blogs",
          whenMatched: "merge",
          whenNotMatched: "insert",
        },
      },
    ];
    const Blog = await blogModel.aggregate(pipeline);
    /*  
     [
      { $match: { _id: blogId } },
      {
        $project: {
          _id: 1,
        title: 1,
        description: 1,
        author: 1,
        createdAt: 1,
        updatedAt: 1,
        likes: 1,
        userAlreadyLiked: {
          $in: [userId, "$likes.likedBy.userId"],
        },
      },
    },

    {
      $addFields: {
        likes: {
          likedBy: {
            $cond: {
              if: { $eq: ["$userAlreadyLiked", true] },
              then: {
                //Removes the user id from list if user already liked the blog
                $filter: {
                  input: "$likes.likedBy",
                  cond: {
                    $ne: ["$$this.userId", userId],
                  },
                },
              },
              else: {
                $concatArrays: ["$likes.likedBy", [{ userId: userId }]],
              },
            },
          },
          numOfLikes: {
            $cond: { $eq: ["$userAlreadyLiked", true] },
            then: { $subtract: ["likes.numOfLikes", 1] },
            else: {
              $add: ["likes.numOfLikes", 1],
            },
          },
        },
      },
    },
    {
      $merge: {
        into: "blogs",
        whenMatched: "merge",
        whenNotMatched: "insert",
      },
    },
  ] */
    const newBlog = await blogModel.findById(blogId);

    if (!Blog) return next(new ErrorHandler(404, "Blog Not found"));
    return res.json(newBlog);
  } catch (error) {
    next(error);
  }
};

export const myBlogs = async (req, res, next) => {
  let userId = req.user;
  userId = new Types.ObjectId(userId);
  const myblog = await blogModel.find({ author: userId });
  if (myblog[0]) {
    return res.json({
      success: true,
      message: "successfully fetch data",
      myblog,
    });
  } else {
    return res.json({
      success: true,
      message: "no blog added",
    });
  }
};

export const BlogLikedByme = async (req, res, next) => {
  let userId = req.user;
  try {
    userId = new Types.ObjectId(userId);
    const blogLiked = await blogModel.aggregate([
      {
        $match: {
          "likes.likedBy.userId": userId,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      {
        $project: {
          title: 1,
          _id: 1,
          description: 1,
          likes: 1,
          thumbnailUrl: 1,
          "authorDetails.name": 1,
          "authorDetails.email": 1,
          "authorDetails.profile_image": 1,
        },
      },
    ]);
    if (!blogLiked) {
      return next(new ErrorHandler(404, `No Blog Liked By you`));
    }
    return res.status(200).json({
      success: true,
      message: "found something",
      blogLiked,
    });
  } catch (error) {
    next(error);
  }
};
