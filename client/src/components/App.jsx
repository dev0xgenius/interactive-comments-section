import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useReducer, useState } from "react";
import useWebSocket from "../hooks/useWebSocket.js";
import { UserContext } from "../utils/contexts/UserContext.js";
import Comments from "./Comments";
import Modal from "./Modal";
import ReplyForm from "./ReplyForm.jsx";

import reducer from "../../../shared/utils/reducer.js";
import { updateComment } from "../utils/helpers.js";
import Auth from "./Auth.jsx";
import LoadingSkeleton from "./LoadingSkeleton.jsx";

export default function App() {
    const [user, setUser] = useState(undefined);
    const [comments, dispatch] = useReducer(reducer, []);
    const [modalState, setModalState] = useState({
        msg: "",
        headerMsg: "",
        isOpen: false,
        handleResponse: null,
    });

    let protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const [loadMessages, sendMessage] = useWebSocket(
        `${protocol}://${window.location.host}/comments`,
        dispatch,
    );

    const {
        isLoading: messagesLoading,
        data: messages,
        error,
    } = useQuery({
        queryKey: ["comments"],
        queryFn: async () => {
            return loadMessages();
        },
    });

    useEffect(() => {
        if (!messagesLoading && !error) {
            messages.forEach((message) => dispatch(message));
        }
    }, [messages, messagesLoading, error]);

    const { data: authenticatedUser } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const response = await fetch("/auth", { method: "POST" });
            if (response.status != 200) {
                console.log("Couldn't authenticate user");
                throw "Couldn't authenticate user";
            }

            return await response.json();
        },
        retry: 2,
    });

    const { error: signOutError, mutate: signOut } = useMutation({
        mutationFn: async (authenticatedUser) => {
            await fetch("/auth?signout=true", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(authenticatedUser),
            });
        },

        mutationKey: ["logout"],
    });

    useEffect(() => {
        if (authenticatedUser) setUser(authenticatedUser);
        if (signOutError) throw "Couldn't sign you out right now";
    }, [authenticatedUser, signOutError]);

    if (messagesLoading) {
        return <LoadingSkeleton />;
    } else if (error) {
        <div>Sorry an unexpected server error occured!!!</div>;
    }

    const showModal = (msg, headerMsg) => {
        return new Promise((resolve) => {
            setModalState(() => ({
                msg,
                headerMsg,
                isOpen: true,
                handleResponse: resolve,
            }));
        });
    };

    const closeModal = () => {
        setModalState(() => ({
            isOpen: false,
            msg: "",
            handleResponse: null,
        }));
    };

    const addComment = (comment) => {
        const data = {
            userID: user.id,
            content: comment,
            score: 0,
        };

        sendMessage({ type: "ADD_COMMENT", data });
    };

    const addReply = (reply, commentID) => {
        reply.userID = user.id;
        reply.commentID = commentID;

        sendMessage({
            type: "ADD_REPLY",
            data: reply,
        });
    };

    const deleteReply = async (replyID) => {
        let userSelection = await showModal(
            `Are you sure you want to remove this comment?
                This will remove the comment and can't be undone`,
            "Delete Comment",
        );

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

    const handleSignOut = async () => {
        const userSelection = await showModal(
            "Are you sure you want to sign out?",
            "Sign Out",
        );

        if (userSelection) {
            closeModal();
            signOut(authenticatedUser);
            setUser(null);
        } else closeModal();
    };

    return (
        <UserContext.Provider value={user}>
            <Modal
                mainMsg={modalState.msg}
                headerMsg={modalState.headerMsg}
                isOpen={modalState.isOpen}
                handleResponse={modalState.handleResponse}
            />
            <div className="min-h-screen w-full m-auto flex items-center justify-center max-w-screen-md px-5 py-2.5">
                <div className="w-full flex flex-col gap-4 items-center justify-center">
                    {comments?.length == 0 ? (
                        <span className="font-extrabold tracking-tighter md:text-7xl text-4xl px-8 py-4 my-6 rounded-md text-gray-400">
                            {"Be the first to say something"}
                        </span>
                    ) : (
                        <Comments
                            data={comments}
                            actions={{
                                addReply,
                                deleteReply,
                                editReply,
                                vote,
                            }}
                        />
                    )}
                    {user ? (
                        <div className="reply-form w-full bg-white-100 rounded-2xl p-5 relative">
                            <ReplyForm
                                keepOpen={true}
                                placeholder="Add a comment..."
                                user={user}
                                action={addComment}
                            />
                            <button
                                className="rounded-md text-xs bg-red-500 px-4 py-2 text-white-50 absolute right-0 -bottom-12 font-bold"
                                onClick={handleSignOut}
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <Auth
                            onAuthSuccess={(authenticatedUser) =>
                                setUser(authenticatedUser)
                            }
                        />
                    )}
                </div>
            </div>
        </UserContext.Provider>
    );
}
