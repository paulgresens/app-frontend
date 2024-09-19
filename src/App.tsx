import { useEffect, useState } from "react";
import backend from "./backendApi";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMessage = async () => {
      const { data } = await backend.get("/ping");
      setMessage(data);
    };
    fetchMessage();
  });

  return <>{message}</>;
}

export default App;
