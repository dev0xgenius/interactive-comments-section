import { createContext } from "react";

export const UserContext = createContext({
  image: { 
      png: "",
      webp: ""
    },
    username: "juliusomo"
});