import { useRef } from "react";
import { useEffect } from "react";

export default function useWebSocket(url) {
  let initialMessage = useRef(null);
  let messageHandler = useRef((data) =>
    console.log(
      "Nothing to do with ",
      JSON.stringify(data),
      " at this moment...",
    ),
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
      console.log("I active die!!!");
      messageHandler.current = websocket.send;
    };

    websocket.addEventListener(
      "message",
      (event) => {
        if (event.data != undefined)
          initialMessage.current = JSON.parse(event.data);

        websocket.addEventListener("message", (event) => {
          const data = event.data;
          console.log(`Received Message: ${data}`);
        });
      },
      { once: true },
    );

    return () => {
      websocket.close();
    };
  }, [initialMessage, url]);

  return [getInitialMessage, messageHandler.current];
}
