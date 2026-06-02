import { motion } from "motion/react";
import PropTypes from "prop-types";

function Shimmer({ className = "" }) {
    return (
        <span
            className={`block rounded-full bg-gradient-to-r from-blue-200/10 via-white-50/50 to-blue-200/10 bg-[length:200%_100%] animate-shimmer ${className}`}
        />
    );
}

function SkeletonCard() {
    return (
        <motion.div
            className="rounded-2xl p-5 bg-white-100 shadow-card"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
        >
            <div className="flex flex-col sm:grid gap-4 sm:grid-cols-12 sm:grid-rows-1">
                <div className="content sm:col-start-2 sm:col-span-full flex flex-col gap-4 sm:row-start-1 sm:pl-5">
                    <header>
                        <div className="flex gap-4 items-center">
                            <span className="flex gap-4 items-center">
                                <Shimmer className="size-10 rounded-full" />
                                <Shimmer className="h-4 w-24 rounded" />
                                <Shimmer className="h-3 w-16 rounded" />
                            </span>
                        </div>
                    </header>
                    <main className="flex flex-col gap-2.5">
                        <Shimmer className="h-3.5 w-full rounded" />
                        <Shimmer className="h-3.5 w-4/5 rounded" />
                        <Shimmer className="h-3.5 w-3/5 rounded" />
                    </main>
                </div>
                <footer className="sm:col-start-1 sm:col-span-full sm:row-start-1">
                    <div className="flex justify-between sm:items-start">
                        <div className="rounded-full flex gap-2 p-2.5 bg-white-80 w-full max-w-28 sm:flex-col sm:w-16 sm:h-28 sm:self-center">
                            <Shimmer className="size-4 mx-auto rounded" />
                            <Shimmer className="h-5 w-8 mx-auto rounded" />
                            <Shimmer className="size-4 mx-auto rounded" />
                        </div>
                        <div className="flex items-center gap-4">
                            <Shimmer className="h-4 w-16 rounded" />
                        </div>
                    </div>
                </footer>
            </div>
        </motion.div>
    );
}

function SkeletonReplyCard() {
    return (
        <div className="border-l-2 border-blue-200/40 pl-5 sm:pl-12">
            <SkeletonCard />
        </div>
    );
}

function SkeletonReplyForm() {
    return (
        <motion.div
            className="rounded-2xl p-5 bg-white-100 shadow-card"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: 0.08 }}
        >
            <div className="flex flex-col gap-4">
                <Shimmer className="h-32 w-full rounded-xl" />
                <div className="flex justify-between items-center gap-4">
                    <Shimmer className="size-10 rounded-full" />
                    <Shimmer className="h-12 w-24 rounded-xl" />
                </div>
            </div>
        </motion.div>
    );
}

export default function LoadingSkeleton({ count = 2 }) {
    const cards = [];
    for (let i = 0; i < count; i++) {
        cards.push(
            <li key={i} className="flex flex-col gap-4">
                <SkeletonCard />
                <SkeletonReplyCard />
            </li>,
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center">
            <div className="w-full max-w-screen-md px-5 py-2.5">
                <ul className="flex flex-col gap-4 py-4">{cards}</ul>
                <SkeletonReplyForm />
            </div>
        </div>
    );
}

Shimmer.propTypes = {
    className: PropTypes.string,
};

LoadingSkeleton.propTypes = {
    count: PropTypes.number,
};
