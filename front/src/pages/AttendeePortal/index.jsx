import React, {useState, useEffect} from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import HeaderAttendee from "components/HeaderAttendee";
import AttndeeEventPortalEventTile from "components/EventTile";
import { Link, useParams } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Footer from "components/Footer";
import { Text } from "components";

export default function AttendeePortalPage() {
  const {attendeeid} = useParams();
  const [events,setEvents] = useState([]);
  const [searchQuery,setSearchQuery] = useState("");
  const [searchPerformed,setSearchPerformed] = useState(false);
  
  useEffect(()=>{
    const fetchEvents= async () =>{
      try{
        const response = await axios.get("http://localhost:8080/events");
        setEvents(response.data);
      }
      catch(error){
        console.error("Error in fetching data",error);
      }
    }
    fetchEvents();
  },[]);

  const handleSearch = async () =>{
    try{
      const response = await axios.get(`http://localhost:8080/search?query=${searchQuery}`);
      setEvents(response.data);
      setSearchPerformed(true);
    }
    catch(error){
      console.error("Error in searching events", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>EpicEventify - Attendee Portal</title>
        <meta name=""/>
      </Helmet>
      <div className="flex flex-col w-full gap-[33px] bg-white-A700 min-h-screen">
        <HeaderAttendee attendeeid={attendeeid}/>
        <div className="flex flex-col flex-grow w-full gap-[34px] mx-auto md:p-5 max-w-[1214px]">
            <div className="flex sm:flex-col justify-between items-center gap-5">
                <div className="flex items-center w-full max-w-[400px] border-2 border-deep_purple-800 rounded-[10px]">
                    <input 
                        type="text" 
                        placeholder="Search Events"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-grow h-[42px] px-4 ml-4 text-deep_purple-800 placeholder:text-deep_purple-800"
                    />

                    <button
                        onClick={handleSearch}
                        className="h-[42px] px-4 rounded-r-[20px] text-deep_purple-800 text-[24px]"
                    >
                        <i className="fas fa-search h-[23px] w-[24px]"></i>
                    </button>
                </div>
            </div>

            {searchPerformed && events.length === 0 ? (
              <Text as="h2" size="2xl" className="text-center text-deep_purple-800">
                <strong> We couldn't find any events </strong>
              </Text>
            ) : (
              <div className="grid grid-cols-3 gap-12">
                {events.map((event)=>(
                    <Link to={`/display-event/${attendeeid}/${event.eventid}`} key={event.eventid} >
                    <AttndeeEventPortalEventTile 
                        className="p-[23px] sm:p-5 bg-blue_gray-100 shadow-xs rounded-[20px]" 
                        eventname={event.eventname}
                        eventimage={event.eventimage}
                        date={event.date}
                        time={event.time}
                        venue={event.venue}
                    />
                    </Link>
                ))}
              </div>
            )}
        </div>
        <Footer/>
      </div>
    </>
  );
}
