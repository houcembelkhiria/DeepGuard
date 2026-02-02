import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setSuccess('Signup successful! Please check your email and log in.');
                setIsSignUp(false);
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate('/');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0f0f13] p-4 text-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel w-full max-w-md p-8"
            >
                <h2 className="mb-2 text-center text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="mb-6 text-center text-gray-400">
                    {isSignUp ? 'Join the deepfake detection platform' : 'Sign in to access your dashboard'}
                </p>

                {error && (
                    <div className="mb-4 rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 rounded-md bg-green-500/10 p-3 text-sm text-green-400 border border-green-500/20">
                        {success}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-300">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-white/5 p-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-300">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-white/5 p-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <Button type="submit" className="w-full" isLoading={loading}>
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="font-medium text-blue-400 hover:text-blue-300 hover:underline"
                    >
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
