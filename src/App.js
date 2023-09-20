import { useState, useEffect } from "react";
import "./App.css";
import MapContainer from "./MapContainer";
import { orders } from "./ordersJSON";
import { vans } from "./vansJSON";

function App() {
  const [ordersList, setOrdersList] = useState([]);
  const [vansList, setVansList] = useState([]);

  const fetchOrders = () => {
    const response = orders;
    setOrdersList(response);
  };

  const fetchVans = () => {
    const response = vans;
    setVansList(response);
  };

  useEffect(() => {
    fetchOrders();
    fetchVans();
  }, []);

  return (
    <>
      <h1>Route Map</h1>
      <MapContainer ordersList={ordersList} />
    </>
  );
}

export default App;
