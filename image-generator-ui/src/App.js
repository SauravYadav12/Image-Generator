import "./App.css";
import LinkedinLogin from "./pages/LinkedinLogin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  const isloggedIn = JSON.parse(localStorage.getItem("loggedIn"));

  return (
    <div className="App">
      <LinkedinLogin isloggedIn={isloggedIn} />
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
