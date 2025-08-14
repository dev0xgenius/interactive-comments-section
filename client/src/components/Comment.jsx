import PropTypes from "prop-types";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../utils/contexts/UserContext.js";
import { elapsedString } from "../utils/time.js";
import { generateID } from "../utils/helpers.js";
import Counter from "./Counter";
import ReplyForm from "./ReplyForm.jsx";
import UserOptions from "./UserOptions.jsx";
import UserTag from "./UserTag.jsx";

export default function Comment(props) {
	const loggedUser = useContext(UserContext);
	const [editForm, setEditForm] = useState(false);
	const [formState, setFormState] = useState({
		isOpen: false,
		action: () => {},
		actionText: "",
		placeholder: "",
		content: "",
		user: { username: "" },
	});

	const upVote = () => props.actions.vote(1, props.id);
	const downVote = () => props.actions.vote(-1, props.id);
	const openForm = () => setFormState((fs) => ({ ...fs, isOpen: true }));
	const closeForm = () => setFormState((fs) => ({ ...fs, isOpen: false }));

	const toggleForm = () => {
		let formOpen = formState.isOpen;
		formOpen ? closeForm() : openForm();
	};

	const toggleEditForm = () => setEditForm((bool) => !bool);

	const addReply = useCallback(
		(replyText) => {
			replyText = replyText.replace(/(^@[0-9a-z]+,?)/, "").trim();

			const newReply = {
				id: generateID(props.replies || props.siblings),
				content: replyText,
				score: 0,
				replyingTo: props.user.username,
			};

			closeForm();
			if (replyText)
				props.actions.addReply(newReply, props.commentID || props.id);
		},
		[props],
	);

	const deleteReply = () => props.actions.deleteReply(props.id);

	const handleEditedReply = (editedReply) => {
		toggleEditForm();
		editedReply = editedReply.replace(/(^@[0-9a-z]+,?)/, "");
		if (editedReply.trim()) props.actions.editReply(editedReply, props.id);
	};

	const editReply = () => {
		let content =
			typeof props.content == "object"
				? props.content.props.children[1]
				: props.content;

		if (props.replyingTo) content = `@${props.replyingTo}, ${content.trim()}`;

		setFormState((fs) => ({
			...fs,
			isOpen: !editForm,
			actionText: "UPDATE",
			action: handleEditedReply,
			placeholder: "Edit Your Comment...",
			content: content,
			user: { ...loggedUser, image: "" },
		}));

		toggleEditForm();
	};

	const contentJSX = (replyingTo, replyText) => (
		<>
			<span className="author text-blue-300">{`@${replyingTo}, `}</span>
			{`${replyText}`}
		</>
	);

	useEffect(() => {
		setFormState((fs) => ({
			...fs,
			user: loggedUser,
			content: `@${props.user.username}, `,
			action: addReply,
			actionText: "REPLY",
		}));
	}, [loggedUser, addReply, props.user.username]);

	return (
		<div className="flex flex-col gap-4">
			<div className="comment rounded-2xl p-5 bg-white-100 h-max">
				<div
					className="flex flex-col sm:grid gap-4 h-max
          sm:grid-cols-12 sm:grid-rows-1"
				>
					<div
						className="content sm:col-start-2 sm:col-span-full 
            flex flex-col gap-4 sm:row-start-1 sm:pl-5"
					>
						<header>
							<div className="comment-info flex gap-4 items-center">
								<UserTag user={props.user} />
								<span className="text-blue-500">
									{elapsedString(new Date(props.createdAt))}
								</span>
							</div>
						</header>
						<main className="w-full">
							{editForm ? (
								<ReplyForm
									keepOpen={formState.isOpen}
									action={formState.action}
									content={formState.content}
									placeholder={formState.placeholder}
									actionText={formState.actionText}
									user={formState.user}
								/>
							) : (
								<p className="text-blue-500 overflow-x-auto">
									{props.replyingTo
										? contentJSX(props.replyingTo, props.content)
										: props.content}
								</p>
							)}
						</main>
					</div>
					<footer className="sm:col-start-1 sm:col-span-full sm:row-start-1">
						<div className="comment-actions w-full flex justify-between sm:items-start">
							<Counter
								count={props.score}
								onPlusClick={upVote}
								onMinusClick={downVote}
							/>
							<UserOptions
								user={props.user}
								toggleForm={toggleForm}
								actions={{ deleteReply, editReply }}
							/>
						</div>
					</footer>
				</div>
			</div>
			{loggedUser.username === props.user.username ? (
				<></>
			) : (
				<div
					className={
						formState.isOpen
							? "reply-form bg-white-100 rounded-2xl p-5 w-full"
							: "hidden"
					}
				>
					<ReplyForm
						keepOpen={formState.isOpen}
						action={formState.action}
						content={formState.content}
						placeholder={formState.placeholder}
						actionText={formState.actionText}
						user={formState.user}
					/>
				</div>
			)}
		</div>
	);
}

Comment.propTypes = {
	id: PropTypes.number.isRequired,
	content: PropTypes.string.isRequired,
	createdAt: PropTypes.number.isRequired,
	score: PropTypes.number.isRequired,

	replyingTo: PropTypes.string, // For Comment as Reply
	commentID: PropTypes.number, // For Comment as Reply
	siblings: PropTypes.arrayOf(
		// For comment as Reply
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			content: PropTypes.string.isRequired,
			createdAt: PropTypes.number.isRequired,
			score: PropTypes.number.isRequired,
			replyingTo: PropTypes.string.isRequired,

			user: PropTypes.shape({
				image: PropTypes.shape({
					png: PropTypes.string,
					webp: PropTypes.string,
				}),
				username: PropTypes.string,
			}).isRequired,
		}),
	),

	replies: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			content: PropTypes.string.isRequired,
			createdAt: PropTypes.number.isRequired,
			score: PropTypes.number.isRequired,
			replyingTo: PropTypes.string.isRequired,

			user: PropTypes.shape({
				image: PropTypes.shape({
					png: PropTypes.string,
					webp: PropTypes.string,
				}),
				username: PropTypes.string,
			}).isRequired,
		}),
	),

	user: PropTypes.shape({
		image: PropTypes.shape({
			png: PropTypes.string,
			webp: PropTypes.string,
		}),
		username: PropTypes.string,
	}).isRequired,

	actions: PropTypes.shape({
		handleReply: PropTypes.func,
		editReply: PropTypes.func,
		deleteReply: PropTypes.func,
		addReply: PropTypes.func,
		vote: PropTypes.func,
	}).isRequired,
};
