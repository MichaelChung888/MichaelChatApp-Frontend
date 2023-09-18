import { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "./UserContext";
import { uniqBy } from "lodash";
import axios from "axios";
import Contacts from "./Contacts";

const SendIcon = () => (
    <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
        <path d="M10.3009 13.6949L20.102 3.89742M10.5795 14.1355L12.8019 18.5804C13.339 19.6545 13.6075 20.1916 13.9458 20.3356C14.2394 20.4606 14.575 20.4379 14.8492 20.2747C15.1651 20.0866 15.3591 19.5183 15.7472 18.3818L19.9463 6.08434C20.2845 5.09409 20.4535 4.59896 20.3378 4.27142C20.2371 3.98648 20.013 3.76234 19.7281 3.66167C19.4005 3.54595 18.9054 3.71502 17.9151 4.05315L5.61763 8.2523C4.48114 8.64037 3.91289 8.83441 3.72478 9.15032C3.56153 9.42447 3.53891 9.76007 3.66389 10.0536C3.80791 10.3919 4.34498 10.6605 5.41912 11.1975L9.86397 13.42C10.041 13.5085 10.1295 13.5527 10.2061 13.6118C10.2742 13.6643 10.3352 13.7253 10.3876 13.7933C10.4468 13.87 10.491 13.9585 10.5795 14.1355Z"
            stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const MessageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
        <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
        <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
    </svg>
);

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
    </svg>
);

const AttachedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
    </svg>

);

