import React, { useState } from "react";
import Lottie from "react-lottie";
import * as animationData from "./pinjump.json";

export default function LottieControl(props) {
  const [isStopped, setIsStopped] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const buttonStyle = {
    display: "block",
    margin: "10px auto",
  };
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div>
      <Lottie
        options={defaultOptions}
        height={400}
        width={400}
        isStopped={isStopped}
        isPaused={isPaused}
      />
    </div>
  );
}
