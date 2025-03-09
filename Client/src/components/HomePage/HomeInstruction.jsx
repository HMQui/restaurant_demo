import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import coffee2 from '../../assets/images/Home/coffee2.avif';
import coffee3 from '../../assets/images/Home/coffee3.avif';

function HomeInstruction() {
    const navigate = useNavigate();

    return (
        <section className="px-28 w-full flex flex-col justify-start items-start">
            <div className='w-full flex flex-row justify-between items-center'>
                <h1 className="text-5xl font-bold">About Our Cyber Cafe</h1>
                <img src={coffee2} alt="Services image" className="rounded-2xl w-[224px] h-[200px]" />
            </div>
            <div className="w-full flex flex-row justify-start items-start gap-10">
                <img src={coffee3} alt="Services image" className="rounded-2xl" />
                <div className="flex flex-col gap-10">
                    <p className="text-2xl/relaxed">
                        Gentle Cyber Restaurant makes dining easy with online reservations and food delivery. Book a
                        table or order your favorite dishes for a seamless experience, blending technology with comfort.
                    </p>
                    <div className="flex flex-row justify-start items-center gap-10">
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/learn-more')}
                            sx={{
                                color: '#F6F9F5',
                                backgroundColor: '#035772',
                            }}
                        >
                            Learn more
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HomeInstruction;
