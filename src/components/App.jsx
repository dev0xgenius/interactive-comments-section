import Comments from './Comments'
import ReplyForm from './ReplyForm'
import Modal from './Modal'
import { useEffect, useState, useContext } from 'react';
import client from '../api/client';
import { UserContext } from "../../utils/contexts/UserContext";
import { generateID } from '../../utils/helpers'
import { elapsedString } from '../../utils/time'; 

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
      data => setAppData(currentState => ({ ...data }))
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
      createdAt: Date.now(),
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

      setAppData(currentData => ({ ...currentData, comments: updatedComments }));
      client.deleteReply(replyID);
    } else closeModal();
  };

  const editReply = (editedReply, id) => {
    let { comments } = appData;
    let updatedComments = comments.map(comment => {
      if (comment.id === id) return { ...comment, content: editedReply }
      else if (comment.id !== id && !comment.replies) return comment;
      else if (comment.replies) {
        let { replies } = comment;
        replies = replies.map(reply => {
          if (reply.id === id) return { ...reply, content: editedReply };
          else return reply;
        });

        return { ...comment, replies: replies };
      }
    });

    setAppData(currentData => (
      { ...currentData, comments: updatedComments }
    ));
  };

  const vote = (count, id) => {
    const { comments } = appData;
    const counter = (count, oldVal) =>
      (oldVal || count > 0) ? (oldVal + (count)) : oldVal;

    let updatedComments = comments.map(comment => {
      let newScore = 0, oldScore = comment.score;
      if (comment.id === id) return { ...comment, score: counter(count, oldScore) };
      else if (comment.replies && comment.id !== id ) {
        let { replies } = comment;
        replies = replies.map(reply => {
          oldScore = reply.score;
          return (reply.id === id) ? 
            { ...reply, score: counter(count, oldScore) } : reply;
        });
        
        return { ...comment, replies: replies }
      }
    });

    setAppData(currentData => ({
      ...currentData,
      comments: updatedComments
    }));
  };

  return (appData != null) ? (
    <UserContext.Provider value={appData.currentUser}>
      <Modal
        mainMsg="Are you sure you want to remove this comment?
        This will remove the comment and can't be undone"
        headerMsg="Delete Comment"
        isOpen={modalState.isOpen}
        handleResponse={modalState.handleResponse}
      />
      <div className="wrapper m-auto max-w-3xl flex flex-col gap-0 px-5 py-2.5">
        <Comments
          data={appData.comments}
          actions={{ addReply, deleteReply, editReply, vote }}
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