import { useMutation } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useState } from "react";
import { z } from "zod";
import FileInput from "./FileInput";
import { useEffect } from "react";

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

    const clearFormFields = () => {
        setPassword("");
        setConfirmedPassword("");
    };

    const {
        data: authData,
        error: authFailed,
        mutate: authenticate,
    } = useMutation({
        mutationFn: async (data) => {
            const requestUrl = "/auth";
            const request = new Request(requestUrl, {
                method: "POST",
                body: data,
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
                    console.log(response.statusText);
            }

            if (response.status == 200) {
                let authenticatedUser = await response.json();
                onAuthSuccess(authenticatedUser);
            }

            return;
        },
        mutationKey: ["auth"],
    });

    const handleSubmit = (evt) => {
        evt.preventDefault();
        const formData = new FormData(evt.target);
        const serializedData = {
            username,
            password,
        };

        const validateForm = formSchema.safeParse(serializedData);
        if (validateForm.error) {
            console.log(validateForm.error);
            return;
        }

        authenticate(formData);
    };

    useEffect(() => {
        if (authData) {
            clearFormFields();
        }

        return () => clearFormFields();
    }, [authData]);

    return (
        <div className="bg-white-100 self-end rounded-2xl p-8 mt-8 w-full md:w-max max-w-full">
            <div className="container w-full relative">
                {authFailed && (
                    <div className={"text-sm py-2 text-red-500"}>
                        {authFailed.message}
                    </div>
                )}

                <form
                    encType="multipart/form-data"
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
                                onChange={(evt) => {
                                    let updatedUsername = evt.target.value;
                                    updatedUsername = updatedUsername.replace(
                                        /\s/gi,
                                        "",
                                    );

                                    setUsername(updatedUsername);
                                }}
                            />
                            <Input
                                type="password"
                                placeholder="Enter Password"
                                name="password"
                                value={password}
                                onChange={(evt) =>
                                    setPassword(evt.currentTarget.value)
                                }
                            />
                        </div>
                        {authData?.signUp && (
                            <div className="flex md:flex-nowrap flex-wrap items-center justify-center gap-2">
                                <Input
                                    type="password"
                                    placeholder="Confirm Password"
                                    name="confirmedPassword"
                                    value={confirmedPassword}
                                    onChange={(evt) =>
                                        setConfirmedPassword(
                                            evt.currentTarget.value,
                                        )
                                    }
                                />
                                <FileInput />
                            </div>
                        )}
                    </main>
                    <button
                        type="submit"
                        className="bg-blue-700 p-4 rounded-md text-white-100 font-semibold"
                    >
                        Sign Up/Log In
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
