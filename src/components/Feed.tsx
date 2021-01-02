import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import Post from "./Post";

import TweetInput from "./TweetInput";

const Feed: React.FC = () => {
  const [posts, setPosts] = useState([
    {
      id: "",
      username: "",
      avatar: "",
      text: "",
      image: "",
      timestamp: null,
    },
  ]);
  useEffect(() => {
    const unSub = db
      .collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            avatar: doc.data().avatar,
            image: doc.data().image,
            text: doc.data().text,
            timestamp: doc.data().timestamp,
            username: doc.data().username,
          }))
        )
      );
    return () => {
      unSub();
    };
  }, []);

  return (
    <div className="Feed_feed">
      <TweetInput />
      {posts[0]?.id && (
        <>
          {posts.map((post) => (
            <Post
              key={post.id}
              postID={post.id}
              username={post.username}
              avatar={post.avatar}
              text={post.text}
              image={post.image}
              timestamp={post.timestamp}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Feed;
