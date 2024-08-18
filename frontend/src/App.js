import "./App.css";
import ChatPage from "./Pages/ChatPage";
import HomePage from "./Pages/HomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} exact />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
    </div>
  );
}

export default App;
