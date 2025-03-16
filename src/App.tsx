import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MarkdownEditor from "./components/MarkdownEditor";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-full mx-4">
        <MarkdownEditor />
      </main>
      <ToastContainer />
    </div>
  );
}

export default App;
