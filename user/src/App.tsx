import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Home</div>} />
      <Route path="/post/:id" element={<div>Post</div>} />
      <Route path="/login" element={<div>Login</div>} />
      <Route path="/signup" element={<div>Signup</div>} />
      <Route path="/profile" element={<div>Profile</div>} />
    </Routes>
  );
}

export default App;
