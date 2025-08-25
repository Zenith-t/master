import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Eye, Share2 } from 'lucide-react';
import { supabase } from '../contexts/SupabaseContext';

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image?: string;
  category: 'health' | 'tutors';
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  author: string;
  reading_time: number;
  views: number;
  created_at: string;
  updated_at: string;
}

export default function BlogDetail() {
  const navigate = useNavigate();
  const { category, slug } = useParams<{ category: 'health' | 'tutors'; slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    if (slug && category) {
      fetchBlog();
      fetchRelatedBlogs();
    }
  }, [slug, category]);

  const fetchBlog = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('category', category)
        .eq('is_published', true)
        .single();

      if (error) throw error;
      if (data) {
        setBlog(data);
        // Increment view count
        await supabase
          .from('blogs')
          .update({ views: data.views + 1 })
          .eq('id', data.id);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('category', category)
        .eq('is_published', true)
        .neq('slug', slug)
        .limit(3)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setRelatedBlogs(data);
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  const formatContent = (content: string) => {
    return content
      .split('\n')
      .map((paragraph, index) => {
        if (paragraph.trim() === '') return null;
        
        // Handle headings
        if (paragraph.startsWith('## ')) {
          return (
            <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              {paragraph.replace('## ', '')}
            </h2>
          );
        }
        
        if (paragraph.startsWith('### ')) {
          return (
            <h3 key={index} className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              {paragraph.replace('### ', '')}
            </h3>
          );
        }

        // Handle bold text
        const formattedText = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        return (
          <p 
            key={index} 
            className="text-gray-700 leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: formattedText }}
          />
        );
      })
      .filter(Boolean);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate(`/blogs/${category}`)}
                className="mr-4 p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-blue-600">HealthCare Plus</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Blog Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="mb-6">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
              {category === 'health' ? 'Health' : 'Education'}
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {blog.title}
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              {blog.excerpt}
            </p>
          </div>

          {blog.featured_image && (
            <img
              src={blog.featured_image}
              alt={blog.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}

          <div className="flex items-center justify-between text-sm text-gray-500 border-b border-gray-200 pb-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{new Date(blog.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{blog.reading_time} min read</span>
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                <span>{blog.views} views</span>
              </div>
            </div>
            <button className="flex items-center text-blue-600 hover:text-blue-800">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </button>
          </div>
        </div>

        {/* Blog Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            {formatContent(blog.content)}
          </div>
        </div>

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <div
                  key={relatedBlog.id}
                  className="cursor-pointer group"
                  onClick={() => navigate(`/blog/${category}/${relatedBlog.slug}`)}
                >
                  {relatedBlog.featured_image && (
                    <img
                      src={relatedBlog.featured_image}
                      alt={relatedBlog.title}
                      className="w-full h-32 object-cover rounded-lg mb-3 group-hover:opacity-90 transition-opacity"
                    />
                  )}
                  <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {relatedBlog.title}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {relatedBlog.excerpt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}