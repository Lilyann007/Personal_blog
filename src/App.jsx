import React,{useState,useEffect} from "react";
import ReactMarkdown from 'react-markdown';
import './App.css';

export default function BlogApp(){

  //状态声明区
  const [posts,setPosts] = useState(()=> {
    try {
      const saved = localStorage.getItem("posts");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  })

  useEffect(() => {
    localStorage.setItem("posts",JSON.stringify(posts));
  },[posts]);

  const [currentView,setCurrentView] = useState("list");
  // 'list' | 'detail' | 'edit'

  const [editingPost,setEditingPost] = useState({
    title: "",
    content: "",
    tags: []
  });

  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);


  //事件处理区
  const handlePostBlogs = function(){
      const newPost = {
      id: Date.now(),
      title: editingPost.title,
      content: editingPost.content,
      author: "リリアン",
      date: new Date().toLocaleDateString("zh-CN"),
    };
    setPosts([newPost, ...posts]);
    setEditingPost({title: "",content: ""});
    setCurrentView("list");
    alert("发布成功！");
    }

  const handleDeletePost = function(id){
    const confirmed = window.confirm("确定删除这篇文章吗？")
    if(confirmed){
      setPosts(posts.filter((post) => post.id !== id));
      setCurrentView("list");
      alert("已删除");
    }
  }

  //渲染区
  return(
    <div className="container">
      
      {loading && "博客正在飞来的路上……"}
      
      <div className="header">
        <h1>📝我的个人博客</h1>
        <button className="article-list" onClick={() => setCurrentView("list")}>文章列表</button>
        <button className="article-edit" onClick={() => setCurrentView("edit")}>写文章</button>
      </div>


      {/* 文章列表区 */}
      {currentView == "list" && (
        <div>
          <h2>文章列表（{posts.length}）</h2>
          {posts.map((post) => (
              <div key={post.id}>
                <h3>{post.title}</h3>
                <p>{post.date}</p>
                <p>{post.content.substring(0,100)}...</p>
                <button onClick={() => handleDeletePost(post.id)}>删除</button>
              </div>
            ))}
        </div>
      )}

      {/* 编辑区 */}
      {currentView == "edit" && (
        <div>
          <h2>写新文章</h2>
          <input 
            type="text" 
            value={editingPost.title}
            onChange={(e) => setEditingPost({...editingPost,title:e.target.value})} 
            placeholder="文章标题" />
          <textarea 
              value={editingPost.content}
              onChange={(e) => setEditingPost({...editingPost,content:e.target.value})}
              placeholder="文章内容"
              rows={20}>
          </textarea>
          <button onClick={handlePostBlogs}>发布</button>
          <button onClick={() => setCurrentView("list")}>取消</button>
        </div>
      )}

    </div>
    
  )
    
  }