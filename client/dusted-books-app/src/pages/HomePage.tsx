import { lazy, Suspense } from "react";
import Hero from "../components/customer/Hero";

const LazyBooks = lazy(() => import("../components/Books"));
const LazyWorkflow = lazy(() => import("../components/customer/Workflow"));


function HomePage() {


  return (
    <div>
      <Hero />
          <Suspense fallback={<div className="min-h-[28rem]" />}>
            <LazyBooks />
          </Suspense>
          <Suspense fallback={<div className="min-h-[32rem]" />}>
            <LazyWorkflow />
          </Suspense>
    </div>
  );
}

export default HomePage;
