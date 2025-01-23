import React from "react";
import Feed from "../components/Feed";

const HomePage = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6 text-indigo-600">
          Welcome to Social Media App
        </h1>
        <Feed />
      </div>
    </div>
  );
};

export default HomePage;
