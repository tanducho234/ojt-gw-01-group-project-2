import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

const OverviewCards = ({ data }) => {
  return (
    <Box
      display="flex"
      gap={3}
      justifyContent="space-between"
      sx={{ padding: "20px" }}
    >
      {data.map((item, index) => (
        <Card
          key={index}
          sx={{
            flex: 1,
            minWidth: "250px",
            height: "180px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontSize: "1.5rem", color: "#616161", fontWeight: "600" }}
              >
                {item.title}
              </Typography>
              <Typography
                variant="h4"
                sx={{ marginY: "10px", color: "green", fontWeight: "400", fontSize: "1.5rem" }}
              >
                {item.value}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  marginY: "10px",
                  color: "#616161",
                  fontWeight: "400",
                  fontSize: "1rem",
                }}
              >
                {item.desc}
              </Typography>
            </Box>
            <Box>
              {item.trend === "up" ? (
                <TrendingUpIcon sx={{ color: item.color, fontSize: "5rem" }} />
              ) : (
                <TrendingDownIcon
                  sx={{ color: item.color, fontSize: "5rem" }}
                />
              )}
              <Typography
                variant="body2"
                sx={{
                  color: item.color,
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                }}
              >
                {item.change}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default OverviewCards;
