import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext({}); //createContext() lets you create a context that components can provide or read.
// As empty, therefore is meant for "last resort" fallback.
//It's useful for passing state from a parent to a child component, no matter how nested the child is.

export function UserContextProvider({ children }) {
    const [loggedInUsername, setLoggedInUsername] = useState(null);
    const [loggedInId, setLoggedInId] = useState(null);

    //useEffect Hook allows you to perform side effects in your components e.g fetching data.
    //These effects are meant to be performed after every render/change but due to 2nd param being "[]", it will only run on the first render.
    useEffect(() => {
        axios.get("/profile").then(result => {
            setLoggedInId(result.data.userId);
            setLoggedInUsername(result.data.username);
        });
    }, []);

    return (
        <UserContext.Provider value={{ loggedInUsername, setLoggedInUsername, loggedInId, setLoggedInId }}>
            {children}
        </UserContext.Provider>
    );
}