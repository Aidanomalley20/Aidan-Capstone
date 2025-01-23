import React from "react";
import Post from "./Post";

const posts = [
  { id: 1, username: "John", content: "Hello World!", image: null },
  { id: 2, username: "Jane", content: "React is awesome!", image: null },
];

const Feed = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Feed;
