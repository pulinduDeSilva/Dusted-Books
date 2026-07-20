import HeroImg from "../../assets/hero-imgs/hero-img.jpg";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="relative flex h-[600px] w-full items-center justify-center overflow-hidden">
      <img
        src={HeroImg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-105 object-cover object-center"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
      
      <div className="relative z-10 mt-6 flex min-w-[80%] flex-col items-center justify-center gap-4 md:flex-row md:justify-between md:px-20">
        <aside className="hero-left">
          <h1 className=" font-semibold text-7xl md:text-9xl text-white">
            Buy.Sell. <br />
            Books <br />
          </h1>
        </aside>

        
      </div>
    </div>
  );
}

export default Hero;
