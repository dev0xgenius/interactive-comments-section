import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

const AVATAR_COUNT = 4;
const AVATAR_BASE = "https://api.dicebear.com/10.x/adventurer/png";

function generateSeed(username) {
    const suffix = Math.random().toString(36).substring(2, 8);
    return `${username}-${suffix}`;
}

function createAvatarList(username) {
    return Array.from({ length: AVATAR_COUNT }, () => generateSeed(username));
}

function avatarUrl(seed) {
    return `${AVATAR_BASE}?seed=${encodeURIComponent(seed)}`;
}

function Skeleton({ isLoaded }) {
    return (
        <motion.div
            className={`size-16 rounded-full bg-gradient-to-r from-blue-200/10 via-white-50/50 to-blue-200/10 bg-[length:200%_100%] animate-shimmer shrink-0 ${
                isLoaded ? "hidden" : ""
            }`}
            initial={{ opacity: 1 }}
            animate={isLoaded ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
        />
    );
}

export default function AvatarPicker({ disabled, username }) {
    const [seeds, setSeeds] = useState(() => createAvatarList(username));
    const [selected, setSelected] = useState(seeds[0]);
    const [loaded, setLoaded] = useState(new Set());
    const inputRef = useRef(null);

    const allLoaded = loaded.size >= AVATAR_COUNT;

    const regenerate = useCallback(() => {
        const next = createAvatarList(username);
        setSeeds(next);
        setLoaded(new Set());
        setSelected(next[0]);
    }, [username]);

    useEffect(() => {
        regenerate();
    }, [regenerate]);

    const handleLoad = useCallback((seed) => {
        setLoaded((prev) => {
            const next = new Set(prev);
            next.add(seed);
            return next;
        });
    }, []);

    const handleSelect = useCallback(
        (seed) => {
            if (disabled) return;
            setSelected(seed);
        },
        [disabled],
    );

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.value = avatarUrl(selected);
        }
    }, [selected]);

    return (
        <motion.div
            className="flex flex-col items-center gap-3 w-full"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.2 }}
        >
            <input
                type="hidden"
                ref={inputRef}
                name="avatar"
                defaultValue={avatarUrl(selected)}
            />

            {!allLoaded && (
                <span className="text-xs text-blue-500/60 font-medium tracking-wide">
                    Loading avatars...
                </span>
            )}

            <div className="flex flex-wrap justify-center gap-3">
                {seeds.map((seed) => {
                    const isSelected = selected === seed;
                    const isLoaded = loaded.has(seed);

                    return (
                        <motion.button
                            key={seed}
                            type="button"
                            disabled={disabled}
                            onClick={() => handleSelect(seed)}
                            className={`relative size-16 rounded-full overflow-hidden border-2 transition-all duration-150 shrink-0 ${
                                disabled
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer"
                            } ${
                                isSelected
                                    ? "border-blue-300 shadow-md scale-105"
                                    : "border-transparent hover:border-blue-200/50"
                            }`}
                            whileTap={disabled ? {} : { scale: 0.95 }}
                        >
                            <Skeleton isLoaded={isLoaded} />

                            <motion.img
                                src={avatarUrl(seed)}
                                alt={`Avatar ${seed}`}
                                width={64}
                                height={64}
                                className={`absolute inset-0 size-full ${
                                    isLoaded ? "opacity-100" : "opacity-0"
                                }`}
                                initial={{ opacity: 0 }}
                                animate={
                                    isLoaded ? { opacity: 1 } : { opacity: 0 }
                                }
                                transition={{ duration: 0.3 }}
                                onLoad={() => handleLoad(seed)}
                                onError={() => handleLoad(seed)}
                                draggable={false}
                            />
                        </motion.button>
                    );
                })}
            </div>

            <motion.button
                type="button"
                disabled={disabled}
                onClick={regenerate}
                className="flex items-center gap-1.5 text-xs font-semibold text-blue-300 transition-all duration-150 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                whileTap={disabled ? {} : { scale: 0.95 }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0"
                >
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                </svg>
                Regenerate
            </motion.button>
        </motion.div>
    );
}

AvatarPicker.propTypes = {
    disabled: PropTypes.bool,
    username: PropTypes.string,
};

Skeleton.propTypes = {
    isLoaded: PropTypes.bool,
};
