import { useEffect, useRef } from "react";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";
import './App.css';

function App() {

  const inputVideoRef = useRef();
  const canvasRef = useRef();
  const contextRef = useRef();

  useEffect(() => {
    contextRef.current = canvasRef.current.getContext("2d");
    const constraints = {
      video: { width: { ideal: 350 }, height: { ideal: 240 }},
    };

    navigator.mediaDevices.getUserMedia(constraints).then((stream) =>{
      inputVideoRef.current.srcObject = stream;
      sendToMediaPipe();
      }
    );

    const selfieSegmentation = new SelfieSegmentation({
      locateFile: (file) =>{
        console.log("file", file);
        return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
      }
        ,
    });

    selfieSegmentation.setOptions({
      modelSelection: 1,
      selfieMode: false,
    });

    selfieSegmentation.onResults(onResults);

    const sendToMediaPipe = async () => {
      if (!inputVideoRef.current.videoWidth) {
        console.log(inputVideoRef.current.videoWidth);
        requestAnimationFrame(sendToMediaPipe);
      } else {
        await selfieSegmentation.send({ image: inputVideoRef.current });
        requestAnimationFrame(sendToMediaPipe);
      }
    }
  }, []);

  const onResults = (results) => {
    contextRef.current.save();
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    // mask
    contextRef.current.drawImage(
      results.segmentationMask,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    // Only overwrite existing pixels. background
    contextRef.current.globalCompositeOperation = "source-out";
    contextRef.current.fillStyle = "#00FF00";
    contextRef.current.fillRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    // Only overwrite missing pixels. image
    contextRef.current.globalCompositeOperation = "destination-atop";
    contextRef.current.drawImage(
      results.image,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    contextRef.current.restore();
  };

  return (
    <div className="App">
      <div>
        <video autoPlay ref={inputVideoRef} />
      </div>
      <div>
        <canvas ref={canvasRef} width={350} height={240} />
      </div>
    </div>
  );
}

export default App;
