
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { type, ...data } = req.body;
    const NOTION_API_KEY = process.env.NOTION_API_KEY || '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';

    // DATABASES MAPPING
    const DATABASES = {
        'lead-magnet': process.env.NOTION_DB_LEAD || '2f9334aa15c1803b96fdf7a5bc4bbf0c', // Fallback to Diagnosis DB or a new one if user provides
        'onboarding-personal': '2fc334aa15c18072af0bc786b5433e95',
        'onboarding-business': '2fc334aa15c180f594c6c70132d4ee10',
        'onboarding-event': '2fc334aa15c18072ad29f3fa5da15a92',
        'onboarding-web': '2fc334aa15c180459d74ef5957a4a8d7'
    };

    const dbId = DATABASES[type];

    if (!dbId) {
        return res.status(400).json({ message: 'Invalid form type' });
    }

    // MAP PAYLOAD BASED ON TYPE
    // Note: We are inferring property names based on the form labels.
    // If Notion throws validation errors, we will need to correct them.
    // We treat most fields as Rich Text to stay safe, unless we know it's a specific type.

    let properties = {};

    const createRichText = (content) => [{ text: { content: String(content || '') } }];
    const createTitle = (content) => [{ text: { content: String(content || 'Sin nombre') } }];
    const createEmail = (email) => email; // Notion checks validity
    const createPhone = (phone) => phone; // Notion expects string for phone_number sometimes or check type

    // HELPER: Dynamic Property Mapper
    // We will just map ALL incoming data keys to Title Case Text properties to attempt generous matching
    // EXCEPT for the known basics.

    // Common fields
    if (data.nombre || data.nombre_respondente || data.nombre_contacto || data.fullName) {
        properties["Nombre"] = { title: createTitle(data.nombre || data.nombre_respondente || data.nombre_contacto || data.fullName) };
    }
    if (data.email) {
        properties["Email"] = { email: data.email };
    }
    if (data.whatsapp) {
        // Notion Phone Number expects valid phone string
        properties["WhatsApp"] = { phone_number: data.whatsapp };
    }

    // For all other keys, we try to create a Rich Text property with the capitalized key name
    // This assumes the Notion DB has columns named exactly like our keys but Title Cased or similar.
    // Since we don't have the EXACT schema for the new DBs, this is a "Best Effort" strategy.
    // If it fails, we will catch the error and ask user for schema.

    // Specific Mapping Strategy
    // We will dump the form answers into a "Resumen" or map individually if we guess the column name.
    // Given the previous task, the user likely uses Spanish labels as column names. 
    // Example: "Ciudad y país" -> "Ciudad y país" (Text)

    // We will try to map explicit keys that we defined in HTML name attributes to likely Notion column names.

    const keyMap = {
        // General / Common
        'ciudad_pais': 'Ciudad y País',
        'ubicacion': 'Ubicación',

        // Lead Magnet
        'helpType': 'Tipo de Ayuda',
        'notes': 'Notas',

        // Marca Personal
        'red_principal': 'Red Principal',
        'otras_redes': 'Otras Redes',
        'dedicacion': 'Dedicación',
        'estado_actual': 'Estado Actual',
        'no_funciona': 'Problema Actual',
        'intentos_previos': 'Intentos Previos',
        'por_que_ahora': 'Por Qué Ahora',
        'vision_3_meses': 'Visión 3 Meses',
        'objetivo_principal': 'Objetivo Principal',
        'exito_metricas': 'Éxito',
        'target_persona': 'Cliente Ideal',
        'problema_target': 'Problema Cliente',
        'sentir_target': 'Sentir Cliente',
        'resultado_deseado': 'Resultado Deseado',
        'objeciones': 'Objeciones',
        'oferta_actual': 'Oferta Actual',
        'precio_oferta': 'Precio Oferta',
        'canal_llegada': 'Canal Llegada',
        'proceso_venta': 'Proceso Venta',
        'cuello_botella': 'Cuello de Botella',
        'diferenciador': 'Diferenciador',
        'fortalezas': 'Fortalezas',
        'temas_pasion': 'Temas Pasión',
        'postura_unica': 'Postura Única',
        'historia': 'Historia',
        'tipo_contenido': 'Tipo Contenido',
        'contenido_no_deseado': 'Contenido No Deseado',
        'tiempo_contenido': 'Tiempo Contenido',
        'freno_constancia': 'Freno Constancia',
        'palabras_clave': 'Palabras Clave',
        'frases_propias': 'Frases Propias',
        'anti_tono': 'Anti Tono',
        'estilo_visual': 'Estilo Visual',
        'colores_gusto': 'Colores Gusto',
        'colores_no': 'Colores No',
        'tipografia': 'Tipografía',
        'apoyo_visual': 'Apoyo Visual',
        'referencias_visuales': 'Referencias Visuales',
        'referencias_positivas': 'Referencias +',
        'referencias_negativas': 'Referencias -',
        'competencia_similares': 'Similares',
        'diferencia_competencia': 'Diferencia',
        'experiencia_contacto': 'Experiencia Contacto',
        'feeling_cliente': 'Feeling Cliente',
        'anti_experiencia': 'Anti Experiencia',
        'miedos': 'Miedos',
        'motivacion': 'Motivación',
        'comentarios_extra': 'Comentarios Extra',

        // Negocio
        'nombre_negocio': 'Nombre Negocio',
        'website': 'Website',
        'redes_sociales': 'Redes Sociales',
        'descripcion_negocio': 'Descripción Negocio',
        'antiguedad': 'Antigüedad',
        'tipo_producto': 'Tipo Producto',
        'ticket_promedio': 'Ticket Promedio',
        'volumen_ventas': 'Volumen Ventas',
        'objetivo_90_dias': 'Objetivo 90 Días',
        'metricas_exito': 'Métricas Éxito',
        'meta_concreta': 'Meta Concreta',
        'cliente_ideal': 'Cliente Ideal',
        'problema_cliente': 'Problema Cliente',
        'razon_eleccion': 'Razón Elección',
        'fuentes_trafico': 'Fuentes Tráfico',
        'volumen_leads': 'Volumen Leads',
        'proceso_leads': 'Proceso Leads',
        'tiempo_respuesta': 'Tiempo Respuesta',
        'metodo_venta': 'Método Venta',
        'responsable_ventas': 'Responsable Ventas',
        'capacidad_atencion': 'Capacidad Atención',
        'fuga_dinero': 'Fuga Dinero',
        'tamano_equipo': 'Tamaño Equipo',
        'herramientas': 'Herramientas',
        'documentacion_procesos': 'Documentación Procesos',
        'area_fragil': 'Área Frágil',
        'personalidad_marca': 'Personalidad Marca',
        'feeling_marca': 'Feeling Marca',
        'anti_feeling': 'Anti Feeling',
        'flujo_ideal': 'Flujo Ideal',
        'deseo_sistema': 'Deseo Sistema',
        'automatizacion_deseada': 'Automatización',
        'frenos_actuales': 'Frenos Actuales',
        'impacto_inaccion': 'Impacto Inacción',
        'urgencia': 'Urgencia',
        'disposicion_inversion': 'Disposición Inversión',
        'presupuesto': 'Presupuesto',
        'expectativas': 'Expectativas',

        // Evento
        'tipo_evento': 'Tipo Evento',
        'protagonistas': 'Protagonistas',
        'fecha_evento': 'Fecha Evento',
        'descripcion_evento': 'Descripción Evento',
        'feeling_invitacion': 'Feeling Invitación',
        'concepto_tema': 'Concepto Tema',
        'secciones_invitacion': 'Secciones',
        'cantidad_invitados': 'Cantidad Invitados',
        'control_rsvp': 'Control RSVP',
        'tipos_invitados': 'Tipos Invitados',
        'tipo_regalos': 'Tipo Regalos',
        'detalles_regalos': 'Detalles Regalos',
        'uso_fotos': 'Uso Fotos',
        'experiencia_apertura': 'Experiencia Apertura',
        'mensaje_especial': 'Mensaje Especial',
        'anti_contenido': 'Anti Contenido',
        'tiempo_entrega': 'Tiempo Entrega',
        'metodo_envio': 'Método Envío',
        'prioridad_proyecto': 'Prioridad Proyecto',
        'preocupaciones': 'Preocupaciones',

        // Web
        'nombre_proyecto': 'Nombre Proyecto',
        'tipo_proyecto': 'Tipo Proyecto',
        'tiene_web': 'Tiene Web',
        'url_actual': 'URL Actual',
        'tipo_oferta': 'Tipo Oferta',
        'descripcion_oferta': 'Descripción Oferta',
        'mensaje_clave': 'Mensaje Clave',
        'call_to_action': 'Call To Action',
        'secciones_web': 'Secciones Web',
        'estado_textos': 'Estado Textos',
        'recursos_visuales': 'Recursos Visuales',
        'estilo_web': 'Estilo Web',
        'funcionalidad_deseada': 'Funcionalidad',
        'funcionalidad_especial': 'Especial',
        'canal_contacto': 'Canal Contacto',
        'fecha_limite': 'Fecha Límite',
        'anti_resultado': 'Anti Resultado',
    };

    // Apply mappings
    Object.keys(data).forEach(key => {
        if (['nombre', 'nombre_respondente', 'nombre_contacto', 'fullName', 'email', 'whatsapp', 'type'].includes(key)) return; // Already handled

        const notionColumnName = keyMap[key] || key; // Default to key if no map found

        // We assume Rich Text for generic fields
        properties[notionColumnName] = { rich_text: createRichText(data[key]) };
    });

    try {
        const response = await fetch('https://api.notion.com/v1/pages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28'
            },
            body: JSON.stringify({
                parent: { database_id: dbId },
                properties: properties
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Notion API Error:', JSON.stringify(errorData, null, 2));
            return res.status(response.status).json({
                message: 'Notion API Error',
                details: errorData,
                payloadSent: properties // Return this to help debug mapping
            });
        }

        return res.status(200).json({ message: 'Success' });
    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
