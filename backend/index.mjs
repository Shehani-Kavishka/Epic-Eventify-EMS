import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { URL } from 'url';
import { dirname,join } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import {sendOTPEmail} from './mailer.js';
import connection from './connection.js';
import { sendContactEmail } from './contactService.js';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {firebaseConfig} from './firebase.js';
import { error } from 'console';


const app = express();
app.use(cors());
app.use(express.json());

//check backend
app.get("/",(req,res)=>{
    res.end("Backend working");
})

//Route to handle fetching userid, attendee id by username - attendee
app.get("/attendee/:username",(req,res)=>{
    const username = req.params.username;
    const sql = "SELECT users.userid, attendeeid FROM users, attendee WHERE fullname = ? AND users.userid = attendee.userid";
    connection.query(sql,[username],(err,data)=>{
        if(err){
            console.error("Error fetching organizer id: ",err);
            return res.json(err);
        }
        if(data.length>0){
            return res.json(data[0]);
        }
        else{
            return res.json({error:"user not found"});
        }
    })
}) 

//Route to handle fetching userid, organizerid by username - organizer
app.get("/organizer/:username",(req,res)=>{
    const username = req.params.username;
    const sql = "SELECT users.userid,organizerid FROM users, organizer WHERE fullname = ? AND users.userid = organizer.userid";
    connection.query(sql,[username],(err,data)=>{
        if(err){
            console.error("Error fetching organizer id: ",err);
            return res.json(err);
        }
        if(data.length>0){
            return res.json(data[0]);
        }
        else{
            return res.json({error:"user not found"});
        }
    })
})

//Route to handle fetching user details by user id
app.get("/users/:userid",(req,res)=>{
    const userid = req.params.userid;
    const sql = "SELECT * FROM users WHERE userid = ?";
    connection.query(sql,[userid],(err,data)=>{
        if(err){
            console.error("Error fetching user details: ",err);
            return res.json(err);
        }
        if(data.length>0){
            return res.json(data[0]);
        }
        else{
            return res.json({error:"user not found"});
        }
    })
})

//Route to handle fetching organizer  details by organizer id
app.get("/organizers/:organizerid",(req,res)=>{
    const organizerid = req.params.organizerid;
    const sql = "SELECT * FROM organizer, users WHERE organizer.userid = users.userid AND organizerid = ?";
    connection.query(sql,[organizerid],(err,data)=>{
        if(err){
            console.error("Error fetching attendee detials: ",err);
            return res.json(err);
        }
        if(data.length>0){
            return res.json(data[0]);
        }
        else{
            return res.json({error:"organizer not found"});
        }
    })
})

//Route to handle fetching attendee details by attendee id
app.get("/attendees/:attendeeid",(req,res)=>{
    const attendeeid = req.params.attendeeid;
    const sql = "SELECT * FROM attendee, users WHERE attendee.userid = users.userid AND attendeeid = ?";
    connection.query(sql,[attendeeid],(err,data)=>{
        if(err){
            console.error("Error fetching attendee details: ",err);
            return res.json(err);
        }
        if(data.length>0){
            return res.json(data[0]);
        }
        else{
            return res.json({error:"attendee not found"});
        }
    })
})

//Route to handle get requests for all events by organizer id
app.get("/events/:organizerid",(req,res)=>{
    const organizerid = req.params.organizerid;
    const sql = "SELECT * FROM events WHERE organizerid = ? ORDER BY (eventid) DESC";
    connection.query(sql,[organizerid],(err,data)=>{
        if(err){
            console.error("Error fetching events:", err);
            return res.json(err);
        }
        return res.json(data);
    });
});

//Route to handle get requests for all events (attendee logged in)
app.get("/events/attendee/:attendeeid",(req,res)=>{
    const sql = "SELECT * FROM events WHERE status = 'Ongoing' ORDER BY eventid DESC";
    connection.query(sql,(err,data)=>{
        if(err){
            console.error("Error fetching events ",err);
            return res.json(err);
        }
        return res.json(data);
    });
});

//Route to handle get requests for all events (attendee not logged in)
app.get("/events",(req,res)=>{
    const sql = "SELECT * FROM events WHERE status = 'Ongoing' ORDER BY eventid DESC";
    connection.query(sql,(err,data)=>{
        if(err){
            console.error("Error fetching events ",err);
            return res.json(err);
        }
        return res.json(data);
    });
});

