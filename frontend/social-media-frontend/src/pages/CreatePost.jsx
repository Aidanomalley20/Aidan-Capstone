import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CreatePost = () => {
  const [newPost, setNewPost] = useState({ content: "", image: null });
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handlePostChange = (e) => {
    setNewPost({ ...newPost, content: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewPost({ ...newPost, image: file });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("content", newPost.content);
    if (newPost.image) {
      formData.append("image", newPost.image);
    }

    try {
      const token = localStorage.getItem("token");
      await api.post("/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Post created successfully!");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (error) {
      console.error("❌ Failed to create post:", error);
      setMessage("Failed to create post. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white px-6">
      <div className="w-full max-w-md bg-gray-900 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          Create a Post
        </h1>

        <form onSubmit={handlePostSubmit} className="space-y-4">
          <div className="flex flex-col items-center">
            <label
              htmlFor="file-upload"
              className="w-full text-center py-3 bg-blue-500 text-white font-semibold rounded-md cursor-pointer hover:bg-blue-600 transition"
            >
              Select from Computer
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg mt-3"
              />
            )}
          </div>

          <textarea
            className="w-full p-3 bg-gray-800 text-white rounded border border-gray-700"
            placeholder="Write a caption..."
            value={newPost.content}
            onChange={handlePostChange}
            required
          />

          <button
            type="submit"
            className="w-full py-3 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 transition"
          >
            Post
          </button>

          {message && (
            <p className="text-center mt-3 text-green-400">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
