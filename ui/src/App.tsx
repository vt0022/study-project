import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MainRoutes from "./routes/main-routes";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/*" element={<MainRoutes />} />
      </Routes>
    </div>
  );
}

export default App;
