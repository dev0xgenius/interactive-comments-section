import { motion } from "motion/react";
import { UserContext } from "../utils/contexts/UserContext";
import { useContext } from "react";
import PropTypes from "prop-types";

export default function UserTag({ user }) {
    const loggedUser = useContext(UserContext);

    return (
        <span className="user flex gap-4 items-center">
            <span className="block size-10 rounded-full overflow-hidden shadow-sm">
                <img
                    src={user.image.png}
                    width="100%"
                    height="auto"
                    alt={user.username}
                    onError={(e) => {
                        e.target.src =
                            "/images/avatars/default-user-avatar.png";
                        e.target.onerror = null;
                    }}
                />
            </span>
            <span className="flex gap-2 justify-center items-center">
                <span className="author">{user.username}</span>
                {user.username === loggedUser?.username ? (
                    <motion.span
                        className="bg-blue-300 text-white-100 text-sm
              rounded-sm px-2 py-0.25 pb-0.5 font-bold tracking-wider"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.15 }}
                    >
                        you
                    </motion.span>
                ) : (
                    <></>
                )}
            </span>
        </span>
    );
}

UserTag.propTypes = {
    user: PropTypes.shape({
        username: PropTypes.string,
        image: PropTypes.shape({
            png: PropTypes.string,
        }),
    }),
};
