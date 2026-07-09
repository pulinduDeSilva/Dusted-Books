import HeroImg from "../../assets/hero-imgs/hero-img2.jpg";

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
          <p className="text-white flex flex-col text-center">
            The hero is now split into two layers in src/components/Hero.tsx:
            the image is a separate absolutely positioned background
          </p>
          <div className="flex gap-4 mt-6 text-black font-semibold">
            <button className="px-3 py-1 bg-white rounded-md text-lg hover:scale-105 transition-transform duration-100 ease-linear">Browse</button>
            <button className="px-3 py-1 bg-white rounded-md hover:scale-105 transition-transform duration-100 ease-linear">Sell Books</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
