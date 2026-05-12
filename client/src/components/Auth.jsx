import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { z } from "zod";
import FileInput from "./FileInput";

function Input(props) {
    return (
        <span className="border-2 p-2 rounded-md focus-within:border-black focus-within:border flex-grow">
            <input
                type="text"
                className="outline-none border-none"
                {...props}
            />
        </span>
    );
}

const formSchema = z.object({
    username: z.string(),
    password: z.string(),
});

function AuthForm({ onAuthSuccess }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");

    const {
        data,
        error: authFailed,
        mutate,
    } = useMutation({
        mutationFn: async (data) => {
            const requestUrl = "/auth";
            const request = new Request(requestUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const response = await fetch(request);
            switch (response.status) {
                case 400:
                    throw new Error(await response.text());
                case 401:
                    return { signUp: true };
                case 403:
                    throw new Error("Invalid Credentials...");
                default:
                    console.log(response.status);
            }

            if (response.status == 200) {
                let authenticatedUser = await response.json();
                onAuthSuccess(authenticatedUser);
            } else if (response.status == 204) {
                console.log("User logged in successfully");
            }

            return;
        },
    });

    const handleSubmit = (evt) => {
        evt.preventDefault();
        let formData = new FormData(evt.currentTarget);

        const serializedData = {};
        for (let [key, value] of formData) serializedData[key] = value;

        const validateForm = formSchema.safeParse(serializedData);
        if (validateForm.error) {
            console.log(validateForm.error);
            return;
        }

        mutate(serializedData);
    };

    return (
        <div className="bg-white-100 self-end rounded-2xl p-8 mt-8 w-full md:w-max max-w-full">
            <div className="container w-full relative">
                {authFailed && (
                    <div className={"text-sm py-2 text-red-500"}>
                        {authFailed.message}
                    </div>
                )}

                <form
                    className="flex flex-col gap-6 max-w-lg"
                    onSubmit={handleSubmit}
                >
                    <h3 className="font-bold text-blue-700">
                        {"Sign Up/Log In"}
                    </h3>
                    <main className="flex flex-wrap gap-4 items-center w-full">
                        <div className="flex flex-wrap gap-2 w-full">
                            <Input
                                placeholder="@johndoe"
                                name="username"
                                value={username}
                                onChange={(evt) =>
                                    setUsername(evt.currentTarget.value)
                                }
                            />
                            <Input
                                type="password"
                                placeholder="Enter Password"
                                name="password"
                                onChange={(evt) =>
                                    setPassword(evt.currentTarget.value)
                                }
                                value={password}
                            />
                        </div>
                        {data?.signUp && (
                            <div className="flex md:flex-nowrap flex-wrap items-center justify-center gap-2">
                                <Input
                                    type="password"
                                    placeholder="Confirm Password"
                                    name="confirmedPassword"
                                    onChange={(evt) =>
                                        setConfirmedPassword(
                                            evt.currentTarget.value,
                                        )
                                    }
                                    value={confirmedPassword}
                                />
                                <FileInput />
                            </div>
                        )}
                    </main>
                    <button
                        type="submit"
                        className="bg-blue-700 p-4 rounded-md text-white-100 font-semibold"
                    >
                        Sign Up/Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function Auth({ onAuthSuccess }) {
    return <AuthForm onAuthSuccess={onAuthSuccess} />;
}

Auth.propTypes = {
    onAuthSuccess: PropTypes.func,
};

AuthForm.propTypes = {
    onAuthSuccess: PropTypes.func,
};
