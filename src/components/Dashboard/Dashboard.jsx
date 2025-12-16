import React, { useEffect, useState } from 'react';
import { getStats, getVocabulary } from '../../lib/storage';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Flame, Activity, Book, Zap } from 'lucide-react';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Dashboard = ({ onNavigate }) => {
    const [stats, setStats] = useState(null);
    const [decayCount, setDecayCount] = useState(0);
    const [totalWords, setTotalWords] = useState(0);
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const s = await getStats();
        const v = await getVocabulary();

        setStats(s);
        setTotalWords(v.length);

        // Decay Logic: items where nextReviewDate is past
        const now = new Date();
        const decaying = v.filter(w => new Date(w.stats.nextReviewDate) <= now);
        setDecayCount(decaying.length);

        // Chart Logic: Last 7 days
        const labels = [];
        const dataPoints = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const displayStr = d.toLocaleDateString('en-US', { weekday: 'short' });

            labels.push(displayStr);
            dataPoints.push(s.wordsLearnedHistory[dateStr] || 0);
        }

        setChartData({
            labels,
            datasets: [
                {
                    label: 'Words Learned',
                    data: dataPoints,
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#8b5cf6',
                    pointBorderColor: '#fff',
                }
            ]
        });
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0,0,0,0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                cornerRadius: 8,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#a0a4ac', stepSize: 1 }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#a0a4ac' }
            }
        }
    };

    if (!stats) return <div className="loading">Loading dashboard...</div>;

    return (
        <div className="dashboard-container">
            <h1 className="dash-title">Welcome back!</h1>

            <div className="stats-grid">
                <div className="stat-card glass-panel">
                    <div className="stat-icon-wrapper fire">
                        <Flame size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.streak} Days</h3>
                        <p>Current Streak</p>
                    </div>
                </div>

                <div className="stat-card glass-panel">
                    <div className="stat-icon-wrapper book">
                        <Book size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>{totalWords}</h3>
                        <p>Total Words</p>
                    </div>
                </div>

                <div className="stat-card glass-panel">
                    <div className="stat-icon-wrapper decay">
                        <Activity size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>{decayCount}</h3>
                        <p>Needs Review</p>
                    </div>
                </div>
            </div>

            <div className="main-grid">
                <div className="chart-section glass-panel">
                    <h3>Learning Velocity</h3>
                    <div className="chart-wrapper">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>

                <div className="daily-mix-section glass-panel">
                    <h3>Daily Mix</h3>
                    <p>Ready for your daily practice?</p>
                    <ul className="mix-list">
                        <li>🎯 5 Review Words</li>
                        <li>🗣️ 1 Speaking Topic</li>
                    </ul>
                    <button className="start-btn" onClick={() => onNavigate('practice')}>
                        <Zap size={18} fill="currentColor" /> Start Session
                    </button>

                    {decayCount > 0 && (
                        <div className="decay-alert">
                            ⚠️ {decayCount} words are fading from memory!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
