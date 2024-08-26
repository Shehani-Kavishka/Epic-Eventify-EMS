import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Text, Img } from "../../components";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function CompleteEvents() {
  const [event,setEvent] = useState(null);
  const [showconfirmBox, setShowConfirmBox] = useState(false);
  const [isEventCompleted, setIsEventCompleted] = useState(false);
  const [showDateErrorBox, setShowDateErrorBox] = useState(false);
  const {eventid} = useParams();
  
  useEffect(()=>{
    const fetchEvent = async () =>{
      try{
      const response = await axios.get(`http://localhost:8080/event/${eventid}`);
      setEvent(response.data);
      console.log(response.data);
    } catch(err){
      console.log(err);
    }
  };
  fetchEvent();  
  },[eventid]);

  const handleCompleteEvent = () => {
    const eventdate = new Date(event.date);
    const currentdate = new Date();

    if(eventdate > currentdate){
        setShowDateErrorBox(true);
        return;
    }
    setShowConfirmBox(true);
  }

  const handleCloseDateErrorBox = () => {
    setShowDateErrorBox(false);
    window.location.href=`/event-portal/${event.organizerid}`;
  }

  const handleConfirmedCompleteEvent = async() => {
      try{
        const response = await axios.put(`http://localhost:8080/events/${eventid}/complete`,{status:'Completed'});
        console.log(response.data);
        setIsEventCompleted(true);
        // alert("Event Cancelled Successfully");
        // setShowConfirmBox(false);
      }
      catch(err)
      {
        console.log(err);
        alert("failed to cancle the event");
        // setShowConfirmBox(false);
      }
      finally
      {
        setShowConfirmBox(false);
      }
    // }
  }

  const handleCloseConfirmBox = () => {
    setShowConfirmBox(false)
  }

  if(!event){
    return <p>Loading...</p>;
  }

  return (
    <>
      <Helmet>
        <title>Complete Events</title>
        <meta
          name="description"
        />
      </Helmet>
      
      <div className="flex w-full flex-col gap-8 bg-white-A700 pb-[100px] md:pb-5">
        
        <div>
          <Header/>
        </div>

        
        <div className="flex flex-col items-end">
          
          <div className="mr-[25px] mt-[6px] flex w-[88%] flex-col items-start gap-[9px] md:mr-0 md:w-full md:p-5">
            <Text as="h1" size="2xl" className="font-bold text-center mx-auto md:ml-0" style={{fontWeight:'bold'}}>
            Do you want to complete this event?
            </Text>

            <div className="flex items-center gap-[46px] self-stretch md:flex-col">
              <Img
                src={event.eventimage}
                alt="eventimageone"
                className="h-[400px] w-[400px] object-cover md:w-full"
              />

              <div className="flex flex-1 flex-col gap-[67px] md:self-stretch sm:gap-[33px]">
                <div className="flex items-center justify-between gap-5 sm:flex-col">
                  <div className="mb-[7px] flex flex-col items-start gap-[27px] self-end mt-10">
                    <div className="grid grid-cols-2 gap-x-4 w-full">
                      <Text size="xl" as="p" className="text-right leading-[2.5]">
                        Event Name: 
                      </Text>
                      <Text size="xl" as="p" className="leading-[2.5]">
                        {event.eventname}
                      </Text>
                      <Text size="xl" as="p" className="text-right leading-[2.5]">
                        Date: 
                      </Text>
                      <Text size="xl" as="p" className="leading-[2.5]">
                        {event.date}
                      </Text>
                      <Text size="xl" as="p" className="text-right leading-[2.5]">
                        Time: 
                      </Text>
                      <Text size="xl" as="p" className="leading-[2.5]">
                        {event.time}
                      </Text>
                      <Text size="xl" as="p" className="text-right leading-[2.5]">
                        Venue: 
                      </Text>
                      <Text size="xl" as="p" className="leading-[2.5]">
                        {event.venue}
                      </Text>
                      <Text size="xl" as="p" className="text-right leading-[2.5]">
                        Organized By: 
                      </Text>
                      <Text size="xl" as="p" className="leading-[2.5]">
                        {event.organizer}
                      </Text>
                    </div>
                  </div>
                </div>

                <div className="flex w-[83%] flex-col gap-[25px] md:w-full -mt-8">
                  <Text size="xl" as="p" className="leading-6">
                    {event.description}
                  </Text>

                  <div className="flex flex-col items-start gap-1.5">
                    <Text size="xl" as="p">
                      Event Type:
                    </Text>
                    <div className="flex flex-col items-start gap-2.5 ml-16">
                      <Text size="lg" as="p">{event.type1}</Text>
                      <Text size="lg" as="p">{event.type2}</Text>
                      <Text size="lg" as="p">{event.type3}</Text>
                      <Text size="lg" as="p">{event.type4}</Text>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end w-full -mt-20 pr-20">
              <Link>
                <button 
                  type="button"
                  className="flex items-center justify-center h-[34px] px-[35px] sm:px-5 text-white-A700 text-center text-lg font-semibold bg-deep_purple-800 min-w-[225px] rounded-[17px]"
                  onClick={handleCompleteEvent}>
                    Complete Event
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {showconfirmBox && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative z-[1] bg-[#C7ADCE] w-full h-[200px] p-8 rounded-ld shadow-lg">
            <div className="flex flex-col items-center justify-center gap-[40px] h-full">
              <Text size="xl" as="p" className="font-bold" style={{fontWeight:'bold'}}>
                Confirm Event Completion 
              </Text>
              <div className="flex gap-4">
                <button 
                  className="flex items-center justify-center px-6 py-2 h-[34px] px-[35px] sm:px-5 text-deep_purple-800 text-center text-lg font-semibold bg-white-A700 min-w-[225px] rounded-[17px] sm:px-5 border border-deep_purple-800"
                  onClick={handleCloseConfirmBox}>
                    Back
                </button>
                <button 
                  className="flex items-center justify-center px-6 py-2 h-[34px] px-[35px] sm:px-5 text-white-A700 text-center text-lg font-semibold bg-deep_purple-800 min-w-[225px] rounded-[17px] sm:px-5 border border-deep_purple-800" 
                  onClick={handleConfirmedCompleteEvent}>
                  Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEventCompleted && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative z-[1] bg-[#C7ADCE] w-full h-[200px] p-8 rounded-ld shadow-lg">
            <div className="flex flex-col items-center justify-center gap-[40px] h-full">
              <Text size="xl" as="p" className="font-bold" style={{fontWeight:'bold'}}>
                Event Completed
              </Text>
              <div className="flex gap-4">
                <button 
                  className="flex items-center justify-center px-6 py-2 h-[34px] px-[35px] sm:px-5 text-deep_purple-800 text-center text-lg font-semibold bg-white-A700 min-w-[225px] rounded-[17px] sm:px-5 border border-deep_purple-800"
                  onClick={()=>window.location.href=`/event-portal/${event.organizerid}`}>
                    Back to Home
                </button>
                <button 
                  className="flex items-center justify-center px-6 py-2 h-[34px] px-[35px] sm:px-5 text-white-A700 text-center text-lg font-semibold bg-deep_purple-800 min-w-[225px] rounded-[17px] sm:px-5 border border-deep_purple-800" 
                >
                    Send Notifications
                </button>
              </div>
            </div>
          </div>
        </div>

      )}

      {showDateErrorBox && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative z-[1] bg-[#C7ADCE] w-full h-[200px] p-8 rounded-ld shadow-lg">
            <div className="flex flex-col items-center justify-center gap-[40px] h-full">
              <Text size="xl" as="p" className="font-bold" style={{fontWeight:'bold'}}>
              Event date has not passed yet. You cannot complete the event.
              </Text>
              <div className="flex gap-4">
                <button 
                  className="flex items-center justify-center px-6 py-2 h-[34px] px-[35px] sm:px-5 text-deep_purple-800 text-center text-lg font-semibold bg-white-A700 min-w-[225px] rounded-[17px] sm:px-5 border border-deep_purple-800"
                  onClick={handleCloseDateErrorBox}>
                    OK
                </button>
              </div>
            </div>
          </div>
        </div>

      )}
    </>
  );
}
