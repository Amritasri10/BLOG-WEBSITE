const mongoose = require("mongoose");
const blogModel = require("../models/blogModel");
const userModel = require("../models/userModel");
//GET ALL BLOGS || GET
exports.getAllBlogsController = async(req,res)=>{
    try{
        const blogs = await blogModel.find({}).populate("user");
        if (!blogs){
            return res.status(200).json({
                    message:"No blog found",
                    success:false
            })    
        }
        return res.status(200).json({
            success:true,
            count:blogs.length,
            message:"All blogs fetched successfully",
            blogs
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            message:error.message,
            success:false
        })
    }
};

//CREATE BLOG || POST
exports.createBlogController = async(req,res)=>{
    try{
        const {title, description, image, user} = req.body
        //Validation
        if(!title || !description || !image || !user){
            return res.status(400).json({
                message:"All fields are required",
                success:false
            })
        }
        const existingUser = await userModel.findById(user)
        //validation
        if(!existingUser){
            return res.status(404).send({
                message:"User not found",
                success:false
            })
        }
        //save blog
        const newBlog = new blogModel({title,description,image, user});
        const session = await mongoose.startSession();
        await newBlog.save({session});
        existingUser.blogs.push(newBlog);
        await existingUser.save({session});
        await newBlog.save();
        return res.status(201).json({
            success:true,
            message:"Blog created successfully",
            newBlog,
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message:error.message,
            success:false
        });
    }
}; 

//UPDATE BLOG || PUT
exports.updateBlogController = async(req,res)=>{
    try{
        const {id} = req.params
        const {title,description,image} = req.body
        const blog = await blogModel.findByIdAndUpdate(id,{...req.body},{new:true})
        return res.status(200).json({
            success:true,
            message:"Blog updated successfully",
            blog,
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            message:error.message,
            success:false
        })
    }
}

//GET SINGLE BLOG || GET
exports.getSingleBlogByIdController = async(req,res)=>{
    try{
        const {id} = req.params
        const blog = await blogModel.findById(id)
        if(!blog){
            return res.status(404).json({
                message:"Blog not found",
                success:false
            })
        }
        return res.status(200).json({
            success:true,
            message:"Blog fetched successfully",
            blog,
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            message:error.message,
            success:false
        })
    }
}

//DELETE BLOG || DELETE
//DELETE BLOG || DELETE
exports.deleteBlogController = async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await blogModel.findByIdAndDelete(blogId);
        
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        if (blog.user) {
            await userModel.findByIdAndUpdate(blog.user, {
                $pull: { blogs: blogId }
            });
        }

        return res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
            blog
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};
//USER BLOGS || GET
exports.userBlogController = async (req, res) => {
    try {
        const userBlog = await userModel.findById(req.params.id).populate("blogs");
        if (!userBlog) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }
        return res.status(200).json({
            success: true,
            message: "User blogs fetched successfully",
            userBlog
        })
    }catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
}
