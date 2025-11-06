import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/onboarding/Welcome";
import Signup from "./pages/onboarding/Signup";
import Login from "./pages/onboarding/Login";
import "./App.css";
import { DesignSystemComponents } from "./pages/DS/designSystem";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route path="/design-system" element={<DesignSystemComponents />} />


      </Routes>
    </Router>
  );
};

export default App;
