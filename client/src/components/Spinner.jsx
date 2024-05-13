import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Spinner = ({path="login"}) => {
  const [count, setCount] = useState(3);
  const router = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((preValue) => --preValue);
    }, 1000);
    count === 0 &&
      router(`/${path}`, {
        state: location.pathname
      });
    return () => clearInterval(interval);
  }, [count, router, location, path]);
  return (
    <>
      <div
        className="flex flex-col justify-center items-center"
        style={{ height: "100vh" }}
      >
        <h1 className="text-center">redirecting to you in {count} second</h1>
       
        <button type="button" class="bg-indigo-500 ..." disabled>
          <svg class="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">...</svg>
          Processing...
        </button>
      </div>
     x
    </>
  );
};

export default Spinner;
