import ProfilePic from "./ProfilePic";

export default function Contacts({ userId, username, clicked, selected, online, myUsername }) {

    return (
        username !== myUsername ? (
            <div key={userId} onClick={() => clicked(userId)} className={"border-b h-14 border-gray-200 flex items-center gap-2 " + (userId === selected ? "bg-blue-50" : "")}>
                {userId === selected && (
                    <div className="w-2 bg-blue-500 h-14 rounded-r-md"></div>
                )}
                <div className="flex gap-2 pl-4 py-2 items-center">
                    <ProfilePic online={online} username={username} userId={userId} />
                    <span className="text-gray-800 text-lg">{username}</span>
                </div>
            </div>
        )
            :
            null //return null(show nothing) when the user from onlinePeople is yourself
    );
}