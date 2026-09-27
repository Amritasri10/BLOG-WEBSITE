import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useBlog from "../hooks/useBlog";

export default function BlogCard({ title, description, image, username, time, id, isUser }) {
  const navigate = useNavigate();
  const { handleDeleteBlog } = useBlog();

  const handleEdit = () => navigate(`/blog-details/${id}`);

  const handleDelete = () => handleDeleteBlog(id);

  return (
    <Card
      sx={{
        width: "40%",
        margin: "auto",
        mt: 2,
        padding: 2,
        boxShadow: "5px 5px 10px #ccc",
        "&:hover": { boxShadow: "10px 10px 20px #ccc" },
      }}
    >
      {isUser && (
        <Box display="flex">
          <IconButton onClick={handleEdit} sx={{ marginLeft: "auto" }} aria-label="edit">
            <ModeEditIcon color="info" />
          </IconButton>
          <IconButton onClick={handleDelete} aria-label="delete">
            <DeleteIcon color="error" />
          </IconButton>
        </Box>
      )}
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label={username}>
            {username?.[0]?.toUpperCase()}
          </Avatar>
        }
        title={username}
        subheader={time ? new Date(time).toDateString() : ""}
      />
      <CardMedia component="img" height="194" image={image} alt={title} />
      <CardContent>
        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}
