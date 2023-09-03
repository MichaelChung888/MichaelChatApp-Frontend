import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "./UserContext"

const MessageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
        <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
        <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
    </svg>
);

const Reasons = {
    "emptyUserPass": "Please fill out this field",
    "emptyUser": "Please fill out this field",
    "emptyPass": "Please fill out this field",
    "incorrect": "Incorrect Username or Password",
    "nameUsed": "Name is already taken",
    "notFound": "Account not found"
}

export default function RegisterLoginForm() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [incorrectUserPass, setIncorrectUserPass] = useState("");
    const [isLoginOrRegister, setIsLoginOrRegister] = useState("login")
    const { setLoggedInUsername, setLoggedInId } = useContext(UserContext);

    async function handleSubmit(e) {
        e.preventDefault();
        if (username === "" && password === "") {
            setIncorrectUserPass("emptyUserPass");
        }
        else if (username === "") {
            setIncorrectUserPass("emptyUser");
        }
        else if (password === "") {
            setIncorrectUserPass("emptyPass");
        }
        else {
            await axios.post(isLoginOrRegister, { username, password }).then(res => {
                setLoggedInUsername(username);
                setLoggedInId(res.data.id);
                setIncorrectUserPass("");
            }).catch(err => {
                const reason = err.response.data; //incorrect, nameUsed, notFound
                setIncorrectUserPass(reason);
            });
        }

        //This will send the form data to the server and respond with userId if successful
    }



    /*
    mx=margin   
    h=height    
    w=width
    bg=background where the 50 is brightness level(range 0-1000)
    rounded=border-radius
    p=padding
    mb=margin-bottom
    */

    const usernameError = ["emptyUserPass", "emptyUser", "incorrect", "nameUsed", "notFound"].includes(incorrectUserPass);
    const passwordError = ["emptyUserPass", "incorrect", "emptyPass"].includes(incorrectUserPass);

    return (
        <div className="bg-blue-50 h-screen flex items-center">
            <form className="w-80 mx-auto mb-12" onSubmit={handleSubmit}>
                <div className="text-blue-600 font-bold flex gap-2 p-4 items-center text-2xl justify-center mr-4">
                    <MessageIcon />
                    MichaelChatApp
                </div>
                <input value={username}
                    onChange={e => setUsername(e.target.value)} //Takes the element's value and updates the state
                    type="text" placeholder="username"
                    className={"block w-full rounded-sm p-3 mb-3 border-2 " + (usernameError ? "border-red-500" : "")} />

                {usernameError && (
                    <div className="text-center mb-3 text-red-500 font-bold">
                        {Reasons[incorrectUserPass]}
                    </div>
                )}

                <input value={password}
                    onChange={e => setPassword(e.target.value)}
                    type="password" placeholder="password"
                    className={"block w-full rounded-sm p-3 mb-3 border-2 " + (passwordError ? "border-red-500" : "")} />

                {passwordError && (
                    <div className="text-center mb-3 text-red-500 font-bold">
                        {Reasons[incorrectUserPass]}
                    </div>
                )}

                <button className="bg-blue-500 text-white block w-full rounded-sm p-3">
                    {isLoginOrRegister === "register" ? "Register" : "Login"}
                </button>
                <div className="text-center mt-5">
                    {isLoginOrRegister === "register" && (
                        <>
                            <div>Already a member?</div>
                            <button onClick={() => { setIsLoginOrRegister("login"); setIncorrectUserPass(""); }}><span className="font-bold underline">Login here</span></button>
                        </>
                    )}
                    {isLoginOrRegister === "login" && (
                        <>
                            <div>Don't have an account?</div>
                            <button onClick={() => { setIsLoginOrRegister("register"); setIncorrectUserPass(""); }}><span className="font-bold underline">Register here</span></button>
                        </>

                    )}
                </div>
            </form>
        </div>
    );
}