import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import "./home.css";

const images = [
  "/images/1.jpg",
  "/images/2.jpg",
  "/images/3.jpg",
];

const HomePage = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:8003/api/v1/blog/all-blog");
        setBlogs(response.data.blogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();

    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* ✅ Hero Section */}
      <div className="carousel-container">
        <img src={images[currentImage]} alt="Carousel" className="carousel-image" />
        <div className="carousel-content">
          <h1>Publish your passions, your way</h1>
          <p>Create a unique and beautiful blog easily.</p>
          <button className="btn btn-primary" onClick={() => navigate("/register")}>
            Create your blog
          </button>
        </div>
      </div>

      {/* ✅ Latest Blogs Section */}
      <div className="container my-5">
        <h2 className="text-center mb-5 blog-heading">Latest Blogs</h2>
        
        {blogs.length > 0 ? (
          <div className="card-group">
            {blogs.map((blog) => (
              <div key={blog._id} className="card">
                <img
                  src={blog.image || "/images/default.jpg"}
                  alt={blog.title}
                  className="card-img-top blog-image"
                />
                <div className="card-body">
                  <h3 className="card-title">{blog.title}</h3>
                  <p className="card-text">{blog.description.substring(0, 100)}...</p>
                  <p className="card-text">
                    <small className="text-muted">
                      Published: {new Date(blog.createdAt).toDateString()}
                    </small>
                  </p>
                  <Link to={`/register`} className="btn btn-primary">Read More</Link>
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
