import Link from "next/link";
import Image from "next/image";
import {
    CheckCircle,
    PlayCircle,
    Check,
    Verified,
} from "lucide-react";

export default function HomePage() {
    return (
        <>
            {/* ─── Hero Section ─── */}
            <section className="relative overflow-hidden py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                    <div className="z-10">
                        <h1 className="text-5xl lg:text-7xl font-black text-clay leading-[1.1] mb-6 font-serif">
                            Your business, <br />
                            <span className="editorial-heading font-normal text-primary">
                                without the chaos.
                            </span>
                        </h1>
                        <p className="text-lg lg:text-xl text-clay/70 mb-10 max-w-lg leading-relaxed">
                            Rookies manages orders, payments, customers, and WhatsApp — so
                            you can focus on the art of creating.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/sign-up">
                                <button className="bg-primary text-white text-base font-bold px-8 py-4 rounded-xl hover:scale-[1.02] transition-transform shadow-xl shadow-primary/30">
                                    Get Started Free
                                </button>
                            </Link>
                            <button className="bg-white border border-primary/20 text-clay text-base font-bold px-8 py-4 rounded-xl flex items-center gap-2 hover:bg-peach-soft transition-colors">
                                <PlayCircle className="h-5 w-5" />
                                Watch Demo
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-3xl"></div>
                        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBltStGdVI-79W1POUh4wUKUAcwXlVSxrLeEYbIt111vXbJjgmZGjzpcC7jj-0f-V37ioI4l-Qa22fAb3T44d5BdvBHK8xvaZQ2HUEFmZTdkvtCK5uiiSs4NQnoEhjsNZW6U05mDgiJCNKeOHVx5jsxIp58LeawfKgQzxjeJpmXRv44WAEtIQeQPFIZGYyzQ5CCgc_kxVmZBVPGosn7p9fPj7W9PCI-gLbqNVpPfDtrf0HYyXXNbJ4c4kZPaBRIh63Vb2OQs377tuI8"
                                alt="Jewelry tray with pink bags and crafting materials"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── The Chaos We Solve ─── */}
            <section id="solutions" className="py-24 bg-peach-soft/30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 font-serif">
                            The Chaos We Solve
                        </h2>
                        <p className="uppercase tracking-[0.1em] text-sm font-semibold opacity-60">
                            From manual mess to digital harmony.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Card 1 — Order Management */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-primary/5 group">
                            <div className="aspect-square rounded-xl overflow-hidden mb-6 relative">
                                <div className="absolute inset-0 bg-clay/20 group-hover:bg-transparent transition-colors z-10"></div>
                                <Image
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDP9dGw5kEivp43EwLEk1VvY1vryOABaDckmAlcQ72YgdMob0gogB-UMNtxXiteefFMWRWQPXQpF5p02Xgm2yvrcpDz_MoP0yQhziv5sokfN4_Ay4oq3RuwfIEsRGUd_cztLn85juTtBCnAMfKFNeKet6uO02kkfunPF5RO5tjQOkYSTQX671qBnLZf0Dw43sYO_gVd7OZ6PucxDHUFCUhM6oTw4loUZPjwhiciNfhoRTDy19f8e9SaNKqchBPwvXwW9g89yQm162zR"
                                    alt="Notification fragments and paper sticky notes chaos"
                                    fill
                                    className="object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                                />
                            </div>
                            <h3 className="text-xl font-bold mb-2 px-2 font-serif tracking-tight">
                                Order Management
                            </h3>
                            <p className="text-sm text-clay/60 px-2 leading-relaxed">
                                Stop chasing WhatsApp threads. Every order organized in a
                                single, beautiful flow.
                            </p>
                        </div>

                        {/* Card 2 — Inventory Clarity */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-primary/5 group">
                            <div className="aspect-square rounded-xl overflow-hidden mb-6 relative">
                                <div className="absolute inset-0 bg-clay/20 group-hover:bg-transparent transition-colors z-10"></div>
                                <Image
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjBJ03ZoDtkqRaZWfa4iNQLan7TiL-7NCPTa0AR_tV1Y58lVDDY3Wx8wxh4tw7izBwLuY9yHCX5Ab8SJPnVGuCOUeqip53W_vwl00dwqGlAcxF_mHDJhFeMZK8u7DeCpRuVW87P_-qI3QZDWtcMeWUE2gnULMWtK-JqjDtA_jbfBiSP9dOLVQxn1isp2OjYC9MsbdDLjtS43rAsasnA4uvxKOZaYSJB0q66v2cVwGnuQ_wq5juYgnO30KKiRC1ehBVQZMPQZaZ6Dfi"
                                    alt="A minimal candle with dried flowers decoration"
                                    fill
                                    className="object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                                />
                            </div>
                            <h3 className="text-xl font-bold mb-2 px-2 font-serif tracking-tight">
                                Inventory Clarity
                            </h3>
                            <p className="text-sm text-clay/60 px-2 leading-relaxed">
                                Real-time stock tracking that feels as natural as checking
                                your workspace shelf.
                            </p>
                        </div>

                        {/* Card 3 — Creator Analytics */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-primary/5 group">
                            <div className="aspect-square rounded-xl overflow-hidden mb-6 relative bg-background flex items-center justify-center p-8">
                                <div className="w-full h-full border border-primary/20 rounded-lg flex flex-col justify-end p-6 gap-4 bg-white/50 backdrop-blur-sm">
                                    <div className="flex gap-2 items-end h-32">
                                        <div className="w-full bg-primary/20 h-1/2 rounded-t-sm"></div>
                                        <div className="w-full bg-primary/40 h-3/4 rounded-t-sm"></div>
                                        <div className="w-full bg-primary h-full rounded-t-sm"></div>
                                        <div className="w-full bg-primary/60 h-2/3 rounded-t-sm"></div>
                                    </div>
                                    <div className="h-1 w-full bg-primary/10 rounded-full"></div>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-2 px-2 font-serif tracking-tight">
                                Creator Analytics
                            </h3>
                            <p className="text-sm text-clay/60 px-2 leading-relaxed">
                                Elegant data insights designed for makers, not
                                mathematicians. Growth at a glance.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Simple Tools for Modern Makers ─── */}
            <section className="py-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        {/* Mock Dashboard */}
                        <div className="order-2 lg:order-1 relative">
                            <div className="bg-clay p-4 rounded-2xl shadow-2xl relative z-10">
                                <div className="bg-background rounded-lg aspect-video flex flex-col">
                                    <div className="h-8 border-b border-primary/10 flex items-center px-4 gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                    </div>
                                    <div className="p-6 flex-1">
                                        <div className="grid grid-cols-3 gap-4 mb-6">
                                            <div className="h-20 bg-primary/5 rounded-lg border border-primary/10"></div>
                                            <div className="h-20 bg-primary/5 rounded-lg border border-primary/10"></div>
                                            <div className="h-20 bg-primary/5 rounded-lg border border-primary/10"></div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="h-4 w-3/4 bg-primary/10 rounded"></div>
                                            <div className="h-4 w-1/2 bg-primary/5 rounded"></div>
                                            <div className="h-4 w-2/3 bg-primary/10 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Floating image card */}
                            <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-xl overflow-hidden shadow-xl border-4 border-white z-20 hidden md:block">
                                <Image
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOYMBi8z9DVyrhRSlcWk25B09E__XKcWcmn9m_2UBShp0DqUe68hQC2rCyDNbFVQ0Q1rPhb2Y4I0MUJPMtKpXBsKNydlsm3v6XzsYv0Gl1BYkqZGhCMRyY0JbA_EO7zKU6-4GEXYWYR2cvtcVAkT9Hn_1KIa7buBhhjZHV8kFKzQoKUX2sDkrQ0M9C_SphZSk2l_C1xTQSW9YfZf2Tyrw4cBBSNzkNpVG-yoPzegyO4HSIMsCiK2KFs9LVfFY73YadzuDP0pia67Z0"
                                    alt="Handmade jewelry and packing bags on a desk"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="order-1 lg:order-2">
                            <h2 className="text-4xl font-bold mb-6 font-serif">
                                Simple Tools for Modern Makers
                            </h2>
                            <p className="text-lg text-clay/70 mb-8 leading-relaxed">
                                We&apos;ve stripped away the complexity of enterprise ERPs to
                                give you a dashboard that feels like your favorite
                                sketchbook.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                                    <span className="font-medium">
                                        One-click checkout links
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                                    <span className="font-medium">
                                        Automated stock alerts
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                                    <span className="font-medium">
                                        Unified customer history
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Meet Your Virtual Team ─── */}
            <section id="virtual-team" className="py-24 bg-clay text-peach-soft">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white font-serif">
                            Meet Your Virtual Team
                        </h2>
                        <p className="uppercase tracking-[0.1em] text-sm font-semibold opacity-50">
                            Invisible support for visible success.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-12">
                        {/* Warehouse Manager */}
                        <div className="text-center">
                            <div className="w-full aspect-square rounded-full overflow-hidden mb-8 border-2 border-primary/30 p-2">
                                <div className="relative w-full h-full rounded-full overflow-hidden">
                                    <Image
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBU1_arFzzJj9PVCsLGfMHvrcW8nzwFROZ_JXqCoNNwiVwbnFlZYy0nJGc8Ql46GXTkVVBVrRx8YQWjAMyM2tXdObJ0dJGcD-igsTFHLhWp4XOANxE2mCc4mgB-htUzr-oawRcXKc3JU7BWDiew2At3YDJblID1gMV65yCehLzwOuTTtMUjF1O4LzoZT949Ov2X3UdTA-NLp2uUGtsKSpOt8WCSn-29t_Bvm9mbZPt_vup60fzvKEXeeSi9tLBALrrtYB4oPN99kRG0"
                                        alt="Carefully tagged artisanal products on a wooden shelf"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                            <h4 className="text-2xl font-bold mb-2 font-serif">
                                The Warehouse Manager
                            </h4>
                            <p className="text-peach-soft/60">
                                Automated inventory syncing across all your sales channels.
                            </p>
                        </div>

                        {/* Concierge */}
                        <div className="text-center">
                            <div className="w-full aspect-square rounded-full overflow-hidden mb-8 border-2 border-primary/30 p-2">
                                <div className="relative w-full h-full rounded-full overflow-hidden">
                                    <Image
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuwa-c389ZylxX3VhcZxpvTdEkVbKQ2QN4a46BitFI6fy4sBuTSCkRG4l30mm0u90E0-cpS5GhH263uRQ0r4hWWFU3Qd_lx_uCC_-975w8dfTGPeChLkxKjfzEPTJh5jq-0Ov0tuptVlwgDXVMhEUrW_Yx8FeMYsblrk2nMK3Yv794bVm1Q1Gbiowp9UvZ4sfhRwVN7LrZO8fvaS35MiGxh1_RioDhZOnlEIHmw-Z3z1-iJOdZqewe6c6vWfOey7FdzLiC5RSvVZbK"
                                        alt="WhatsApp order confirmations visible on a smartphone screen"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                            <h4 className="text-2xl font-bold mb-2 font-serif">
                                The Concierge
                            </h4>
                            <p className="text-peach-soft/60">
                                Instant WhatsApp updates that keep your customers delighted.
                            </p>
                        </div>

                        {/* Accountant */}
                        <div className="text-center">
                            <div className="w-full aspect-square rounded-full overflow-hidden mb-8 border-2 border-primary/30 p-2">
                                <div className="relative w-full h-full rounded-full overflow-hidden">
                                    <Image
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOEvl254ytdOl6OXosmzdil8jWq3riSN5NVveHUJj4PY5IGgmDc_6oa6H-wh9JLyEwVCtKT6fNv3JUyl-PumuaJZOYkyEijqepcNInlWD4ea6rGaPBGPUBiIahWqJSEd5hPHQC64V1O8HYFfAm38eF2FScvNE5nMrHVJWJyuZKD1P9p5vqBRfaC2vLkUq_OL7A10kNs17Zk9ear3ZLQigQIjm0qwegPWyaDtk090BBbBJBZC5m4OGUAQQ6dWvWwmRWwhhd9bjjoJBP"
                                        alt="Elegant ledger books and neat payment summaries"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                            <h4 className="text-2xl font-bold mb-2 font-serif">
                                The Accountant
                            </h4>
                            <p className="text-peach-soft/60">
                                Tax-ready reports and payment tracking that never misses a
                                cent.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Loved by Local Makers (Testimonial) ─── */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="mb-12 inline-block">
                        <div className="relative w-48 h-48 rounded-2xl overflow-hidden mx-auto shadow-lg">
                            <Image
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuApBx2Lpd7OYDuyHXRIelYxGfNKudSnjOe4n4s83GA-ycLgQNfjAijetGEgyWpZ9-QUSTD0HCWvnTagERcB9MMs9z0UxS_zmhH-2sZ6icVgRjUPg1ZfGRJGPcMRmm-i3RBmO6h6WzqMOanKbQe1zSMx9VJmaMB7qeKFN_pH26b7RFOByRwLpOEmSDjnIwAHfbaNKsZ57FD7JVpqkmavrWZH4B-Lo609xdgwYToWCoTqcWB2BAuDDHFGZgngcV7HdKEX_d4wTtA-LrZg"
                                alt="Box of tarts with a label saying This box contains happiness"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold mb-8 editorial-heading font-serif">
                        &ldquo;Rookies didn&apos;t just organize my business; it gave me
                        my weekends back. It&apos;s like having a silent partner{" "}
                        <span className="editorial-heading italic font-normal">
                            who never sleeps.
                        </span>
                        &rdquo;
                    </h2>
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Verified className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-bold tracking-widest uppercase text-sm">
                            Aurore Pâtisserie
                        </span>
                    </div>
                </div>
            </section>

            {/* ─── Pricing ─── */}
            <section id="pricing" className="py-24 bg-peach-soft/20">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4 font-serif">
                            Transparent &amp; Calm Pricing
                        </h2>
                        <p className="text-clay/60">
                            No hidden fees, no aggressive tiers. Just growth.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Free Tier */}
                        <div className="bg-white p-10 rounded-2xl border border-primary/5 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-lg font-bold mb-2 uppercase tracking-widest text-clay/50 font-serif">
                                Free
                            </h3>
                            <div className="text-5xl font-black mb-8">
                                $0
                                <span className="text-lg font-normal text-clay/40">
                                    /mo
                                </span>
                            </div>
                            <ul className="space-y-4 mb-10">
                                <li className="flex items-center gap-3">
                                    <Check className="h-4 w-4 text-primary/40" />
                                    Up to 50 orders / month
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="h-4 w-4 text-primary/40" />
                                    Basic Inventory
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="h-4 w-4 text-primary/40" />
                                    WhatsApp integration
                                </li>
                            </ul>
                            <Link href="/sign-up">
                                <button className="w-full py-4 rounded-xl border-2 border-clay/10 font-bold hover:bg-peach-soft/50 transition-colors">
                                    Start for Free
                                </button>
                            </Link>
                        </div>

                        {/* Pro Tier */}
                        <div className="bg-white p-10 rounded-2xl border-2 border-primary shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-4 py-1 uppercase tracking-widest rounded-bl-lg">
                                Recommended
                            </div>
                            <h3 className="text-lg font-bold mb-2 uppercase tracking-widest text-primary font-serif">
                                Pro
                            </h3>
                            <div className="text-5xl font-black mb-8">
                                $29
                                <span className="text-lg font-normal text-clay/40">
                                    /mo
                                </span>
                            </div>
                            <ul className="space-y-4 mb-10">
                                <li className="flex items-center gap-3 font-medium">
                                    <Check className="h-4 w-4 text-primary" />
                                    Unlimited orders
                                </li>
                                <li className="flex items-center gap-3 font-medium">
                                    <Check className="h-4 w-4 text-primary" />
                                    Advanced Analytics
                                </li>
                                <li className="flex items-center gap-3 font-medium">
                                    <Check className="h-4 w-4 text-primary" />
                                    Multi-user access
                                </li>
                                <li className="flex items-center gap-3 font-medium">
                                    <Check className="h-4 w-4 text-primary" />
                                    Priority Concierge Support
                                </li>
                            </ul>
                            <Link href="/sign-up">
                                <button className="w-full py-4 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all">
                                    Go Pro Today
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Final CTA ─── */}
            <section className="relative py-32 overflow-hidden bg-background-dark">
                <div className="absolute inset-0 opacity-40">
                    <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvsdFlwfhy24WI4hIPR1MK-WXI7lzXMhbs2UOzd-9xtrB4qX_kXsQpOqEXlXkA4LmhEMGefPBbqo9hsl6h8KW02Yp_IRC3Ngokoo5fXBUIOuFbRQhrYtrvnniimWOTCokI74aCTBdhabOdauPM_yRGJ1GFDMJ5P7NEu9dEXSjRD-zoTbDO16JPRXLOpeRCoy38_sWwOt3dZX0OikUMMsceMgJvpQTSYpGHTJr9LLx4cFKrSspDs14NQD_5Z1RDdrCirUpmfP-Hjx4G"
                        alt="Calm evening workspace with a desk lamp glow"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a110c] via-[#1a110c]/80 to-transparent"></div>
                </div>
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8 font-serif">
                        Ready to reclaim your focus?
                    </h2>
                    <p className="text-xl text-peach-soft/70 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Join over 2,000 creators who have traded chaos for clarity. Your
                        first 14 days are on us.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/sign-up">
                            <button className="w-full sm:w-auto bg-primary text-white text-lg font-bold px-10 py-5 rounded-2xl shadow-2xl shadow-primary/40 hover:scale-105 transition-transform">
                                Get Started Free
                            </button>
                        </Link>
                        <button className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border border-white/20 text-lg font-bold px-10 py-5 rounded-2xl hover:bg-white/20 transition-colors">
                            Talk to Sales
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
}
