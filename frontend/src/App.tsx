import { Outlet } from "react-router-dom";
import { Header } from "./components/header";

function App() {
  return (
    <div>
      <Header />
      <main className="max-w-[1120px] mx-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
