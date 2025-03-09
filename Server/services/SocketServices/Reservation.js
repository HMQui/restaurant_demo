const reservationIo = (io) => {
    io.on("connect", (socket) => {
        socket.on("join-room", (userId) => {            
            socket.join(userId);            
        });

        socket.on("client-order", (orderData) => {
            io.emit("new_order", orderData)
        })

        socket.on("admin-response", (response) => {     
            io.to(response.userId).emit("order-status", response)
        })

        socket.on("client-cancel", (id) => {
            io.emit("order-cancel", id)
        })

        socket.on("disconnect", () => {
        });
    })
}

module.exports = reservationIo
