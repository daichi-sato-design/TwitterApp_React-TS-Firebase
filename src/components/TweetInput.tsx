import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { storage, db, auth } from "../firebase";
import firebase from "firebase/app";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";

import { Avatar, Button, IconButton } from "@material-ui/core";

const TweetInput: React.FC = () => {
  const user = useSelector(selectUser);
  const [tweetImage, setTweetImage] = useState<File | null>(null);
  const [tweetMsg, setTweetMsg] = useState("");

  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setTweetImage(e.target.files![0]);
      e.target.value = "";
    }
  };
  const sendTweet = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (tweetImage) {
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + tweetImage.name;
      const uploadTweetImg = storage.ref(`images/${fileName}`).put(tweetImage);
      uploadTweetImg.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        // 実行時の発火
        () => {},
        // error時に発火
        (err) => {
          alert(err.message);
        },
        // 実行後に発火
        async () => {
          await storage
            .ref("images")
            .child(fileName)
            .getDownloadURL()
            .then(async (url) => {
              await db.collection("posts").add({
                username: user.displayName,
                avatar: user.photoURL,
                text: tweetMsg,
                image: url,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              });
            });
        }
      );
    } else {
      db.collection("posts").add({
        username: user.displayName,
        avatar: user.photoURL,
        text: tweetMsg,
        image: "",
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
    setTweetImage(null);
    setTweetMsg("");
  };
  return (
    <>
      <form onSubmit={sendTweet}>
        <div className="TweetInput_form">
          <Avatar
            className="TweetInput_avatar"
            src={user.photoURL}
            onClick={async () => {
              await auth.signOut();
            }}
          />
          <input
            type="text"
            className="TweetInput_input"
            placeholder="What's happening?"
            autoFocus
            value={tweetMsg}
            onChange={(e) => setTweetMsg(e.target.value)}
          />
          <IconButton>
            <label>
              <AddAPhotoIcon
                className={
                  tweetImage ? "TweetInput_addIconLoaded" : "TweetInput_addIcon"
                }
              />
              <input
                type="file"
                className="TweetInput_hiddenIcon"
                onChange={onChangeImageHandler}
              />
            </label>
          </IconButton>
        </div>
        <Button
          type="submit"
          disabled={!tweetMsg}
          className={
            tweetMsg ? "TweetInput_sendBtn" : "TweetInput_sendDisableBtn"
          }
        >
          Tweet
        </Button>
      </form>
    </>
  );
};

export default TweetInput;
