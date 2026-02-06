'use client';

import { useState } from 'react';
import Typeform from '../components/Typeform';

export default function Home() {
  const [started, setStarted] = useState(false);

  if (started) {
    return (
      <div className="relative min-h-screen">
        <div className="animated-gradient-bg">
          <div className="gradient-blob"></div>
          <div className="gradient-blob-2"></div>
        </div>
        <Typeform />
      </div>
    );
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-6 md:p-12 text-center overflow-hidden">
      {/* Background - Clean */}
      <div className="absolute inset-0 bg-black -z-10"></div>

      <div className="fade-in z-10 flex flex-col gap-6 items-center max-w-3xl mx-auto">

        {/* Brand Logo/Name */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm tracking-[0.2em] font-bold text-[var(--primary)] uppercase">Sutura Systems</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
          Construye tu <br />
          <span className="text-[var(--text-muted)]">Marca Personal</span>
        </h1>

        <p className="text-lg md:text-xl text-[var(--text-muted)] max-w-xl leading-relaxed mt-4">
          Un formulario breve para entender quién eres y diseñar un plan estratégico a tu medida.
        </p>

        <button
          onClick={() => setStarted(true)}
          className="btn btn-primary text-lg px-10 py-4 mt-8"
        >
          Iniciar Diagnóstico
        </button>

        <div className="mt-8 text-xs text-[var(--text-muted)] opacity-50 uppercase tracking-widest">
          Tiempo estimado: 8 min
        </div>
      </div>
    </main>
  );
}
