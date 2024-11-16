import Comments from './Comments'
import ReplyForm from './ReplyForm'
import Modal from './Modal'
import { useEffect, useState, useContext } from 'react';
import client from '../api/client';
import { UserContext } from "../../utils/contexts/UserContext";
import { generateID } from '../../utils/helpers'

export default function App() {
  const [appData, setAppData] = useState();
  const [modalState, setModalState] = useState({
    isOpen: false,
    handleResponse: null
  });
  
  const showModal = () => {
    return new Promise(resolve => {
      setModalState(s => ({
        isOpen: true,
        handleResponse: resolve,
      }));
    });
  };
  
  const closeModal = () => {
    setModalState(s => ({
      isOpen: false,
      handleResponse: null
    }));
  };
  
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
    )); client.addReply(reply, commentID);
  };
  
  const deleteReply = async (replyID) => {
    let userSelection = await showModal();
    if (userSelection) {
      closeModal();
      let updatedComments = appData.comments.filter(comment => {
        if (comment.replies.length != 0)
          comment.replies = comment.replies.filter(reply => reply.id != replyID);
        return (comment.id != replyID);
      });
      
      setAppData(currentData => ({...currentData, comments: updatedComments}));
      client.deleteReply(replyID);
    } else closeModal();
  };
  
  const editReply = () => {}
  

  return (appData != null) ? (
    <UserContext.Provider value={appData.currentUser}>
      <Modal
        mainMsg="Are you sure you want to remove this comment?
        This will remove the comment and can't be undone"
        headerMsg="Delete Comment"
        isOpen={modalState.isOpen}
        handleResponse={modalState.handleResponse}
      />
      <div className="wrapper max-w-sm m-auto flex flex-col gap-0">
        <Comments 
          data={appData.comments}
          actions={{addReply, deleteReply, editReply}}
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