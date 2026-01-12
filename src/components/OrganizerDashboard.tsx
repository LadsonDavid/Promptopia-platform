import React, { useState, useEffect } from 'react';
import { Logout, Group, BarChart, EmojiEvents, Visibility, Download, CheckCircle, Error as AlertCircle } from '@mui/icons-material';
import { supabase } from '../lib/supabaseClient';
import { PROMPT_DUELS } from '../data/duels';

interface OrganizerDashboardProps {
    onLogout: () => void;
}

interface Answer {
    duelId: number;
    selected: string;
    explanation: string;
    correct: boolean;
    timeSpent: number;
}

interface Submission {
    id: number;
    name: string;
    email: string;
    college: string;
    answers: Answer[];
    score: number;
    timestamp: string;
}

const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({ onLogout }) => {
    const [allSubmissions, setAllSubmissions] = useState<Submission[]>([]);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [organizerView, setOrganizerView] = useState<'dashboard' | 'submissions' | 'details'>('dashboard');

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const { data, error } = await supabase
                    .from('submissions')
                    .select('*')
                    .order('timestamp', { ascending: false });

                if (error) {
                    console.error('Error fetching submissions:', error);
                } else {
                    setAllSubmissions(data || []);
                }
            } catch (err) {
                console.error('Error:', err);
            }
        };

        fetchSubmissions();
    }, []);

    const exportToCSV = () => {
        const headers = ['Name', 'Email', 'College', 'Score', 'Correct Answers', 'Total Questions', 'Timestamp'];
        const rows = allSubmissions.map(sub => [
            sub.name,
            sub.email,
            sub.college,
            sub.score + '%',
            sub.answers.filter(a => a.correct).length,
            sub.answers.length,
            new Date(sub.timestamp).toLocaleString()
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'promptipia_results.csv';
        a.click();
    };

    const topScorers = [...allSubmissions].sort((a, b) => b.score - a.score).slice(0, 10);
    const avgScore = allSubmissions.length > 0
        ? Math.round(allSubmissions.reduce((sum, s) => sum + s.score, 0) / allSubmissions.length)
        : 0;

    if (organizerView === 'details' && selectedSubmission) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
                        <div className="flex justify-between items-center">
                            <button
                                onClick={() => {
                                    setOrganizerView('submissions');
                                    setSelectedSubmission(null);
                                }}
                                className="text-purple-300 hover:text-purple-200 flex items-center gap-2"
                            >
                                ← Back to Submissions
                            </button>
                            <button
                                onClick={onLogout}
                                className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg transition-all"
                            >
                                <Logout sx={{ fontSize: 18 }} />
                                Logout
                            </button>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-white mb-2">{selectedSubmission.name}</h2>
                            <div className="flex gap-6 text-gray-300">
                                <span>{selectedSubmission.email}</span>
                                <span>•</span>
                                <span>{selectedSubmission.college}</span>
                                <span>•</span>
                                <span>{new Date(selectedSubmission.timestamp).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="bg-white/5 rounded-xl p-6 text-center">
                                <div className="text-4xl font-bold text-green-400 mb-2">
                                    {selectedSubmission.answers.filter(a => a.correct).length}
                                </div>
                                <div className="text-gray-300">Correct</div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 text-center">
                                <div className="text-4xl font-bold text-red-400 mb-2">
                                    {selectedSubmission.answers.length - selectedSubmission.answers.filter(a => a.correct).length}
                                </div>
                                <div className="text-gray-300">Incorrect</div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 text-center">
                                <div className="text-4xl font-bold text-purple-400 mb-2">{selectedSubmission.score}%</div>
                                <div className="text-gray-300">Score</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white">Detailed Answers</h3>
                            {selectedSubmission.answers.map((answer, idx) => {
                                const duel = PROMPT_DUELS.find(d => d.id === answer.duelId);
                                return (
                                    <div key={idx} className={`bg-white/5 rounded-xl p-6 border ${answer.correct ? 'border-green-500/50' : 'border-red-500/50'}`}>
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    {answer.correct ? (
                                                        <CheckCircle className="text-green-400" sx={{ fontSize: 20 }} />
                                                    ) : (
                                                        <AlertCircle className="text-red-400" sx={{ fontSize: 20 }} />
                                                    )}
                                                    <span className="text-white font-semibold">Duel {answer.duelId}</span>
                                                </div>
                                                <div className="text-gray-400 text-sm">{duel?.goal}</div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm ${answer.correct ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                                {answer.correct ? 'Correct' : 'Incorrect'}
                                            </span>
                                        </div>

                                        <div className="bg-white/5 rounded-lg p-4 mb-3">
                                            <div className="text-gray-400 text-sm mb-1">Participant's Choice:</div>
                                            <div className="text-purple-300">Prompt {answer.selected}</div>
                                        </div>

                                        <div className="bg-white/5 rounded-lg p-4 mb-3">
                                            <div className="text-gray-400 text-sm mb-1">Explanation:</div>
                                            <div className="text-gray-200 italic">"{answer.explanation}"</div>
                                        </div>

                                        {!answer.correct && (
                                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                                                <div className="text-yellow-300 text-sm mb-1">Correct Answer:</div>
                                                <div className="text-yellow-200">Prompt {duel?.correctPrompt}</div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (organizerView === 'submissions') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
                        <div className="flex justify-between items-center">
                            <button
                                onClick={() => setOrganizerView('dashboard')}
                                className="text-purple-300 hover:text-purple-200 flex items-center gap-2"
                            >
                                ← Back to Dashboard
                            </button>
                            <button
                                onClick={onLogout}
                                className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg transition-all"
                            >
                                <Logout sx={{ fontSize: 18 }} />
                                Logout
                            </button>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                        <h2 className="text-3xl font-bold text-white mb-6">All Submissions</h2>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/20">
                                        <th className="text-left text-gray-300 font-semibold py-3 px-4">Submitted</th>
                                        <th className="text-left text-gray-300 font-semibold py-3 px-4">College</th>
                                        <th className="text-center text-gray-300 font-semibold py-3 px-4">Score</th>
                                        <th className="text-center text-gray-300 font-semibold py-3 px-4">Correct</th>
                                        <th className="text-left text-gray-300 font-semibold py-3 px-4">Time</th>
                                        <th className="text-center text-gray-300 font-semibold py-3 px-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allSubmissions.map((sub) => (
                                        <tr key={sub.id} className="border-b border-white/10 hover:bg-white/5">
                                            <td className="py-4 px-4 text-white">{sub.name}</td>
                                            <td className="py-4 px-4 text-gray-300">{sub.college}</td>
                                            <td className="py-4 px-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${sub.score >= 80 ? 'bg-green-500/20 text-green-300' :
                                                    sub.score >= 60 ? 'bg-yellow-500/20 text-yellow-300' :
                                                        'bg-red-500/20 text-red-300'
                                                    }`}>
                                                    {sub.score}%
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-center text-gray-300">
                                                {sub.answers.filter(a => a.correct).length}/{sub.answers.length}
                                            </td>
                                            <td className="py-4 px-4 text-gray-300 text-sm">
                                                {new Date(sub.timestamp).toLocaleString()}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <button
                                                    onClick={() => {
                                                        setSelectedSubmission(sub);
                                                        setOrganizerView('details');
                                                    }}
                                                    className="flex items-center gap-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-4 py-2 rounded-lg transition-all mx-auto"
                                                >
                                                    <Visibility sx={{ fontSize: 16 }} />
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {allSubmissions.length === 0 && (
                            <div className="text-center py-12 text-gray-400">
                                No submissions yet
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Organizer Dashboard</h1>
                            <p className="text-gray-300">PROMPTIPIA - Round 2</p>
                        </div>
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg transition-all"
                        >
                            <Logout sx={{ fontSize: 18 }} />
                            Logout
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <div className="flex items-center gap-3 mb-3">
                            <Group className="text-purple-400" sx={{ fontSize: 32 }} />
                            <div>
                                <div className="text-4xl font-bold text-white">{allSubmissions.length}</div>
                                <div className="text-gray-300 text-sm">Total Participants</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <div className="flex items-center gap-3 mb-3">
                            <BarChart className="text-green-400" sx={{ fontSize: 32 }} />
                            <div>
                                <div className="text-4xl font-bold text-white">{avgScore}%</div>
                                <div className="text-gray-300 text-sm">Average Score</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <div className="flex items-center gap-3 mb-3">
                            <EmojiEvents className="text-yellow-400" sx={{ fontSize: 32 }} />
                            <div>
                                <div className="text-4xl font-bold text-white">
                                    {topScorers.length > 0 ? topScorers[0].score + '%' : 'N/A'}
                                </div>
                                <div className="text-gray-300 text-sm">Highest Score</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <EmojiEvents className="text-yellow-400" sx={{ fontSize: 24 }} />
                            Top 10 Scorers
                        </h2>

                        <div className="space-y-3">
                            {topScorers.map((sub, idx) => (
                                <div key={sub.id} className="flex items-center justify-between bg-white/5 rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${idx === 0 ? 'bg-yellow-500 text-black' :
                                            idx === 1 ? 'bg-gray-400 text-black' :
                                                idx === 2 ? 'bg-orange-600 text-white' :
                                                    'bg-white/10 text-white'
                                            }`}>
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <div className="text-white font-semibold">{sub.name}</div>
                                            <div className="text-gray-400 text-sm">{sub.college}</div>
                                        </div>
                                    </div>
                                    <div className={`text-xl font-bold ${sub.score >= 80 ? 'text-green-400' :
                                        sub.score >= 60 ? 'text-yellow-400' :
                                            'text-red-400'
                                        }`}>
                                        {sub.score}%
                                    </div>
                                </div>
                            ))}

                            {topScorers.length === 0 && (
                                <div className="text-center py-8 text-gray-400">
                                    No submissions yet
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>

                        <div className="space-y-3">
                            <button
                                onClick={() => setOrganizerView('submissions')}
                                className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-between"
                            >
                                <span>View All Submissions</span>
                                <Visibility sx={{ fontSize: 20 }} />
                            </button>

                            <button
                                onClick={exportToCSV}
                                disabled={allSubmissions.length === 0}
                                className="w-full bg-green-500/20 hover:bg-green-500/30 disabled:bg-gray-500/20 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-between"
                            >
                                <span>Export to CSV</span>
                                <Download sx={{ fontSize: 20 }} />
                            </button>

                            <div className="bg-white/5 rounded-xl p-4 mt-4">
                                <h3 className="text-white font-semibold mb-2">Event Statistics</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-300">
                                        <span>Completion Rate:</span>
                                        <span className="text-white font-semibold">
                                            {allSubmissions.length > 0 ? '100%' : '0%'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-300">
                                        <span>Pass Rate (≥60%):</span>
                                        <span className="text-white font-semibold">
                                            {allSubmissions.length > 0
                                                ? Math.round((allSubmissions.filter(s => s.score >= 60).length / allSubmissions.length) * 100) + '%'
                                                : '0%'
                                            }
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-300">
                                        <span>Excellence Rate (≥80%):</span>
                                        <span className="text-white font-semibold">
                                            {allSubmissions.length > 0
                                                ? Math.round((allSubmissions.filter(s => s.score >= 80).length / allSubmissions.length) * 100) + '%'
                                                : '0%'
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizerDashboard;
