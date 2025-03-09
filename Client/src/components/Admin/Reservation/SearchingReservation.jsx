import { useState } from 'react';
import { TextField, Button, Box, Card, CardHeader, CardContent, Typography } from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import isValidEmail from '../../../../services/isValidEmail';
import { searchReservations } from '../../../../services/apis/reservationApi';

function SearchingReservation() {
    const [searchInput, setSearchInput] = useState({
        date: '',
        time: '',
        email: '',
    });
    const [isValid, setIsValid] = useState({
        email: { isValid: true, message: '' },
    });
    const [searchResult, setSearchResult] = useState([]);

    const handleSearch = () => {
        let valid = true;
        if (searchInput.email.trim() && !isValidEmail(searchInput.email)) {
            setIsValid((prev) => ({ ...prev, email: { isValid: false, message: 'Email format is incorrect' } }));
            valid = false;
        }

        if (!valid || (searchInput.date === '' && searchInput.time === '' && searchInput.email === '')) {
            return;
        }

        const fetch = async () => {
            const response = await searchReservations(searchInput);
            if (response.error !== 0) {
                console.log(response);
                return;
            }
            response.reservations = response.reservations.sort((a, b) => a.date.localeCompare(b.date));
            setSearchResult(response.reservations);
        };

        fetch();
    };

    return (
        <section className="my-10 w-full flex flex-col justify-start items-start gap-5">
            <h2 className="text-2xl font-bold">Searching Reservation</h2>
            <div className="flex flex-row justify-between gap-5 w-full">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        sx={{ width: '100%', height: '30px' }}
                        label="Date"
                        value={searchInput.date ? dayjs(searchInput.date) : null}
                        onChange={(newValue) =>
                            setSearchInput({ ...searchInput, date: newValue ? newValue.format('YYYY-MM-DD') : '' })
                        }
                    />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                        ampm={false}
                        sx={{ width: '100%', height: '30px' }}
                        label="Time"
                        value={searchInput.time ? dayjs(searchInput.time, 'HH:mm') : null}
                        onChange={(newValue) =>
                            setSearchInput({ ...searchInput, time: newValue ? newValue.format('HH:mm') : '' })
                        }
                    />
                </LocalizationProvider>
                <TextField
                    fullWidth
                    size="large"
                    label="Email"
                    value={searchInput.email}
                    onChange={(e) => {
                        setIsValid((prev) => ({ ...prev, email: { isValid: true, message: '' } }));
                        setSearchInput({ ...searchInput, email: e.target.value });
                    }}
                    error={!isValid.email.isValid}
                    helperText={isValid.email.message}
                />
                <Button variant="contained" sx={{ width: '400px' }} onClick={handleSearch}>
                    Search
                </Button>
            </div>
            <div className="w-full flex flex-row flex-wrap gap-10">
                {searchResult.map((reservation, index) => (
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
                                            color: '#035772',
                                            display: 'flex',
                                            direction: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <span className="text-sm">{index + 1}</span>
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
                        </Card>
                    </Box>
                ))}
            </div>
        </section>
    );
}

export default SearchingReservation;
