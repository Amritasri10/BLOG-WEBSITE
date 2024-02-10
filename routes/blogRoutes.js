const express = require("express");
const { 
    getAllBlogsController,
    createBlogController, 
    updateBlogController, 
    getSingleBlogByIdController,
    deleteBlogController, 
    userBlogController} = require("../controllers/blogController");

// router object
const router = express.Router();

//routes
//GET ALL BLOGS || GET
router.get('/all-blog',getAllBlogsController);

//CREATE BLOG || POST
router.post('/create-blog',createBlogController);

//UPDATE BLOG || PUT
router.put('/update-blog/:id',updateBlogController);

//GET SINGLE BLOG || GET
router.get('/get-blog/:id',getSingleBlogByIdController);

//DELETE BLOG || DELETE
router.delete('/delete-blog/:id',deleteBlogController);

//USER BLOGS || GET
router.get('/user-blog/:id',userBlogController);

module.exports = router;