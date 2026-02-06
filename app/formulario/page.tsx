'use client';

import { useState } from 'react';
import Typeform from '../components/Typeform';

export default function Home() {
  const [started, setStarted] = useState(false);

  if (started) {
    return <Typeform />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24 text-center max-w-4xl mx-auto">
      <div className="fade-in flex flex-col gap-8 items-center">
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--foreground)] to-[var(--text-muted)] pb-2">
          ¡Vamos a darle forma a tu marca!
        </h1>

        <div className="text-xl md:text-2xl text-[var(--text-muted)] max-w-2xl leading-relaxed space-y-6 text-left md:text-center">
          <p>
            Antes de empezar, queremos entender mejor quién eres y cómo podemos ayudarte a construir tu marca personal.
          </p>
          <p>
            Este formulario toma menos de 10 minutos y no hay respuestas correctas o incorrectas; sé sincero/a y conciso/a.
          </p>
          <p className="font-medium text-[var(--foreground)]">
            Tu información será tratada con confidencialidad y nos permitirá diseñar un plan a tu medida.
          </p>
        </div>

        <button
          onClick={() => setStarted(true)}
          className="btn btn-primary text-xl px-12 py-4 mt-8 rounded-full shadow-[0_0_20px_rgba(212,163,115,0.3)] hover:shadow-[0_0_30px_rgba(212,163,115,0.5)] transition-shadow"
        >
          Comenzar
        </button>

        <div className="mt-12 text-sm text-[var(--text-muted)] opacity-60">
          Presiona <strong>Enter ↵</strong> para comenzar
        </div>
      </div>
    </main>
  );
}
