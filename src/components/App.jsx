import Comments from './Comments'
import ReplyForm from './ReplyForm'
import { useEffect, useState, useContext } from 'react';
import client from '../api/client';
import { UserContext } from "../../utils/contexts/UserContext";

export default function App() {
  const [appData, setAppData] = useState();

  const addComment = (comment) => {
    const newComment = {
      id: Math.floor(Date.now() / 1000),
      content: comment,
      score: 0,
      createdAt: "Now",
      user: appData.currentUser,
      replies: []
    };

    let updatedComments = [...appData.comments, newComment];
    setAppData(currentState =>
      Object.assign(
        {}, currentState, { comments: updatedComments })
    ); client.addComment(newComment);

  };

  useEffect(() => {
    const controller = new AbortController();
    let t = setInterval(() => {
      client.getComments(data => setAppData(
        currentState => ({...data}))
      ,controller);
    }, 50);

    return () => {
      controller.abort();
      clearInterval(t);
    }
  }, []);

  return (appData != null) ? (
    <UserContext.Provider value={appData.currentUser}>
      <div className="wrapper max-w-sm m-auto flex flex-col gap-0">
        <Comments data={appData.comments} />
        <ReplyForm
          keepOpen={true}
          placeholder="Add a comment..."
          action={addComment}
        />
      </div>
    </UserContext.Provider>
  ) : (
    <div className="bg-white rounded-xl font-mono flex justify-center items-center p-8">
      <p className="text-md">Couldn't Fetch Data...</p>
    </div>
  );
};