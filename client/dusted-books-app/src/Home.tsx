import Books from "./components/Books";
import Hero from "./components/Hero";
import Nav from "./components/Nav";

function Home() {
  return (
    <>
      <Nav />
      <section className="h-full w-screen">
        <Hero />
        <Books/>
      </section>
    </>
  );
}

export default Home;
