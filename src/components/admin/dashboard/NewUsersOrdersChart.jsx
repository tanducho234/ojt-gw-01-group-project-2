import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const NewUsersOrdersRevenueChart = ({ users = [], orders = [] }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    // Prepare monthly counts for users, orders, and revenue
    const usersMonthlyCounts = new Array(12).fill(0);
    const ordersMonthlyCounts = new Array(12).fill(0);
    const revenueMonthlyCounts = new Array(12).fill(0);

    // Count users per month
    users.forEach(user => {
      if (user.createdAt) {
        const createdAt = new Date(user.createdAt);
        const month = createdAt.getMonth();
        usersMonthlyCounts[month]++;
      }
    });

    // Count orders and revenue per month
    orders.forEach(order => {
      if (order.createdAt) {
        const createdAt = new Date(order.createdAt);
        const month = createdAt.getMonth();

        // Count delivered orders
        if (order.status === 'Delivered') {
          ordersMonthlyCounts[month]++;
          revenueMonthlyCounts[month] += order.totalPrice || 0;
        }
      }
    });

    // Configure the chart
    const option = {
      title: {
        text: 'New Users, Orders, and Revenue by Month',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: params => {
          let tooltipContent = '';
          params.forEach(param => {
            tooltipContent += `${param.seriesName}: ${param.value}${
              param.seriesName === 'Revenue' ? ' $' : ''
            }<br/>`;
          });
          return tooltipContent;
        },
      },
      legend: {
        data: ['New Users', 'New Orders', 'Revenue'],
        bottom: 0,
      },
      xAxis: {
        type: 'category',
        data: [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December',
        ],
      },
      yAxis: [
        {
          type: 'value',
          name: 'Count',
        },
        {
          type: 'value',
          name: 'Revenue ($)',
          axisLabel: {
            formatter: '${value}',
          },
        },
      ],
      series: [
        {
          name: 'New Users',
          type: 'bar',
          data: usersMonthlyCounts,
          itemStyle: {
            color: 'blue',
          },
        },
        {
          name: 'New Orders',
          type: 'bar',
          data: ordersMonthlyCounts,
          itemStyle: {
            color: 'yellow',
          },
        },
        {
          name: 'Revenue',
          type: 'line',
          data: revenueMonthlyCounts,
          yAxisIndex: 1, // Use the secondary Y-axis for revenue
          itemStyle: {
            color: 'green',
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
  }, [users, orders]);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default NewUsersOrdersRevenueChart;