export default function Chat() {
    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    const [offlinePeople, setOfflinePeople] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const { loggedInUsername, loggedInId, setLoggedInUsername, setLoggedInId } = useContext(UserContext);
    const [newMessageText, setNewMessageText] = useState("");
    const [messages, setMessages] = useState([]);
    const divUnderMessages = useRef(); //Accepts 1 argument as the initial value and returns a reference(an object having a special property current)


    useEffect(() => {
        if (ws) {
            ws.close();
            setWs(null);
        }
        connectToWs();
    }, [selectedUserId]); //This effect hook is only ran upon logging in

    //This "WebSocket" allows data exchange between the client and server over a persistent connection
    function connectToWs() {
        const ws = new WebSocket("wss://michaelchatapp-backend.onrender.com"); //Set up a websocket connection to our server/backend
        setWs(ws);
        ws.addEventListener("message", handleMessage); //The message event occurs when the WebSocket recieves a message.
    }

    function handleMessage(e) {
        const messageData = JSON.parse(e.data); //Parse the JSON string back into a JSON object
        if ("online" in messageData) {
            showOnlinePeople(messageData.online);
        } else if ("text" in messageData) {
            if (messageData.sender === selectedUserId || messageData.sender === loggedInId) {
                setMessages(prev => ([...prev, { ...messageData }])); //NOTE: Passing a function to setState() will treat it as an "updater function"
            }                                                         //It should take the pending state as its only argument, and should return the next state
        }                                                   
    }

    function showOnlinePeople(peopleArray) {
        const people = {};
        peopleArray.forEach(({ userId, username }) => {
            people[userId] = username;
        });
        setOnlinePeople(people);
    }

    function sendMessage(ev, file = null) {
        if (ev) ev.preventDefault(); //Prevent reloading the page upon form submission/sending message
        ws.send(JSON.stringify({
            recipient: selectedUserId,
            text: newMessageText,
            file: file
        }));
        if (!file) setNewMessageText(""); //Reset the message input 
    }

    function sendFile(ev) {
        const reader = new FileReader();
        reader.readAsDataURL(ev.target.files[0]); //Convert file to base64
        reader.onload = () => {
            sendMessage(null, {
                name: ev.target.files[0].name,
                data: reader.result
            });
        }
        reader.onerror = (err) => { throw err; }
    }

    function logout() {
        axios.post("/logout").then(async () => { //Send post request to change your cookie token to empty
            setWs(null); 
            setLoggedInId(null);
            setLoggedInUsername(null); //Change back the states to null
            ws.close(); //Kill websocket
        });
    }

    useEffect(() => {  //WILL SCROLL TO BOTTOM OF CHAT WHEN NEW MESSAGE APPEARS
        const div = divUnderMessages.current;
        if (div) {
            div.scrollIntoView({ behaviour: "smooth", block: "end" });
        }
    }, [messages]); //This hook will be run every time messages changes(a new message for e.g)

    useEffect(() => { //FETCH MESSAGES OF SELECTED USER FROM MONGODB
        if (selectedUserId) {
            axios.get("/messages/" + selectedUserId).then(res => {
                setMessages(res.data);
            });
        }
        console.log(messages);
    }, [selectedUserId]);

    useEffect(() => { //FETCHING ALL OFFLINE PEOPLE
        axios.get("/people").then(res => { //Returns every User in database
            const offlinePeopleArr = res.data
                .filter(e => e._id !== loggedInId) //Removing yourself
                .filter(e => !Object.keys(onlinePeople).includes(e._id)); //If the id matches an onlinePeople Id, remove that person
            const offlinePeopleObj = {};
            offlinePeopleArr.forEach(e => {
                offlinePeopleObj[e._id] = e.username;
            });
            setOfflinePeople(offlinePeopleObj);
        });
    }, [onlinePeople]); //It fetches when onlinePeople changes(i.e someone went offline)

    const messagesWithoutDupes = uniqBy(messages, "_id");



    return (
        <div className="flex h-screen">
            <div className="bg-white w-1/4 flex flex-col">
                <div className="flex-grow">
                    <div className="text-blue-600 font-bold flex gap-2 p-4 items-center text-2xl">
                        <MessageIcon />
                        MichaelChatApp
                    </div>
                    {Object.keys(onlinePeople).map(userId => //Object keys returns an array of the keys within the "onlinePeople" object
                        <Contacts
                            key={userId}
                            userId={userId}
                            username={onlinePeople[userId]}
                            clicked={() => setSelectedUserId(userId)}
                            selected={selectedUserId}
                            online={true}
                            myUsername={loggedInUsername}
                        />
                    )}
                    {Object.keys(offlinePeople).map(userId => //Object keys returns an array of the keys within the "onlinePeople" object
                        <Contacts
                            key={userId}
                            userId={userId}
                            username={offlinePeople[userId]}
                            clicked={() => setSelectedUserId(userId)}
                            selected={selectedUserId}
                            online={false}
                            myUsername={loggedInUsername}
                        />
                    )}
                </div>
                <div className="p-2 text-center flex items-center justify-center">
                    <span className="mr-4 text-xl text-gray-500 flex items-center">
                        <UserIcon />
                        {loggedInUsername}
                    </span>
                    <button onClick={logout} className="text-lg text-gray-500 bg-blue-100 py-1 px-2">Logout</button>
                </div>
            </div>
            <div className="flex flex-col bg-blue-50 w-3/4">
                <div className="flex-grow">

                    {!selectedUserId && ( //No one selected
                        <div className="flex h-full items-center justify-center text-gray-400 text-lg">&larr; No selected person, Select a User from the sidebar</div>
                    )}

                    {selectedUserId && ( //Someone selected
                        <div className="relative h-full">
                            <div className="overflow-y-scroll absolute inset-0 p-3 pb-0">
                                {messagesWithoutDupes.map(message => (
                                    <div key={message._id} className={(message.sender === loggedInId ? "text-right" : "text-left")}>
                                        <div className={"max-w-2xl break-words text-left inline-block p-2 my-2 rounded-md " + (message.sender === loggedInId ? "bg-blue-500 text-white" : "bg-white text-gray-500")}>
                                            {message.text}
                                            {message.file && ( 
                                                message.file.type === "img" ?
                                                <a href={message.file.data} download={message.file.name}><img src={message.file.data} alt="Could not load" /></a>
                                                :
                                                message.file.type === "other" ?
                                                <a href={message.file.data} download={message.file.name} className="flex items-center gap-1 border-b"><AttachedIcon />{message.file.name}</a> 
                                                :
                                                null
                                                )}
                                        </div>
                                    </div>
                                ))}
                                <div ref={divUnderMessages}></div>
                            </div>
                        </div>

                    )}

                </div>
                {selectedUserId && (
                    <form className="flex gap-2 p-3" onSubmit={sendMessage}>
                        <input type="text" value={newMessageText} onChange={e => setNewMessageText(e.target.value)} className="bg-white border p-2 flex-grow rounded-sm" placeholder="Type your message here"></input>
                        <label className="bg-blue-100 p-2 rounded-sm border border-blue-200 cursor-pointer">
                            <input type="file" className="hidden" onChange={sendFile} />
                            <UploadIcon />
                        </label>
                        <button type="submit" className="bg-blue-500 p-2 rounded-sm"><SendIcon /></button>
                    </form>
                )}

            </div>
        </div>
    );
}