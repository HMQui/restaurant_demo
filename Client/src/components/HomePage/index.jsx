import HomeSlider from "./HomeSlider";
import HomeServices from "./HomeServices";
import HomeInstruction from "./HomeInstruction";

function Home() {
    return ( 
        <div className="py-20 w-full h-fit bg-base-1 flex flex-col justify-start items-center gap-16">
            <HomeSlider />
            <hr className="w-full border border-base-2"/>
            <HomeServices />
            <hr className="w-full border border-base-2"/>
            <HomeInstruction />
        </div>
     );
}

export default Home;