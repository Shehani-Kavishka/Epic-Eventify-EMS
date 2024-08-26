import React from "react";
import { Link } from "react-router-dom";

export default function HomePage(){
    return(
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl mb-4">Welcome</h1>
            <div className="flex gap-4">
                <Link to={"/attendee-login"}>
                    <button className="bg-white text-deep_purple-800 border-2 border-deep_purple-800 py-2 px-4 rounded">
                        Attendee Login
                    </button>
                </Link>
                <Link to={"/organizer-login"}>
                    <button className="bg-deep_purple-800 text-white-A700 py-2 px-4 rounded">
                        Organizer Login
                    </button>
                </Link>
                <Link to={"/events"}>
                    <button className="bg-white text-deep_purple-800 border-2 border-deep_purple-800 py-2 px-4 rounded">
                        Go to Events
                    </button>
                </Link>
            </div>
        </div>
    )
}