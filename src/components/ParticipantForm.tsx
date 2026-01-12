import React, { useState } from 'react';

interface ParticipantFormProps {
    onStart: (name: string, email: string, college: string) => void;
    onBack: () => void;
}

const ParticipantForm: React.FC<ParticipantFormProps> = ({ onStart, onBack }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [college, setCollege] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && email && college) {
            onStart(name, email, college);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
            <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="mb-8">
                    <button
                        onClick={onBack}
                        className="text-purple-300 hover:text-purple-200 mb-4"
                    >
                        ← Back to Login
                    </button>
                    <h1 className="text-5xl font-bold text-white mb-2 text-center">PROMPTIPIA</h1>
                    <div className="text-purple-300 text-xl text-center">Round 2: Prompt Duel Arena</div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white/5 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-semibold text-white mb-4">Participant Details</h2>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                        />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                        />
                        <input
                            type="text"
                            placeholder="College/Institution"
                            value={college}
                            onChange={(e) => setCollege(e.target.value)}
                            required
                            className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                        />
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl transition-all"
                        >
                            Continue
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ParticipantForm;
