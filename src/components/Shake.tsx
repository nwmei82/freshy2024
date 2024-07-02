import { useState } from "react";
// import dashboard from "./Dashboard"

const getMobileOperatingSystem = () => {
  var userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return "Windows Phone";
  }

  if (/android/i.test(userAgent)) {
    return "Android";
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return "iOS";
  }

  return "unknown";
};

const ShakeComponent = () => {
  const [count, setCount] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);

  let lastAcceleration = 9.81;
  let acceleration = 0;

  const handleMotion = (event: DeviceMotionEvent) => {
    const acc = event.accelerationIncludingGravity;
    if (acc && acc.x !== null && acc.y !== null && acc.z !== null) {
      const x = acc.x;
      const y = acc.y;
      const z = acc.z;

      const currentAcceleration = Math.sqrt(x * x + y * y + z * z);
      const delta = currentAcceleration - lastAcceleration;
      lastAcceleration = currentAcceleration;
      
      acceleration = 0.4 * acceleration + delta;

      console.log(`Acceleration: x=${x}, y=${y}, z=${z}, total=${acceleration}`);

      if (acceleration > 22) { // Use the smoothed acceleration value
        if (!isShaking) {
          setCount((prevCount) => prevCount + 1);
          setIsShaking(true);
        }
      } 

    }
  };

  const handleRequestMotion = async () => {
    const mobile = getMobileOperatingSystem();
    if (mobile === "iOS") {
      if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
        try {
          const permissionStatus = await (DeviceMotionEvent as any).requestPermission();
          if (permissionStatus === "granted") {
            window.addEventListener("devicemotion", handleMotion as EventListener);
            setPermissionRequested(true);
          } else {
            alert("Permission not granted");
          }
        } catch (error) {
          console.error("Error requesting DeviceMotion permission:", error);
        }
      } else {
        alert("DeviceMotionEvent.requestPermission is not supported on this device.");
      }
    } else if(mobile === "Android") {
      window.addEventListener("devicemotion", handleMotion as EventListener);
      setPermissionRequested(true);
    } else {
      
    }
  };

  return (
    <div>
      <p>Shake count: {count}</p>
      {!permissionRequested && (
        <button onClick={handleRequestMotion}>start</button>
      )}

      
    </div>
  );
};

export default ShakeComponent;