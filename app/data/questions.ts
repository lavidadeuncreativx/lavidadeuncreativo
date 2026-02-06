export type InputType = 'text' | 'select' | 'multi-select';

export interface Question {
  id: string;
  type: InputType;
  text: string;
  description?: string; // For "Ej. Juan Pérez" etc
  options?: string[];
  maxSelections?: number; // For "Selecciona máximo 2"
  apiField: string;
}

export const questions: Question[] = [
  // BLOQUE 1
  {
    id: 'b1-q1',
    type: 'text',
    text: 'Nombre completo',
    description: '(Ej. Juan Pérez)',
    apiField: 'Nombre completo',
  },
  {
    id: 'b1-q2',
    type: 'multi-select',
    text: '¿Cómo te gustaría que te llamen públicamente en tu marca?',
    options: [
      'Mi nombre tal cual',
      'Nombre + apellido',
      'Apodo / alias',
      'Aún no lo sé'
    ],
    apiField: '¿Cómo te gustaría que te llamen públicamente en tu marca?',
  },
  {
    id: 'b1-q3',
    type: 'select',
    text: '¿En qué país vives actualmente?',
    options: [
      'México',
      'Estados Unidos'
    ],
    apiField: '¿En qué país vives actualmente?',
  },
  {
    id: 'b1-q4',
    type: 'select',
    text: '¿A qué te dedicas hoy principalmente?',
    options: [
      'Empleado/a',
      'Freelancer / independiente',
      'Emprendedor/a',
      'Estudiante',
      'Otro'
    ],
    apiField: '¿A qué te dedicas hoy principalmente?',
  },
  {
    id: 'b1-q5',
    type: 'select',
    text: '¿Hace cuánto tiempo estás en tu área principal de experiencia?',
    options: [
      'Menos de 1 año',
      '1–3 años',
      '3–5 años',
      'Más de 5 años'
    ],
    apiField: '¿Hace cuánto tiempo estás en tu área principal de experiencia?',
  },
  // BLOQUE 2
  {
    id: 'b2-q1',
    type: 'text',
    text: '¿En qué nicho te gustaría posicionar tu marca personal?',
    description: '(Respuesta corta — ejemplo: fitness, nutrición, marketing, psicología, espiritualidad, finanzas, etc.)',
    apiField: '¿En qué nicho te gustaría posicionar tu marca personal?',
  },
  {
    id: 'b2-q2',
    type: 'multi-select',
    text: '¿Qué problema principal ayudas a resolver en ese nicho?',
    options: [
      'Falta de conocimiento',
      'Falta de resultados',
      'Falta de claridad',
      'Falta de disciplina',
      'Falta de sistema',
      'Otro'
    ],
    apiField: '¿Qué problema principal ayudas a resolver en ese nicho?',
  },
  {
    id: 'b2-q3',
    type: 'select',
    text: '¿Cuál es tu nivel de experiencia percibido en ese tema?',
    options: [
      'Principiante (estoy aprendiendo)',
      'Intermedio (ya tengo resultados)',
      'Avanzado (he ayudado a otros)',
      'Experto (vivo de esto)'
    ],
    apiField: '¿Cuál es tu nivel de experiencia percibido en ese tema?',
  },
  {
    id: 'b2-q4',
    type: 'select',
    text: '¿Tienes resultados propios o casos reales que puedas contar?',
    options: [
      'Sí personales',
      'Sí de clientes',
      'Ambos',
      'No todavía'
    ],
    apiField: '¿Tienes resultados propios o casos reales que puedas contar?',
  },
  {
    id: 'b2-q5',
    type: 'text',
    text: '¿Qué te diferencia de otros en tu mismo nicho?',
    description: '(Respuesta larga — aquí sale el oro del storytelling)',
    apiField: '¿Qué te diferencia de otros en tu mismo nicho?',
  },
  // BLOQUE 3
  {
    id: 'b3-q1',
    type: 'multi-select',
    text: '¿Para qué quieres crear tu marca personal?',
    description: '(Selecciona máximo 2)',
    options: [
      'Generar ingresos',
      'Conseguir clientes',
      'Vender productos digitales',
      'Conseguir citas / llamadas',
      'Posicionarme como referente',
      'Crear comunidad'
    ],
    maxSelections: 2,
    apiField: '¿Para qué quieres crear tu marca personal?',
  },
  {
    id: 'b3-q2',
    type: 'text',
    text: '¿Cuál sería un resultado ideal en 6 meses con tu marca personal?',
    description: '(Respuesta larga)',
    apiField: '¿Cuál sería un resultado ideal en 6 meses con tu marca personal?',
  },
  {
    id: 'b3-q3',
    type: 'select',
    text: '¿Cuánto te gustaría generar mensualmente con tu marca personal?',
    options: [
      'Solo validar (primeros ingresos)',
      '$5k – $10k MXN',
      '$10k – $30k MXN',
      '+$30k MXN',
      'Aún no lo sé'
    ],
    apiField: '¿Cuánto te gustaría generar mensualmente con tu marca personal?',
  },
  // BLOQUE 4
  {
    id: 'b4-q1',
    type: 'multi-select',
    text: '¿Qué te gustaría vender principalmente?',
    options: [
      'Servicios 1:1',
      'Servicios grupales',
      'Cursos digitales',
      'Mentorías',
      'Membresía',
      'Aún no lo sé'
    ],
    apiField: '¿Qué te gustaría vender principalmente?',
  },
  {
    id: 'b4-q2',
    type: 'select',
    text: '¿Ya tienes algún producto o servicio creado?',
    options: [
      'Sí y ya lo vendo',
      'Sí pero no lo vendo aún',
      'Todavía no'
    ],
    apiField: '¿Ya tienes algún producto o servicio creado?',
  },
  {
    id: 'b4-q3',
    type: 'select',
    text: '¿Cuál sería el precio aproximado de tu oferta principal?',
    options: [
      'Gratis',
      '$500 a $1500 MXN',
      '$1500 a $5000 MXN',
      '$5000 a $15000 MXN',
      '+$15000 MXN',
      'Todavía no lo sé'
    ],
    apiField: '¿Cuál sería el precio aproximado de tu oferta principal?',
  },
  {
    id: 'b4-q4',
    type: 'select',
    text: '¿Te gustaría ofrecer algo gratuito para atraer personas?',
    options: [
      'Ebook / guía',
      'Checklist / plantilla',
      'Clase o masterclass',
      'Reto',
      'Sí pero no sé qué todavía'
    ],
    apiField: '¿Te gustaría ofrecer algo gratuito para atraer personas?',
  },
  // BLOQUE 5
  {
    id: 'b5-q1',
    type: 'multi-select',
    text: '¿En qué redes sociales quieres construir tu marca personal?',
    options: [
      'Instagram',
      'TikTok',
      'YouTube',
      'Facebook',
      'LinkedIn',
      'Threads',
      'Pinterest',
      'Otra'
    ],
    apiField: '¿En qué redes sociales quieres construir tu marca personal?',
  },
  {
    id: 'b5-q2',
    type: 'multi-select',
    text: '¿Qué formatos de contenido te resultan más cómodos?',
    options: [
      'Video hablando a cámara',
      'Texto',
      'Carruseles',
      'Audio / podcast',
      'Todos me resultan cómodos'
    ],
    apiField: '¿Qué formatos de contenido te resultan más cómodos?',
  },
  {
    id: 'b5-q3',
    type: 'select',
    text: '¿Con qué frecuencia podrías crear contenido de forma realista?',
    options: [
      '1–2 veces por semana',
      '3–4 veces por semana',
      'Diario',
      'Solo fines de semana'
    ],
    apiField: '¿Con qué frecuencia podrías crear contenido de forma realista?',
  },
  {
    id: 'b5-q4',
    type: 'multi-select',
    text: '¿Qué tono te gustaría para tu marca?',
    options: [
      'Profesional',
      'Cercano',
      'Inspirador',
      'Directo / sin filtro',
      'Educativo',
      'Divertido'
    ],
    apiField: '¿Qué tono te gustaría para tu marca?',
  },
  {
    id: 'b5-q5',
    type: 'text',
    text: 'Escribe tres marcas / personas que sigues por que te gusta mucho su contenido y qué te gusta de cada una',
    description: '(Ej. Me gusta la cuenta de @lavidadeuncreativo porque comparte tips sobre “x”…., o me gusta la cuenta de “x” por los colores que usa o el estilo que tiene su feed.)',
    apiField: 'Escribe tres marcas / personas que sigues por que te gusta mucho su contenido y qué te gusta de cada una',
  },
  // BLOQUE 6
  {
    id: 'b6-q1',
    type: 'select',
    text: '¿Cómo te gustaría cerrar ventas principalmente?',
    options: [
      'WhatsApp',
      'Llamada / videollamada',
      'Página de venta automática',
      'DM en redes',
      'Aún no lo sé'
    ],
    apiField: '¿Cómo te gustaría cerrar ventas principalmente?',
  },
  {
    id: 'b6-q2',
    type: 'select',
    text: '¿Ya tienes WhatsApp Business o estás dispuesto/a a usarlo?',
    options: [
      'Sí',
      'No pero estoy dispuest@ a usarlo',
      'No'
    ],
    apiField: '¿Ya tienes WhatsApp Business o estás dispuesto/a a usarlo?',
  },
  {
    id: 'b6-q3',
    type: 'select',
    text: '¿Tienes página web actualmente?',
    options: [
      'Sí',
      'No',
      'No pero quiero una'
    ],
    apiField: '¿Tienes página web actualmente?',
  },
  {
    id: 'b6-q4',
    type: 'select',
    text: '¿Qué tan importante es para ti ahorrar tiempo?',
    options: [
      'Muy importante',
      'Importante',
      'Poco importante',
      'No lo sé'
    ],
    apiField: '¿Qué tan importante es para ti ahorrar tiempo?',
  },
  // BLOQUE 7
  {
    id: 'b7-q1',
    type: 'multi-select',
    text: '¿Qué es lo que más te frena hoy para avanzar con tu marca personal?',
    options: [
      'Falta de claridad',
      'Miedo a vender',
      'Falta de tiempo',
      'Falta de confianza',
      'Falta de organización',
      'Otro'
    ],
    apiField: '¿Qué es lo que más te frena hoy para avanzar con tu marca personal?',
  },
  {
    id: 'b7-q2',
    type: 'multi-select',
    text: '¿Qué no te gustaría que fuera tu marca personal?',
    options: [
      'Aburrida',
      'Que se sienta falsa',
      'Que parezca vende humo',
      'Que no transmita confianza',
      'Que se convierta en cuenta de memes',
      'Otra'
    ],
    apiField: '¿Qué no te gustaría que fuera tu marca personal?',
  },
  {
    id: 'b7-q3',
    type: 'select',
    text: '¿Estás dispuesto/a a invertir tiempo y/o dinero en este proceso?',
    options: [
      'Sí',
      'Tal vez',
      'No'
    ],
    apiField: '¿Estás dispuesto/a a invertir tiempo y/o dinero en este proceso?',
  },
  // BLOQUE 8
  {
    id: 'b8-q1',
    type: 'text',
    text: 'Correo electrónico',
    description: '(Escribe el correo que más utilizas (o el que revisas siempre))',
    apiField: 'Correo electrónico',
  },
  {
    id: 'b8-q2',
    type: 'text',
    text: 'WhatsApp',
    description: '(Ej. +52 55 2202 6291)',
    apiField: 'WhatsApp',
  },
];
