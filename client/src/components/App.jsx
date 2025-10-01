import { useQuery } from "@tanstack/react-query";
import { useEffect, useReducer, useState } from "react";
import useWebSocket from "../hooks/useWebSocket.js";
import { UserContext } from "../utils/contexts/UserContext.js";
import Comments from "./Comments";
import Modal from "./Modal";
import ReplyForm from "./ReplyForm.jsx";

import reducer from "../../../shared/utils/reducer.js";
import { updateComment } from "../utils/helpers.js";
import Auth from "./Auth.jsx";

export default function App() {
    const [comments, dispatch] = useReducer(reducer, []);

    let protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const [loadMessages, sendMessage] = useWebSocket(
        `${protocol}://${window.location.host}/comments`,
        dispatch
    );

    const {
        isLoading,
        data: messages,
        error,
    } = useQuery({
        queryKey: ["comments"],
        queryFn: loadMessages,
    });

    useEffect(() => {
        if (!isLoading && !error) {
            messages.forEach((message) => dispatch(message));
        }
    }, [messages, isLoading, error]);

    const { data: loggedUser } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const response = await fetch("/auth", { method: "POST" });

            if (response.status != 200) {
                console.log("Couldn't authenticate user");
                throw "Couldn't authenticate user";
            }

            return await response.json();
        },
    });

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
            userID: loggedUser.id,
            content: comment,
            score: 0,
        };

        sendMessage({ type: "ADD_COMMENT", data });
    };

    const addReply = (reply, commentID) => {
        reply.userID = loggedUser.id;
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
        updateComment([...comments], id, [
            "score",
            (matchedComment) => {
                currentScore = matchedComment.score;
            },
        ]);

        sendMessage({
            type: "EDIT_REPLY",
            data: { id, score: counter(count, currentScore) },
        });
    };

    return (
        <UserContext.Provider value={loggedUser}>
            <Modal
                mainMsg="Are you sure you want to remove this comment?
                This will remove the comment and can't be undone"
                headerMsg="Delete Comment"
                isOpen={modalState.isOpen}
                handleResponse={modalState.handleResponse}
            />
            <div className="wrapper m-auto w-full max-w-3xl flex flex-col gap-0 px-5 py-2.5 items-center">
                {comments?.length == 0 ? (
                    <span className="bg-white-100 px-8 py-4 my-6 rounded-md text-gray-400">
                        {"Be the first to say something"}
                    </span>
                ) : (
                    <Comments
                        data={comments}
                        actions={{ addReply, deleteReply, editReply, vote }}
                    />
                )}
                {loggedUser ? (
                    <div className="reply-form w-full bg-white-100 rounded-2xl p-5">
                        <ReplyForm
                            keepOpen={true}
                            placeholder="Add a comment..."
                            user={loggedUser}
                            action={addComment}
                        />
                    </div>
                ) : (
                    <Auth />
                )}
            </div>
        </UserContext.Provider>
    );
}
