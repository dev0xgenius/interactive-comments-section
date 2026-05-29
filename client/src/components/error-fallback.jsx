import { motion } from "motion/react";
import PropTypes from "prop-types";

export default function ErrorFallback({ error, resetErrorBoundary }) {
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
                    Unexpected Error
                </h2>
                <p className="text-blue-500 text-sm leading-relaxed">
                    Something went wrong. Please try again.
                </p>
                {error && (
                    <details className="w-full text-left">
                        <summary className="text-xs text-blue-500/60 cursor-pointer hover:text-blue-500 transition-colors">
                            Error details
                        </summary>
                        <pre className="mt-2 text-xs text-red-100 bg-red-100/5 rounded-lg p-3 overflow-x-auto">
                            {error.message || String(error)}
                        </pre>
                    </details>
                )}
                <motion.button
                    onClick={resetErrorBoundary}
                    className="mt-2 bg-blue-300 text-white-100 font-bold px-6 py-3 rounded-xl cursor-pointer transition-all duration-150 hover:shadow-md hover:brightness-110"
                    whileTap={{ scale: 0.98 }}
                >
                    Try Again
                </motion.button>
            </motion.div>
        </div>
    );
}

ErrorFallback.propTypes = {
    error: PropTypes.shape({
        message: PropTypes.string,
    }),
    resetErrorBoundary: PropTypes.func,
};
