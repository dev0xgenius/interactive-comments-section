import { useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { z } from "zod";
import AvatarPicker from "./AvatarPicker";

function Input({ disabled, ...props }) {
    return (
        <span
            className={`border p-2 rounded-lg flex-grow transition-all duration-150 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-300/20 ${
                disabled
                    ? "border-blue-200/30 bg-white-80 opacity-60"
                    : "border-blue-200/60"
            }`}
        >
            <input
                type="text"
                className="outline-none border-none w-full bg-transparent"
                disabled={disabled}
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
        isPending: authPending,
        mutate: authenticate,
    } = useMutation({
        mutationFn: async (data) => {
            const requestUrl = "/auth";
            const request = new Request(requestUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
        const serializedData = {
            username,
            password,
            confirmedPassword,
            avatar: evt.target.avatar?.value,
        };

        const validateForm = formSchema.safeParse(serializedData);
        if (validateForm.error) {
            console.log(validateForm.error);
            return;
        }

        authenticate(JSON.stringify(serializedData));
    };

    useEffect(() => {
        if (authData) {
            clearFormFields();
        }

        return () => clearFormFields();
    }, [authData]);

    return (
        <motion.div
            className="bg-white-100 self-end rounded-2xl p-8 mt-8 w-full md:w-max max-w-full shadow-card"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
        >
            <div className="container w-full relative">
                {authFailed && (
                    <motion.div
                        className="text-sm py-2 text-red-100"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.1 }}
                    >
                        {authFailed.message}
                    </motion.div>
                )}

                <form
                    className="flex flex-col gap-6 max-w-lg"
                    onSubmit={handleSubmit}
                >
                    <h3 className="font-bold text-blue-600 text-lg">
                        {"Sign Up / Log In"}
                    </h3>
                    <main className="flex flex-wrap gap-4 items-center w-full">
                        <div className="flex flex-wrap gap-3 w-full">
                            <Input
                                placeholder="@johndoe"
                                name="username"
                                value={username}
                                disabled={authPending}
                                onChange={(evt) => {
                                    let updatedUsername = evt.target.value;
                                    updatedUsername = updatedUsername.replace(
                                        /\s/gi,
                                        "",
                                    );
                                    updatedUsername =
                                        updatedUsername.replace(
                                            /[^a-zA-Z0-9_-]/g,
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
                                disabled={authPending}
                                onChange={(evt) =>
                                    setPassword(evt.currentTarget.value)
                                }
                            />
                        </div>
                        {authData?.signUp && (
                            <motion.div
                                className="flex md:flex-nowrap flex-wrap items-center justify-center gap-3"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                transition={{ duration: 0.1 }}
                            >
                                <Input
                                    type="password"
                                    placeholder="Confirm Password"
                                    name="confirmedPassword"
                                    value={confirmedPassword}
                                    disabled={authPending}
                                    onChange={(evt) =>
                                        setConfirmedPassword(
                                            evt.currentTarget.value,
                                        )
                                    }
                                />
                                <AvatarPicker
                                    disabled={authPending}
                                    username={username}
                                />
                            </motion.div>
                        )}
                    </main>
                    <motion.button
                        type="submit"
                        disabled={authPending}
                        className="bg-blue-300 p-4 rounded-xl text-white-100 font-bold cursor-pointer
                          transition-all duration-150 hover:shadow-md hover:brightness-110
                          disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:brightness-100"
                        whileTap={authPending ? {} : { scale: 0.98 }}
                    >
                        {authPending ? (
                            <span className="flex items-center justify-center gap-2">
                                <motion.span
                                    className="inline-block size-4 border-2 border-white-100/30 border-t-white-100 rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 0.8,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                />
                                Signing in...
                            </span>
                        ) : (
                            "Sign Up / Log In"
                        )}
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
}

export default function Auth({ onAuthSuccess }) {
    return <AuthForm onAuthSuccess={onAuthSuccess} />;
}

Input.propTypes = {
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func,
};

Auth.propTypes = {
    onAuthSuccess: PropTypes.func,
};

AuthForm.propTypes = {
    onAuthSuccess: PropTypes.func,
};
