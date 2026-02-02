import React,{useState,useEffect} from "react";
import ReactMarkdown from 'react-markdown';
import {BrowserRouter,Routes,Route,NavLink,useParams,useNavigate} from "react-router-dom";
import './App.css';

//导航栏样式
const navStyles = `
  nav {
    background-color: #282c34;
    padding: 20px;
    margin-bottom: 20px;
  }

  nav a {
    color: white;
    text-decoration: none;
    padding: 10px 20px;
    margin: 0 5px;
    border-radius: 5px;
    transition: background-color 0.3s;
  }

  nav a:hover {
    background-color: #404854;
  }

  nav a.active {
    background-color: #61dafb;
    color: #282c34;
    font-weight: bold;
  }
`;

//文章列表页面
function PostList({posts,onDelete}) {
  return (
    <div className="container">
      
      <h2>文章列表{posts.length}</h2>
      
      {posts.length === 0 ? (
        <p>还没有文章，快去写一篇吧！</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} style={{
            border: "1px solid #ddd",
            padding: "15px",
            margin: "15px 0",
            borderRadius: "8px",
            backgroundColor: "f9f9f9"
          }}>
            
            <h3>{post.title}</h3>
            
            <p style={{color: "#666", fontSize: "14px"}}>
              {post.date} · {post.author}
            </p>
            
            <ReactMarkdown>
              {post.content.slice(0,100) + "..."}
            </ReactMarkdown>
            
            <div style={{marginTop: "10px"}}>
              <NavLink
                to={`/article/${post.id}`}
                style={{
                  backgroundColor: "#61dafb",
                  color: "#282c34",
                  padding: "8px 15px",
                  borderRadius: "5px",
                  textDecoration: "none",
                  marginRight: "10px"
                }}
              >
                阅读全文 →
              </NavLink>
              
              <button
                onClick={() => onDelete(post.id)}
                style={{
                  backgroundColor: "#ff4444",
                  color: "white",
                  padding: "8px 15px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                删除
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}


//写文章页面
function WritePost({onPublish}) {
  const [editingPost,setEditingPost] = useState({
    title: "",
    content: ""
  });

  const navigate = useNavigate();

  const handlePublish = () => {
    if(!editingPost.title || !editingPost.content) {
      alert("标题和内容不能为空！");
      return
    }

    const newPost = {
      id: Date.now(),
      title: editingPost.title,
      content: editingPost.content,
      author: "リリアン",
      date: new Date().toLocaleDateString("zh-CN"),
    }

    onPublish(newPost);
    setEditingPost({title: "", content: ""});
    navigate("/"); //发布后跳转首页
    alert("发布成功！")
  };

  return (
    <div className="container">
      <h2>写新文章</h2>
      
      <input 
        type="text" 
        value={editingPost.title}
        onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
        placeholder="文章标题"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
          fontSize: "16px",
          border: "1px solid #ddd",
          borderRadius: "5px"
        }}
      />
      
      <textarea
        value={editingPost.content}
        onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
        placeholder="文章内容（支持Markdown）"
        rows={20}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #ddd",
          borderRadius: "5px",
          marginBottom: "15px"
        }}
      />
      
      <button
        onClick={handlePublish}
        style={{
          backgroundColor: "#61dafb",
          color: "#282c34",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          fontSize: "16px",
          cursor: "pointer",
          marginRight: "10px"
        }}
      >
        发布
      </button>
      
      <NavLink
        to="/"
        style={{
          backgroundColor: "#ddd",
          color: "#333",
          padding: "10px 20px",
          borderRadius: "5px",
          textDecoration: "none"
        }}
      >
        取消
      </NavLink>
    </div>
  ) 
}

//文章详情页面
function PostDetail({posts}) {
  const {id} = useParams();
  const post = posts.find(p => p.id === parseInt(id));

  if(!post) {
    return (
      <div className="container">
        <h1>文章不存在</h1>
        <NavLink to="/">← 返回首页</NavLink>
      </div>
    );
  }

  return (
    <div className="container" style={{maxWidth: "800px", margin: "0 auto"}}>
      <h1>{post.title}</h1>
      <p style={{color: "#666", fontSize: "14px"}}>
        {post.date} · {post.author}
      </p>
      <hr />
      <ReactMarkdown>{post.content}</ReactMarkdown>
      <hr />
      <NavLink
        to="/"
        style={{
          backgroundColor: "#61dafb",
          color: "#282c34",
          padding: "10px 20px",
          borderRadius: "5px",
          textDecoration: "none"
        }}
      >
        ← 返回首页
      </NavLink>
    </div>
  )
}


//404页面
function Notfound() {
  return (
    <div className="container" style={{textAlign: "center", padding: "50px"}}>
      <h1 style={{fontSize: "72px", color: "#ddd"}}>404</h1>
      <h2>页面不存在</h2>
      <p>抱歉，你访问的页面不存在</p>
      <NavLink 
        to="/"
        style={{
          backgroundColor: "#61dafb",
          color: "#282c34",
          padding: "10px 20px",
          borderRadius: "5px",
          textDecoration: "none",
          display: "inline-block",
          marginTop: "20px"
        }}
      >
        返回首页
      </NavLink>
    </div>
  )
}



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


  //事件处理区
  const handlePublish = (newPost) => {
    setPosts([newPost,...posts]);
  }

  const handleDelete = (id) => {
    const confirmed = window.confirm("确定删除这篇文章吗？")
    if(confirmed){
      setPosts(posts.filter((post) => post.id !== id));
      alert("已删除");
    }
  }

  //渲染区
  return(
    <BrowserRouter>
      <style>{navStyles}</style>
      <div>
        {/* 导航栏 */}
        <nav>
          <h1 style={{color: "white", display: "inline-block", marginRight: "30px"}}>
            📝我的个人博客
          </h1>
          <NavLink to="/">文章列表</NavLink>
          <NavLink to="/write">写文章</NavLink>
        </nav>

        {/* 路由 */}
        <Routes>
          <Route
            path="/"
            element={<PostList posts={posts} onDelete={handleDelete} />}
          />
          <Route
            path="/write"
            element={<WritePost onPublish={handlePublish} />}
          />
          <Route
            path="/article/:id"
            element={<PostDetail posts={posts} />}
          />

          {/* 捕获所有未匹配的路由 */}
          <Route path="*" element={<Notfound />} />
        </Routes>
      </div>
    </BrowserRouter>    
  )   
}