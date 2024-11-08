import Comments from './Comments'
import ReplyForm from './ReplyForm'
import { useEffect, useState, useContext } from 'react';
import client from '../api/client';
import { UserContext } from "../../utils/contexts/UserContext";

export default function App() {
  const [appData, setAppData] = useState();

  const generateID = (usedIDs = new Set([])) => {
    let newID = null;
    let idExists = false;

    do { // Reset ID if it exists
      newID = Math.floor(Date.now() / 1000);
    } while (usedIDs.has(newID));

    // Add matching ID into usedIDs Set Object for tracking
    for (const comment of appData.comments) {
      const { id } = comment;
      if (Number(id) === newID) {
        idExists = true;
        usedIDs.add(Number(id));
      }
    }
    return (idExists) ? generateID(usedIDs) : newID;
  };

  const addComment = (comment) => {
    const newComment = {
      id: generateID(),
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
      client.getComments(data => setAppData(currentState =>
        Object.assign({}, currentState, data))
        , controller);
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