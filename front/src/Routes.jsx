import React from "react";
import { useRoutes } from "react-router-dom";

import HomePage from "pages/HomePage";
import AttendeeLoginPage from "pages/AttendeeLogin";
import OrganizerLoginPage from "pages/OrganizerLogin";

import AttendeePortal from "pages/AttendeePortal";
import DisplayEvent from "pages/DisplayEvent";

import EventPortal from "pages/OrganizerEventPortal";
import ViewanEventPage from "pages/ViewanEvent";
import CreateNewEvent from "pages/CreateNewEvent";
import EventCreatedPage from "pages/EventCreated";
import UpdateEvents from "pages/UpdateEvents";
import EventUpdatedPage from "pages/EventUpdated";
import PostponeEvents from "pages/PostponeEvents";
import EventPostponed from "pages/EventPostponed";
import CancelEvents from "pages/CancelEvents";
import CompleteEvents from "pages/CompleteEvents";

import OrganizerProfile from "pages/OrganizerProfile";
import EditOrganizerProfile from "pages/EditOrganizerProfile";
import OrganizerEmailVerification from "pages/OrganizerEmailVerification";
import OrganizerChangePassword from "pages/OrganizerChangePassword";

import AttendeeProfile from "pages/AttendeeProfile";
import EditAttendeeProfile from "pages/EditAttendeeProfile";
import AttendeeEmailVerification from "pages/AttendeeEmailVerification";
import AttendeeChangePassword from "pages/AttendeeChangePassword";

import ContactUsPage from "pages/ContactUs";

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/", 
      element: <HomePage/>
    },
    { path: "/attendee-login", 
      element: <AttendeeLoginPage/>
    },
    { path: "/organizer-login", 
      element: <OrganizerLoginPage/>
    },
    {
      path:"/events",
      element: <AttendeePortal/>
    },
    {
      path:"/events/:attendeeid",
      element: <AttendeePortal/>
    },
    {
      path:"/event-portal/:organizerid",
      element: <EventPortal/>
    },    
    {
      path: "create-new-event/:organizerid/:organizername",
      element: <CreateNewEvent />,
    },
    {
      path: "event-created/:eventid",
      element: <EventCreatedPage/>,
    },
    {
      path: "event-updated/:eventid",
      element: <EventUpdatedPage/>,
    },
    {
      path: "event-postponed/:eventid",
      element: <EventPostponed/>,
    },
    {
      path: "view-event/:eventid",
      element: <ViewanEventPage />,
    },
    {
      path: "update-event/:eventid", 
      element: <UpdateEvents/>,
    },
    {
      path: "postpone-event/:eventid",
      element: <PostponeEvents/>,
    },
    {
      path: "cancel-event/:eventid",
      element: <CancelEvents/>,
    },
    {
      path: "complete-event/:eventid",
      element: <CompleteEvents/>,
    },
    {
      path:"display-event/:attendeeid/:eventid",
      element:<DisplayEvent/>
    },
    {
      path:"organizer-profile/:organizerid",
      element:<OrganizerProfile/>
    },
    {
      path:"edit-organizer-profile/:organizerid",
      element:<EditOrganizerProfile/>
    },
    {
      path:"organizer-email-verify",
      element:<OrganizerEmailVerification/>
    },
    {
      path:"organizer-change-pw",
      element:<OrganizerChangePassword/>
    },
    {
      path:"attendee-profile/:attendeeid",
      element:<AttendeeProfile/>
    },
    {
      path:"attendee-email-verify",
      element:<AttendeeEmailVerification/>
    },
    {
      path:"edit-attendee-profile/:attendeeid",
      element:<EditAttendeeProfile/>
    },
    {
      path:"attendee-change-pw",
      element:<AttendeeChangePassword/>
    },
    {
      path:"contact-us",
      element:<ContactUsPage/>
    }
  ]);

  return element;
};

export default ProjectRoutes;
