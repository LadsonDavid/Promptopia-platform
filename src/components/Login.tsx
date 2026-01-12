import React, { useState } from 'react';
import { AccountCircle, Group } from '@mui/icons-material';

interface LoginProps {
    onOrganizerLogin: () => void;
    onEnterParticipant: () => void;
}

const Login: React.FC<LoginProps> = ({ onOrganizerLogin, onEnterParticipant }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');

        // Hardcoded credentials as per original code
        if (username === 'Promptopia' && password === 'ZXCVBNM') {
            onOrganizerLogin();
        } else {
            setLoginError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">PROMPTIPIA</h1>
                    <p className="text-purple-300">Round 2: Prompt Duel Arena</p>
                </div>

                <div className="space-y-4 mb-6">
                    <button
                        onClick={onEnterParticipant}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        <AccountCircle sx={{ fontSize: 24 }} />
                        Enter as Participant
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/20"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-slate-900/50 text-gray-400">or</span>
                        </div>
                    </div>

                    <details className="bg-white/5 rounded-xl p-4 border border-white/20">
                        <summary className="cursor-pointer text-white font-semibold flex items-center justify-between">
                            Organizer Login
                            <Group className="text-purple-300" sx={{ fontSize: 20 }} />
                        </summary>

                        <form onSubmit={handleLogin} className="mt-4 space-y-3">
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                            />
                            {loginError && (
                                <p className="text-red-400 text-sm">{loginError}</p>
                            )}
                            <button
                                type="submit"
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
                            >
                                Login as Organizer
                            </button>
                        </form>
                    </details>
                </div>
            </div>
        </div>
    );
};

export default Login;
