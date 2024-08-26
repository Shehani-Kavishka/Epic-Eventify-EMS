import React, { useState } from "react";
import axios from "axios";

export default function OrganizerLoginPage(){

    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');

    const handleLogin = async() =>{
        try{
            //fetch organizer id
            const response = await axios.get(`http://localhost:8080/organizer/${username}`);
            const organizerid = response.data.organizerid;

            console.log('Organizer login successfull:',{username,password,organizerid});

            window.location.href=`/event-portal/${organizerid}`;

        }
        catch(error)
        {
            console.error("error during login",error);
        }
    }
    
    return(
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl mb-4">Organizer Login</h1>
            <div className="flex flex-col gap-4">
                <input 
                    type="text" 
                    placeholder="username"
                    value={username}
                    onChange={(e)=> setUsername(e.target.value)}
                    style={{ 
                        padding: '8px', 
                        borderWidth: '2px', 
                        borderColor: 'black', 
                        borderRadius: '4px' 
                    }}                />
                <input 
                    type="password" 
                    placeholder="password"
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                    style={{ 
                        padding: '8px', 
                        borderWidth: '2px', 
                        borderColor: 'black', 
                        borderRadius: '4px' 
                    }}                />
                <button onClick={handleLogin} className="bg-deep_purple-800 text-white-A700 py-2 px-4 rounded">
                    Login
                </button>
            </div>
        </div>
    )
}