import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Text, Img } from "../../components";
import Header from "../../components/Header";
import { useParams } from "react-router-dom";
import axios from "axios";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function PostponeEvents() {
  const { eventid } = useParams();
  const [event, setEvent] = useState({
    eventname: "",
    date: "",
    time: "",
    venue: "",
    organizer: "",
    description: "",
    type1: "",
    type2: "",
    type3: "",
    type4: "",
    file: null,
    eventimage: "",
    status: "Ongoing",
    organizerid: ""
  });
  const [errors, setErrors] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/event/${eventid}`);
        const eventData = response.data;
        setEvent({
          ...eventData,
          file: null,
          originaldate: eventData.date,
        });
        setImagePreview(eventData.eventimage);
      } catch (error) {
        console.error("Error in fetching event data", error);
      }
    };
    fetchEvent();
  }, [eventid]);

  const handlechange = (e) => {
    if (e.target.name === "file") {
      const file = e.target.files[0];
      setEvent(prev => ({ ...prev, [e.target.name]: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setEvent(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const currentdate = new Date();
    const seleceteddate = new Date(event.date);
    const originaldate = new Date(event.originaldate);

    if (!event.date) {
      newErrors.date = "Date is required";
    } else if (seleceteddate <= originaldate) {
      newErrors.date = "Select a date after the original event date";
    } else if ((seleceteddate - currentdate) / (1000 * 60 * 60 * 24) < 7) {
      newErrors.date = "Select a date at least a week later";
    }

    if (!event.time) newErrors.time = "Time is required";
    if (!event.venue) newErrors.venue = "Venue is required";
    if (!event.file && !event.eventimage) newErrors.file = "Event image is required";
    if (!event.description) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const postponeEvent = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("eventname", event.eventname);
    formData.append("date", event.date);
    formData.append("time", event.time);
    formData.append("venue", event.venue);
    formData.append("organizer", event.organizer);
    formData.append("description", event.description);
    formData.append("type1", event.type1);
    formData.append("type2", event.type2);
    formData.append("type3", event.type3);
    formData.append("type4", event.type4);
    if (event.file) {
      formData.append("file", event.file);
    }
    try {
      await axios.put(`http://localhost:8080/events/${eventid}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      window.location.href = `/event-postponed/${eventid}`;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Helmet>
        <title>Postpone Events</title>
        <meta name="" />
      </Helmet>
      <style>
        {`
          input::placeholder, textarea::placeholder { color: black; }
        `}
      </style>
      <div className="flex flex-col w-full pb-[26px] gap-[31px] sm:pb-5 bg-white-A700">
        <Header />
        <div className="h-[580px] w-full mx-auto md:p-5 relative max-w-[1115px]">
          <Text size="2xl" as="p" className="w-max top-0 right-0 left-0 m-auto text-center absolute" style={{ top: '-10px' }}>
            Postpone Events
          </Text>
          <div className="flex flex-col gap-[190px] right-[31%] top-[18%] m-auto md:gap-[142px] sm:gap-[95px] absolute">
            <Text size="md" as="p">
              Edit Event Image
            </Text>
            <Text size="md" as="p">
              Event Description
            </Text>
          </div>
          <label htmlFor="eventimage">
            <div className="flex flex-col items-center justify-center w-[20%] right-0 top-[3%] px-10 py-[30px] m-auto md:p-5 bg-blue_gray-100 absolute">
              <i className="fas fa-camera h-[30px] w-[30px] pb-2 text-[20px]"></i>
              {imagePreview ? (
                <img src={imagePreview} alt="uploaded" className="h-[125px] w-full md:h-auto object-cover rounded-[20px]" />
              ) : (
                <Img src={event.eventimage} alt="event image" className="h-[125px] w-full md:h-auto object-cover rounded-[20px]" />
              )}
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
              value={event.description}
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
                    backgroundColor: '#FFFFFF',
                  }}
                  value={event.eventname}
                  readOnly
                  onChange={handlechange} />
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
                  value={event.date}
                  onChange={handlechange} />
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
                  value={event.time}
                  onChange={handlechange} />
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
                  value={event.venue}
                  onChange={handlechange} />
                {errors.venue && <span className="text-red-500">{errors.venue}</span>}
              </div>
            </div>
            <Text size="md" as="p" className="self-start mt-7">
              Event Type
            </Text>
            <div className="flex self-stretch justify-between mt-[9px] gap-5 flex-wrap">
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-5">
                  <input
                    name='type1'
                    type='radio'
                    id='indoor'
                    value='Indoor'
                    checked={event.type1 === "Indoor"}
                    onChange={handlechange}
                  />
                  <label htmlFor="indoor" className="flex justify-between items-center gap-5 flex-1">Indoor Concerts</label>
                </div>
                <div className="flex items-center gap-5">
                  <input
                    name='type2'
                    type='radio'
                    id='club'
                    value='Club'
                    checked={event.type2 === "Club"}
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
                    checked={event.type3 === "Classical"}
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
                    checked={event.type4 === "Tribute"}
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
                    checked={event.type1 === "Outdoor"}
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
                    checked={event.type2 === "Acoustic"}
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
                    checked={event.type3 === "Contemporary"}
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
                    checked={event.type4 === "Cultural"}
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
                className="h-[25px] w-[67%] relative rounded absolute"
                style={{
                  backgroundColor: '#FFFFFF',
                  marginTop: '30px'
                }}
                value={event.organizer}
                readOnly
                onChange={handlechange}
              />
              {errors.organizer && <span className="text-red-500">{errors.organizer}</span>}
            </div>
            <div className="flex self-end items-center justify-center mt-16 gap-4">
              <button
                type="button"
                className="h-[34px] px-[35px] sm:px-5 text-white-A700 text-center text-lg font-semibold bg-deep_purple-800 min-w-[225px] rounded-[17px]"
                onClick={postponeEvent}>
                Postpone
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
