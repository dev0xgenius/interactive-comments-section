import { UserContext } from "../utils/contexts/UserContext";
import { useContext } from "react";
import PropTypes from "prop-types";

export default function UserOptions(props) {
  const loggedUser = useContext(UserContext);

  return props.user.username == loggedUser.username ? (
    <div className="flex items-center gap-4">
      <button
        className="flex items-center gap-2 hover:opacity-80"
        onClick={props.actions.deleteReply}
      >
        <i className="max-w-4 w-full min-w-min">
          <img src="../../images/icon-delete.svg" width="100%" height="auto" />
        </i>
        <span className="font-semibold text-red-100">Delete</span>
      </button>
      <button
        className="flex items-center gap-2 hover:opacity-80"
        onClick={props.actions.editReply}
      >
        <i className="max-w-4 w-full">
          <img src="../../images/icon-edit.svg" width="100%" height="auto" />
        </i>
        <span className="font-semibold text-blue-300">Edit</span>
      </button>
    </div>
  ) : (
    <button
      className="flex items-center gap-2 hover:opacity-80"
      onClick={props.toggleForm}
    >
      <i className="max-w-4 w-full">
        <img src="../../images/icon-reply.svg" width="100%" height="auto" />
      </i>
      <span className="font-semibold text-blue-300">Reply</span>
    </button>
  );
}

UserOptions.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    image: PropTypes.shape({
      png: PropTypes.string,
    }),
  }),

  toggleForm: PropTypes.func,
  actions: PropTypes.shape({
    addReply: PropTypes.func,
    deleteReply: PropTypes.func,
    editReply: PropTypes.func,
  }),
};

