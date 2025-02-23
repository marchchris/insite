import React from "react";
import { Doughnut } from "react-chartjs-2";

export default function FeedbackRatioChart({ feedbackData }) {
    const positive = feedbackData.filter(fb => fb.rating > 7).length;
    const negative = feedbackData.filter(fb => fb.rating <= 4).length;
    const neutral = feedbackData.length - positive - negative;

    const data = {
        labels: ['Positive', 'Negative', 'Neutral'],
        datasets: [
            {
                label: 'Feedback Sentiment',
                data: [positive, negative, neutral],
                backgroundColor: ['#66BB6A', '#EF5350', '#FFEE58'], // Green, Red, Orange
                borderWidth: 0,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: false
            }
        }
    };

    return (
        <Doughnut data={data} options={options} />
    );
};