// Route to handle search requests for events by organizer
app.get("/searchOrg",(req,res) => {
    const query = req.query.query;
    const organizerid = req.query.organizerid;
    const sql = "SELECT * FROM events WHERE eventname LIKE ? AND organizerid = ? ORDER BY eventid DESC";
    connection.query(sql, [`%${query}%`, organizerid], (err,data) => {
        if(err){
            console.error("Error searching events: ",err);
            return res.json(err);
        }
        return res.json(data);
    })
})

// Route to handle search requests for events by attendee
app.get("/search",(req,res) => {
    const query = req.query.query;
    const sql = "SELECT * FROM events WHERE eventname LIKE ? AND status = 'Ongoing' ORDER BY eventid DESC";
    connection.query(sql, [`%${query}%`], (err,data) => {
        if(err){
            console.error("Error searching events: ",err);
            return res.json(err);
        }
        return res.json(data);
    })
})

//Route to handle filter requests by an organizer
app.get("/filterEventsByStatus",(req,res) => {
    const {status, organizerid} = req.query;
    const sql = "SELECT * FROM events WHERE status = ? AND organizerid = ? ORDER BY eventid DESC";
    connection.query(sql, [status, organizerid], (err, data) => {
        if(err) {
            console.error("Error filtering events by status: ",err);
            return res.json(err);
        }
        return res.json(data);
    });
})

//Serve static files from the 'public' directory
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
app.use(express.static(path.join(__dirname,'public')));

// configure multer storage for file uploads 
const storage = getStorage(initializeApp(firebaseConfig));
const uploadfirebase = multer ({storage: multer.memoryStorage()});


// Route to handle post requests for creating events 
app.post("/events",uploadfirebase.single('file'), async(req,res) => {
    try {
        const {eventname, date, time, venue, organizer, description, type1, type2, type3, type4, organizerid} = req.body;
        const file = req.file;

        const storageRef = ref(storage, `eventimages/${Date.now()}_${file.originalname}`);
        await uploadBytes(storageRef, file.buffer);
        const downloadURL = await getDownloadURL(storageRef);

        const q = "insert into events (`eventname`,`date`,`time`,`venue`,`organizer`,`description`,`type1`,`type2`,`type3`,`type4`,`eventimage`,`organizerid`) values (?,?,?,?,?,?,?,?,?,?,?,?)";
        const values = [eventname, date, time, venue, organizer, description, type1, type2, type3, type4, downloadURL, organizerid];

        connection.query(q,values,(err,data)=>{
            if(err){
                console.error("Error inserting event:", err);
                return res.send(err);
            }
            return res.json(data);    
        });
    }
    catch (err) {
        console.error("error uploading to firebase: ", err);
        res.status(500).send(err);
    }
})

//Route to handle get request for a specific event 
app.get("/event/:eventid",(req,res)=>{
    const eventid = req.params.eventid;
    console.log("Fetching event with ID:", eventid);
    const sql = "SELECT * FROM events WHERE eventid = ?";
    connection.query(sql,[eventid],(err,data)=>{
        if (err) {
            console.error("Error fetching event:", err);
            return res.json(err);
        }
        if (data.length === 0) {
            console.log("No event found with this ID");
            return res.json({ error: "No event found with this ID" });
        }
        return res.json(data[0]);
    })
})

//Route to handle put request for updating events
app.put("/events/:eventid", uploadfirebase.single('file'), async(req,res) => {
    try{
        const eventid = req.params.eventid;
        const {eventname, date, time, venue, organizer, description, type1, type2, type3, type4} = req.body;
        const file = req.file;
        let downloadURL;
        
        if(file) {
            const storageRef = ref(storage, `eventimages/${Date.now()}_${file.originalname}`);
            await uploadBytes(storageRef,file.buffer);
            downloadURL = await getDownloadURL(storageRef);
        }

        const q = file ?
            "UPDATE events SET `eventname` =?, `date` =?, `time`=?, `venue`=?, `organizer`=?, `description`=?, `type1`=?, `type2`=?, `type3`=?, `type4`=?, `eventimage`=? WHERE `eventid`=?" :
            "UPDATE events SET `eventname` =?, `date` =?, `time`=?, `venue`=?, `organizer`=?, `description`=?, `type1`=?, `type2`=?, `type3`=?, `type4`=? WHERE `eventid`=?" ;
        
        const values = file ?
            [eventname, date, time, venue, organizer, description, type1, type2, type3, type4, downloadURL, eventid] :
            [eventname, date, time, venue, organizer, description, type1, type2, type3, type4, eventid];
        
        connection.query(q,values, (err,data) => {
            if(err) {
                console.error("error updating event :", err);
                return res.send(err);
            }
            return res.json(data);
        })
    }
    catch(err){
        console.error("error uploading to firebase ",err);
        res.status(500).send(err);
    }
})

