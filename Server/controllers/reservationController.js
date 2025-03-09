const mongoose = require("mongoose");
const ReservationModel = require("../models/Reservation");
const { sendReservationMail } = require("../services/sendMail");

const createReservation = async (req, res) => {
    const orderData = req.body.orderData;
    const userId = req.userId;
    
    try {
        orderData.userId = userId;
        orderData.partySize = parseInt(orderData.partySize);

        const existingReservation = await ReservationModel.findOne({
            userId: userId,
            date: orderData.date,
            time: orderData.time,
            status: { $in: ["pending", "accepted"] },
        });

        if (existingReservation) {
            return res.status(200).json({ error: 1, message: "Reservation already exists" });
        }
        
        const existingReservationAtRejeted = await ReservationModel.findOne({
            userId: userId,
            date: orderData.date,
            time: orderData.time,
            status: "rejected",
        });

        if (existingReservationAtRejeted) {
            await ReservationModel.deleteOne({ id: existingReservationAtRejeted.id });
        }

        const newReservation = new ReservationModel(orderData);
        newReservation.status = "pending";
        await newReservation.save();

        res.status(200).json({ error: 0, message: "Reservation created successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 1, message: "Server error" });
    }
};

const getUserReservations = async (req, res) => {    
    const userId = req.userId;

    try {
        const reservations = await ReservationModel.find({ 
            userId: userId, 
        })
        .select("-_id -createdAt -updatedAt")
        .lean();

        res.json({ error: 0, reservations: reservations || [] });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 1, message: "Server error" });
    }
};

const searchReservations = async (req, res) => {
    try {
        let filter = {};

        // Dynamically add filters from query parameters
        for (const key in req.query) {
            if (req.query[key]) {
                if (key === "partySize") {
                    filter[key] = Number(req.query[key]);
                } else if (key === "date") {
                    const date = req.query[key];
                    filter[key] = new Date(`${date}T00:00:00.000Z`);
                } else if (key === "userId") {
                    filter[key] = req.query[key];
                } else if (key === "userCancel") {
                    filter[key] = req.query[key] === "true";
                } else {
                    filter[key] = req.query[key];
                }
            }
        }        

        const reservations = await ReservationModel.find(filter)
            .select("-_id -createdAt -updatedAt")
            .lean();

        res.json({ error: 0, reservations: reservations || [] });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 1, message: "Server error" });
    }
};

const updateReservationStatus = async (req, res) => {
    const { orderData, status } = req.body;
    
    try {
        if (!orderData || !status) {
            return res.status(400).json({ error: 1, message: "Missing required fields" });
        }

        const id = orderData.id;
        await ReservationModel.updateOne({ id: id }, { $set: { status: status } });

        // Send email notification
        // await sendReservationMail(status === "accepted", "Reservation Accepted", orderData.email, orderData);

        res.json({ error: 0, message: "Reservation status updated successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 1, message: "Server error" });
    }
};

const deleteReservation = async (req, res) => {
    const { id } = req.body;

    try {
        await ReservationModel.deleteOne({ id: id });
        return res.status(200).json({ error: 0, message: "Reservation deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 1, message: "Server error" });
    }
};

const updateReservationServed = async (req, res) => {
    const { id, served } = req.body;
    console.log(id, served);

    try {
        if (!id || served === undefined) {
            return res.status(400).json({ error: 1, message: "Missing required fields" });
        }
        await ReservationModel.updateOne({ id: id }, { $set: { served: served } });
        return res.status(200).json({ error: 0, message: "Reservation served updated successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 1, message: "Server error" });
    }
}

module.exports = {
    createReservation,
    getUserReservations,
    searchReservations,
    updateReservationStatus,
    deleteReservation,
    updateReservationServed,
};
