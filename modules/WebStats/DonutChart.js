import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip);

export default function DonutChart({ title, data }) {
  const themeStyles = getComputedStyle(
    window.document.getElementsByClassName("layout__container")[0]
  );

  let options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: title,
        align: "start",
      },
    },
    centertext: title,
  };

  const visitors = {
    labels: Object.keys(data),
    datasets: [
      {
        label: title,
        data: Object.values(data),
      },
    ],
  };

  return <Doughnut options={options} data={visitors} height={60} />;
}
