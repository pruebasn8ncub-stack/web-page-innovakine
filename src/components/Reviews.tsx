"use client";

import { Star, MessageSquare } from "lucide-react";
import Script from "next/script";
import { motion } from "framer-motion";

export function Reviews() {
    return (
        <section id="opiniones" className="py-16 md:py-24 lg:py-32 bg-white overflow-hidden">
            <div className="container relative">

                <div className="mb-16 text-center max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-light text-cyan-dark text-xs font-black uppercase tracking-widest mb-6"
                    >
                        <MessageSquare className="h-4 w-4" />
                        Testimonios de Pacientes
                    </motion.div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-navy mb-6 tracking-tight leading-tight">
                        Confianza que <span className="text-cyan">Transforma Vidas</span>
                    </h2>
                    <p className="text-text-muted text-lg md:text-xl font-medium leading-relaxed">
                        Nuestra mayor satisfacción es ver la recuperación y el retorno a las actividades normales de quienes confían en nosotros.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex justify-center mb-16 md:mb-20"
                >
                    <a
                        href="https://maps.app.goo.gl/st5fzWLvwPGfJwUQA"
                        target="_blank"
                        rel="noopener"
                        className="group bg-white px-6 py-4 md:px-8 md:py-5 rounded-2xl border border-border shadow-sm hover:shadow-lg hover:border-cyan/20 transition-all duration-400 flex items-center gap-5 md:gap-6"
                    >
                        {/* Google icon */}
                        <div className="h-12 w-12 flex-shrink-0 bg-bg-main rounded-xl flex items-center justify-center border border-border">
                            <svg viewBox="0 0 48 48" aria-hidden="true" width="28" height="28">
                                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                            </svg>
                        </div>

                        {/* Rating + Stars */}
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2.5">
                                <span className="text-3xl font-black text-navy leading-none">4.9</span>
                                <div className="flex gap-0.5 text-[#FFC107]">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                                </div>
                            </div>
                            <span className="text-xs text-text-muted font-semibold mt-1">Google Reviews</span>
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block w-px h-10 bg-border" />

                        {/* CTA */}
                        <span className="hidden md:flex items-center gap-1.5 text-sm font-bold text-cyan group-hover:text-cyan-dark transition-colors">
                            Leer los 38 testimonios
                            <span className="transition-transform group-hover:translate-x-1">→</span>
                        </span>
                    </a>
                </motion.div>

                {/* Elfsight Reviews Widget */}
                <div className="relative z-10">
                    <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
                    <div className="elfsight-app-989f1173-a263-45b3-96b8-d1bfe413008c max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-border" data-elfsight-app-lazy></div>
                </div>

            </div>
        </section>
    );
}
