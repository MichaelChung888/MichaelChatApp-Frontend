import RegisterLoginForm from "./RegisterLoginForm";
import { useContext } from 'react';
import { UserContext } from "./UserContext";
import Chat from "./Chat";

export default function Routes() {
    const { loggedInUsername, loggedInId } = useContext(UserContext);


    if (loggedInUsername) {
        return <Chat />
    }

    return (
        <RegisterLoginForm />
    )
}