import React from "react";

const Footer = () => {
  return (
    <footer className="border-t w-full py-4 flex items-center justify-between lg:px-16 px-8">
      <h1 className="md:text-2xl text-sm font-extrabold">
        Benaiah <span className="text-red-500">Security</span>
      </h1>
      <p className="md:text-xl text-sm">&copy; {new Date().getFullYear()} Benaiah Security. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
