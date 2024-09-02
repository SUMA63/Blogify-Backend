import Blog from "../models/blog.js";
import User from "../models/user.js"; // Import User model
import mongoose from "mongoose"; // Import mongoose

export const getAllBlogs = async (req, res, next) => {
  let blogs;
  try {
    blogs = await Blog.find();
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Fetching blogs failed. Please try again." });
  }
  if (!blogs || blogs.length === 0) {
    return res.status(404).json({ message: "No Blogs Found" });
  }

  return res.status(200).json({ blogs });
};

export const addBlog = async (req, res, next) => {
  const { title, description, image, user } = req.body;

  let existingUser;
  try {
    existingUser = await User.findById(user); // Correctly using the User model
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Finding user failed. Please try again." });
  }

  if (!existingUser) {
    return res.status(404).json({ message: "Unable to find User By this Id" });
  }

  const blog = new Blog({
    title,
    description,
    image,
    user,
  });

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await blog.save({ session });
    existingUser.blogs.push(blog);
    await existingUser.save({ session });
    await session.commitTransaction();
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Creating blog failed. Please try again." });
  }

  return res.status(201).json({ blog });
};

export const updateBlog = async (req, res, next) => {
  const { title, description } = req.body;
  const blogId = req.params.id;
  let blog;
  try {
    blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        title,
        description,
      },
      { new: true } // Return the updated document
    );
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Updating blog failed. Please try again." });
  }

  if (!blog) {
    return res
      .status(404)
      .json({ message: "Unable to update the blog. Blog not found." });
  }

  return res.status(200).json({ blog });
};

export const getById = async (req, res, next) => {
  const id = req.params.id;
  let blog;
  try {
    blog = await Blog.findById(id);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Fetching blog failed. Please try again." });
  }
  if (!blog) {
    return res.status(404).json({ message: "No Blog Found" });
  }

  return res.status(200).json({ blog });
};

export const deleteBlog = async (req, res, next) => {
  const id = req.params.id;

  let blog;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    // Find and populate the blog
    blog = await Blog.findById(id).populate("user");

    if (!blog) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ message: "Unable to delete. Blog not found." });
    }

    // Delete the blog
    await blog.deleteOne({ session });

    // Remove the blog from the user's blog list
    await User.findOneAndUpdate(
      { _id: blog.user._id },
      { $pull: { blogs: blog._id } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ message: "Successfully Deleted" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Deleting blog failed. Please try again." });
  }
};

export const getByUserId = async (req, res, next) => {
    const userId = req.params.id;
    let userBlogs;
  
    try {
      userBlogs = await User.findById(userId).populate('blogs'); 
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Fetching user blogs failed. Please try again." });
    }
  
    if (!userBlogs) {
      return res.status(404).json({ message: "No blogs found for this user." });
    }
    
    return res.status(200).json({ blogs: userBlogs.blogs }); 
  };
  