//Route to handle put request for updating organizer profiles
app.put("/organizers/:organizerid/update",uploadfirebase.single('profileimage'), async(req,res)=>{
    try{
        const organizerid = req.params.organizerid;
        const {fullname, email, contactno, businessaddress, contactperson1, contactno1, contactperson2, contactno2} =req.body;
        const profileimage =req.file;
        let downloadURL;

        if(profileimage){
            const storageRef = ref(storage, `organizer_profile_images/${Date.now()}_${profileimage.originalname}`);
            await uploadBytes(storageRef, profileimage.buffer);
            downloadURL = await getDownloadURL(storageRef);
        }

        const q = profileimage ?
        "UPDATE organizer,users SET `fullname`=?, `email`=?, `contactno`=?, `businessaddress`=?, `contactperson1`=?, `contactno1`=?, `contactperson2` =?, `contactno2`=?, `profileimage`=? WHERE users.`userid` = organizer.`userid` AND organizer.`organizerid` =?":
        "UPDATE organizer,users SET `fullname`=?, `email`=?, `contactno`=?, `businessaddress`=?, `contactperson1`=?, `contactno1`=?, `contactperson2` =?, `contactno2`=? WHERE users.`userid` = organizer.`userid` AND organizer.`organizerid` =?";
        
        const values = profileimage?
            [fullname, email, contactno, businessaddress, contactperson1, contactno1, contactperson2, contactno2, downloadURL, organizerid]:
            [fullname, email, contactno, businessaddress, contactperson1, contactno1, contactperson2, contactno2, organizerid];
        
        connection.query(q, values,(err,data) => {
            if(err) {
                console.error("Error updating organizer:", err);
                return res.send(err);
            }
            return res.json(data);
        })
    }
    catch (err) {
        console.error("Error uploading to Firebase: ", err);
        res.status(500).send(err);
    }

})

//Route to handle put request for updating attendee profiles
app.put("/attendees/:attendeeid/update",uploadfirebase.single('profileimage'), async(req,res)=>{
    try{
        const attendeeid = req.params.attendeeid;
        const {fullname, email, NIC, contactno} =req.body;
        const profileimage =req.file;
        let downloadURL;

        if(profileimage) {
            const storageRef = ref(storage, `attendee_profile_images/${Date.now()}_${profileimage.originalname}`);
            await uploadBytes(storageRef, profileimage.buffer);
            downloadURL = await getDownloadURL(storageRef);
        }

        const q = profileimage ?
            "UPDATE attendee,users SET `fullname`=?, `email`=?, `NIC`=?, `contactno`=?, `profileimage`=? WHERE users.`userid` = attendee.`userid` AND attendee.`attendeeid` = ?" :
            "UPDATE attendee,users SET `fullname`=?, `email`=?, `NIC`=?, `contactno`=? WHERE users.`userid` = attendee.`userid` AND attendee.`attendeeid` = ?" ;

        const values = profileimage ?
            [fullname, email, NIC, contactno, downloadURL, attendeeid]:
            [fullname, email, NIC, contactno, attendeeid];

        connection.query(q, values,(err,data) => {
            if(err) {
                console.error("Error updating attendee:", err);
                return res.send(err);
            }
            return res.json(data);
        })
    }
    catch (err) {
        console.error("Error uploading to Firebase: ", err);
        res.status(500).send(err);
    }

})

//Route to handle updating event status - canceled
app.put("/events/:eventid/cancel",(req,res)=>{
    const eventid = req.params.eventid;
    const status = req.body.status;
    const sql = "UPDATE events SET status = ? WHERE eventid = ?";

    console.log(`updating eventid: ${eventid} to status: ${status}`);
    connection.query(sql,[status,eventid],(err,data)=>{
        if(err){
            console.error("Error updating event status: ",err);
            return res.json(err);
        }
        return res.json({message:"event status updated successfully"})
    })
})

