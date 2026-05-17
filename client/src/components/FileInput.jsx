import PropType from "prop-types";

export default function FileInput() {
    return (
        <span>
            <label htmlFor="avatar">Upload an Avatar</label>
            <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/png, image/jpeg"
                placeholder="Upload An Avatar*"
                alt="Upload an Avatar"
                className="overflow-clip w-full block"
            />
        </span>
    );
}

FileInput.PropType = PropType.shape({});
