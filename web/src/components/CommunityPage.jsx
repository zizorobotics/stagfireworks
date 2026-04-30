import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  
  const [newPost, setNewPost] = useState({ author: '', title: '', content: '' });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      setPosts(data);
    } else {
      console.warn("Could not fetch community posts. Ensure table exists.", error);
    }
    setLoading(false);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.author || !newPost.title || !newPost.content) return;

    setIsPosting(true);
    const { data, error } = await supabase
      .from('community_posts')
      .insert([{ 
        author: newPost.author, 
        title: newPost.title, 
        content: newPost.content,
        likes: 0
      }])
      .select();

    if (!error && data) {
      setPosts([data[0], ...posts]);
      setNewPost({ author: '', title: '', content: '' });
    } else {
      alert("Failed to submit post. The database table might not be set up yet.");
    }
    setIsPosting(false);
  };

  const handleLike = async (id, currentLikes) => {
    const { error } = await supabase
      .from('community_posts')
      .update({ likes: currentLikes + 1 })
      .eq('id', id);
      
    if (!error) {
      setPosts(posts.map(p => p.id === id ? { ...p, likes: currentLikes + 1 } : p));
    }
  };

  return (
    <div style={{ padding: '6rem 2rem 4rem', maxWidth: '800px', margin: '0 auto', color: 'var(--text-main)', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center', background: 'linear-gradient(90deg, var(--accent-magenta), var(--accent-cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Pyro Community Blog
      </h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem' }}>
        Join the discussion, share your display setups, and recommend your favorite fireworks!
      </p>

      {/* Post Creation Form */}
      <div style={{ background: 'var(--panel-bg)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--accent-cyan)' }}>Start a Discussion</h3>
        <form onSubmit={handlePostSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Your Name / Alias" 
              value={newPost.author}
              onChange={e => setNewPost({...newPost, author: e.target.value})}
              required
              style={{ flex: 1, padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff' }}
            />
            <input 
              type="text" 
              placeholder="Post Title" 
              value={newPost.title}
              onChange={e => setNewPost({...newPost, title: e.target.value})}
              required
              style={{ flex: 2, padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff' }}
            />
          </div>
          <textarea 
            placeholder="What's on your mind? Share a review, ask a question, or recommend a firework..." 
            value={newPost.content}
            onChange={e => setNewPost({...newPost, content: e.target.value})}
            required
            rows="4"
            style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff', resize: 'vertical' }}
          ></textarea>
          <button 
            type="submit" 
            disabled={isPosting}
            style={{ alignSelf: 'flex-end', padding: '0.8rem 2rem', background: 'var(--accent-magenta)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: isPosting ? 'not-allowed' : 'pointer', opacity: isPosting ? 0.7 : 1 }}
          >
            {isPosting ? 'Posting...' : 'Post to Community'}
          </button>
        </form>
      </div>

      {/* Posts Feed */}
      <div>
        <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Recent Posts</h3>
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No posts yet. Be the first to start a discussion!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {posts.map(post => (
              <div key={post.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#fff' }}>{post.title}</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Posted by <span style={{ color: 'var(--accent-cyan)' }}>{post.author}</span> • {new Date(post.created_at).toLocaleDateString()}
                </div>
                <p style={{ lineHeight: '1.6', marginBottom: '1.5rem' }}>{post.content}</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => handleLike(post.id, post.likes || 0)}
                    style={{ background: 'rgba(255,0,80,0.1)', border: '1px solid var(--accent-magenta)', color: 'var(--accent-magenta)', padding: '0.4rem 1rem', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    🔥 <span>{post.likes || 0}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
