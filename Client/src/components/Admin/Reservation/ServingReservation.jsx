import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Card,
    CardHeader,
    CardContent,
    Typography,
    CardActions,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import dayjs from 'dayjs';
import io from 'socket.io-client';

import { deleteReservation, updateServedStatus } from '../../../../services/apis/reservationApi';

const socket = io('http://localhost:5000');

function ServingReservation({ reservationsData }) {
    reservationsData = reservationsData.sort((a, b) => a.time.localeCompare(b.time));

    // Store reservations in state
    const [reservations, setReservations] = useState(reservationsData);
    const [openDialog, setOpenDialog] = useState({
        cancel: {
            open: false,
            reservation: {},
        },
        served: {
            open: false,
            reservation: {},
        },
    });

    // Function to update expired status
    const updateReservations = useCallback(() => {
        setReservations(
            reservationsData.map((reservation) => {
                const currentTime = dayjs();
                const reservationDateTime = dayjs(
                    `${dayjs(reservation.date).format('YYYY-MM-DD')} ${reservation.time}`,
                    'YYYY-MM-DD HH:mm',
                );
                return { ...reservation, expired: currentTime.isAfter(reservationDateTime) };
            }),
        );
    }, [reservationsData]);

    // Run update initially and then every 5 minutes
    useEffect(() => {
        updateReservations();

        const interval = setInterval(() => {
            updateReservations();
        }, 5 * 60 * 1000); // 5 minutes

        return () => clearInterval(interval);
    }, [updateReservations]);

    const handleCancelReservation = async (reservation) => {
        try {
            // Delete reservation from database
            await deleteReservation(reservation.id);
            // Send cancel request to server
            socket.emit('client-cancel', reservation.id);
        } catch (error) {
            console.error(error);
        }
    };

    const handleServedReservation = async (reservation) => {
        try {
            // Update served status in database
            await updateServedStatus(reservation.id, true);
            setReservations((prev) =>
                prev.map((item) => {
                    if (item.id === reservation.id) {
                        return { ...item, served: true };
                    }
                    return item;
                }),
            );
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="mt-10 w-full flex flex-col flex-wrap gap-5">
            <h2 className="text-2xl font-bold">All reservations for today</h2>
            <div className="w-full flex flex-row flex-wrap gap-10">
                {reservations.map((reservation, index) => (
                    <Box key={reservation.id}>
                        <Card sx={{ width: 350 }}>
                            <CardHeader
                                title={
                                    <Typography
                                        gutterBottom
                                        variant="h5"
                                        component="div"
                                        style={{
                                            fontWeight: 'bold',
                                            color: reservation.expired || reservation.served ? 'gray' : '#035772',
                                            display: 'flex',
                                            direction: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            textDecoration:
                                                reservation.expired || reservation.served ? 'line-through' : 'none',
                                        }}
                                    >
                                        <span className={`text-sm ${reservation.expired ? 'line-through' : ''}`}>
                                            {index + 1}
                                        </span>
                                        <span className="mx-auto">{reservation.time}</span>
                                    </Typography>
                                }
                                subheader={
                                    <Typography variant="body2" color="text.secondary">
                                        {reservation.date.split('T')[0]}
                                    </Typography>
                                }
                                style={{ textAlign: 'center' }}
                            />
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    Name: {reservation.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Email: {reservation.email}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Party Size: {reservation.partySize}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Notices: {reservation.notices}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    disabled={reservation.expired || reservation.served}
                                    onClick={() =>
                                        setOpenDialog((prev) => ({
                                            ...prev,
                                            served: { open: true, reservation: reservation },
                                        }))
                                    }
                                >
                                    Served
                                </Button>
                                <Button
                                    disabled={reservation.expired || reservation.served}
                                    onClick={() =>
                                        setOpenDialog((prev) => ({
                                            ...prev,
                                            cancel: { open: true, reservation: reservation },
                                        }))
                                    }
                                >
                                    Cancel
                                </Button>
                            </CardActions>
                        </Card>
                    </Box>
                ))}
            </div>
            {/* Dialog For CANCEL A RESERVATION */}
            <Dialog
                open={openDialog.cancel.open}
                onClose={() => {
                    setOpenDialog((prev) => ({ ...prev, cancel: { open: false, id: '' } }));
                }}
                fullWidth
            >
                <DialogTitle>Cancel Reservation</DialogTitle>
                <DialogContent>
                    <DialogContentText>Wanna cancel the reservation?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog((prev) => ({ ...prev, cancel: { open: false, id: '' } }))}>
                        No, i don&apos;t think so
                    </Button>
                    <Button
                        onClick={() => {
                            handleCancelReservation(openDialog.cancel.reservation);
                            setOpenDialog((prev) => ({ ...prev, cancel: { open: false, id: '' } }));
                        }}
                    >
                        Yes, i do
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog For SERVED A RESERVATION */}
            <Dialog
                open={openDialog.served.open}
                onClose={() => {
                    setOpenDialog((prev) => ({ ...prev, served: { open: false, id: '' } }));
                }}
                fullWidth
            >
                <DialogTitle>Served Reservation</DialogTitle>
                <DialogContent>
                    <DialogContentText>Wanna served the reservation?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog((prev) => ({ ...prev, served: { open: false, id: '' } }))}>
                        No, i don&apos;t think so
                    </Button>
                    <Button
                        onClick={() => {
                            handleServedReservation(openDialog.served.reservation);
                            setOpenDialog((prev) => ({ ...prev, served: { open: false, id: '' } }));
                        }}
                    >
                        Yes, i do
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

ServingReservation.propTypes = {
    reservationsData: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            userId: PropTypes.object.isRequired,
            name: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,
            time: PropTypes.string.isRequired,
            partySize: PropTypes.number.isRequired,
            notices: PropTypes.string,
            status: PropTypes.string.isRequired,
            served: PropTypes.bool.isRequired,
            __v: PropTypes.number.isRequired,
        }),
    ),
};

export default ServingReservation;
