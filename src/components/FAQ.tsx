"use client";

import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function FAQ() {
    const faqs = [
        {
            question: "¿Qué es la cámara hiperbárica y para qué sirve?",
            answer: "Es un tratamiento donde respiras oxígeno a mayor presión (1.5 ATA), lo que ayuda a tus células a recuperarse y regenerarse. Mejora la oxigenación de los tejidos, disminuye la inflamación y el dolor, y favorece la cicatrización. Es útil para artrosis, lumbago, fibromialgia, migrañas, lesiones deportivas, recuperación post-quirúrgica y problemas de sueño."
        },
        {
            question: "¿Cuánto cuesta y qué incluye la sesión de evaluación?",
            answer: "La sesión de evaluación tiene un valor promocional de $19.990 e incluye 30 minutos de entrevista clínica con la kinesióloga y 1 hora completa en cámara hiperbárica. Si decides continuar con un plan de tratamiento, esta sesión cuenta como la primera y obtienes un 20% de descuento."
        },
        {
            question: "¿Cuántas sesiones necesito y con qué frecuencia?",
            answer: "Idealmente 2 a 3 veces por semana para obtener el efecto óptimo. Ofrecemos un plan de 5 sesiones ($103.990) orientado a relajación e insomnio, y uno de 12 sesiones ($159.990) para dolor, inflamación y recuperación. La cantidad exacta depende de tu caso y se define en la evaluación."
        },
        {
            question: "¿Tienen convenio con FONASA o Isapres?",
            answer: "Realizamos atención particular. El tratamiento hiperbárico no es cubierto por FONASA ni Isapres directamente. Sin embargo, la kinesiología sí es reembolsable por Isapres, seguros complementarios de salud y bienestar laboral."
        },
        {
            question: "¿La cámara es segura? ¿Qué pasa si soy hipertenso/a?",
            answer: "Sí, es un tratamiento no invasivo y bien tolerado. La hipertensión controlada con medicamentos no es contraindicación. Siempre realizamos una evaluación previa y tomamos parámetros clínicos antes y después de cada sesión. La cámara es individual, tiene un sillón reclinable y es cómoda incluso para personas de más de 1.80 m."
        },
        {
            question: "¿Qué otros servicios ofrecen además de la cámara?",
            answer: "Ofrecemos kinesiología, masajes relajantes y descontracturantes, drenaje linfático, presoterapia y un Plan Integral de Drenaje y Recuperación. También realizamos kinesiología a domicilio. La combinación de cámara hiperbárica con kinesiología acelera significativamente la recuperación."
        },
        {
            question: "¿Cómo puedo agendar una hora?",
            answer: "Escríbenos por WhatsApp al +56 9 3018 6496 o usa nuestro chat en esta página. Indicanos qué día te acomoda y si prefieres horario AM o PM. Atendemos de lunes a jueves de 09:00 a 19:00 hrs y viernes de 09:00 a 18:00 hrs."
        }
    ];

    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section id="faq" className="py-12 md:py-24 bg-gradient-to-b from-bg-main to-surface">
            <div className="container max-w-4xl">

                <div className="mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-light text-cyan-dark text-xs font-black uppercase tracking-widest mb-4"
                    >
                        <HelpCircle className="h-4 w-4" />
                        Atención al Paciente
                    </motion.div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-navy mb-6 tracking-tight">
                        Preguntas <span className="text-cyan">Frecuentes</span>
                    </h2>
                    <p className="text-text-muted text-lg max-w-2xl mx-auto font-medium">
                        Todo lo que necesitas saber sobre nuestros tratamientos y cómo prepararte para tu primera visita.
                    </p>
                </div>

                <div className="flex flex-col gap-3 md:gap-4">
                    {faqs.map((faq, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={cn(
                                "rounded-2xl border transition-all duration-300 overflow-hidden bg-white",
                                openIndex === idx
                                    ? "border-cyan shadow-lg shadow-cyan/5"
                                    : "border-border hover:border-cyan/30 hover:shadow-sm"
                            )}
                        >
                            <button
                                className="w-full text-left px-5 py-4 md:px-8 md:py-6 flex items-center justify-between group focus:outline-none"
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                aria-expanded={openIndex === idx}
                            >
                                <span className={cn(
                                    "font-bold text-base md:text-xl transition-colors",
                                    openIndex === idx ? "text-cyan-dark" : "text-navy group-hover:text-cyan"
                                )}>
                                    {faq.question}
                                </span>
                                <div className={cn(
                                    "flex-shrink-0 ml-4 h-8 w-8 rounded-full flex items-center justify-center transition-all",
                                    openIndex === idx ? "bg-cyan text-white rotate-180" : "bg-bg-main text-text-muted group-hover:bg-cyan-light group-hover:text-cyan"
                                )}>
                                    {openIndex === idx ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                                </div>
                            </button>

                            <AnimatePresence initial={false}>
                                {openIndex === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="px-5 pb-5 md:px-8 md:pb-8">
                                            <div className="h-px w-full bg-gray-100 mb-4 md:mb-6" />
                                            <p className="text-text-muted leading-relaxed text-sm md:text-lg font-medium">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-text-muted font-bold mb-4">¿Aún tienes dudas?</p>
                    <Link
                        href="https://wa.me/56930186496"
                        className="inline-flex items-center gap-2 text-cyan font-black hover:text-cyan-dark transition-colors text-lg"
                    >
                        Contáctanos directamente por WhatsApp
                        <span className="text-2xl">→</span>
                    </Link>
                </div>

            </div>
        </section>
    );
}

