import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Dashboard</div>} />
      <Route path="/posts" element={<div>Posts</div>} />
      <Route path="/posts/new" element={<div>New Post</div>} />
      <Route path="/posts/:id/edit" element={<div>Edit Post</div>} />
      <Route path="/login" element={<div>Login</div>} />
    </Routes>
  );
}

export default App;
