import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AccessTime, EmojiEvents, CheckCircle, Error as AlertCircle } from '@mui/icons-material';
import { supabase } from '../lib/supabaseClient';
import { PROMPT_DUELS } from '../data/duels';

interface ParticipantGameProps {
    name: string;
    email: string;
    college: string;
    onLogout: () => void;
}

interface Answer {
    duelId: number;
    selected: string;
    explanation: string;
    correct: boolean;
    timeSpent: number;
}

const ParticipantGame: React.FC<ParticipantGameProps> = ({ name, email, college, onLogout }) => {
    const [currentDuel, setCurrentDuel] = useState(0);
    const [timeLeft, setTimeLeft] = useState(1200);
    const [selectedPrompt, setSelectedPrompt] = useState('');
    const [explanation, setExplanation] = useState('');
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [gameStarted, setGameStarted] = useState(false);

    // Use ref to access latest answers in callbacks without triggering re-renders or stale closures
    const answersRef = useRef(answers);

    useEffect(() => {
        answersRef.current = answers;
    }, [answers]);

    const calculateScore = (currentAnswers: Answer[]) => {
        const correctAnswers = currentAnswers.filter(a => a.correct).length;
        const totalQuestions = currentAnswers.length;
        const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
        return { correctAnswers, totalQuestions, percentage };
    };

    const handleFinish = useCallback(async (finalAnswers?: Answer[]) => {
        const answersToSubmit = finalAnswers || answersRef.current;
        setShowResults(true);
        const { percentage } = calculateScore(answersToSubmit);

        // Save submission to Supabase
        const submission = {
            name: name,
            email: email,
            college: college,
            answers: answersToSubmit,
            score: percentage,
            timestamp: new Date().toISOString()
        };

        try {
            const { error } = await supabase
                .from('submissions')
                .insert([submission]);

            if (error) {
                console.error('Error saving submission:', error);
                alert('Failed to save submission. Please try again or contact organizer.');
            }
        } catch (err) {
            console.error('Error:', err);
        }
    }, [name, email, college]);

    useEffect(() => {
        if (!gameStarted || showResults) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleFinish();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameStarted, showResults, handleFinish]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStart = () => {
        setGameStarted(true);
        setStartTime(Date.now());
    };

    const handleSubmit = () => {
        if (!selectedPrompt || !explanation.trim()) {
            alert('Please select a prompt and provide an explanation.');
            return;
        }

        const currentAnswer: Answer = {
            duelId: PROMPT_DUELS[currentDuel].id,
            selected: selectedPrompt,
            explanation: explanation,
            correct: selectedPrompt === PROMPT_DUELS[currentDuel].correctPrompt,
            timeSpent: startTime ? Date.now() - startTime : 0
        };

        const newAnswers = [...answers, currentAnswer];
        setAnswers(newAnswers);

        if (currentDuel < PROMPT_DUELS.length - 1) {
            setCurrentDuel(currentDuel + 1);
            setSelectedPrompt('');
            setExplanation('');
            setStartTime(Date.now());
        } else {
            handleFinish(newAnswers);
        }
    };

    if (!gameStarted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
                <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                    <div className="mb-8">
                        <button
                            onClick={onLogout}
                            className="text-purple-300 hover:text-purple-200 mb-4"
                        >
                            ← Back
                        </button>
                        <h1 className="text-5xl font-bold text-white mb-2 text-center">PROMPTIPIA</h1>
                        <div className="text-purple-300 text-xl text-center">Round 2: Prompt Duel Arena</div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-6 mb-8 text-left">
                        <h2 className="text-2xl font-semibold text-white mb-4">🎯 Your Mission</h2>
                        <p className="text-gray-300 mb-4">
                            You will face {PROMPT_DUELS.length} prompt duels. Each duel shows you:
                        </p>
                        <ul className="text-gray-300 space-y-2 mb-4">
                            <li>• A clear objective</li>
                            <li>• Two professional-looking prompts (A and B)</li>
                            <li>• Two AI outputs</li>
                        </ul>
                        <p className="text-gray-300 mb-4">
                            Your task: <span className="text-purple-300 font-semibold">Identify which prompt actually controls the AI correctly.</span>
                        </p>
                        <div className="bg-purple-500/20 border border-purple-400/30 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <AccessTime className="text-purple-300" sx={{ fontSize: 20 }} />
                                <span className="text-white font-semibold">Time Limit: 20 Minutes</span>
                            </div>
                            <p className="text-gray-300 text-sm">
                                No going back. No second chances. Trust your instincts.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleStart}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all transform hover:scale-105"
                    >
                        Start Challenge
                    </button>
                </div>
            </div>
        );
    }

    if (showResults) {
        const { correctAnswers, totalQuestions, percentage } = calculateScore(answers);

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                        <div className="text-center mb-8">
                            <EmojiEvents className="mx-auto mb-4 text-yellow-400" sx={{ fontSize: 64 }} />
                            <h1 className="text-4xl font-bold text-white mb-2">Challenge Complete!</h1>
                            <p className="text-gray-300">Here's how you performed, {name}</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="bg-white/5 rounded-xl p-6 text-center">
                                <div className="text-4xl font-bold text-green-400 mb-2">{correctAnswers}</div>
                                <div className="text-gray-300">Correct</div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 text-center">
                                <div className="text-4xl font-bold text-red-400 mb-2">{totalQuestions - correctAnswers}</div>
                                <div className="text-gray-300">Incorrect</div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-6 text-center">
                                <div className="text-4xl font-bold text-purple-400 mb-2">{percentage}%</div>
                                <div className="text-gray-300">Accuracy</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold text-white mb-4">Your Answers</h2>
                            {answers.map((answer, idx) => (
                                <div key={idx} className={`bg-white/5 rounded-xl p-4 border ${answer.correct ? 'border-green-500/50' : 'border-red-500/50'}`}>
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {answer.correct ? (
                                                <CheckCircle className="text-green-400" sx={{ fontSize: 20 }} />
                                            ) : (
                                                <AlertCircle className="text-red-400" sx={{ fontSize: 20 }} />
                                            )}
                                            <span className="text-white font-semibold">Duel {answer.duelId}</span>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm ${answer.correct ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                            {answer.correct ? 'Correct' : 'Incorrect'}
                                        </span>
                                    </div>
                                    <div className="text-gray-300 text-sm mb-2">
                                        Your choice: <span className="text-purple-300">Prompt {answer.selected}</span>
                                    </div>
                                    <div className="text-gray-400 text-sm italic">
                                        "{answer.explanation}"
                                    </div>
                                    {!answer.correct && (
                                        <div className="mt-2 text-yellow-300 text-sm">
                                            Correct answer: Prompt {PROMPT_DUELS[idx].correctPrompt}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={onLogout}
                            className="w-full mt-8 bg-purple-500/20 hover:bg-purple-500/30 text-white font-semibold py-3 px-6 rounded-xl transition-all"
                        >
                            Return to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const duel = PROMPT_DUELS[currentDuel];
    const progress = ((currentDuel + 1) / PROMPT_DUELS.length) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white">PROMPTIPIA - Round 2</h1>
                            <p className="text-gray-300">Duel {currentDuel + 1} of {PROMPT_DUELS.length}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg">
                                <AccessTime className="text-purple-300" sx={{ fontSize: 20 }} />
                                <span className={`font-mono text-xl ${timeLeft < 60 ? 'text-red-400' : 'text-white'}`}>
                                    {formatTime(timeLeft)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-400/30 mb-6">
                    <h2 className="text-xl font-semibold text-purple-300 mb-2">🎯 Goal</h2>
                    <p className="text-white text-lg">{duel.goal}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <h3 className="text-lg font-semibold text-purple-300 mb-4">Prompt A</h3>
                        <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{duel.promptA}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <h3 className="text-lg font-semibold text-pink-300 mb-4">Prompt B</h3>
                        <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{duel.promptB}</p>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
                    <h3 className="text-xl font-semibold text-white mb-4">AI Outputs</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white/5 rounded-xl p-4">
                            <div className="text-gray-400 text-sm mb-2">Output 1</div>
                            <pre className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">{duel.output1}</pre>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4">
                            <div className="text-gray-400 text-sm mb-2">Output 2</div>
                            <pre className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">{duel.output2}</pre>
                        </div>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <h3 className="text-xl font-semibold text-white mb-4">Your Answer</h3>

                    <div className="mb-4">
                        <label className="text-gray-300 mb-2 block">Which prompt produced the better output?</label>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setSelectedPrompt('A')}
                                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${selectedPrompt === 'A'
                                    ? 'bg-purple-500 text-white border-2 border-purple-400'
                                    : 'bg-white/5 text-gray-300 border-2 border-white/20 hover:border-purple-400/50'
                                    }`}
                            >
                                Prompt A
                            </button>
                            <button
                                onClick={() => setSelectedPrompt('B')}
                                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${selectedPrompt === 'B'
                                    ? 'bg-pink-500 text-white border-2 border-pink-400'
                                    : 'bg-white/5 text-gray-300 border-2 border-white/20 hover:border-pink-400/50'
                                    }`}
                            >
                                Prompt B
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-300 mb-2 block">Why is the other prompt weaker? (1-2 lines)</label>
                        <textarea
                            value={explanation}
                            onChange={(e) => setExplanation(e.target.value)}
                            className="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 resize-none"
                            rows={3}
                            placeholder="E.g., 'Prompt A lacks scope control and includes non-financial risks like regulation and infrastructure.'"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!selectedPrompt || !explanation.trim()}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl transition-all"
                    >
                        {currentDuel < PROMPT_DUELS.length - 1 ? 'Next Duel' : 'Finish Challenge'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ParticipantGame;
