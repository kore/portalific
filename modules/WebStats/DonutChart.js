import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip);

const generateColorPermutations = (hexColor) => {
  // Remove # if present and ensure it's a valid hex color
  const hex = hexColor.replace("#", "");
  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
    throw new Error("Invalid hex color format");
  }

  // Extract R, G, B components
  const r = hex.substring(0, 2);
  const g = hex.substring(2, 4);
  const b = hex.substring(4, 6);

  // Generate all permutations
  return [
    `#${r}${g}${b}`, // RGB (original)
    `#${r}${b}${g}`, // RBG
    `#${g}${r}${b}`, // GRB
    `#${g}${b}${r}`, // GBR
    `#${b}${r}${g}`, // BRG
    `#${b}${g}${r}`, // BGR
  ];
};

export default function DonutChart({ title, data }) {
  const themeStyles = getComputedStyle(
    window.document.getElementsByClassName("layout__container")[0]
  );
  console.log(themeStyles.getPropertyValue("--color-primary-300"));

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
        backgroundColor: generateColorPermutations(
          themeStyles.getPropertyValue("--color-primary-300")
        ),
        borderColor: generateColorPermutations(
          themeStyles.getPropertyValue("--color-primary-500")
        ),
        borderWidth: 1,
      },
    ],
  };

  return <Doughnut options={options} data={visitors} height={60} />;
}
