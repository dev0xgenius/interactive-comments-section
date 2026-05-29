import { motion } from "motion/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useReducer, useState } from "react";
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
    const queryClient = useQueryClient();
    const [user, setUser] = useState(undefined);
    const [comments, dispatch] = useReducer(reducer, []);
    const [signOutErrorMsg, setSignOutErrorMsg] = useState(null);
    const [isSending, setIsSending] = useState(false);
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

    const { data: authenticatedUser, isLoading: authLoading } = useQuery({
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
            await fetch("/auth/signout", {
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
    }, [authenticatedUser]);

    useEffect(() => {
        if (signOutError) {
            setSignOutErrorMsg("Couldn't sign you out right now");
        }
    }, [signOutError]);

    useEffect(() => {
        if (signOutErrorMsg) {
            showModal(signOutErrorMsg, "Error").then(() => {
                setSignOutErrorMsg(null);
                closeModal();
            });
        }
    }, [signOutErrorMsg]);

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

    const addComment = useCallback(
        (comment) => {
            const data = {
                userID: user.id,
                content: comment,
                score: 0,
            };

            setIsSending(true);
            sendMessage({ type: "ADD_COMMENT", data });
            setTimeout(() => setIsSending(false), 600);
        },
        [user, sendMessage],
    );

    const addReply = useCallback(
        (reply, commentID) => {
            reply.userID = user.id;
            reply.commentID = commentID;

            setIsSending(true);
            sendMessage({
                type: "ADD_REPLY",
                data: reply,
            });
            setTimeout(() => setIsSending(false), 600);
        },
        [user, sendMessage],
    );

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

    if (messagesLoading) {
        return <LoadingSkeleton />;
    } else if (error) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center px-5">
                <motion.div
                    className="bg-white-100 rounded-2xl p-8 shadow-modal max-w-md w-full text-center flex flex-col items-center gap-4"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.12, ease: "easeOut" }}
                >
                    <div className="size-14 rounded-full bg-red-100/10 flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#ed6468"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-blue-600">
                        Something went wrong
                    </h2>
                    <p className="text-blue-500 text-sm leading-relaxed">
                        We couldn&apos;t load the comments. This might be a
                        network issue or the server is temporarily unavailable.
                    </p>
                    <motion.button
                        onClick={() =>
                            queryClient.refetchQueries({
                                queryKey: ["comments"],
                            })
                        }
                        className="mt-2 bg-blue-300 text-white-100 font-bold px-6 py-3 rounded-xl cursor-pointer transition-all duration-150 hover:shadow-md hover:brightness-110"
                        whileTap={{ scale: 0.98 }}
                    >
                        Try Again
                    </motion.button>
                </motion.div>
            </div>
        );
    }

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
                        <motion.span
                            className="font-extrabold tracking-tight md:text-5xl text-3xl px-8 py-6 my-8 rounded-2xl text-blue-500/40 select-none"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {"Be the first to say something"}
                        </motion.span>
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
                        <div className="reply-form w-full bg-white-100 rounded-2xl p-5 relative shadow-card">
                            <ReplyForm
                                keepOpen={true}
                                placeholder="Add a comment..."
                                user={user}
                                action={addComment}
                                isSending={isSending}
                            />
                            <motion.button
                                className="rounded-lg text-xs bg-red-100 px-4 py-2 text-white-100 absolute right-0 -bottom-12 font-bold cursor-pointer transition-all duration-150 hover:shadow-md hover:brightness-110"
                                onClick={handleSignOut}
                                whileTap={{ scale: 0.98 }}
                            >
                                Sign Out
                            </motion.button>
                        </div>
                    ) : authLoading ? (
                        <motion.div
                            className="bg-white-100 rounded-2xl p-8 mt-8 w-full self-end md:w-10/12 max-w-full shadow-card"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                        >
                            <div className="flex flex-col gap-6 max-w-lg mx-auto">
                                <div className="h-5 w-40 rounded bg-gradient-to-r from-blue-200/10 via-white-50/50 to-blue-200/10 bg-[length:200%_100%] animate-shimmer" />
                                <div className="flex flex-col gap-3">
                                    <div className="h-10 w-full rounded-lg bg-gradient-to-r from-blue-200/10 via-white-50/50 to-blue-200/10 bg-[length:200%_100%] animate-shimmer" />
                                    <div className="h-10 w-full rounded-lg bg-gradient-to-r from-blue-200/10 via-white-50/50 to-blue-200/10 bg-[length:200%_100%] animate-shimmer" />
                                </div>
                                <div className="h-12 w-full rounded-xl bg-gradient-to-r from-blue-200/10 via-white-50/50 to-blue-200/10 bg-[length:200%_100%] animate-shimmer" />
                            </div>
                        </motion.div>
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
