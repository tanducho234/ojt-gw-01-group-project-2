import React from "react";
import { Card, CardContent, Box, Typography } from "@mui/material";
import {
  SentimentVerySatisfied,
  SentimentSatisfied,
  SentimentNeutral,
  SentimentDissatisfied,
  SentimentVeryDissatisfied,
} from "@mui/icons-material";

const SatisfactionCard = ({ item }) => {
  const renderRatingFaces = (rating) => {
    if (rating >= 4.5) {
      return (
        <SentimentVerySatisfied sx={{ color: "#FFD700", fontSize: "2rem" }} />
      );
    } else if (rating >= 3.5) {
      return <SentimentSatisfied sx={{ color: "#4caf50", fontSize: "2rem" }} />;
    } else if (rating >= 2.5) {
      return <SentimentNeutral sx={{ color: "#ffeb3b", fontSize: "2rem" }} />;
    } else if (rating >= 1.5) {
      return (
        <SentimentDissatisfied sx={{ color: "#ff9800", fontSize: "2rem" }} />
      );
    } else {
      return (
        <SentimentVeryDissatisfied
          sx={{ color: "#f44336", fontSize: "2rem" }}
        />
      );
    }
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Card
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
              sx={{ marginY: "10px", color: "#616161", fontWeight: "400", fontSize: "1rem" }}
            >
              Reviews
            </Typography>
          </Box>
          <Box>
            {/* Render khuôn mặt */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              {renderRatingFaces(item.rating)}
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: "#616161",
                fontWeight: "bold",
                fontSize: "1.5rem",
                marginTop: "8px",
              }}
            >
              {item.rating} / 5
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SatisfactionCard;
