import { useMutation } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { z } from "zod";

function Input(props) {
    return (
        <span className="border-2 p-2 rounded-md focus-within:border-black focus-within:border flex-grow">
            <input
                type="text"
                {...props}
                className="outline-none border-none"
            />
        </span>
    );
}

const formSchema = z.object({
    username: z.string(),
    password: z.string(),
});

function AuthForm({ onAuthSuccess }) {
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

            let authenticatedUser = await response.json();
            onAuthSuccess(authenticatedUser);

            return {};
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
        <div className="bg-white-100 rounded-md p-8 mt-8 m-auto w-max max-w-full">
            <div className="container w-full relative">
                {authFailed && (
                    <div className="text-sm py-2 text-red-500">
                        {authFailed.message}
                    </div>
                )}

                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    <h3 className="font-bold text-blue-700">
                        {"Sign Up/Log In"}
                    </h3>
                    <main className="flex flex-wrap gap-2 w-full">
                        <Input placeholder="@johndoe" name="username" />
                        <Input
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                        />
                        {data?.signUp && (
                            <Input
                                type="password"
                                placeholder="Confirm Password"
                                name="confirmedPassword"
                            />
                        )}
                    </main>
                    <button className="bg-blue-700 p-4 rounded-md text-white-100 font-semibold">
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
