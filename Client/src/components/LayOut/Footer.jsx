function Footer() {
    return (
        <div className="px-36 py-5 w-full bg-base-1 flex flex-col justify-between">
            <h1 className="font-bold text-xl">Gentle Cyber Restaurant</h1>
            <div className="px-56 flex flex-row justify-between">
                <div className="flex flex-col">
                    <b>Contact us:</b>
                    <span>123-456-789</span>
                    <a href="mailto:example@somewhere.com">Send email to example@somewhere.com</a>
                </div>
                <div className="flex flex-col">
                    <b>Our restaurants:</b>
                    <span>508/34 Cach Mang Thang Tam</span>
                    <span>22 Tran Quang Dieu</span>
                </div>
            </div>
        </div>
    );
}

export default Footer;
