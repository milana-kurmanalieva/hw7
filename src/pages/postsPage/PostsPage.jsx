import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

function PostsPage() {
  const { handleSubmit, register, getValues } = useForm();

  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    getPosts();
  }, []);

  async function getPosts() {
    const response = await fetch("http://localhost:3000/posts");
    const data = await response.json();
    setPosts(data);

    // const response = await axios.get("http://jsonplaceholder.typicode.com/posts")
    // setPosts(response.data)
  }

  async function submit(values) {
    const response = await fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    getPosts();

    // const response = await axios.post("http://jsonplaceholder.typicode.com/posts", values)
    // getPosts()
  }

  async function deletePost(id) {
    const response = await fetch(`http://localhost:3000/posts/${id}`, {
      method: "DELETE",
    });
    getPosts();

    // const response = await axios.delete(`http://jsonplaceholder.typicode.com/posts${id}`)
    // getPosts()
  }

  async function getOnePost(id) {
    const response = await fetch(`http://localhost:3000/posts/${id}`);
    const postOne = await response.json();
    setPost(postOne);

    // const response = await axios.get(`http://jsonplaceholder.typicode.com/posts${id}`)
    // setPost(response.data)
  }


  const updatePost = async (id) => {
    const values = getValues();
    const response = await fetch(`http://localhost:3000/posts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    setPosts((prevPosts) => prevPosts.map((p) => (p.id === id ? data : p)));
    setPost({});
    setIsEditing(false);
  };

  return (
    <div>
      <h2>Posts list</h2>

      <form onSubmit={handleSubmit(submit)}>
        <input type="text" {...register("title")} placeholder="title" />
        <textarea
          cols="30"
          rows="10"
          {...register("body")}
          placeholder="body"
        ></textarea>
        <button>create</button>
      </form>
      <ul>
        {posts.length > 0 ? (
          posts.map((post) => (
            <li key={post.id}>
              {post.title}{" "}
              <button onClick={() => deletePost(post.id)}>delete</button>
              <button onClick={() => getOnePost(post.id)}>get more info</button>
              <button onClick={() => updatePost(post.id)}>update</button>
            </li>
          ))
        ) : (
          <p>список пуст</p>
        )}
      </ul>

      <ul>
        <li>title: {post.title}</li>
        <li>body: {post.body}</li>
      </ul>
    </div>
  );
}

export default PostsPage;
