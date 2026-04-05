"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Zap,
    Shield,
    Orbit,
    Globe,
    ShoppingCart,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Sparkles,
    ChevronRight,
    Search,
    User,
    Menu,
    X,
    MessageSquare,
    Send,
    Package
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const PRODUCTS = [
    {
        id: "relay-core",
        name: "Relay Core Node",
        price: 299.00,
        desc: "Base unit for high-performance cross-platform message synchronization with zero overhead.",
        icon: Zap,
        color: "blue"
    },
    {
        id: "quantum-bridge",
        name: "Quantum Secure Bridge",
        price: 899.50,
        desc: "Military-grade post-quantum encrypted relay for highly sensitive financial transmissions.",
        icon: Shield,
        color: "purple"
    },
    {
        id: "neural-uplink",
        name: "Neural Data Uplink",
        price: 1499.99,
        desc: "Direct bio-cybernetic interface for instant relaying. Controlled via neural impulses.",
        icon: Orbit,
        color: "amber"
    },
    {
        id: "aether-link",
        name: "Aether Satellite Link",
        price: 4999.00,
        desc: "Global coverage via AetherDigital's dedicated low-earth orbit constellation. Works everywhere.",
        icon: Globe,
        color: "cyan"
    }
];

export default function DemoStorePage() {
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cart, setCart] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Fetch API Keys on mount to use for the simulation
    useEffect(() => {
        fetch('/api/keys')
            .then(res => res.json())
            .then(data => {
                if (data.keys && data.keys.length > 0) {
                    // Use the first active key’s hash (assuming for demo purposes)
                    setApiKey(data.keys[0].key_hash);
                }
            })
            .catch(err => console.error('Failed to fetch keys for simulation:', err));
    }, []);

    const addToCart = (product: any) => {
        setCart([product]); // Single item checkout for easier testing
        setIsCartOpen(true);
    };

    const handleCheckout = async () => {
        if (!apiKey) {
            setStatus({ type: 'error', msg: "Please login and create an API Key in the dashboard first." });
            return;
        }

        setIsLoading(true);
        setStatus(null);

        const order = cart[0];
        const orderId = `ORD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

        try {
            // Trigger the Relay Engine
            const response = await fetch('/api/relay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey
                },
                body: JSON.stringify({
                    category: 'SALE',
                    variables: {
                        order_id: orderId, // Internal ID
                        order_number: orderId.replace('ORD-', '#'), // Display ID
                        customer_name: "Exequiel Test",
                        customer_email: "user@example.com",
                        item_name: order.name,
                        item_count: 1,
                        total_price: order.price,
                        amount: order.price, // Compatibility alias
                        currency: "USD",
                        shipping_city: "Mendoza",
                        shipping_country: "Argentina",
                        status: "paid",
                        timestamp: new Date().toISOString()
                    }
                })
            });

            if (response.ok) {
                setStatus({ type: 'success', msg: `Order ${orderId} processed! Relay signal transmitted successfully.` });
                setCart([]);
                setTimeout(() => setIsCartOpen(false), 3000);
            } else {
                const err = await response.json();
                setStatus({ type: 'error', msg: err.error || "Uplink failed. Check your API Key configuration." });
            }
        } catch (err) {
            setStatus({ type: 'error', msg: "Connection lost. The Relay server is unreachable." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#020408] text-white font-sans selection:bg-accent/30 overflow-x-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-accent/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-purple-600/5 blur-[120px] rounded-full translate-y-1/3 -translate-x-1/4" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
            </div>

            {/* Premium Header */}
            <header className="fixed top-0 w-full z-40 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center glass border-white/5 rounded-3xl px-8 py-3 shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center gap-12">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-black text-xl tracking-tighter italic italic-bold">AETHER STORE</span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <a href="#" className="text-white hover:text-accent transition-colors">Catalog</a>
                            <a href="#" className="hover:text-white transition-colors">Uplink Status</a>
                            <a href="#" className="hover:text-white transition-colors">Support</a>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-400 hover:text-white transition-colors">
                            <Search className="w-5 h-5" />
                        </button>
                        <Link href="/dashboard" className="p-2 text-slate-400 hover:text-white transition-colors border border-white/5 rounded-full bg-white/5">
                            <User className="w-5 h-5" />
                        </Link>
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative group p-2.5 rounded-full bg-accent text-white shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:scale-105 transition-all active:scale-95"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-accent rounded-full text-[10px] font-black flex items-center justify-center border-2 border-accent">
                                    {cart.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 pt-44 pb-20 px-6 max-w-7xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.2em] mb-8"
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    SIMULATION MODE ACTIVE
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-tight"
                >
                    QUANTUM HARDWARE <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 italic">NEXT-GEN UPLINK</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed"
                >
                    Official simulation laboratory for the Relay Protocol. Verify your automated multi-channel delivery pipelines in a real-world e-commerce environment.
                </motion.p>
            </section>

            {/* Product Grid */}
            <section className="relative z-10 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-44">
                {PRODUCTS.map((product, idx) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * idx }}
                        className="group relative"
                    >
                        <div className="absolute -inset-0.5 bg-gradient-to-b from-white/10 to-transparent rounded-[40px] blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative glass border-white/5 rounded-[40px] p-8 h-full flex flex-col hover:border-white/20 transition-all">
                            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-8 shadow-inner border border-white/5 bg-white/5 text-slate-400 group-hover:text-white transition-colors`}>
                                <product.icon className="w-8 h-8" />
                            </div>

                            <h3 className="text-2xl font-black mb-3 tracking-tight group-hover:text-accent transition-colors uppercase italic">{product.name}</h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 flex-1">
                                {product.desc}
                            </p>

                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                <div className="text-2xl font-black tracking-tighter">${product.price.toFixed(2)}</div>
                                <button
                                    onClick={() => addToCart(product)}
                                    className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent hover:border-accent transition-all group-hover:scale-110 active:scale-95"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </section>

            {/* Slide-over Checkout */}
            <AnimatePresence>
                {isCartOpen && (
                    <div className="fixed inset-0 z-50 flex justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCartOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-3xl"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="relative w-full max-w-md bg-[#05070a] border-l border-white/5 h-full flex flex-col p-10"
                        >
                            <div className="flex items-center justify-between mb-12">
                                <h2 className="text-3xl font-black tracking-tighter italic uppercase flex items-center gap-3">
                                    <ShoppingCart className="w-7 h-7 text-accent" />
                                    TERMINAL
                                </h2>
                                <button onClick={() => setIsCartOpen(false)} className="p-2 border border-white/10 rounded-full hover:bg-white/5 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-4">
                                {cart.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                                        <Package className="w-16 h-16 mb-4 text-slate-700" />
                                        <p className="text-sm font-black uppercase tracking-widest text-slate-500">Cart is empty</p>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        {cart.map((item) => (
                                            <div key={item.id} className="glass p-6 rounded-3xl border-white/10 relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl opacity-50" />
                                                <div className="flex gap-6 items-center relative z-10">
                                                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center">
                                                        <item.icon className="w-8 h-8 text-accent" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-black italic uppercase tracking-tighter text-lg">{item.name}</h4>
                                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Quantity: 1</p>
                                                    </div>
                                                    <div className="font-black text-xl">${item.price.toFixed(2)}</div>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="pt-12 border-t border-white/10 space-y-4">
                                            <div className="flex justify-between text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                                                <span>Subtotal</span>
                                                <span className="text-white">${cart.reduce((a, b) => a + b.price, 0).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                                                <span>Security Protocol Fee</span>
                                                <span className="text-accent underline">WAIVED (BETA)</span>
                                            </div>
                                            <div className="flex justify-between text-2xl font-black tracking-tighter pt-4 border-t border-white/10">
                                                <span>TOTAL</span>
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">${cart.reduce((a, b) => a + b.price, 0).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-12 space-y-6">
                                {status && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`p-4 rounded-2xl border text-sm font-bold flex gap-3 ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}
                                    >
                                        {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                                        {status.msg}
                                    </motion.div>
                                )}

                                {cart.length > 0 && (
                                    <button
                                        onClick={handleCheckout}
                                        disabled={isLoading}
                                        className="w-full h-16 bg-accent text-white rounded-3xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-4 hover:shadow-[0_0_50px_rgba(59,130,246,0.3)] transition-all disabled:opacity-50 group active:scale-95"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                PROCURE TRANSMISSION
                                                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                )}

                                <p className="text-[9px] text-slate-600 text-center font-black uppercase tracking-[0.2em] leading-relaxed">
                                    By clicking procure, you initiate a secure relay protocol to your connected platforms. No actual funds will be deducted in simulation mode.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Footer />
        </main>
    );
}

function Footer() {
    return (
        <footer className="relative z-10 py-20 px-6 border-t border-white/5 bg-black/40">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="text-center md:text-left">
                    <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                        <Sparkles className="w-6 h-6 text-accent" />
                        <span className="font-black text-lg tracking-tighter">AETHER DIGITAL</span>
                    </div>
                    <p className="text-slate-600 text-xs font-bold uppercase tracking-widest max-w-xs leading-loose">
                        Advanced signal processing & cross-platform relay optimization infrastructure.
                    </p>
                </div>

                <div className="flex gap-12 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Security</a>
                    <a href="#" className="hover:text-white transition-colors">Uplink API</a>
                </div>

                <div className="text-[10px] font-black uppercase tracking-widest text-slate-700">
                    &copy; 2026 AETHER • MISSION READY
                </div>
            </div>
        </footer>
    );
}
