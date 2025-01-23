import React from "react";

const Post = ({ post }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
      <h2 className="text-lg font-bold mb-2">{post.username}</h2>
      <p className="text-gray-700">{post.content}</p>
      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="w-full h-40 object-cover mt-4 rounded"
        />
      )}
    </div>
  );
};

export default Post;
