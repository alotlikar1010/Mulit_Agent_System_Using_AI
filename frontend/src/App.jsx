import React, { useEffect } from "react";
import Home from "./pages/Home";
import getCurrentUser from "./features/getCurrentUser";
import { useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice";

const App = () => {

  const dispatch = useDispatch()
  useEffect(() => {
    const getuser = async () => {
      const data = await getCurrentUser()
      dispatch(setUserData(data))
    }
    getuser()
  }, [])
  return (
    <>
      <Home />
    </>
  );
};

export default App;