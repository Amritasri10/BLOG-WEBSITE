import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>© {new Date().getFullYear()} Your Blog. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
