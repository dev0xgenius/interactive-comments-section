import { useEffect, useRef } from "react";

export default function useWebSocket(url, handleMessage) {
    let resolveInitialMessages = null;
    const messagesPromise = useRef(
        new Promise((resolve) => {
            resolveInitialMessages = resolve;
        }),
    );
    const messageHandler = useRef(null);

    const loadMessages = () => messagesPromise.current;

    useEffect(() => {
        const websocket = new WebSocket(url);

        websocket.onopen = () => {
            messageHandler.current = (data) => {
                websocket.send(
                    JSON.stringify({
                        type: "chat",
                        payload: data,
                        timestamp: Date.now(),
                    }),
                );
            };
        };

        websocket.onmessage = (event) => {
            if (event.data) {
                const data = JSON.parse(event.data);

                if (resolveInitialMessages) {
                    resolveInitialMessages(data);
                    resolveInitialMessages = null;
                } else {
                    handleMessage(data);
                }
            }
        };

        websocket.onerror = () => {
            console.error("WebSocket connection error");
        };

        return () => {
            websocket.close();
        };
    }, [url, handleMessage]);

    return [loadMessages, messageHandler.current];
}
