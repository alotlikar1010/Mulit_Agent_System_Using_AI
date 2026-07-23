import React from "react";
import { auth, googleProvider } from "./utils/firebase";
import { signInWithPopup, getAuth } from "firebase/auth";

const App = () => {

  const googleLogin = async () => {
    const data = await signInWithPopup(auth, googleProvider);
    console.log(data);
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