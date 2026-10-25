import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";

export default function useOrderHub(customerId, onStatusUpdate) {
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5007/orderHub")
      .withAutomaticReconnect()
      .build();

    connection.start().then(() => {
      connection.invoke("JoinCustomerGroup", customerId);
    });

    connection.on("OrderStatusUpdated", (update) => {
      onStatusUpdate(update);
    });

    return () => {
      connection.stop();
    };
  }, [customerId, onStatusUpdate]);
}
