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

  const [newTag,setNewTag] = useState("");
  const [filterTag,setFilterTag] = useState("all");
  const [searchTerm,setSearchTerm] = useState("");

  const [detailedPost,setDetailedPost] =useState({
    id: "",
    title: "",
    date: "",
    author: "",
    content: "",
    tags: ""
  })

  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);



  //逻辑计算区
  const allTags = [...new Set(posts.flatMap((post => post.tags)))]
  // ⬆️ flatMap：遍历+拍平成一维数组；set去重；扩展运算符：将set对象里的东西拿出来（外面套了数组方括号）放进数组➡️转换成数组

  const filteredPosts = posts.filter((post => {
    const matchSearch = searchTerm === "" ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchTag = filterTag === "all" || post.tags.includes(filterTag);
    
    return matchSearch && matchTag;
  }))



  //事件处理区
  const handlePostBlogs = function(){
    if(editingPost.id){
      // 有id = 编辑旧文章 = 更新
      setPosts(posts.map(post => 
        post.id === editingPost.id ? editingPost : post
      ))
    }else{
      // 没id = 新文章 = 创建
      const newPost = {
      id: Date.now(),
      ...editingPost,
      author: "リリアン",
      date: new Date().toLocaleDateString("zh-CN"),
      tags: editingPost.tags ? editingPost.tags : [],
      isDraft: false
    };
    setPosts([newPost, ...posts]);
    setEditingPost({title: "",content: "",tags: []});
    setCurrentView("list");
    alert("发布成功！");
    }
    
  }

  const handleAddTag = function(){
    setEditingPost({
      ...editingPost,
      tags: [...editingPost.tags,newTag.trim()]
    });
    setNewTag("");
  }

  const handleDraft = function(){
    const newDraft = {
      id: editingPost.id || Date.now(),
      ...editingPost,
      author: "リリアン",
      date: new Date().toLocaleDateString("zh-CN"),
      tags: editingPost.tags || [],
      isDraft: true
    }

    // 判断是新建还是更新
    if(editingPost.id){
      //更新已有草稿
      setPosts(posts.map((post) => post.id === editingPost.id ? newDraft : post));
    }else{
      //创建新草稿
      setPosts([newDraft, ...posts]);
    }
  }
  
  const handlePostDetail = function(id){
    const selectedPost = posts.find((post) => post.id === id);
    setDetailedPost(selectedPost);
    setCurrentView("detail");
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
          <div className="search-section">
            <input 
              type="text" 
              className="search" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索标题或内容…"/>
            
            <div className="tag-search">按标签筛选：</div>
              <button className="tag-btn" onClick={() => setFilterTag("all")}>全部({allTags.length})</button>
              {allTags.map((tag => (
                <button key={tag} className="tag-btn" onClick={() => setFilterTag(tag)}>#{tag}</button>
              )))}

            {/* 嵌套map，无法直接取到一个post的tags，先遍历posts取到单独的一篇post，再遍历post的tags，取到具体标签 */}
            {/* {posts.map((post) => (
              post.tags.map((tag,index) => (
                <button className="tag-btn" key={index}>#{tag}</button>
              ))
            ))} */}
          </div>

          <div className="counting-section">
            <div className="total-articles">总文章数:{posts.length}</div>
            <div className="published">已发布</div>
            <div className="drafts">草稿</div>
          </div>

          <div className="blog-section">
            {filteredPosts.map((post) => (
              <div className="post" key={post.id} onClick={() => handlePostDetail(post.id)}>
                <h3>{post.title}</h3>
                {post.isDraft && (<span>草稿</span>)}
                <p>{post.date}</p>
                <p>作者：{post.author}</p>
                <p>{post.content.substring(0,100)}...</p>
              </div>
            ))}
          </div>
        </div>
      )}



      {/* 编辑区 */}
      {currentView == "edit" && (
        <div className="edit-section">
          
          <div className="edit-header">
            <h2>{editingPost.id ? "编辑文章" : "写新文章"}</h2>
            <button className="draft-btn" onClick={handleDraft}>保存草稿</button>
            <button className="post-btn" onClick={handlePostBlogs}>发布</button>
            <button className="cancel-btn" onClick={() => setCurrentView("list")}>取消</button>
          </div>
          
          <input 
            type="text" 
            value={editingPost.title}
            onChange={(e) => setEditingPost({...editingPost,title:e.target.value})} 
            placeholder="文章标题" />

          <div className="post-tag">
            <div>标签管理</div>
            <input 
              type="text" 
              value={newTag} 
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="添加标签" />
            <button 
              className="tag-btn" onClick={handleAddTag}>添加</button>
          </div>

          <div>
            <h3>编辑（MarkDown）</h3>
            <textarea 
              value={editingPost.content}
              onChange={(e) => setEditingPost({...editingPost,content:e.target.value})}
              placeholder="# 标题&#10;&#10;**粗体** *斜体*"
              rows={20}>
            </textarea>
          </div>         
        </div>
      )}


      {/* 文章详情区 */}
      {currentView === "detail" && (
        <div className="article-detail">
          <button className="back-to-list-btn" onClick={() => setCurrentView("list")}>⬅返回列表</button>
          <button className="edit-btn" onClick={() => handleEditPost(detailedPost)}>编辑</button>
          <button className="delete-btn" onClick={() => handleDeletePost(detailedPost.id)}>删除</button>
          
          <div className="post">
                <h3>{detailedPost.title}</h3>
                <p>{detailedPost.date}</p>
                <p>作者：{detailedPost.author}</p>
                <span>{detailedPost.tags.map((tag) => `#${tag}`)}</span>
                <p>{detailedPost.content}</p>
          </div>
        </div>
      )}

      
    
    </div>
    
  )

}