import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginForm from "./pages/auth/login.tsx";
import RegisterForm from "./pages/auth/register.tsx";

function App() {
  return (
    <div className="App">
      <div className="container">
        <LoginForm />
        <RegisterForm />
      </div>
    </div>
  );
}

export default App;
