import { BrowserRouter, Route, Routes } from "react-router-dom";
import { getSession } from "./hooks/use-session";
import Home from "./pages/Home";
import Login from "./pages/Login";

export default function App() {
  const session = getSession();
  console.log("🚀 ~ App ~ session:", session);

  return (
    <BrowserRouter>
      <Routes>
        {!session ? (
          <>
            <Route path="/" element={<Login />} />
            <Route path="*" element={<Login />} />
          </>
        ) : (
          <Route path="/" element={<Home />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}
