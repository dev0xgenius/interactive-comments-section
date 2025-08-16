import { useQuery } from "@tanstack/react-query";
import { useEffect, useReducer, useState } from "react";
import useWebSocket from "../hooks/useWebSocket.js";
import { UserContext } from "../utils/contexts/UserContext.js";
import Comments from "./Comments";
import Modal from "./Modal";
import ReplyForm from "./ReplyForm.jsx";

import reducer from "../../../shared/utils/reducer.js";

// TODO: Add authentication and replace all 'userID' variables
export default function App() {
    const [data, dispatch] = useReducer(reducer, {
        currentUser: {
            image: {
                png: "./images/avatars/image-juliusomo.png",
                webp: "./images/avatars/image-juliusomo.webp",
            },
            username: "juliusomo",
        },
        comments: [],
    });

    const [getInitialMessage, sendMessage] = useWebSocket(
        "ws://localhost:8080/comments",
        dispatch
    );

    const {
        isLoading,
        data: messages,
        error,
    } = useQuery({
        queryKey: ["comments"],
        queryFn: getInitialMessage,
    });

    useEffect(() => {
        if (!isLoading && !error) {
            messages.forEach((message) => dispatch(message));
        }
    }, [messages, isLoading, error]);

    const [modalState, setModalState] = useState({
        isOpen: false,
        handleResponse: null,
    });

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl font-mono flex justify-center items-center p-8">
                <p className="text-md">Loading...</p>
            </div>
        );
    } else if (error) {
        <div>Sorry an unexpected server error occured!!!</div>;
    }

    const showModal = () => {
        return new Promise((resolve) => {
            setModalState(() => ({
                isOpen: true,
                handleResponse: resolve,
            }));
        });
    };

    const closeModal = () => {
        setModalState(() => ({
            isOpen: false,
            handleResponse: null,
        }));
    };

    const addComment = (comment) => {
        const data = {
            userID: "faeb5f28-8632-4e0b-aaac-f8368f333430",
            content: comment,
            score: 0,
        };

        sendMessage({ type: "ADD_COMMENT", data });
    };

    const addReply = (reply, commentID) => {
        reply.userID = "faeb5f28-8632-4e0b-aaac-f8368f333430";
        reply.commentID = commentID;

        sendMessage({
            type: "ADD_REPLY",
            data: reply,
        });
    };

    const deleteReply = async (replyID) => {
        let userSelection = await showModal();

        if (userSelection) {
            closeModal();
            sendMessage({ type: "DELETE_REPLY", data: { id: replyID } });
        } else closeModal();
    };

    const editReply = (editedReply, id) => {
        sendMessage({ type: "EDIT_REPLY", data: { id, content: editedReply } });
    };

    const vote = (count, id) => {
        const counter = (count, oldVal) =>
            oldVal || count > 0 ? oldVal + count : oldVal;

        let currentScore = 0;
        data.comments.forEach((comment) => {
            if (comment.id === id) currentScore = comment.score;
            else if (comment.replies.length > 0) {
                comment.replies.forEach((reply) => {
                    currentScore = reply.id === id && reply.score;
                });
            }
        });

        sendMessage({
            type: "EDIT_REPLY",
            data: { id, score: counter(count, currentScore) },
        });
    };

    return (
        <UserContext.Provider value={data.currentUser}>
            <Modal
                mainMsg="Are you sure you want to remove this comment?
        This will remove the comment and can't be undone"
                headerMsg="Delete Comment"
                isOpen={modalState.isOpen}
                handleResponse={modalState.handleResponse}
            />
            <div className="wrapper m-auto w-full max-w-3xl flex flex-col gap-0 px-5 py-2.5">
                <Comments
                    data={data.comments}
                    actions={{ addReply, deleteReply, editReply, vote }}
                />
                <div className="reply-form bg-white-100 rounded-2xl p-5">
                    <ReplyForm
                        keepOpen={true}
                        placeholder="Add a comment..."
                        user={data.currentUser}
                        action={addComment}
                    />
                </div>
            </div>
        </UserContext.Provider>
    );
}
