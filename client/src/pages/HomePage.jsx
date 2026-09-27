import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import useCarousel from "../hooks/useCarousel";
import useBlog from "../hooks/useBlog";
import "./home.css";

const HomePage = () => {
  const navigate = useNavigate();
  const { currentImage } = useCarousel();
  const { blogs, loading, getAllBlogs } = useBlog();

  useEffect(() => {
    getAllBlogs();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Hero / Carousel Section */}
      <div className="carousel-container">
        <img src={currentImage} alt="Carousel" className="carousel-image" />
        <div className="carousel-content">
          <h1>Publish your passions, your way</h1>
          <p>Create a unique and beautiful blog easily.</p>
          <button className="btn btn-primary" onClick={() => navigate("/register")}>
            Create your blog
          </button>
        </div>
      </div>

      {/* Latest Blogs Section */}
      <div className="container my-5">
        <h2 className="text-center mb-5 blog-heading">Latest Blogs</h2>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : blogs && blogs.length > 0 ? (
          <div className="card-group">
            {blogs.map((blog) => (
              <div key={blog._id} className="card">
                <img
                  src={blog.image || "/images/1.jpg"}
                  alt={blog.title}
                  className="card-img-top blog-image"
                />
                <div className="card-body">
                  <h3 className="card-title">{blog.title}</h3>
                  <p className="card-text">{blog.description?.substring(0, 100)}...</p>
                  <p className="card-text">
                    <small className="text-muted">
                      Published: {new Date(blog.createdAt).toDateString()}
                    </small>
                  </p>
                  <Link to="/register" className="btn btn-primary">
                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted">No blogs available.</p>
        )}
      </div>
    </>
  );
};

export default HomePage;
