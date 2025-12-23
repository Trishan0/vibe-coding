import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BlogForm from '../components/Blog/BlogForm';

const CreateBlog: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <BlogForm />;
};

export default CreateBlog;