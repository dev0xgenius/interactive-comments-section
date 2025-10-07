const LoadingSkeleton = () => {
    return (
        <div className="border-2 border-red-700 flex absolute top-0 left-0 right-0 bottom-0">
            <div className="w-full h-auto p-5 flex flex-col gap-4">
                <div className="animate-pulse w-full max-w-3xl min-h-40 bg-white-100 rounded-2xl m-auto" />
                <div className="pl-12 border-l-2 w-full max-w-3xl m-auto">
                    <div className="animate-pulse w-full max-w-3xl min-h-40 bg-white-100 rounded-2xl m-auto" />
                </div>
                <div className="animate-pulse w-full max-w-3xl min-h-40 bg-white-100 rounded-2xl m-auto" />
                <div className="pl-12 border-l-2 w-full max-w-3xl m-auto">
                    <div className="animate-pulse w-full max-w-3xl min-h-40 bg-white-100 rounded-2xl m-auto" />
                </div>
            </div>
        </div>
    );
};

export default LoadingSkeleton;
