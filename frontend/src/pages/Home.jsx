import React from "react";
import { auth, googleProvider } from "../utils/firebase";
import { signInWithPopup, getAuth } from "firebase/auth";
import api from "../utils/axios";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

const Home = () => {
    const userData = useSelector(state => state.user)
    const dispatch = useDispatch()
    console.log(userData)

    const handleLogin = async (token) => {

        try {
            const { data } = await api.post("/api/auth/login", { token });
            console.log("User logged in", data)
            dispatch(setUserData(data))
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
        <div className='h-screen flex bg-[#0d0f14] text-white overflow-hidden'>
            {!userData &&

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
                    <div className='w-[400px] bg-[#13151c] border border-white/[0.08] p-7 rounded-2xl flex flex-col gap-5 '>
                        <div className="w-full text-center">
                            <h2 className="text-2xl font-semibold">Welcome To Geminis App</h2>
                            <p className="text-sm text-white/[0.5] mt-2">Please login to continue the app</p>
                        </div>
                        <button className='w-full h-12 bg-white text-black rounded-md flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors cursor-pointer border-none' onClick={googleLogin} >
                            <FcGoogle
                                className="text-white text-xl"
                            /> Continue With Google </button>
                    </div>

                </div>

            }

        </div>
    );
};

export default Home;

