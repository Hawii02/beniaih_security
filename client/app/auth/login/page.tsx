import LoginForm from "@/app/components/AuthForm";
import React from "react";

const LoginPage = () => {
  return (
    <div className="grid lg:grid-cols-2 w-full shadow-md min-h-screen">
      {/* <div className="relative h-screen overflow-y-hidden">
        <img src="/auth2.jpg" alt="Login to Benaiah Security" className="w-full h-auto"/>
        <div className="absolute inset-0 bg-red-600 opacity-40 pointer-events-none"/>
      </div> */}
      <div className="bg-red-500 h-screen text-white">
        <div className="flex flex-col justify-center items-start h-full px-10 space-y-6">
          <h1 className="text-4xl font-bold mb-4">Login to Benaiah Security</h1>
          <p className="text-lg text-left">
            Gain access to exclusive resources, updates, and support. Login now to continue your journey with Benaiah Security!
          </p>
        </div>
      </div>
      <LoginForm type={"login"} />
    </div>
  );
};

export default LoginPage;
