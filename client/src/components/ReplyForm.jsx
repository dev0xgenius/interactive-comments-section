import PropTypes from "prop-types";

export default function ReplyForm(props) {
  const submitReply = (formEvt) => {
    formEvt.preventDefault();
    let formData = new FormData(formEvt.target);
    let replyContent = formData.get("content");

    formEvt.target.querySelector("[name='content']").value = "";
    if (replyContent.trim() && props.action) props.action(replyContent);
  };

  return props.keepOpen ? (
    <form className="grid gap-4" onSubmit={submitReply}>
      <textarea
        name="content"
        className="rounded-xl w-full border px-5 py-2.5 
          sm:z-10 resize-none h-32 
          focus:border-blue-300 focus:border-2 outline-0"
        placeholder={props.placeholder || "Reply..."}
        defaultValue={props.content}
      ></textarea>
      <div className="flex justify-between items-center">
        <span className="inline-block w-8">
          {props.user.image ? (
            <img src={props.user.image.png} width="100%" height="auto" />
          ) : (
            <></>
          )}
        </span>
        <button
          type="submit"
          className="rounded-xl bg-blue-300 max-w-24 w-full font-bold 
          sm:z-10 text-white-100 p-4 hover:opacity-80"
        >
          {props.actionText || "SEND"}
        </button>
      </div>
    </form>
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
  user: PropTypes.shape({
    image: PropTypes.shape({
      png: PropTypes.string.isRequired,
      webp: PropTypes.string.isRequired,
    }),
    username: PropTypes.string.isRequired,
  }),
};
