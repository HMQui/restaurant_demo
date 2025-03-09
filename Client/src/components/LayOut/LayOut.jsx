import { Outlet } from 'react-router';

import Header from './Header';
import Footer from './Footer';

function LayOut() {
    return (
        <div className="flex flex-col min-h-screen relative w-full overscroll-x-none overflow-y-auto bg-white">
            <Header />
            <hr className="w-full border border-base-2"/>
            {/* This will make `main` grow to push the footer down */}
            <main className="flex-grow w-full h-fit overflow-y-auto flex justify-center">
                <Outlet />
            </main>
            <hr className="w-full border border-base-2"/>
            <Footer />
        </div>
    );
}

export default LayOut;
