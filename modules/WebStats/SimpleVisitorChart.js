import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip
);

export default function SimpleVisitorChart({ domain, data }) {
  const themeStyles = getComputedStyle(window.document.getElementsByClassName("layout__container")[0]);

  let options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: domain,
      },
    },
    scales: {
      x: {
        stacked: true,
        display: false,
      },
      y: {
        stacked: true,
      },
    },
  };

  const visitors = {
    labels: Object.keys(data).sort(),
    datasets: [
      {
        label: "Bots",
        data: Object.entries(data).reverse().map(([label, dayData]) => dayData?.userType?.Bot || 0 ),
        backgroundColor: themeStyles.getPropertyValue('--color-red-100'),
      },
      {
        label: "Humans",
        data: Object.entries(data).reverse().map(([label, dayData]) => dayData?.userType?.Human || 0),
        backgroundColor: themeStyles.getPropertyValue('--color-gray-300'),
      },
    ],
  }

  return <Bar options={options} data={visitors} height={60} />;
}

