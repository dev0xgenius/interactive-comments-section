import PropType from "prop-types";
import { useState } from "react";

export default function FileInput() {
    const [file, setFile] = useState(undefined);

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
                value={file}
                onChange={(evt) => {
                    console.log(evt.currentTarget.value);
                    setFile(evt.currentTarget.value);
                }}
            />
        </span>
    );
}

FileInput.PropType = PropType.shape({});
