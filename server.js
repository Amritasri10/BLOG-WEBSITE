const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const colors = require("colors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

//router
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");

//env config
dotenv.config();

//mongodb connection
connectDB();
//rest object
const app = express();

//middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

//routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/blog', blogRoutes);
//PORT
const PORT = process.env.PORT || 8003;
//listen
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
})