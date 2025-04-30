import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Filler,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
);

export default function SimpleVisitorChart({
  interval,
  domain,
  data,
  onClick,
}) {
  const themeStyles = getComputedStyle(
    window.document.getElementsByClassName("layout__container")[0]
  );

  let options = {
    responsive: true,
    interaction: {
      intersect: false,
      mode: "index",
    },
    scales: {
      x: {
        stacked: true,
        display: false,
      },
      y: {
        stacked: true,
        display: false,
      },
    },
    plugins: {
      title: {
        display: true,
        text: domain,
        align: "start",
      },
      tooltip: {
        callbacks: {
          footer: (tooltipItems) => {
            let sum = 0;

            tooltipItems.forEach(function (tooltipItem) {
              sum += tooltipItem.parsed.y;
            });
            return "Combined: " + sum;
          },
        },
      },
    },
  };

  const visitors = {
    labels: Object.keys(data)
      .sort()
      .map((dateString) => {
        let date;
        switch (interval) {
          case "days":
            date = new Date(dateString);
            return date.toLocaleDateString("en-US", { weekday: "long" });

          case "weeks":
            return dateString.slice(-5);

          case "months":
            date = new Date(dateString + "-01");
            return date.toLocaleDateString("en-US", { month: "long" });

          default:
            return dateString;
        }
      }),
    datasets: [
      {
        label: "Bots",
        data: Object.values(data).map((dayData) => dayData?.userType?.Bot || 0),
        borderColor: themeStyles.getPropertyValue("--color-gray-500"),
        backgroundColor: themeStyles.getPropertyValue("--color-red-100"),
        tension: 0.4,
        fill: true,
      },
      {
        label: "Humans",
        data: Object.values(data).map(
          (dayData) => dayData?.userType?.Human || 0
        ),
        borderColor: themeStyles.getPropertyValue("--color-gray-500"),
        backgroundColor: themeStyles.getPropertyValue("--color-gray-300"),
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <Line onClick={onClick} options={options} data={visitors} height={60} />
  );
}
