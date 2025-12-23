import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Blog, BlogContextType } from '../types';

const BlogContext = createContext<BlogContextType | undefined>(undefined);

// Mock blogs for demo purposes
const mockBlogs: Blog[] = [
  {
    id: '1',
    title: 'Getting Started with React and TypeScript',
    content: 'React and TypeScript make a powerful combination for building scalable web applications. In this comprehensive guide, we\'ll explore how to set up a React project with TypeScript, understand the benefits of type safety, and learn best practices for component development.\n\nTypeScript adds static type checking to JavaScript, which helps catch errors at compile time rather than runtime. This is particularly beneficial in large applications where maintaining code quality becomes challenging.\n\nWhen working with React components, TypeScript helps define props interfaces, state types, and event handlers with precision. This leads to better IDE support, improved refactoring capabilities, and more maintainable code.',
    excerpt: 'Learn how to combine React with TypeScript for better development experience and type safety.',
    authorId: '2',
    authorName: 'John Doe',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    status: 'published',
    readTime: 8
  },
  {
    id: '2',
    title: 'Modern CSS Techniques for 2024',
    content: 'CSS has evolved significantly over the past few years, introducing powerful new features that make styling more intuitive and efficient. From CSS Grid and Flexbox to custom properties and container queries, modern CSS offers tools that were unimaginable just a decade ago.\n\nIn this article, we\'ll explore the latest CSS features that every developer should know. We\'ll cover practical examples and use cases that you can implement in your projects today.\n\nCSS Grid has revolutionized layout design, providing a two-dimensional layout system that makes complex layouts simple. Combined with Flexbox for one-dimensional layouts, these tools give developers unprecedented control over page structure.',
    excerpt: 'Discover the latest CSS features and techniques that will improve your web development workflow.',
    authorId: '1',
    authorName: 'Admin User',
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
    status: 'published',
    readTime: 6
  },
  {
    id: '3',
    title: 'Building Scalable Node.js Applications',
    content: 'Node.js has become the go-to runtime for building server-side applications, but as your application grows, maintaining scalability becomes crucial. This guide covers architectural patterns, performance optimization techniques, and best practices for building robust Node.js applications.\n\nWe\'ll explore topics like microservices architecture, database optimization, caching strategies, and monitoring. These concepts are essential for applications that need to handle high traffic and maintain reliability.',
    excerpt: 'Learn architectural patterns and best practices for building scalable Node.js applications.',
    authorId: '2',
    authorName: 'John Doe',
    createdAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-05T09:15:00Z',
    status: 'draft',
    readTime: 12
  }
];

export const BlogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    // Load blogs from localStorage or use mock data
    const storedBlogs = localStorage.getItem('blogs');
    if (storedBlogs) {
      setBlogs(JSON.parse(storedBlogs));
    } else {
      setBlogs(mockBlogs);
      localStorage.setItem('blogs', JSON.stringify(mockBlogs));
    }
  }, []);

  const saveBlogsToStorage = (updatedBlogs: Blog[]) => {
    localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
    setBlogs(updatedBlogs);
  };

  const createBlog = (blogData: Omit<Blog, 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'authorName'>) => {
    const userData = localStorage.getItem('userData');
    if (!userData) return;
    
    const user = JSON.parse(userData);
    const newBlog: Blog = {
      ...blogData,
      id: Date.now().toString(),
      authorId: user.id,
      authorName: user.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedBlogs = [...blogs, newBlog];
    saveBlogsToStorage(updatedBlogs);
  };

  const updateBlog = (id: string, blogData: Partial<Blog>) => {
    const updatedBlogs = blogs.map(blog => 
      blog.id === id 
        ? { ...blog, ...blogData, updatedAt: new Date().toISOString() }
        : blog
    );
    saveBlogsToStorage(updatedBlogs);
  };

  const deleteBlog = (id: string) => {
    const updatedBlogs = blogs.filter(blog => blog.id !== id);
    saveBlogsToStorage(updatedBlogs);
  };

  const getBlogById = (id: string) => {
    return blogs.find(blog => blog.id === id);
  };

  const getUserBlogs = (userId: string) => {
    return blogs.filter(blog => blog.authorId === userId);
  };

  const getPublishedBlogs = () => {
    return blogs.filter(blog => blog.status === 'published');
  };

  return (
    <BlogContext.Provider value={{
      blogs,
      createBlog,
      updateBlog,
      deleteBlog,
      getBlogById,
      getUserBlogs,
      getPublishedBlogs
    }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};