//Route to handle updating event status - completed
app.put("/events/:eventid/complete",(req,res)=>{
    const eventid = req.params.eventid;
    const status = req.body.status;

    //fetch event date
    const sqlGetEventDate = "SELECT date FROM events WHERE eventid = ?";
    connection.query(sqlGetEventDate,[eventid], (err,data) =>{
        if(err){
            console.error("error fetching event date: ",err);
            return res.json(err);
        }
        if (data.length === 0){
            return res.json({error: "Event Not Found"});
        }

        const eventdate = new Date(data[0].date);
        const currentdate = new Date();

        //check if the event date is in the past
        if(eventdate > currentdate){
            return res.json({error: "Event date has not passed yet"});
        }

        //update the event status
        const sql = "UPDATE events SET status = ? WHERE eventid = ?";
        connection.query(sql,[status,eventid],(err,data)=>{
            if(err){
                console.error("Error updating event status: ",err);
                return res.json(err);
            }
            return res.json({message:"event status updated successfully"})
        })
    })
    
})

const otpStore = {};

//Route to send OTP
app.post('/send-otp',async(req,res)=>{
    const {email} = req.body;
    const otp = crypto.randomInt(100000,999999).toString();
    otpStore[email] = otp;

    try {
        sendOTPEmail(email, otp); 
        res.json({ message: 'OTP sent' });
    } catch (error) {
        console.error("Error sending OTP email:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//Route to verify OTP
app.post(`/verify-otp`,(req,res) =>{
    try{
        const {email, otp} = req.body;
        console.log("Received data:",req.body);

        // const otpStore = {};

        if(otpStore[email] && otpStore[email] === otp) {
            delete otpStore[email];
            res.json({message: `OTP verified`});
        }
        else{
            res.status(400).json({message: `Invalid OTP`})
        }
    }
    catch(error){
        console.error("error verifying otp",error);
        res.status(500).json({message:`internal server error`});
    }
});

//Route to handle changing the password
app.post('/change-password',(req,res)=>{
    const {email, oldpassword, newpassword} = req.body;
    const sqlselect = "SELECT password FROM users WHERE email = ?";

    connection.query(sqlselect,[email],(err,data)=>{
        if(err){
            console.error("Error fetching password: ",err);
            return res.status(500).json({success: false, message:"internal server error"})
        }
        if(data.length === 0 || data[0].password !== oldpassword){
            return res.status(400).json({ success: false, message: "old password is incorrect" });
        }
        if (oldpassword === newpassword) {
            return res.status(400).json({success:false,message:"your new password should not be same as the old password"});
        }
        const sqlUpdate = "UPDATE users SET password = ? WHERE email = ?";
        connection.query(sqlUpdate, [newpassword, email], (err, data) => {
            if (err) {
                console.error("Error updating password:", err);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
            res.json({ success: true, message: "password changed successfully" });
        });
    });
})

// //Route to handle attendee changing the password
// app.post('/change-password-atd',(req,res)=>{
//     const {email, oldpassword, newpassword} = req.body;
//     const sqlselect = "SELECT password FROM attendee WHERE email = ?";

//     connection.query(sqlselect,[email],(err,data)=>{
//         if(err){
//             console.error("Error fetching password: ",err);
//             return res.status(500).json({success: false, message:"internal server error"})
//         }
//         if(data.length === 0 || data[0].password !== oldpassword){
//             return res.status(400).json({ success: false, message: "old password is incorrect" });
//         }
//         if (oldpassword === newpassword) {
//             return res.status(400).json({success:false,message:"your new password should not be same as the old password"});
//         }
//         const sqlUpdate = "UPDATE attendee SET password = ? WHERE email = ?";
//         connection.query(sqlUpdate, [newpassword, email], (err, data) => {
//             if (err) {
//                 console.error("Error updating password:", err);
//                 return res.status(500).json({ success: false, message: "Internal server error" });
//             }
//             res.json({ success: true, message: "password changed successfully" });
//         });
//     });
// })

//Route to handle contact form submission
app.post('/api/contact',(req,res) => {
    const formData = req.body;
    sendContactEmail(formData);
    res.status(200).json({success:true,message:"email sent successfully"});
})

//start server 
app.listen(8080,()=>{
    console.log('successful');
});
 