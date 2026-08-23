import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CheckAuth from "./Components/AuthCheck";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<p>Page not found</p>} />
        <Route path="/" element={<Login />} />
        <Route path="/Dashboard" element={<CheckAuth><Dashboard /></CheckAuth>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
