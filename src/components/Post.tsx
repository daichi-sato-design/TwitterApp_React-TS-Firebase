import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import firebase from "firebase/app";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";

import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import MessageIcon from "@material-ui/icons/Message";
import SendIcon from "@material-ui/icons/Send";

interface PROPS {
  postID: string;
  username: string;
  avatar: string;
  text: string;
  image: string;
  timestamp: any;
}

interface COMMENT {
  ID: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: any;
}

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(1),
  },
}));

const Post: React.FC<PROPS> = (props) => {
  const classes = useStyles();
  const user = useSelector(selectUser);
  const [comment, setComment] = useState("");
  const newComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    db.collection("posts").doc(props.postID).collection("comments").add({
      username: user.displayName,
      avatar: user.photoURL,
      text: comment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };
  const [comments, setComments] = useState<COMMENT[]>([
    {
      ID: "",
      username: "",
      avatar: "",
      text: "",
      timestamp: null,
    },
  ]);
  useEffect(() => {
    const unSub = db
      .collection("posts")
      .doc(props.postID)
      .collection("comments")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setComments(
          snapshot.docs.map((doc) => ({
            ID: doc.id,
            username: doc.data().username,
            avatar: doc.data().avatar,
            text: doc.data().text,
            timestamp: doc.data().timestamp,
          }))
        );
      });
    return () => {
      unSub();
    };
  }, [props.postID]);
  const [openComment, setOpenComment] = useState(false);
  return (
    <div className="Post_post">
      <div className="Post_avatar">
        <Avatar src={props.avatar} />
      </div>
      <div className="Post_body">
        <div>
          <div className="Post_header">
            <h3>
              <span className="Post_headerUser">@{props.username}</span>
              <span className="Post_headerTime">
                {new Date(props.timestamp?.toDate()).toLocaleString()}
              </span>
            </h3>
          </div>
          <div className="Post_tweet">
            <p>{props.text}</p>
          </div>
        </div>
        {props.image && (
          <div className="Post_tweetImage">
            <img src={props.image} alt="tweet" />
          </div>
        )}
        <MessageIcon
          className="Post_commentIcon"
          onClick={() => {
            setOpenComment(!openComment);
          }}
        />
        {openComment && (
          <>
            {comments.map((com) => (
              <div key={com.ID} className="Post_comment">
                <Avatar src={com.avatar} className={classes.small} />

                <span className="Post_commentUser">@{com.username}</span>
                <span className="Post_commentText">{com.text} </span>
                <span className="Post_headerTime">
                  {new Date(com.timestamp?.toDate()).toLocaleString()}
                </span>
              </div>
            ))}
            <form onSubmit={newComment}>
              <div className="Post_form">
                <input
                  type="text"
                  className="Post_input"
                  placeholder="Type new comment..."
                  value={comment}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setComment(e.target.value);
                  }}
                />
                <button
                  type="submit"
                  disabled={!comment}
                  className={comment ? "Post_button" : "Post_buttonDisable"}
                >
                  <SendIcon className="Post_sendIcon" />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Post;
