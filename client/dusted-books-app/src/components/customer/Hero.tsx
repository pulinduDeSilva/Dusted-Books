import HeroImg from "../../assets/hero-imgs/hero-img.jpg";
import Search from "./Search";

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
      
      <div className=" z-10 mt-6 flex min-w-[80%] items-center justify-center gap-4 md:flex-row md:px-40 md:justify-between w-[90%]">
        <aside className="hero-left flex items-center justify-between gap-4 mb-15 md:mb-0 w-full">
          <h1 className=" font-semibold text-7xl md:text-9xl text-amber-50 anti-aliased">
            Buy.Sell. <br />
            Books.
          </h1>

        </aside>

        
      </div>
    </div>
  );
}

export default Hero;
