import Comments from './Comments'
import ReplyForm from './ReplyForm'
import Modal from './Modal'
import { useEffect, useState, useContext } from 'react'
import client from '../api/client'
import { UserContext } from "../utils/contexts/UserContext"
import { generateID, updateComment } from '../utils/helpers'
import { elapsedString } from '../utils/time'

export default function App() {
  const [appData, setAppData] = useState({
  "currentUser": {
    "image": {
      "png": "./images/avatars/image-juliusomo.png",
      "webp": "./images/avatars/image-juliusomo.webp"
    },
    "username": "juliusomo"
  },
  "comments": [
    {
      "id": 1,
      "content": "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
      "createdAt": 1729551600000,
      "score": 14,
      "user": {
        "image": {
          "png": "./images/avatars/image-amyrobson.png",
          "webp": "./images/avatars/image-amyrobson.webp"
        },
        "username": "amyrobson"
      },
      "replies": [
        {
          "id": 1736927180,
          "content": " what's up gurl?",
          "createdAt": 1736927180218,
          "score": 0,
          "user": {
            "image": {
              "png": "./images/avatars/image-juliusomo.png",
              "webp": "./images/avatars/image-juliusomo.webp"
            },
            "username": "juliusomo"
          },
          "replyingTo": "amyrobson"
        },
        {
          "id": 1736928236,
          "content": "tiwa savage",
          "createdAt": 1736928236848,
          "score": 0,
          "user": {
            "image": {
              "png": "./images/avatars/image-juliusomo.png",
              "webp": "./images/avatars/image-juliusomo.webp"
            },
            "username": "juliusomo"
          },
          "replyingTo": "amyrobson"
        },
        {
          "id": 1736928536,
          "content": "God idid",
          "createdAt": 1736928536835,
          "score": 0,
          "user": {
            "image": {
              "png": "./images/avatars/image-juliusomo.png",
              "webp": "./images/avatars/image-juliusomo.webp"
            },
            "username": "juliusomo"
          },
          "replyingTo": "amyrobson"
        }
      ]
    },
    {
      "id": 2,
      "content": "Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
      "createdAt": 1728342000000,
      "score": 5,
      "user": {
        "image": {
          "png": "./images/avatars/image-maxblagun.png",
          "webp": "./images/avatars/image-maxblagun.webp"
        },
        "username": "maxblagun"
      },
      "replies": [
        {
          "id": 3,
          "content": "If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
          "createdAt": 1728946800000,
          "score": 3,
          "replyingTo": "maxblagun",
          "user": {
            "image": {
              "png": "./images/avatars/image-ramsesmiron.png",
              "webp": "./images/avatars/image-ramsesmiron.webp"
            },
            "username": "ramsesmiron"
          }
        },
        {
          "id": 1736930424,
          "content": "hola",
          "createdAt": 1736930424662,
          "score": 0,
          "user": {
            "image": {
              "png": "./images/avatars/image-juliusomo.png",
              "webp": "./images/avatars/image-juliusomo.webp"
            },
            "username": "juliusomo"
          },
          "replyingTo": "maxblagun"
        }
      ]
    }
  ]
});
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

    setAppData(currentState => ({ ...currentState,  comments: updatedComments })); 
    client.addReply(reply, commentID);
  };

  const deleteReply = async (replyID) => {
    let userSelection = await showModal();
    if (userSelection) {
      closeModal();
      let updatedComments = appData.comments.filter(comment => {
        if (comment.replies.length != 0) {
          comment.replies = comment.replies.filter(
            reply => reply.id != replyID);
        }
            
        return (comment.id != replyID);
      });

      setAppData(currentData => ({ ...currentData, comments: updatedComments }));
      client.deleteReply(replyID);
    } else closeModal();
  };

  const editReply = (editedReply, id) => {
    let { comments } = appData;
    let updatedComments = updateComment(comments, id,
      ["content", editedReply]);

    setAppData(currentData => (
      { ...currentData, comments: updatedComments }
    )); client.editComment(id, editedReply);
  };

  const vote = (count, id) => {
    const { comments } = appData;
    const counter = (count, oldVal) =>
      (oldVal || count > 0) ? (oldVal + (count)) : oldVal;
      
    let updatedComments = updateComment(comments, id, 
      ["score", (comment) => { 
        let newScore = counter(count, comment.score)
        client.vote(newScore, id);
        
        return newScore;
      }]
    );

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
      <div className="wrapper m-auto w-full max-w-3xl flex flex-col gap-0 px-5 py-2.5">
        <Comments
          data={appData.comments}
          actions={{ addReply, deleteReply, editReply, vote }}
        />
        <div className="reply-form bg-white-100 rounded-2xl p-5">
          <ReplyForm
            keepOpen={true}
            placeholder="Add a comment..."
            user={appData.currentUser}
            action={addComment}
          />
        </div>
      </div>
    </UserContext.Provider>
  ) : (
    <div className="bg-white rounded-xl font-mono flex justify-center items-center p-8">
      <p className="text-md">Couldn't Fetch Data...</p>
    </div>
  );
};