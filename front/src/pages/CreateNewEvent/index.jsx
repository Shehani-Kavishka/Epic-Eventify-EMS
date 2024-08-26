import React,{useState,useEffect} from "react";
import { Helmet } from "react-helmet";
import { Text} from "../../components";
import Header from "../../components/Header";
import { useParams } from "react-router-dom";
import axios from "axios";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function CreateNewEventPage() {
  const {organizerid, organizerName} = useParams();
  const [event,setEvent] = useState({
    eventname:"",
    date:"",
    time:"",
    venue:"",
    organizer:"",
    description:"",
    type1:"",
    type2:"",
    type3:"",
    type4:"",
    file:null,
    organizerid:organizerid
  });

  // const [eventid,setEventid] = useState(null);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  
  const handlechange = (e) =>{
    if(e.target.name==="file"){
    setEvent(prev => ({...prev,[e.target.name]:e.target.files[0]}));
    setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
    else{
    setEvent(prev=>({...prev,[e.target.name]:e.target.value}));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const currentdate = new Date();
    const seleceteddate = new Date(event.date);

    if(!event.eventname) newErrors.eventname = "Event name is required";
    if(!event.date) {
      newErrors.date = "Date is required";
    }
    else if (seleceteddate <= currentdate) {
      newErrors.date = "Select a future date";
    }
    else if ((seleceteddate - currentdate) / (1000*60*60*24) < 7){
      newErrors.date = "Select a date at least a week later"
    }
    if(!event.time) newErrors.time = "Time is required";
    if(!event.venue) newErrors.venue = "Venue is required";
    if(!event.organizer) newErrors.organizer = "Organizer name is required";
    if(!event.file) newErrors.file = "Event image is required";
    if(!event.description) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createEvent = async (e) =>{
    e.preventDefault();
    if(!validateForm()) return;

    const formData = new FormData();
    formData.append("eventname",event.eventname);
    formData.append("date",event.date);
    formData.append("time",event.time);
    formData.append("venue",event.venue);
    formData.append("organizer",event.organizer);
    formData.append("description",event.description);
    formData.append("type1",event.type1);
    formData.append("type2",event.type2);
    formData.append("type3",event.type3);
    formData.append("type4",event.type4);
    formData.append("file",event.file);
    formData.append("organizerid",event.organizerid);

    try{
      const response = await axios.post("http://localhost:8080/events",formData,
      {
        headers:{
          'Content-Type':'multipart/form-data'
        }
      });
      console.log(response.data);
      // setEventid(response.data.insertId);
      window.location.href=`/event-created/${response.data.insertId}`;
    }
    catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
    setEvent(prev => ({...prev, organizer:organizerName}));
  },[organizerName]);

  return (
    <>
      <Helmet>
        <title>Create New Event</title>
        <meta name=""/>
      </Helmet>

      <style>
        {`
          input::placeholder,textarea::placeholder {color: black;}
        `}
      </style>

      <div className="flex flex-col w-full pb-[26px] gap-[31px] sm:pb-5 bg-white-A700">
        <Header/>
        <div className="h-[580px] w-full mx-auto md:p-5 relative max-w-[1115px]">
          <Text size="2xl" as="p" className="w-max top-0 right-0 left-0 m-auto text-center absolute" style={{ top: '-10px', left:'100px' }}>
            Create New Event
          </Text>
          <div className="flex flex-col gap-[190px] right-[31%] top-[18%] m-auto md:gap-[142px] sm:gap-[95px] absolute">
            <Text size="md" as="p">
              Add Event Image
            </Text>
            <Text size="md" as="p">
              Event Description
            </Text>
          </div>
          <label htmlFor="eventimage">
          <div className="flex flex-col items-center justify-center w-[25%] right-0 top-[10%] px-14 py-10 m-auto md:p-5 bg-blue_gray-100 absolute">
            <i className="fas fa-camera h-[30px] w-[30px] pb-10 text-[30px]"></i>
            {imagePreview && <img src={imagePreview} alt="uploaded"/>}
            <input 
              type="file" 
              id="eventimage" 
              name="file" 
              className="hidden" 
              onChange={handlechange}
            />
            {errors.file && <span className="text-red-500">{errors.file}</span>}
          </div>
          </label>
          <div className="h-[160px] w-[43%] bottom-[11%] right-0 m-auto absolute rounded">
            <textarea 
              name="description"  
              cols="30" 
              rows="10" 
              placeholder="Add a description to be displayed to the viewers of this event" 
              className="justify-center h-[160px] left-0 bottom-0 right-0 top-0 m-auto absolute rounded absolute"
              style={{
                backgroundColor: '#F5F5F5',
              }}
              onChange={handlechange}
            >           
            </textarea>
            {errors.description && <span className="text-red-500">{errors.description}</span>}
          </div>
          
          <div className="flex flex-col items-center w-[43%] h-max left-0 bottom-0 top-0 my-auto absolute">
            <div className="flex flex-col self-stretch pt-[50px] gap-[25px] md:pt-5">
            <div className="flex sm:flex-col justify-between items-start gap-5 flex-1">
                <Text size="md" as="p" className="mt-0.5">
                  Event Name
                </Text>
                <input 
                  type="text" 
                  name="eventname" 
                  placeholder="Event Name" 
                  className="h-[25px] w-[67%] relative rounded"
                  style={{
                    backgroundColor: '#F5F5F5',
                  }}
                  onChange={handlechange}/>
                {errors.eventname && <span className="text-red-500">{errors.eventname}</span>}
              </div>
              <div className="flex justify-between items-start gap-5 flex-1">
                <Text size="md" as="p" className="mt-0.5">
                  Date
                </Text>
                <input 
                  type="date" 
                  name="date" 
                  placeholder="Date" 
                  className="h-[25px] w-[67%] relative rounded absolute"
                  style={{
                    backgroundColor: '#F5F5F5',
                  }}
                  onChange={handlechange}/>
                {errors.date && <span className="text-red-500">{errors.date}</span>}
              </div>
              <div className="flex justify-between items-start gap-5 flex-1">
                <Text size="md" as="p">
                  Time
                </Text>
                <input 
                  type="time" 
                  name="time" 
                  placeholder="Time" 
                  className="h-[25px] w-[67%] relative rounded absolute"
                  style={{
                    backgroundColor: '#F5F5F5',
                  }}
                  onChange={handlechange}/>
                {errors.time && <span className="text-red-500">{errors.time}</span>}
              </div>
              <div className="flex justify-between items-start gap-5 flex-1">
                <Text size="md" as="p" className="mt-0.5">
                  Venue
                </Text>
                <input 
                  type="text" 
                  name="venue" 
                  placeholder="Venue" 
                  className="h-[25px] w-[67%] relative rounded absolute"
                  style={{
                    backgroundColor: '#F5F5F5',
                  }}
                  onChange={handlechange}/>
                {errors.venue && <span className="text-red-500">{errors.venue}</span>}
              </div>
            </div>

            <Text size="md" as="p" className="self-start mt-7">
              Event Type
            </Text>
            {/* <div className="flex sm:flex-col self-stretch justify-between mt-[9px] gap-5">              */}
            <div className="flex self-stretch justify-between mt-[9px] gap-5 flex-wrap">
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-5">
                  <input 
                    name='type1'
                    type='radio'
                    id='indoor'
                    value='Indoor'
                    onChange={handlechange}
                  />
                  <label htmlFor="indoor"  className="flex justify-between items-center gap-5 flex-1">Indoor Concerts</label>
                </div>
                <div className="flex items-center gap-5">
                  <input 
                    name='type2'
                    type='radio'
                    id='club'
                    value='Club'
                    onChange={handlechange}
                  />
                  <label htmlFor="club" className="flex justify-between items-center gap-5 flex-1">Club Events</label>
                </div>
                <div className="flex items-center gap-5">
                  <input 
                    name='type3'
                    type='radio'
                    id='classical'
                    value='Classical'
                    onChange={handlechange}
                  />
                  <label htmlFor="classical" className="flex justify-between items-center gap-5 flex-1">Classical Events</label>
                </div>
                <div className="flex items-center gap-5">
                  <input 
                    name='type4'
                    type='radio'
                    id='tribute'
                    value='Tribute'
                    onChange={handlechange}
                  />
                  <label htmlFor="tribute" className="flex justify-between items-center gap-5 flex-1">Tribute Events</label>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-5">
                  <input 
                    name='type1'
                    type='radio'
                    id='outdoor'
                    value='Outdoor'
                    onChange={handlechange}
                  />
                  <label htmlFor="outdoor" className="flex justify-between items-center gap-5 flex-1">Outdoor Musical</label>
                </div>
                <div className="flex items-center gap-5">
                  <input 
                    name='type2'
                    type='radio'
                    id='Acoustic'
                    value='Acoustic'
                    onChange={handlechange}
                  />
                  <label htmlFor="Acoustic" className="flex justify-between items-center gap-5 flex-1">Acoustic Events</label>
                </div>
                <div className="flex items-center gap-5">
                  <input 
                    name='type3'
                    type='radio'
                    id='Contemporary'
                    value='Contemporary'
                    onChange={handlechange}
                  />
                  <label htmlFor="Contemporary" className="flex justify-between items-center gap-5 flex-1">Contemporary Events</label>
                </div>
                <div className="flex items-center gap-5">
                  <input 
                    name='type4'
                    type='radio'
                    id='Cultural'
                    value='Cultural'
                    onChange={handlechange}
                  />
                  <label htmlFor="Cultural" className="flex justify-between items-center gap-5 flex-1">Cultural Events</label>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col self-stretch justify-between items-center mt-[38px] gap-5">
              <Text size="md" as="p" className="self-start mt-7">
                Organized By
              </Text>
              <input 
                type="text" 
                name="organizer" 
                placeholder="Organizer" 
                value={organizerName}
                className="h-[25px] w-[67%] relative rounded !text-gray-500 absolute"
                style={{
                  backgroundColor: '#F5F5F5',
                  marginTop: '30px'
                }}
                onChange={handlechange}
              />
              {errors.organizer && <span className="text-red-500">{errors.organizer}</span>}
            </div>
            <button 
              type="button"
              className="flex self-end items-center justify-center mt-16 h-[34px] px-[35px] sm:px-5 text-white-A700 text-center text-lg font-semibold bg-deep_purple-800 min-w-[225px] rounded-[17px]"
              onClick={createEvent}>
                {/* <Link to={`/event-created/${eventid}`}> */}
                  Create
                {/* </Link> */}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
