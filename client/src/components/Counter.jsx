import { AnimatePresence, motion } from "motion/react";
import PropTypes from "prop-types";
import { useRef } from "react";
import minusIcon from "/images/icon-minus.svg";
import plusIcon from "/images/icon-plus.svg";

export default function Counter({
    count,
    onMinusClick,
    onPlusClick,
    disabled,
}) {
    const prev = useRef(count);
    const direction = count > prev.current ? "up" : "down";
    prev.current = count;

    const scoreColor =
        count < 0
            ? "text-red-100"
            : count > 0
              ? "text-blue-300"
              : "text-blue-500";

    const btnBase =
        "flex items-center justify-center min-w-8 min-h-8 rounded-full transition-all duration-150 outline-none";
    const interactive = "cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-300/40";
    const nonInteractive = "opacity-30 cursor-default";

    const upBtn = `${btnBase} ${disabled ? nonInteractive : `${interactive} hover:bg-blue-300/10 group`}`;
    const downBtn = `${btnBase} ${disabled ? nonInteractive : `${interactive} hover:bg-red-100/10 group`}`;

    return (
        <div
            role="group"
            aria-label="Voting"
            className="rounded-xl flex gap-1 p-2 bg-white-80
                max-w-32 w-full justify-around items-center
                sm:flex-col sm:w-16 sm:h-28 sm:self-center shadow-counter"
        >
            <button
                className={upBtn}
                onClick={disabled ? undefined : onPlusClick}
                aria-label="Upvote"
                tabIndex={disabled ? -1 : 0}
            >
                <img
                    src={plusIcon}
                    width="12"
                    height="12"
                    alt=""
                    className="pointer-events-none"
                />
            </button>

            <div className="relative min-w-[2ch] text-center">
                <AnimatePresence mode="popLayout">
                    <motion.span
                        key={count}
                        className={`font-extrabold text-lg select-none block ${scoreColor}`}
                        initial={{
                            y: direction === "up" ? 8 : -8,
                            opacity: 0,
                        }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{
                            y: direction === "up" ? -8 : 8,
                            opacity: 0,
                        }}
                        transition={{ duration: 0.1, ease: "easeOut" }}
                    >
                        {count}
                    </motion.span>
                </AnimatePresence>
            </div>

            <button
                className={downBtn}
                onClick={disabled ? undefined : onMinusClick}
                aria-label="Downvote"
                tabIndex={disabled ? -1 : 0}
            >
                <img
                    src={minusIcon}
                    width="12"
                    height="12"
                    alt=""
                    className="pointer-events-none"
                />
            </button>
        </div>
    );
}

Counter.propTypes = {
    count: PropTypes.number.isRequired,
    onMinusClick: PropTypes.func.isRequired,
    onPlusClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};
