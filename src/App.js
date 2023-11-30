import { useEffect, useRef } from 'react';
import './App.css';

function App() {

  const inputVideoRef = useRef();
  const canvasRef = useRef();
  const contextRef = useRef();

  useEffect(() => {
    const constraints = {
      video: { width: { min: 1280 }, height: { min: 720 } },
    };

    // console.log("navigator.mediaDevices", navigator.mediaDevices.getUserMedia(constraints));

    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        console.log(stream);
      });
  }, []);
  return (
    <div className="App">
      <video autoPlay ref={inputVideoRef} />
      <canvas ref={canvasRef} width={1280} height={720} />
    </div>
  );
}

export default App;
