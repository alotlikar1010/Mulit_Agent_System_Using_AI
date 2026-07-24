import React from "react";
import { auth, googleProvider } from "./utils/firebase";
import { signInWithPopup, getAuth } from "firebase/auth";
import api from "./utils/axios";

const App = () => {

  const handleLogin = async (token) => {

    try {
      const { data } = await api.post("/auth/login", { token });
      console.log("User logged in", data)
    }
    catch (error) {
      console.log(error)
    }

  }

  const googleLogin = async () => {
    const data = await signInWithPopup(auth, googleProvider);
    const token = await data.user.getIdToken()
    await handleLogin(token);
    console.log(data)
  }
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      {/* <h1>App</h1> */}
      <button className='w-50 h-24 bg-white'

        onClick={googleLogin}>Continue with Google </button>
    </div>
  );
};

export default App;