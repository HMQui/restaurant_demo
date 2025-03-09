import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router';
import { io } from 'socket.io-client';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

import ServingReservation from './ServingReservation';
import SearchingReservation from './SearchingReservation';
import { updateReservationStatus, searchReservations } from '../../../../services/apis/reservationApi';

const socket = io('http://localhost:5000', { transports: ['websocket'] });

function AdminReservation() {
    const [orders, setOrders] = useState([]);
    const [todayRervation, setTodayReservation] = useState([]);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('new_order', (data) => {
            socket.emit('join-room', data.userId);

            let isDuplicate = false;
            orders.forEach((order) => {
                if (order.id === data.id) {
                    isDuplicate = true;
                }
            });

            if (isDuplicate) {
                return;
            }
            setOrders((prevOrders) => [...prevOrders, data]);
        });

        socket.on('order-cancel', (id) => {
            setTodayReservation((prevReservations) => prevReservations.filter((item) => item.id !== id));
            setOrders((prevOrders) => prevOrders.filter((item) => item.id !== id));
        });

        const fetch = async () => {
            const currentDate = new Date().toISOString().split('T')[0];

            try {
                const responseTodayServing = await searchReservations({
                    status: 'accepted',
                    date: currentDate,
                });
                if (responseTodayServing.erorr === 1) {
                    return console.log('Failed to fetch reservations');
                }

                setTodayReservation(responseTodayServing.reservations);

                const responsePending = await searchReservations({ status: 'pending' });
                if (responsePending.error === 1) {
                    return console.log('Failed to fetch reservations');
                }
                const reservations = responsePending.reservations;
                reservations.forEach((reservation) => {
                    socket.emit('join-room', reservation.userId);
                    setOrders((prevOrders) => [...prevOrders, reservation]);
                });
            } catch (error) {
                console.log(error);
            }
        };

        fetch();

        return () => {
            socket.off('connect');
            socket.off('new_order');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleResponseReservation = async (order, status) => {
        try {
            const response = await updateReservationStatus(order, status);

            if (response.erorr === 1) {
                return socket.emit('admin-response', {
                    erorr: 1,
                    message: 'Failed to accept reservation. Server is borken',
                });
            }
            socket.emit('admin-response', {
                erorr: 0,
                message: `Reservation request has been ${status}ed`,
                status,
                id: order.id,
                userId: order.userId,
            });

            setOrders((prevOrders) => prevOrders.filter((item) => item.id !== order.id));
            if (status === 'accepted') {
                const currentDate = new Date().toISOString().split('T')[0];
                const res = await searchReservations({ status: 'accepted', date: currentDate });
                setTodayReservation(res.reservations);
            }
        } catch (error) {
            console.log(error);
            socket.emit('admin-response', {
                erorr: 1,
                message: 'Failed to accept reservation. Server is borken',
                id: order.id,
            });
        }
    };

    return (
        <div className="py-6 w-3/4">
            <h1 className="text-3xl font-bold mb-4">Reservation Requests</h1>

            <TableContainer component={Paper} className="shadow-lg rounded-lg w-full">
                <Table>
                    <TableHead>
                        <TableRow className="bg-gray-200">
                            <TableCell className="font-bold" sx={{ textAlign: 'center' }}>
                                #
                            </TableCell>
                            <TableCell className="font-bold" sx={{ textAlign: 'center' }}>
                                Name
                            </TableCell>
                            <TableCell className="font-bold" sx={{ textAlign: 'center' }}>
                                Email
                            </TableCell>
                            <TableCell className="font-bold" sx={{ textAlign: 'center' }}>
                                Date
                            </TableCell>
                            <TableCell className="font-bold" sx={{ textAlign: 'center' }}>
                                Time
                            </TableCell>
                            <TableCell className="font-bold" sx={{ textAlign: 'center' }}>
                                Party Size
                            </TableCell>
                            <TableCell className="font-bold" sx={{ textAlign: 'center' }}>
                                Notices
                            </TableCell>
                            <TableCell className="font-bold" sx={{ textAlign: 'center' }}>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.length > 0 ? (
                            orders.map((order, index) => (
                                <TableRow key={index} className="hover:bg-gray-100">
                                    <TableCell className="border border-gray-300" sx={{ textAlign: 'center' }}>
                                        {index + 1}
                                    </TableCell>
                                    <TableCell className="border border-gray-300">{order.name}</TableCell>
                                    <TableCell className="border border-gray-300">{order.email}</TableCell>
                                    <TableCell className="border border-gray-300" sx={{ textAlign: 'center' }}>
                                        {order.date.split('T')[0]}
                                    </TableCell>
                                    <TableCell className="border border-gray-300" sx={{ textAlign: 'center' }}>
                                        {order.time}
                                    </TableCell>
                                    <TableCell className="border border-gray-300" sx={{ textAlign: 'center' }}>
                                        {order.partySize}
                                    </TableCell>
                                    <TableCell className="border border-gray-300">{order.notices || 'N/A'}</TableCell>
                                    <TableCell
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            gap: '5px',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            color="success"
                                            className="mr-2"
                                            onClick={() => handleResponseReservation(order, 'accepted')}
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => handleResponseReservation(order, 'rejected')}
                                        >
                                            Reject
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="py-4" sx={{ textAlign: 'center' }}>
                                    No reservations yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {todayRervation && <ServingReservation reservationsData={todayRervation} />}

            <SearchingReservation />
        </div>
    );
}

export default AdminReservation;
