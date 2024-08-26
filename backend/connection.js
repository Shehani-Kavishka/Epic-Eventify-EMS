import mysql from 'mysql2';

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'test'
});

connection.connect((err) =>{
    if (err) {
        console.error("Connection error:", err);
    } else {
        console.log("Database connected");
    }
});

export default connection;