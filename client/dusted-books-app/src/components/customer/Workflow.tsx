function Workflow() {
  return (
    <>
      <section className="books h-screen flex flex-col items-center justify-start gap-4 m-5">
        <aside className="flex flex-col justify-center items-start mt-30 md:mt-40 min-w-[70%]">
          <h1 className="text-black text-[40px] md:text-7xl font-semibold my-5">
            Read Again.
          </h1>
          <h2 className="text-black text-base md:text-lg">
            Discover affordable hidden gems, clear your shelves, and pass on the
            joy of reading. <br /> Shop and sell used books today.
          </h2>
        </aside>
        <aside className="flex flex-col justify-center items-end mt-30 md:mt-40 min-w-[70%]">
          <h1 className="text-black text-[40px] md:text-7xl font-semibold my-5">
            Done Reading?
          </h1>
          <h2 className="text-black text-base md:text-lg text-right">
            Turn Your Pages Into Cash. Don’t let your favorite
            stories gather dust. Sell them directly to other book lovers in our community.
          </h2>
        </aside>
      </section>
    </>
  );
}

export default Workflow;
