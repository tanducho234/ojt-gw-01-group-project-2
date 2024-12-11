import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const OrderStatusPieChart = ({ orders = [] }) => {
  const chartRef = useRef(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#FDE047"; // bg-yellow-100 text-yellow-600
      case "Preparing":
        return "#FB923C"; // bg-orange-100 text-orange-600
      case "Canceled":
        return "#F87171"; // bg-red-100 text-red-600
      case "Delivering":
        return "#60A5FA"; // bg-blue-100 text-blue-600
      case "Delivered":
        return "#4ADE80"; // bg-green-100 text-green-600
      case "Returned":
        return "#D1D5DB"; // bg-gray-100 text-gray-600
      default:
        return "#D1D5DB"; // bg-gray-100 text-gray-600
    }
  };

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    // Calculate order counts by status
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    // Prepare data for the chart with dynamic colors
    const chartData = Object.entries(statusCounts).map(([status, count]) => ({
      value: count,
      name: status,
      itemStyle: { color: getStatusColor(status) }, // Apply color dynamically
    }));

    // Configure the chart
    const option = {
      title: {
        text: 'Orders by Status',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: 'Order Status',
          type: 'pie',
          radius: '50%',
          data: chartData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };

    // Set options to the chart
    chart.setOption(option);

    // Cleanup on unmount
    return () => {
      chart.dispose();
    };
  }, [orders]);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default OrderStatusPieChart;
