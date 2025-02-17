import React from "react";
import Chart from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
const data = {
    labels: [],
    datasets: [
        {
            label: 'Feedback Sentiment',
            data: [120, 35, 55], // Corresponds to positive, negative, and neutral
            backgroundColor: ['#4caf50', '#f44336', '#ff9800'], // Green, Red, Orange
            borderWidth: 0,
        },
    ],
};



export default function FeedbackRatioChart() {
    return (
        <Doughnut data={data} />
    );
};