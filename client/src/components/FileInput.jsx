import { useState } from "react";

export default function FileInput() {
    const [fileName, setFileName] = useState("");

    return (
        <label className="flex items-center gap-2 border-2 border-dashed border-blue-200 rounded-md p-2 cursor-pointer hover:border-blue-300 focus-within:border-blue-300 transition-colors text-sm text-blue-500 hover:text-blue-300 focus-within:text-blue-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span className="truncate max-w-[100px]">
                {fileName || "Upload Avatar"}
            </span>
            <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/png, image/jpeg"
                className="sr-only"
                onChange={(e) => {
                    const file = e.target.files[0];
                    setFileName(file ? file.name : "");
                }}
            />
        </label>
    );
}
