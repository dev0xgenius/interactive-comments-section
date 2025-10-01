import { useEffect, useRef } from "react";

export default function useWebSocket(url, handleMessage) {
    let messages = useRef(null);
    let messageHandler = useRef((data) =>
        console.log(
            "Nothing to do with ",
            JSON.stringify(data),
            " at this moment..."
        )
    );

    const loadMessages = () => {
        return new Promise((resolve, reject) => {
            let t = setInterval(() => {
                if (messages.current != null) {
                    clearInterval(t);
                    resolve(messages.current);
                }
            }, 500);

            setTimeout(() => {
                if (messages.current) {
                    clearInterval(t);
                    return;
                }

                clearInterval(t);
                reject("Timeout: Couldn't fetch data within 5 seconds");
            }, 3000);
        });
    };

    useEffect(() => {
        const websocket = new WebSocket(url);

        websocket.onopen = () => {
            messageHandler.current = (data) => {
                data = {
                    type: "chat",
                    payload: data,
                    timestamp: Date.now(),
                };

                websocket.send(JSON.stringify(data));
            };
        };

        websocket.addEventListener(
            "message",
            (event) => {
                if (event.data != undefined) {
                    messages.current = JSON.parse(event.data);
                }

                websocket.addEventListener("message", (event) => {
                    const { data } = event;
                    if (data) handleMessage(JSON.parse(data));
                });
            },
            { once: true }
        );

        websocket.onerror = () => {
            console.error("Unable to fetch data...");
        };

        return () => {
            websocket.close();
        };
    }, [messages, handleMessage, url]);

    return [loadMessages, messageHandler.current];
}
