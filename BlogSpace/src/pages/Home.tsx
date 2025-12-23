import React from 'react';
import { Link } from 'react-router-dom';
import { PenTool, Sparkles, Users, TrendingUp, BookOpen, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBlog } from '../contexts/BlogContext';
import BlogCard from '../components/Blog/BlogCard';

const Home: React.FC = () => {
  const { user } = useAuth();
  const { getPublishedBlogs, getUserBlogs } = useBlog();
  const publishedBlogs = getPublishedBlogs();
  const userBlogs = user ? getUserBlogs(user.id) : [];

  // Show different content based on authentication status
  if (user) {
    return (
      <div className="min-h-screen">
        {/* Welcome Back Section */}
        <section className="relative py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 text-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 mb-8 sm:mb-12">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-6 lg:mb-0">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">
                    Welcome back, {user.name}! 👋
                  </h1>
                  <p className="text-blue-100 text-base sm:text-lg">
                    Ready to share your next story with the world?
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link
                    to="/create"
                    className="bg-white text-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <PenTool className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Write New Post</span>
                  </Link>
                  <Link
                    to="/dashboard"
                    className="border-2 border-white text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>My Dashboard</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4">
                    <PenTool className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{userBlogs.length}</p>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Your Posts</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 dark:bg-green-900 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4">
                    <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {userBlogs.filter(b => b.status === 'published').length}
                    </p>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Published</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="bg-yellow-100 dark:bg-yellow-900 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4">
                    <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {userBlogs.filter(b => b.status === 'draft').length}
                    </p>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Drafts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Community Posts */}
        <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-12">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
                  Latest from the Community
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
                  Discover amazing stories from fellow writers
                </p>
              </div>
              <Link
                to="/dashboard"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold flex items-center space-x-2 text-sm sm:text-base"
              >
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {publishedBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                {publishedBlogs.slice(0, 6).map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16">
                <div className="bg-gray-100 dark:bg-gray-800 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PenTool className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">No community posts yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm sm:text-base">Be the first to share your story!</p>
                <Link
                  to="/create"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  Write Your First Post
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    );
  }

  // Guest/Non-authenticated view
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="relative">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
              Share Your
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block sm:inline"> Stories</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
              A beautiful platform for writers, thinkers, and storytellers. Create, publish, and share your ideas with a community that cares.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
              <Link
                to="/signup"
                className="w-full sm:w-auto bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Writing Today
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold border-2 border-gray-200 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-400 transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose BlogSpace?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to create, manage, and share your content
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center group">
              <div className="bg-blue-100 dark:bg-blue-900 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                <PenTool className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">Easy Writing</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Clean, distraction-free editor with auto-save and draft functionality
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-purple-100 dark:bg-purple-900 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                <Users className="h-7 w-7 sm:h-8 sm:w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">Community</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Connect with like-minded writers and build your audience
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-green-100 dark:bg-green-900 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                <TrendingUp className="h-7 w-7 sm:h-8 sm:w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">Analytics</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Track your performance and grow your readership
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-12">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
                Latest Stories
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
                Discover amazing content from our community
              </p>
            </div>
            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
          </div>

          {publishedBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {publishedBlogs.slice(0, 6).map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <div className="bg-gray-100 dark:bg-gray-800 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <PenTool className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">No posts yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm sm:text-base">Be the first to share your story!</p>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;