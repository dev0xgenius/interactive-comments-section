import PropTypes from "prop-types";

export default function ErrorFallback({ error, resetErrorBoundary }) {
    return (
        <div role="alert" className="p-4  bg-red-100 text-red-700 rounded-md">
            {error}
            <p>An error occured</p>
            <button onClick={resetErrorBoundary}></button>
        </div>
    );
}

ErrorFallback.propTypes = {
    error: PropTypes.string.isRequired,
    resetErrorBoundary: PropTypes.func,
};
