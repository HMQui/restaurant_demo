import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import services from '../../assets/images/Home/services.avif';

function HomeServices() {
    const navigate = useNavigate();

    return (
        <section className="px-28 w-full flex flex-col justify-start items-start gap-10">
            <h1 className="text-5xl font-bold">Services</h1>
            <div className="w-full flex flex-row justify-start items-start gap-10">
                <img src={services} alt="Services image" className="rounded-2xl" />
                <div className="flex flex-col gap-10">
                    <p className="text-2xl/relaxed">
                        Gentle Cyber Restaurant makes dining easy with online reservations and food delivery. Book a
                        table or order your favorite dishes for a seamless experience, blending technology with comfort.
                    </p>
                    <div className="flex flex-row justify-start items-center gap-10">
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/reservation')}
                            sx={{
                                color: '#035772',
                                borderColor: '#035772',
                                '&:hover': {
                                    backgroundColor: '#035772',
                                    color: '#F6F9F5',
                                },
                            }}
                        >
                            Reservation Now
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('order-online')}
                            sx={{
                                color: '#035772',
                                borderColor: '#035772',
                                '&:hover': {
                                    backgroundColor: '#035772',
                                    color: '#F6F9F5',
                                },
                            }}
                        >
                            Order Now
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HomeServices;
