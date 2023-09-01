export default function ProfilePic({ username, userId, online }) {
    const colours = ["bg-red-200", "bg-blue-200", "bg-green-200", "bg-purple-200", "bg-pink-200", "bg-yellow-200", "bg-teal-200"];

    const decimalUserId = parseInt(userId, 16);
    const remainder = decimalUserId % colours.length;
    const colour = colours[remainder];

    return (
        <div className={"w-8 h-8 relative bg-red-200 rounded-full flex items-center " + colour}>
            <div className="text-center w-full">{username[0]}</div>
            <div className={"absolute w-3 h-3 rounded-full bottom-0 right-0 border border-white " + (online === true ? "bg-green-400" : "bg-gray-300")}></div>
        </div>
    );
}