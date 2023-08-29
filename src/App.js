import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Component/Login";
import SignUp from "./Component/SignUp";
import UploadIMG from "./Component/UploadIMG";
import Header from "./Component/Header";
function App() {
  return (
    <>
      <Router>
        {/* <Header /> */}
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route exact path="/uploadimage" element={<UploadIMG />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
