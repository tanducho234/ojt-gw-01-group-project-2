import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

// Function to download user and order data in CSV format
const downloadData = (users, orders) => {
  // Define the header for user data
  const userHeaders = ["User ID", "Name", "Email", "Registration Date"];
  // Format the user data rows
  const userRows = users.map(user => [
    user.fullName || "N/A", 
    user.email || "N/A",
    user.createdAt || "N/A"
  ]);

  // Define the header for order data
  const orderHeaders = ["Order ID", "User ID", "Total Price", "Status", "Order Date"];
  // Format the order data rows
  const orderRows = orders.map(order => [
    order._id,
    order.userId,
    order.totalPrice,
    order.status,
    order.createdAt
  ]);

  // Combine user and order data
  const csvContent = [
    "Users Data",
    userHeaders.join(","),
    ...userRows.map(row => row.join(",")),
    "",
    "Orders Data",
    orderHeaders.join(","),
    ...orderRows.map(row => row.join(","))
  ].join("\n");

  // Create a Blob from the CSV data
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create a link element and simulate a click to trigger the download
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "user_and_order_data.csv"; // Specify the file name
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const ExtraCard = ({ users, orders }) => (
  <Box sx={{ padding: "20px" }}>
    <Card
      sx={{
        flex: 1,
        minWidth: "250px",
        height: "180px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <CardContent>
        <Typography
          variant="subtitle1"
          sx={{ fontSize: "1.1rem", color: "#616161", fontWeight: "600" }}
        >
          Download Users and Orders Data
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#757575" }}
        >
          Get your users and orders data in a CSV format. Download now to explore!
        </Typography>
        <Box
          component="button"
          onClick={() => downloadData(users, orders)} // Trigger the download function
          sx={{
            marginTop: "5px",
            padding: "10px 20px",
            backgroundColor: "black",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background-color 0.3s",
            "&:hover": {
              backgroundColor: "gray",
            },
          }}
        >
          Download Data
        </Box>
      </CardContent>
    </Card>
  </Box>
);

export default ExtraCard;
