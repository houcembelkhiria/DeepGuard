import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Lock, BarChart3, ArrowRight, Play } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const LandingPage = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0f13] text-white">
            {/* Navigation Header */}
            <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#0f0f13]/80 backdrop-blur-md">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">DeepGuard</span>
                    </div>
                    <nav className="hidden gap-8 md:flex">
                        <a href="#features" className="text-sm font-medium text-gray-400 transition-colors hover:text-white">Features</a>
                        <a href="#how-it-works" className="text-sm font-medium text-gray-400 transition-colors hover:text-white">How it Works</a>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link to="/login">
                            <Button variant="ghost" className="text-gray-400 hover:text-white">Sign In</Button>
                        </Link>
                        <Link to="/login">
                            <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
                    {/* Background glows */}
                    <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />
                    <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-600/10 blur-[120px]" />

                    <div className="container relative z-10 px-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="mb-6 inline-block rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400">
                                Trusted by AI Researchers Globally
                            </span>
                            <h1 className="mb-8 text-6xl font-bold tracking-tight md:text-8xl bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent">
                                Exposing the Unseen <br /> In Digital Content
                            </h1>
                            <p className="mx-auto mb-12 max-w-2xl text-xl text-gray-400">
                                Our state-of-the-art Deepfake detection platform uses advanced neural networks to verify authenticity in milliseconds.
                            </p>
                            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                                <Link to="/login">
                                    <Button size="lg" className="h-14 px-8 text-lg bg-blue-600 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                                        Start Analysis Free <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Button variant="outline" size="lg" className="h-14 border-white/10 px-8 text-lg hover:bg-white/5">
                                    <Play className="mr-2 h-5 w-5 fill-current" /> Watch Demo
                                </Button>
                            </div>
                        </motion.div>

                        {/* Floating Dashboard Preview */}
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 1 }}
                            className="mt-20 flex justify-center"
                        >
                            <div className="group relative mx-auto max-w-5xl rounded-2xl border border-white/10 bg-black/40 p-2 backdrop-blur-2xl transition-all duration-700 hover:border-blue-500/30">
                                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur group-hover:opacity-40 transition-opacity" />
                                <img
                                    src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2000"
                                    alt="DeepGuard Interface"
                                    className="relative rounded-xl shadow-2xl"
                                />
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Features Grid */}
                <section id="features" className="py-32">
                    <div className="container mx-auto px-6">
                        <div className="mb-20 text-center">
                            <h2 className="mb-4 text-4xl font-bold">Cutting-Edge Detection</h2>
                            <p className="text-gray-400 text-lg">Engineered for accuracy, built for scale.</p>
                        </div>

                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            className="grid gap-8 md:grid-cols-3"
                        >
                            {[
                                {
                                    icon: Zap,
                                    title: "Real-time Verification",
                                    desc: "Get instant results on any image. Our distributed computing cluster processes requests in under 500ms."
                                },
                                {
                                    icon: BarChart3,
                                    title: "Confidence Scoring",
                                    desc: "Beyond binary results, we provide deep-level analytical probability trees for every single pixel."
                                },
                                {
                                    icon: Lock,
                                    title: "Secure Architecture",
                                    desc: "Your data is encrypted end-to-end. We don't store original copies, ensuring your privacy is paramount."
                                }
                            ].map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={fadeIn}
                                    className="glass-panel group p-8"
                                >
                                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                        <feature.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-32 bg-gradient-to-t from-blue-900/10 to-transparent">
                    <div className="container mx-auto px-6 text-center">
                        <div className="glass-panel mx-auto max-w-4xl p-16">
                            <h2 className="mb-6 text-4xl font-bold">Ready to secure your content?</h2>
                            <p className="mb-10 text-xl text-gray-400">Join over 10,000+ professionals using DeepGuard to fight misinformation.</p>
                            <Link to="/login">
                                <Button size="lg" className="h-14 px-12 text-lg bg-blue-600 hover:scale-105 transition-transform">
                                    Create Free Account
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/5 py-12">
                <div className="container mx-auto px-6 text-center text-gray-400">
                    <div className="mb-6 flex justify-center items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-blue-400" />
                        <span className="text-lg font-bold text-white">DeepGuard</span>
                    </div>
                    <p>© 2026 DeepGuard. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};
