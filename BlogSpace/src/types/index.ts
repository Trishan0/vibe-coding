export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  status: 'published' | 'draft';
  readTime: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface BlogContextType {
  blogs: Blog[];
  createBlog: (blog: Omit<Blog, 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'authorName'>) => void;
  updateBlog: (id: string, blog: Partial<Blog>) => void;
  deleteBlog: (id: string) => void;
  getBlogById: (id: string) => Blog | undefined;
  getUserBlogs: (userId: string) => Blog[];
  getPublishedBlogs: () => Blog[];
}