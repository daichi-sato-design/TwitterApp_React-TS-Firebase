import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Auth from "./components/Auth";
import Feed from "./components/Feed";

// reducerで作成した関数などをインポート
import { selectUser, login, logout } from "./features/userSlice";
// firebase.tsで作成したfirebase認証機能をインポート
import { auth } from "./firebase";

const App: React.FC = () => {
  // reduxのstateの中から、userというstateを取得して、userという変数に代入する。
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    // auth.onAuthStateChangedは、Auth認証に変化を検知し発火するsubscriptionなイベントハンドラー
    // subscription: 動作の監視(常に実行されている)
    const unSub = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(
          // dispatch関数の引数にpayloadを含むことができる
          login({
            // payload
            uid: authUser.uid,
            photoURL: authUser.photoURL,
            displayName: authUser.displayName,
          })
        );
      } else {
        dispatch(logout());
      }
    });
    // CleanUp関数の実行
    // CleanUp関数とは、Appコンポーネントが UnMount(exc: 非表示など)されたときに発火。
    return () => {
      // AppコンポーネントがUnMountされると監視(subscription)が不要(エラーに原因)になるので、監視を解除する関数を発火
      unSub();
    };
  }, [dispatch]);

  // <> ... </>で囲むことをFlagment(フラグメント)という
  return (
    <>
      {user.uid ? (
        <div className="App_feed">
          <Feed />
        </div>
      ) : (
        <Auth />
      )}
    </>
  );
};

export default App;
