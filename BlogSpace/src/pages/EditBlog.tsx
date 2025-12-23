import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBlog } from '../contexts/BlogContext';
import BlogForm from '../components/Blog/BlogForm';

const EditBlog: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { getBlogById } = useBlog();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const blog = id ? getBlogById(id) : undefined;

  if (!blog) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check if user can edit this blog
  const canEdit = user.id === blog.authorId || user.role === 'admin';
  
  if (!canEdit) {
    return <Navigate to="/dashboard" replace />;
  }

  return <BlogForm blog={blog} isEditing />;
};

export default EditBlog;