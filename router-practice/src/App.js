import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useParams } from 'react-router-dom';

const styles = `
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

// 首页组件
function Home() {
  
  const articles = [
    {id: 1, title: "我的第一篇博客", summary: "今天开始学React了！"},
    {id: 2, title: "React Router真好用", summary: "学会了路由切换"},
    {id: 3, title: "准备找工作了", summary: "1.5个月计划进行中"},
  ]
  
  return (
    <div>
      <h1>首页</h1>
      <p>欢迎来到我的博客！</p>

      <h2>文章列表：</h2>
      {articles.map(article => (
        <div key={article.id} style={{
          border: "1px solid #ddd",
          padding: "10px",
          margin: "10px 0",
          borderRadius: "5px"
        }}>
          <h3>{article.title}</h3>
          <p>{article.summary}</p>
          <NavLink to={`/article/${article.id}`}>阅读全文 →</NavLink>
        </div>
      ))}
    </div>
  );
}

// 关于页面组件
function About() {
  return (
    <div>
      <h1>关于我</h1>
      <p>我是一个前端开发者。</p>
    </div>
  );
}

//联系组件
function Contact() {
  return (
    <div>
      <h1>联系我</h1>
      <p>邮箱：example@email.com</p>
    </div>
  )
}

function Article() {
  const {id} = useParams();

  const articles = {
    "1": {
      title: "我的第一篇博客",
      content: "今天开始学React了！非常兴奋！React比我想象的简单很多。",
      date: "2026-01-26"
    },
    "2": {
      title: "React Router真好用",
      content: "学会了路由切换，还学会了NavLink的用法。导航栏现在看起来很专业！",
      date: "2026-01-27"
    },
    "3": {
      title: "准备找工作了",
      content: "1.5个月计划进行中，目标是成为前端开发者。加油！",
      date: "2026-01-28"
    }
  };

  const article = articles[id];

  if(!article) {
    return <div><h1>文章不存在</h1></div>
  }

  return (
    <div style={{maxWidth: "800px", margin: "0 auto"}}>
      <h1>{article.title}</h1>
      <p style={{color: "#666"}}>发布于：{article.date}</p>
      <hr />
      <p style={{fontSize: "18px", lineHeight: "1.8"}}>
        {article.content}
      </p>
      <hr />
      <NavLink to="/">← 返回首页</NavLink>
    </div>
  );
}

//新增：API测试组件
function ApiTest() {
  const [user,setUser] = useState(null);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);
  
  const fetchUser = () => {
    setLoading(true);
    setError(null);

    fetch("https://jsonplaceholder.typicode.com/users/1")
      .then(response => response.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      })
  }

  return (
    <div style={{padding: "20px"}}>
      <h1>API测试</h1>
      <button
        onClick={fetchUser}
        style={{
          backgroundColor: "#61dafb",
          color: "#282c34",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px"
        }}
      >
        获取用户数据
      </button>

      {loading && <p>加载中…</p>}
      {error && <p style={{color: "red"}}>错误：{error}</p>}
      {user && (
        <div style={{
          marginTop: "20px",
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "8px"
        }}>
          <h2>{user.name}</h2>
          <p>📧 邮箱：{user.email}</p>
          <p>📱 电话：{user.phone}</p>
          <p>🌐 网站：{user.website}</p>
          <p>🏢 公司：{user.company.name}</p>
        </div>
      )}
    </div>
  )
}

//新增：自动刷新新闻组件
function AutoRefreshNews () {
  const [news,setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(10);

  //useEffect 1：页面加载时获取新闻
  useEffect(() => {
    fetchNews();
  }, []);//只执行一次


  //useEffect 2：每10秒自动刷新
  useEffect(() => {
    const timer = setInterval(() => {
      fetchNews();
      setCountdown(10); //重制倒计时
    }, 10000); //10秒

    //清理函数
    return () => clearInterval(timer);
  },[])
  

  //useEffect 3：倒计时
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => prev > 0 ? prev -1 : 0);
    }, 1000);
  
    return () => clearInterval(timer);
  }, []);
  

  const fetchNews = () => {
    setLoading(true);
    //这是一个假的新闻 API，返回随机数据
    fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
      .then(res => res.json())
      .then(data => {
        setNews(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      })
  }

  return (
    <div style={{padding: "20px"}}>
      <h1>自动刷新新闻</h1>
      <p>下次刷新倒计时：{countdown} 秒</p>
      <button
        onClick={fetchNews}
        style={{
          backgroundColor: "#61dafb",
          color: "#282c34",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px"
        }}
      >
        立即刷新
      </button>

      {loading ? (
        <p>加载中…</p>
      ) : (
        <div>
          {news.map(item => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                margin: "10px 0",
                borderRadius: "8px"
              }}
            >
              <h3>{item.title}</h3>
              <p style={{color: "#666"}}>{item.body.slice(0,100)}...</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


// 主应用
function App() {
  return (
    <>
      <style>{styles}</style>
      <BrowserRouter>
        <nav>
          <NavLink to="/">首页</NavLink>
          <NavLink to="/about">关于</NavLink>
          <NavLink to="/contact">联系我</NavLink>
          <NavLink to="/api-test">API测试</NavLink>
          <NavLink to="/auto-news">自动新闻</NavLink>
          
        </nav>
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/article/:id" element={<Article />} />
          <Route path="/api-test" element={<ApiTest />} />
          <Route path="/auto-news" element={<AutoRefreshNews />} />
        </Routes>
      </BrowserRouter>
    </>
    
  );
}

export default App;