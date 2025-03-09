const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const cron = require('node-cron');
const dayjs = require('dayjs');
require('dotenv').config();

const initSocket = require('./configs/initSocket');
const verifyToken = require('./middleWares/authServices');

const authenRouter = require('./routes/authen.route');
const usersRouter = require('./routes/users.route');
const reservationRouter = require('./routes/reservation.route');
const productsRouter = require('./routes/products.route');
// const ReservationModel = require('./models/Reservation');

const server = http.createServer(app);
initSocket(server);

// Configure CORS
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Middleware to read cookies
app.use(cookieParser());

// Middleware to parse JSON & URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_CONNECT)
  .then(() => console.log('Database - CONNECTED'))
  .catch((err) => console.log('Database - Error: ', err));

// Auth router
app.use('/api/auth', authenRouter);

// Users router
app.use('/api/users', verifyToken, usersRouter);

// Reservation router
app.use('/api/reservation', verifyToken, reservationRouter);

// Products router
app.use('/api/products', verifyToken, productsRouter);

// Automatic Cleanup Job: Remove expired reservations every midnight
// const cleanupExpiredReservations = async () => {
//   try {
//     const now = dayjs(); // Get current date and time

//     const expiredReservations = await ReservationModel.find({
//       status: "accepted",
//       $expr: {
//         $lt: [
//           { 
//             $dateFromString: { 
//               dateString: { 
//                 $concat: [
//                   { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, 
//                   " ", 
//                   "$time"
//                 ] 
//               }, 
//               format: "%Y-%m-%d %H:%M" 
//             } 
//           },
//           new Date()
//         ]
//       }
//     });
    

//     if (expiredReservations.length > 0) {
//       await ReservationModel.deleteMany({
//         _id: { $in: expiredReservations.map(res => res._id) }
//       });

//       console.log(`✅ Deleted ${expiredReservations.length} expired reservations.`);
//     } else {
//       console.log("⏳ No expired reservations found.");
//     }
//   } catch (error) {
//     console.error("❌ Error cleaning up reservations:", error);
//   }
// };

// // Schedule cleanup every day at midnight (00:00 UTC)
// cron.schedule("0 0 * * *", cleanupExpiredReservations, {
//   scheduled: true,
//   timezone: "UTC",
// });

// cleanupExpiredReservations()
//   .then(() => console.log('Cleanup worked'))
//   .catch((error) => console.log('Cleanup false: ', error))

// Start Server
server.listen(process.env.PORT, function(err){
  if (err) console.log("Error in server setup");
  console.log("Server has been started at PORT", process.env.PORT);
});
