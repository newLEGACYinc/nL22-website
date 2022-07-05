import React from 'react';

import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

function BarChart(props) {
    const labels = Object.keys(props.localStats["attempts"])
        .reduce((obj, key) => {
            if (key !== "fail")
                obj[key] = props.localStats["attempts"][key];
            return obj;
        }, {});

    console.log(labels)


    const dataHorBar = {
        labels: Object.keys(labels),
        datasets: [{
            axis: 'y',
            barPercentage: 0.95,
            categoryPercentage: 0.95,
            data: Object.values(labels),
            fill: false,
            backgroundColor: [
                `${props.darkMode ? 'dodgerblue' :
                    'skyblue'}`
            ],
            borderColor: [
                `${props.darkMode ? 'deepskyblue' :
                    'lightblue'}`
            ],
            datalabels: {
                labels: {
                    value: {
                        display: function (context) {
                            var index = context.dataIndex;
                            return context.dataset.data[index] === 0 ? false : true; // display labels with an odd index
                        },
                        anchor: "end",
                        clamp: true,
                        align: "start",
                        offset: 10,
                        color:
                            `${props.darkMode ? 'white' :
                                'black'}`,
                        font: {
                            weight: "bold",
                            size: 15
                        }
                    }
                }
            }
        }]
    };

    const options = {
        indexAxis: 'y',
        maintainAspectRatio: false,
        elements: {
            bar: {
                borderWidth: 2,
            },
        },
        plugins: {
            legend: {
                position: 'right',
                display: false
            },
            title: {
                display: true,
                text: 'Guess Distribution',
                color: `${props.darkMode ? "white" : "black"}`,
                font: {
                    size: 20,
                }
            },
        },
        scales: {
            x: {
                display: false,
                grid: {
                    display: false
                }
            },
            y: {
                ticks: {
                    autoSkip: false,
                    color: `${props.darkMode ? "white" : "black"}`,

                    font: {
                        size: 15,
                    }
                },
                grid: {
                    display: false
                }
            }
        }
    };

    return (
        <div>
            <table className='table-fixed w-full text-center justify-center md:mb-5'>
                <thead>
                    <tr>
                        <th scope="col">Played</th>
                        <th scope="col">Win %</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{props.localStats["games_played"]}</td>
                        <td>{props.localStats["games_played"] > 0 ? ((props.localStats["games_won"] / props.localStats["games_played"]) * 100).toFixed(2) : 0}%</td>
                    </tr>
                </tbody>
            </table>
            <table className='table-fixed w-full text-center justify-center md:mb-5'>
                <thead>
                    <tr>
                        <th scope="col">Current Streak</th>
                        <th scope="col">Max Streak</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{props.localStats["current_streak"]}</td>
                        <td>{props.localStats["max_streak"]}</td>
                    </tr>
                </tbody>
            </table>
            <div className='hidden md:block relative w-full h-96 '>
                <Bar options={options} plugins={[ChartDataLabels]} data={dataHorBar} />
            </div>
        </div>
    );

}

export default BarChart;