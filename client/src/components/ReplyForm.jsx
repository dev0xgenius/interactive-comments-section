import { motion } from "motion/react";
import PropTypes from "prop-types";

function Spinner() {
    return (
        <motion.span
            className="inline-block size-4 border-2 border-white-100/30 border-t-white-100 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
    );
}

export default function ReplyForm(props) {
    const submitReply = (formEvt) => {
        formEvt.preventDefault();
        let formData = new FormData(formEvt.target);
        let replyContent = formData.get("content");

        formEvt.target.querySelector("[name='content']").value = "";
        if (replyContent.trim() && props.action) props.action(replyContent);
    };

    return props.keepOpen ? (
        <motion.form
            className="grid gap-4 sticky bottom-0"
            onSubmit={submitReply}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
        >
            <textarea
                name="content"
                disabled={props.isSending}
                className="rounded-xl w-full border px-5 py-2.5
          sm:z-10 resize-none h-32
          focus:border-blue-300 focus:ring-2 focus:ring-blue-300/20 outline-0
          transition-all duration-150
          disabled:bg-white-80 disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder={props.placeholder || "Reply..."}
                defaultValue={props.content}
            ></textarea>
            <div className="flex justify-between gap-4 items-center">
                <span className="block size-10 rounded-full overflow-hidden shadow-sm">
                    <img
                        src={props.user.image.png}
                        width="100%"
                        height="auto"
                        className="w-full max-w-full object-cover"
                        alt={props.user.username}
                        onError={(e) => {
                            e.target.src =
                                "/images/avatars/default-user-avatar.png";
                            e.target.onerror = null;
                        }}
                    />
                </span>
                <motion.button
                    type="submit"
                    disabled={props.isSending}
                    className="rounded-xl bg-blue-300 max-w-28 w-full font-bold
          sm:z-10 text-white-100 p-4 cursor-pointer
          transition-all duration-150 hover:shadow-md hover:brightness-110
          disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:brightness-100"
                    whileTap={props.isSending ? {} : { scale: 0.98 }}
                >
                    {props.isSending ? (
                        <span className="flex items-center justify-center gap-2">
                            <Spinner />
                            Sending
                        </span>
                    ) : (
                        props.actionText || "SEND"
                    )}
                </motion.button>
            </div>
        </motion.form>
    ) : (
        <></>
    );
}

ReplyForm.propTypes = {
    actionText: PropTypes.string,
    content: PropTypes.string,
    action: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    keepOpen: PropTypes.bool.isRequired,
    isSending: PropTypes.bool,
    user: PropTypes.shape({
        image: PropTypes.shape({
            png: PropTypes.string.isRequired,
        }).isRequired,
        username: PropTypes.string.isRequired,
    }),
};
