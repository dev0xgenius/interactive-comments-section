import Comments from './Comments'
import ReplyForm from './ReplyForm'
import { useEffect, useState, useContext } from 'react';
import client from '../api/client';
import { UserContext } from "../../utils/contexts/UserContext";
import { generateID } from '../../utils/helpers.js'

export default function App() {
  const [appData, setAppData] = useState();

  useEffect(() => {
    const controller = new AbortController();
    client.getComments(
      data => setAppData(currentState => ({...data}))
    , controller);
    
    return () => {
      controller.abort();
    }
  }, []);

  const addComment = (comment) => {
    const newComment = {
      id: generateID(appData.comments),
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
  
  const addReply = (reply, commentID) => {
    let updatedComments = appData.comments.map(comment => {
      if (comment.id === commentID) {
        let updatedReplies = comment.replies.concat(reply);
        return Object.assign({}, comment, 
          { replies: updatedReplies }
        ); 
      }
      return comment;
    });
    
    setAppData(currentState => Object.assign(
      {}, currentState, { comments: updatedComments }
    ));
  };

  return (appData != null) ? (
    <UserContext.Provider value={appData.currentUser}>
      <div className="wrapper max-w-sm m-auto flex flex-col gap-0">
        <Comments 
          data={appData.comments}
          handleReply={addReply}
        />
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