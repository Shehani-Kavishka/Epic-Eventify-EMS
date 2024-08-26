import React, {useState, useEffect} from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import {Text, Button} from "../../components";
import Header from "../../components/Header";
import Footer from "components/Footer";
import OrganizerEventPortalRecentlyAddedColumnOne from "../../components/OrganizerEventPortalRecentlyAddedColumnOne";
import { Link,useParams } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function OrganizerEventPortalRecentlyAddedPage() {
  const [events,setEvents] = useState([]);
  const [searchQuery,setSearchQuery] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const {organizerid} = useParams();
  const [organizerName,setOrganizerName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  
  useEffect(()=>{
    const fetchEventsAndOrganizer = async () =>{
      try{
        const response = await axios.get(`http://localhost:8080/events/${organizerid}`);
        setEvents(response.data);

        const organizerResponse = await axios.get(`http://localhost:8080/organizers/${organizerid}`);
        setOrganizerName(organizerResponse.data.organizername);
      }
      catch(error){
        console.error("Error in fetching data",error);
      }
    }
    fetchEventsAndOrganizer();
  },[organizerid]);

  const handleSearch = async () =>{
    try{
      const response = await axios.get(`http://localhost:8080/searchOrg`,{
        params: {
          query: searchQuery,
        organizerid: organizerid
        }
      });
      setEvents(response.data);
      setSearchPerformed(true);
    }
    catch(error){
      console.error("Error in searching events", error);
    }
  };

  const handleFilterchange = async (e) => {
    const status = e.target.value;
    setFilterStatus(status);
    if(status){
      try{
        const response = await axios.get(`http://localhost:8080/filterEventsByStatus`,{
          params:{
            status,
            organizerid
          }
        });
        setEvents(response.data);
        setSearchPerformed(true);
      } catch (error){
        console.error ("error in filtering events", error);
      }
    }
    else{
      const response = await axios.get(`http://localhost:8080/events/${organizerid}`);
      setEvents(response.data);
      setSearchPerformed(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Organizer Event Portal</title>
        <meta name=""/>
      </Helmet>
      <div className="flex flex-col w-full gap-[33px] bg-white-A700 min-h-screen">
        <Header />
        <div className="flex flex-col w-full gap-[34px] mx-auto md:p-5 max-w-[1214px] flex-grow">
          <div className="flex sm:flex-col justify-between items-center gap-5">
            <div className="flex items-center w-full max-w-[400px] border-2 border-deep_purple-800 rounded-[10px]">
              <input 
                type="text" 
                placeholder="Search Your Event"
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

            <select
              value={filterStatus}
              onChange={handleFilterchange}
              className="flex items-center w-[175px] h-[42px] px-4 border-2 border-deep_purple-800 rounded-[10px] text-deep_purple-800"
            >
              <option value="">Filter by Status</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Completed">Completed</option>
            </select>
            

            <Button className="flex items-center justify-center h-[42px] px-[9px] text-white-A700 text-center text-lg font-semibold bg-deep_purple-800 min-w-[158px] rounded-[20px]">
              <Link to={`/create-new-event/${organizerid}/${organizerName}`}> Create an Event </Link>
            </Button>
          </div>

          {searchPerformed && events.length === 0 ? (
              <Text as="h2" size="2xl" className="text-center text-deep_purple-800">
                <strong> We couldn't find any events </strong>
              </Text>
            ) : events.length === 0 ? (
              <Text as="h2" size="2xl" className="text-center text-deep_purple-800">
                <strong>You haven't created any events yet</strong>
              </Text>
            ):  (
                  events.map((event)=>(
                    <Link to={`/view-event/${event.eventid}`} key={event.eventid} >
                      <OrganizerEventPortalRecentlyAddedColumnOne 
                        className="p-[23px] sm:p-5 bg-blue_gray-100 shadow-xs rounded-[20px]" 
                        eventid={event.eventid}
                        eventname={event.eventname}
                        eventimage={event.eventimage}
                        date={event.date}
                        status={event.status}
                      />
                    </Link>
                  ))
                )
          }
        </div>
        <Footer/>
      </div>      
    </>
  );
}
