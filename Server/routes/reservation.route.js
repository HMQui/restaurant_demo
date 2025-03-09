const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");

// Create a reservation [POST] /reservation/create
router.post("/create", reservationController.createReservation);

// Get reservations for a user [GET] /reservation/user-reservations
router.get("/user-reservations", reservationController.getUserReservations);

// Search reservations with filters [GET] /reservation/search
router.get("/search", reservationController.searchReservations);

// Update reservation status [POST] /reservation/update-status
router.post("/update-status", reservationController.updateReservationStatus);

// Delete a reservation [POST] /reservation/delete
router.post("/delete", reservationController.deleteReservation);

// Update reservation served status [POST] /reservation/update-served
router.post("/update-served", reservationController.updateReservationServed);

module.exports = router;
