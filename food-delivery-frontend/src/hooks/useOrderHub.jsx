import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";

export default function useOrderHub(customerId, onOrderUpdate) {
  const callbackRef = useRef(onOrderUpdate);
  const [connectionState, setConnectionState] = useState("Disconnected");
  const [error, setError] = useState("");

  useEffect(() => {
    callbackRef.current = onOrderUpdate;
  }, [onOrderUpdate]);

  useEffect(() => {
    if (!customerId) return undefined;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(import.meta.env.VITE_ORDER_HUB_URL || "http://localhost:5214/orderHub", {
        accessTokenFactory: () => localStorage.getItem("token") || "",
      })
      .withAutomaticReconnect()
      .build();

    let active = true;
    const handleOrderUpdate = (orderId, status) => {
      callbackRef.current?.({ orderId, status });
    };

    connection.on("ReceiveOrderUpdate", handleOrderUpdate);
    connection.onreconnecting(() => setConnectionState("Reconnecting"));
    connection.onreconnected(() => setConnectionState("Connected"));
    connection.onclose((connectionError) => {
      setConnectionState("Disconnected");
      if (connectionError) setError(connectionError.message);
    });

    const startConnection = async () => {
      try {
        await connection.start();
        if (!active) return;

        await connection.invoke("JoinCustomerGroup");
        setError("");
        setConnectionState("Connected");
      } catch (connectionError) {
        if (!active) return;
        setError(connectionError.message || "Could not connect to live order updates.");
        setConnectionState("Disconnected");
      }
    };

    void startConnection();

    return () => {
      active = false;
      connection.off("ReceiveOrderUpdate", handleOrderUpdate);
      void connection.stop().catch((connectionError) => {
        console.error("Could not stop the order hub connection.", connectionError);
      });
    };
  }, [customerId]);

  return { connectionState, error };
}
