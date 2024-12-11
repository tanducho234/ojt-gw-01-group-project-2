import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import OverviewCards from "../../components/admin/dashboard/OverviewCards";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import ExtraCard from "../../components/admin/dashboard/extraCard";
import SatisfactionCard from "../../components/admin/dashboard/SatisfactionCard";
import { get } from "react-hook-form";
import NewUsersOrdersChart from "../../components/admin/dashboard/NewUsersOrdersChart";
import OrderStatusPieChart from "../../components/admin/dashboard/OrderStatusPieChart";

export const Dashboard = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, reviewsResponse, ordersResponse] =
          await Promise.all([
            axios.get(
              "https://ojt-gw-01-final-project-back-end.vercel.app/api/auth/all?role=user",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),
            axios.get(
              "https://ojt-gw-01-final-project-back-end.vercel.app/api/reviews/admin",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),
            axios.get(
              "https://ojt-gw-01-final-project-back-end.vercel.app/api/order-details/admin",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),
          ]);

        setUsers(usersResponse.data);
        setReviews(reviewsResponse.data);
        setOrders(ordersResponse.data);
        console.log("users", usersResponse.data);
        console.log("reviews", reviewsResponse.data);
        console.log("orders", ordersResponse.data);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function calculateUserStats(users) {
    if (!users) return {};
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    let prevMonthCount = 0,
      currentMonthCount = 0;

    users.forEach((item) => {
      const createdAt = new Date(item.createdAt);
      const itemMonth = createdAt.getMonth();
      const itemYear = createdAt.getFullYear();

      if (itemYear === currentYear) {
        if (itemMonth === currentMonth) {
          currentMonthCount++;
        } else if (
          itemMonth === currentMonth - 1 ||
          (currentMonth === 0 && itemMonth === 11)
        ) {
          prevMonthCount++;
        }
      }
    });

    // Calculate percentage change
    let change = 0;
    let trend = "up";
    if (prevMonthCount > 0) {
      change = ((currentMonthCount - prevMonthCount) / prevMonthCount) * 100;
      trend = change >= 0 ? "up" : "down";
    }

    // Return the result
    return {
      title: "User",
      value: `${currentMonthCount}`,
      desc: `Monthly users`,
      change: `${change >= 0 ? "+" : ""}${Math.round(change)}%`,
      trend: trend,
      color: "blue",
    };
  }

  function calculateOrdersStats(orders) {
    if (!orders) return {};
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    let prevMonthCount = 0,
      currentMonthCount = 0;

    orders.forEach((item) => {
      const createdAt = new Date(item.createdAt);
      const itemMonth = createdAt.getMonth();
      const itemYear = createdAt.getFullYear();

      if (itemYear === currentYear) {
        if (itemMonth === currentMonth) {
          currentMonthCount++;
        } else if (
          itemMonth === currentMonth - 1 ||
          (currentMonth === 0 && itemMonth === 11)
        ) {
          prevMonthCount++;
        }
      }
    });

    // Calculate percentage change
    let change = 0;
    let trend = "up";
    if (prevMonthCount > 0) {
      change = ((currentMonthCount - prevMonthCount) / prevMonthCount) * 100;
      trend = change >= 0 ? "up" : "down";
    }

    // Return the result
    return {
      title: "Orders",
      value: `${currentMonthCount}`,
      desc: `Monthly orders`,
      change: `${change >= 0 ? "+" : ""}${Math.round(change)}%`,
      trend: trend,
      color: "yellow",
    };
  }

  function calculateRevenueStats(orders) {
    if (!orders) return {};

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    let currentMonthRevenue = 0;
    let prevMonthRevenue = 0;

    orders.forEach((order) => {
      const createdAt = new Date(order.createdAt);
      const itemMonth = createdAt.getMonth();
      const itemYear = createdAt.getFullYear();

      // Check if the order has status "Delivered"
      if (order.status === "Delivered" && itemYear === currentYear) {
        if (itemMonth === currentMonth) {
          currentMonthRevenue += order.totalPrice;
        } else if (
          itemMonth === currentMonth - 1 ||
          (currentMonth === 0 && itemMonth === 11)
        ) {
          prevMonthRevenue += order.totalPrice;
        }
      }
    });

    // Calculate percentage change
    let change = 0;
    let trend = "up";
    if (prevMonthRevenue > 0) {
      change =
        ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100;
      trend = change >= 0 ? "up" : "down";
    }

    // Return the result
    return {
      title: "Revenue",
      value: `${currentMonthRevenue.toFixed(2)} $`, // Ensure 2 decimal points for currency
      desc: "Monthly revenue",
      change: `${change >= 0 ? "+" : ""}${Math.round(change)}%`,
      trend: trend,
      color: "green", // Using green for revenue
    };
  }

  const calculateReviewStats = (reviews) => {
    if (!reviews || reviews.length === 0) return {};

    const totalReviews = reviews.length;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);

    const averageRating = totalRating / totalReviews;

    return {
      title: "Satisfaction",
      value: `${totalReviews}`,

      rating: averageRating.toFixed(1),
    };
  };

  return (
    <div className="flex">
      <main className="flex-1 w-full ml-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-start">Overview</h1>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="flex">
              <OverviewCards
                data={[
                  calculateUserStats(users),
                  calculateOrdersStats(orders),
                  calculateRevenueStats(orders),
                ]}
              />
              <SatisfactionCard item={calculateReviewStats(reviews)} />
              <ExtraCard users={users} orders={orders} />
            </div>
            <h1 className="text-3xl font-semibold text-start">Analytics</h1>
            <div className="flex justify-between m-6">
              <NewUsersOrdersChart
                className="m-6"
                users={users}
                orders={orders}
              />
              <div className="m-6"></div>
              <OrderStatusPieChart className="m-6" orders={orders} />
            </div>
          </>
        )}
      </main>
    </div>
  );
};
