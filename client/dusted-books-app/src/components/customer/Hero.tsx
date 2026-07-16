import HeroImg from "../../assets/hero-imgs/hero-img2.jpg";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="relative flex items-center justify-center h-[600px] w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm md:blur-md scale-105 z-[-1]"
        style={{ backgroundImage: `url(${HeroImg})` }}
        aria-hidden="true"
      />
      <div className="flex flex-col md:flex-row items-center justify-center  md:justify-between min-w-[80%] justify-between md:px-20 gap-4 mt-6">
        <aside className="hero-left">
          <h1 className=" font-semibold text-7xl md:text-9xl text-white">
            Buy.Sell. <br />
            Books <br />
          </h1>
        </aside>

        <div className="hero-right flex flex-col items-center justify-center max-w-[500px] px-7 md:mr-8 gap-2 mt-7 md:mt-3 ">
          <p className="text-white flex flex-col text-center text-lg leading-relaxed drop-shadow">
            Discover pre-loved books at great prices, or sell the ones you no longer need.
          </p>
          <div className="flex flex-wrap gap-4 mt-6 text-black font-semibold justify-center">
            <Link
              to="/sell-book"
              className="px-4 py-2 bg-white rounded-md text-lg hover:scale-105 transition-transform duration-100 ease-linear"
            >
              Sell a Book
            </Link>
            <Link
              to="/my-sell-requests"
              className="px-4 py-2 bg-white rounded-md text-lg hover:scale-105 transition-transform duration-100 ease-linear"
            >
              My Sell Requests
            </Link>
            <Link
              to="/my-requests"
              className="px-4 py-2 bg-white rounded-md text-lg hover:scale-105 transition-transform duration-100 ease-linear"
            >
              Request a Book
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
