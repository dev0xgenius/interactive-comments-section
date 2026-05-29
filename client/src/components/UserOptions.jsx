import { motion } from "motion/react";
import { UserContext } from "../utils/contexts/UserContext";
import { useContext } from "react";
import PropTypes from "prop-types";

function ActionButton({ icon, label, labelColor, onClick, ...rest }) {
    return (
        <motion.button
            className="flex items-center gap-2 cursor-pointer transition-opacity duration-150"
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.1 }}
            {...rest}
        >
            <i className="max-w-4 w-full min-w-min flex items-center">
                <img src={icon} width="100%" height="auto" alt={label} />
            </i>
            <span className={`font-semibold ${labelColor}`}>{label}</span>
        </motion.button>
    );
}

export default function UserOptions(props) {
    const loggedUser = useContext(UserContext);

    return loggedUser && props.user.username == loggedUser.username ? (
        <div className="flex justify-end items-center gap-4">
            <ActionButton
                icon="../../images/icon-delete.svg"
                label="Delete"
                labelColor="text-red-100"
                onClick={props.actions.deleteReply}
            />
            <ActionButton
                icon="../../images/icon-edit.svg"
                label="Edit"
                labelColor="text-blue-300"
                onClick={props.actions.editReply}
            />
        </div>
    ) : (
        <ActionButton
            icon="../../images/icon-reply.svg"
            label="Reply"
            labelColor="text-blue-300"
            onClick={props.actions.toggleForm}
        />
    );
}

ActionButton.propTypes = {
    icon: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    labelColor: PropTypes.string,
    onClick: PropTypes.func,
};

UserOptions.propTypes = {
    user: PropTypes.shape({
        username: PropTypes.string,
        image: PropTypes.shape({
            png: PropTypes.string,
        }),
    }),

    actions: PropTypes.shape({
        addReply: PropTypes.func,
        deleteReply: PropTypes.func,
        editReply: PropTypes.func,
        toggleForm: PropTypes.func,
    }),
};
