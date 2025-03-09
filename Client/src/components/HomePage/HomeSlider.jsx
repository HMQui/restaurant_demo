import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/bundle';

import coffee from '../../assets/images/Home/coffee.avif';
import steak from '../../assets/images/Home/steak.avif';
import salad from '../../assets/images/Home/salad.avif';
import thaifood from '../../assets/images/Home/thai-food.avif';

const IMAGES = [coffee, steak, salad, thaifood];

function HomeSlider() {
    return (
        <section className="w-5/6 flex flex-row justify-end items-center">
            <h1 className='flex-1 text-7xl font-bold'>Welcome to our Gentle Restaurant</h1>
            <Swiper
                modules={[Navigation, Autoplay, Pagination, Scrollbar]}
                spaceBetween={20}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                autoplay={{ delay: 3000 }}
                loop
                className="w-2/5"
                style={{
                    '--swiper-pagination-color': '#BBC0B9',
                    '--swiper-pagination-bullet-inactive-color': '#999999',
                    '--swiper-pagination-bullet-inactive-opacity': '1',
                    '--swiper-pagination-bullet-horizontal-gap': '6px',
                    '--swiper-navigation-color': '#BBC0B9',
                    '--swiper-navigation-size': '27px'
                }}
            >
                {IMAGES.map((img, index) => (
                    <SwiperSlide key={index} className="w-full">
                        <img src={img} alt={`Slide ${index}`} className="w-full object-cover rounded-lg shadow-lg" />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}

export default HomeSlider;
