import { useEffect, useRef } from "react";

export default function useWebSocket(url, handleMessage) {
    let initialMessage = useRef(null);
    let messageHandler = useRef((data) =>
        console.log(
            "Nothing to do with ",
            JSON.stringify(data),
            " at this moment..."
        )
    );

    const getInitialMessage = () => {
        return new Promise((resolve, reject) => {
            let t = setInterval(() => {
                if (initialMessage.current != null) {
                    clearInterval(t);
                    resolve(initialMessage.current);
                }
            }, 500);

            setTimeout(() => {
                if (initialMessage.current) {
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
                if (typeof data == "string") websocket.send(data);
                else websocket.send(JSON.stringify(data));
            };
        };

        websocket.addEventListener(
            "message",
            (event) => {
                if (event.data != undefined)
                    initialMessage.current = JSON.parse(event.data);

                websocket.addEventListener("message", (event) => {
                    const { data } = event;
                    handleMessage(JSON.parse(data));
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
    }, [initialMessage, handleMessage, url]);

    return [getInitialMessage, messageHandler.current];
}
