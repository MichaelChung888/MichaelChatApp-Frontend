import './App.css';
import axios from "axios";
import { UserContextProvider } from './UserContext';
import Routes from './Routes';

function App() {
  axios.defaults.baseURL = "http://michaelchatapp-backend.onrender.com"; //"http://localhost:4000"
  axios.defaults.withCredentials = true; //allows cookies to be set from our APIs

  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  );
}

export default App
