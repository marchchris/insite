import React from "react";
import { Chart } from "chart.js/auto";
import { Bar } from "react-chartjs-2";

export default function FeedbackAmountChart({ feedbackData }) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const feedbackPerMonth = new Array(12).fill(0);

    feedbackData.forEach(fb => {
        const month = new Date(fb.dateSubmitted).getMonth();
        feedbackPerMonth[month]++;
    });

    const data = {
        labels: months,
        datasets: [{
            data: feedbackPerMonth,
            backgroundColor: [
                '#9F9FF8',
                '#96E2D6',
                '#92BFFF',
                '#AEC7ED',
                '#94E9B8',
                '#9F9FF8',
                '#96E2D6',
                '#92BFFF',
                '#AEC7ED',
                '#94E9B8',
                '#9F9FF8',
                '#96E2D6',
            ],
            borderWidth: 0,
            borderRadius: 8
        }]
    };

    const options = {
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.4)'
                }
            },
            y: {
                grid: {
                    display: false
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.4)'
                }
            }
        },

        plugins: {
            legend: {
                display: false
            }
        },

        tooltips: {
            callbacks: {
                label: function (tooltipItem) {
                    return tooltipItem.yLabel;
                }
            }
        }
    };

    return (
        <Bar data={data} options={options} />
    );
};