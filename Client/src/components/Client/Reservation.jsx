import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import {
    Button,
    Grid,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { ToastContainer, toast, Bounce } from 'react-toastify';

import { userInfoFull } from '../../../services/apis/userApi.js';
import isValidEmail from '../../../services/isValidEmail.js';
import { createReservation, getUserReservations, deleteReservation } from '../../../services/apis/reservationApi.js';

const socket = io('http://localhost:5000', { transports: ['websocket'] });

const notify = (text, type = 'success', hideProgress, timeToClose = 2000) => {
    toast[type](text, {
        position: 'top-right',
        autoClose: timeToClose,
        hideProgressBar: hideProgress,
        closeOnClick: true,
        draggable: false,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
    });
};

function Reservation() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [requestData, setResquestData] = useState([]);
    const [orderData, setOrderData] = useState({
        id: '',
        name: '',
        email: '',
        time: '',
        date: '',
        partySize: '2',
        notices: '',
    });
    const [isValid, setIsValid] = useState({
        name: {
            isValid: true,
            message: '',
        },
        email: {
            isValid: true,
            message: '',
        },
        partySize: {
            isValid: true,
            message: '',
        },
    });
    const [openDialog, setOpenDialog] = useState({
        cancel: {
            open: false,
            order: {},
        },
        delete: {
            open: false,
            order: {},
        },
    });

    // Load all user data and connect to socket
    useEffect(() => {
        const fetchUserAndConnect = async () => {
            try {
                const res = await userInfoFull();
                setUserId(res._id);
                setOrderData((prev) => ({ ...prev, name: res.username, email: res.email }));
                socket.emit('join-room', res._id);

                const resReservations = await getUserReservations();

                resReservations.reservations = resReservations.reservations.sort((a, b) =>
                    a.time.localeCompare(b.time),
                );

                setResquestData(() => [...resReservations.reservations]);
            } catch (error) {
                console.error('Error at get init data in Reservation', error);
            }
        };

        fetchUserAndConnect();

        socket.on('order-status', (response) => {
            if (response.error === 1) {
                notify(response.message + 'at on request one', 'error', false);
            } else {
                notify(response.message, 'success', false);
                setResquestData((prev) =>
                    prev.map((order) => {
                        if (order.id === response.id) {
                            return { ...order, status: response.status };
                        }
                        return order;
                    }),
                );
            }
        });

        socket.on('order-cancel', (id) => {
            setResquestData((prev) => prev.filter((item) => item.id !== id));
            notify('One reservation has been canceled!', 'success', false);
        });

        return () => {
            socket.off('order-status');
        };
    }, []);

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        let isValid = true;
        const newIsValid = {
            name: { isValid: true, message: '' },
            email: { isValid: true, message: '' },
            partySize: { isValid: true, message: '' },
        };

        if (!orderData.name.trim() === '') {
            newIsValid.name = { isValid: false, message: 'Name is required!' };
            isValid = false;
        }

        if (!isValidEmail(orderData.email) || orderData.email.trim() === '') {
            if (orderData.email.trim() === '') {
                newIsValid.email = { isValid: false, message: 'Email is required!' };
            } else {
                newIsValid.email = { isValid: false, message: 'Invalid email!' };
            }
            isValid = false;
        }

        if (Number(orderData.partySize) <= 0 || isNaN(Number(orderData.partySize))) {
            if (isNaN(Number(orderData.partySize))) {
                newIsValid.partySize = { isValid: false, message: 'Party size must be a number!' };
            } else {
                newIsValid.partySize = { isValid: false, message: 'Party size must be greater than 0!' };
            }
            isValid = false;
        }

        if (orderData.time === '') {
            notify('Please select a time!', 'error', false);
            return;
        }

        if (orderData.date === '') {
            notify('Please select a date!', 'error', false);
            return;
        }

        if (
            dayjs(orderData.date).isSame(dayjs(), 'day') &&
            dayjs(`${orderData.date} ${orderData.time}`, 'YYYY/MM/DD HH:mm').isBefore(dayjs())
        ) {
            notify('You can not select a time in the past!', 'error', false);
            return;
        }

        requestData.forEach((order) => {
            if (order.date === orderData.date && order.time === orderData.time && order.status !== 'rejected') {
                notify('This time slot has been taken!', 'error', false);
                isValid = false;
            }
        });

        if (!isValid) {
            setIsValid(newIsValid);
            return;
        }

        if (userId) {
            const generatedId = userId + String(orderData.date) + String(orderData.time);
            const newOrder = { ...orderData, id: generatedId };

            socket.emit('client-order', { ...newOrder, userId });
            const res = await createReservation(newOrder);
            if (res.error === 1) {
                notify('You have request this reservations before!', 'error', false);
                return;
            }

            setResquestData((prev) => [...prev, { ...newOrder, status: 'pending' }]);
            setOrderData((prev) => ({ ...prev, time: '', date: '' }));
            notify('Your reservation request has been sent!', 'success', false);
        }
    };

    const handleCancleRequest = async (order) => {
        try {
            const reservationDateTime = dayjs(
                `${dayjs(order.date).format('YYYY-MM-DD')} ${order.time}`,
                'YYYY-MM-DD HH:mm',
            );

            const now = dayjs();
            if (now.isAfter(reservationDateTime)) {
                notify("You can't cancel this reservation. Please reset the page", 'error', true, 5000);
                return;
            }
            await deleteReservation(order.id);
            setResquestData((prev) => prev.filter((item) => item.id !== order.id));
            notify('Reservation has been canceled!', 'success', false);

            socket.emit('client-cancel', order.id);
        } catch (error) {
            console.error('Error at handleCancleRequest in Reservation', error);
            notify('Failed to cancel reservation!', 'error', false);
        }
    };

    const handleDelteReservation = async (id) => {
        try {
            await deleteReservation(id);
            setResquestData((prev) => prev.filter((item) => item.id !== id));
            notify('Reservation has been deleted!', 'success', false);
            // socket.emit('client-cancel', id);
        } catch (error) {
            console.error('Error at handleDelteReservation in Reservation', error);
            notify('Failed to delete reservation!', 'error', false);
        }
    };

    return (
        <div className="py-20 px-28 w-full min-h-full flex flex-col justify-start items-start">
            <div className="flex flex-row justify-start items-center text-2xl">
                <Button
                    sx={{
                        color: 'black',
                        '&:hover': {
                            backgroundColor: 'transparent',
                            fontWeight: '500',
                            color: '#035772',
                        },
                        fontWeight: '300',
                    }}
                    onClick={() => navigate('/')}
                >
                    Home
                </Button>
                <ArrowForwardIosIcon sx={{ fontSize: '14px' }} />
                <Button
                    sx={{
                        color: '#035772',
                        '&:hover': {
                            backgroundColor: 'transparent',
                        },
                        fontWeight: '500',
                    }}
                >
                    Reservation
                </Button>
            </div>
            <div className="w-full flex flex-col justify-start items-center gap-5">
                <h1 className="text-3xl font-semibold">Make a Reservation</h1>
                <h3 className="text-[15px] font-light">
                    Select your details and we&apos;ll try to get the seat for you
                </h3>
            </div>
            <form
                className="w-3/4 flex flex-col justify-start items-start gap-5"
                style={{ margin: 'auto' }}
                onSubmit={handleSubmitForm}
            >
                <Grid container spacing={2} width={'100%'} sx={{ margin: 'auto' }}>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Name"
                            value={orderData.name}
                            onChange={(e) => {
                                setOrderData((prev) => ({ ...prev, name: e.target.value }));
                                setIsValid((prev) => ({ ...prev, name: { isValid: true, message: '' } }));
                            }}
                            error={!isValid.name.isValid}
                            helperText={isValid.name.message}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Email"
                            value={orderData.email}
                            onChange={(e) => {
                                setOrderData((prev) => ({ ...prev, email: e.target.value }));
                                setIsValid((prev) => ({ ...prev, email: { isValid: true, message: '' } }));
                            }}
                            error={!isValid.email.isValid}
                            helperText={isValid.email.message}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Party Size"
                            value={orderData.partySize}
                            onChange={(e) => {
                                setOrderData((prev) => ({ ...prev, partySize: e.target.value }));
                                setIsValid((prev) => ({ ...prev, partySize: { isValid: true, message: '' } }));
                            }}
                            error={!isValid.partySize.isValid}
                            helperText={isValid.partySize.message}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Enter your phone number or any special request"
                            value={orderData.notices}
                            onChange={(e) => setOrderData((prev) => ({ ...prev, notices: e.target.value }))}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                                ampm={false}
                                sx={{ width: '100%', height: '30px' }}
                                label="Time"
                                value={orderData.time ? dayjs(orderData.time, 'HH:mm') : null}
                                onChange={(newValue) =>
                                    setOrderData({ ...orderData, time: newValue ? newValue.format('HH:mm') : '' })
                                }
                                minTime={dayjs().hour(9).minute(0)}
                                maxTime={dayjs().hour(21).minute(0)}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                disablePast
                                sx={{ width: '100%', height: '30px' }}
                                label="Date"
                                value={orderData.date ? dayjs(orderData.date) : null}
                                onChange={(newValue) =>
                                    setOrderData({ ...orderData, date: newValue ? newValue.format('YYYY-MM-DD') : '' })
                                }
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sx={{ marginTop: '15px' }}>
                        <span className="text-accent-1 font-semibold">
                            Reservation forms will be processed from 9:00 AM to 6:00 PM. Please allow 5-10 minutes for a
                            response. You will receive an email confirming or declining your reservation.
                        </span>
                    </Grid>
                </Grid>
                <Button
                    size="large"
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: '15px', marginLeft: '15px' }}
                    type="submit"
                >
                    Submit
                </Button>
            </form>
            <hr className="my-10 m-auto w-2/5 border border-accent-1" />
            <div className="w-full flex flex-col justify-start items-center">
                <h2 className="text-xl font-semibold">All Your Reservation Request</h2>
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
                                    Status
                                </TableCell>
                                <TableCell className="font-bold" sx={{ textAlign: 'center' }}>
                                    More
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requestData.length > 0 ? (
                                requestData.map((order, index) => (
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
                                        <TableCell className="border border-gray-300">
                                            {order.notices || 'N/A'}
                                        </TableCell>
                                        <TableCell
                                            className={`border border-gray-300 capitalize text-accent-1`}
                                            sx={{
                                                textAlign: 'center',
                                                color: { pending: '#B7BD00', accepted: '#00BD2C', rejected: 'red' }[
                                                    order.status
                                                ],
                                            }}
                                        >
                                            {order.status}
                                            <br />
                                            <span className="text-sm">{order.served && '(Served)'}</span>
                                        </TableCell>
                                        <TableCell className="border border-gray-300" sx={{ textAlign: 'center' }}>
                                            {(() => {
                                                const reservationDateTime = dayjs(
                                                    `${dayjs(order.date).format('YYYY-MM-DD')} ${order.time}`,
                                                    'YYYY-MM-DD HH:mm',
                                                );

                                                const now = dayjs();

                                                if (order.status === 'pending') {
                                                    return (
                                                        <Button
                                                            onClick={() =>
                                                                setOpenDialog((prev) => ({
                                                                    ...prev,
                                                                    cancel: { open: true, order: order },
                                                                }))
                                                            }
                                                        >
                                                            Cancel
                                                        </Button>
                                                    );
                                                } else if (
                                                    order.status === 'accepted' &&
                                                    now.isBefore(reservationDateTime) &&
                                                    !order.served
                                                ) {
                                                    return (
                                                        <div className="flex flex-row justify-center items-center gap-1">
                                                            <Button
                                                                onClick={() =>
                                                                    setOpenDialog((prev) => ({
                                                                        ...prev,
                                                                        cancel: { open: true, order: order },
                                                                    }))
                                                                }
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    );
                                                } else {
                                                    return (
                                                        <IconButton
                                                            onClick={() =>
                                                                setOpenDialog((prev) => ({
                                                                    ...prev,
                                                                    delete: { open: true, order },
                                                                }))
                                                            }
                                                            sx={{ color: 'red' }}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    );
                                                }
                                            })()}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={9} sx={{ textAlign: 'center' }}>
                                        You have not made any reservation yet!
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                theme="light"
                transition={Bounce}
            />

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
                            handleCancleRequest(openDialog.cancel.order);
                            setOpenDialog((prev) => ({ ...prev, cancel: { open: false, id: '' } }));
                        }}
                    >
                        Yes, i do
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog For DELETE A RESERVATION */}
            <Dialog
                open={openDialog.delete.open}
                onClose={() => {
                    setOpenDialog((prev) => ({ ...prev, delete: { open: false, id: '' } }));
                }}
                fullWidth
            >
                <DialogTitle>Delete Reservation</DialogTitle>
                <DialogContent>
                    <DialogContentText>Wanna delete the reservation?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog((prev) => ({ ...prev, delete: { open: false, id: '' } }))}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            handleDelteReservation(openDialog.delete.order.id);
                            setOpenDialog((prev) => ({ ...prev, delete: { open: false, id: '' } }));
                        }}
                    >
                        DELETE
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Reservation;
