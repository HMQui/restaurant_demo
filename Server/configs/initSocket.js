const { Server } = require('socket.io')
const reservationIo = require('../services/SocketServices/Reservation')
require('dotenv').config()

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            methods: ['GET', 'POST'],
        }
    })

    reservationIo(io)

}

module.exports = initSocket
