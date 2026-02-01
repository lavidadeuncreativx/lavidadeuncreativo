
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const body = req.body;

    // CREDENTIALS CHECK
    const NOTION_API_KEY = process.env.NOTION_API_KEY || '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';
    const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID || '2f9334aa15c1803b96fdf7a5bc4bbf0c';

    if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
        return res.status(500).json({ message: 'Server Configuration Error: Missing Credentials' });
    }

    // Input Validation
    if (!body.focusType || !body.email || !body.fullName) {
        return res.status(400).json({
            message: 'Faltan campos obligatorios',
            details: 'Asegúrate de seleccionar una opción (Marca Personal o Negocio) y llenar tus datos.'
        });
    }

    // Prepare Data Object for User's Mapping
    const data = {
        nombre: body.fullName,
        email: body.email,
        whatsapp: body.whatsapp,
        url: body.socialLink,
        // Normalize "Negocio Establecido" to "Negocio" for consistency with user's logic
        tipo: body.focusType === 'Negocio Establecido' ? 'Negocio' : body.focusType,
        objetivo: body.objective,
        // Personal
        habilidad: body.hardSkill,
        avatar: body.personalAvatar,
        dolor: body.personalPain,
        diferenciador: body.differentiator,
        // Negocio
        producto: body.starProduct,
        cliente: body.businessAvatar,
        problema_negocio: body.marketGap,
        infraestructura: body.infrastructure
    };

    try {
        // --- USER PROVIDED MAPPING ---
        const payload = {
            parent: { database_id: NOTION_DATABASE_ID },
            properties: {
                // --- 1. DATOS GENERALES ---
                "Nombre": {
                    title: [{ text: { content: data.nombre || 'Anonymous' } }]
                },
                "Email": {
                    email: data.email
                },
                "WhatsApp": {
                    phone_number: data.whatsapp || null
                },
                "Red_Social": {
                    rich_text: [{ text: { content: data.url || '' } }]
                },
                "Tipo_Perfil": {
                    select: { name: data.tipo } // "Marca Personal" or "Negocio"
                },
                "Objetivo": {
                    select: { name: data.objetivo || 'Sin especificar' }
                },

                // --- 2. RAMA MARCA PERSONAL (Condicional) ---
                "MP_Habilidad": {
                    rich_text: [{ text: { content: data.tipo === "Marca Personal" ? (data.habilidad || "") : "" } }]
                },
                "MP_Avatar": {
                    rich_text: [{ text: { content: data.tipo === "Marca Personal" ? (data.avatar || "") : "" } }]
                },
                "MP_Dolor": {
                    rich_text: [{ text: { content: data.tipo === "Marca Personal" ? (data.dolor || "") : "" } }]
                },
                "MP_Diferenciador": {
                    rich_text: [{ text: { content: data.tipo === "Marca Personal" ? (data.diferenciador || "") : "" } }]
                },

                // --- 3. RAMA NEGOCIO (Condicional) ---
                "NEG_Producto": {
                    rich_text: [{ text: { content: data.tipo === "Negocio" ? (data.producto || "") : "" } }]
                },
                "NEG_Cliente": {
                    rich_text: [{ text: { content: data.tipo === "Negocio" ? (data.cliente || "") : "" } }]
                },
                "NEG_Problema": {
                    rich_text: [{ text: { content: data.tipo === "Negocio" ? (data.problema_negocio || "") : "" } }]
                },
                "NEG_Infraestructura": {
                    rich_text: [{ text: { content: data.tipo === "Negocio" ? (data.infraestructura || "") : "" } }]
                }
            }
        };

        const response = await fetch('https://api.notion.com/v1/pages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Notion API Error:', errorData);
            return res.status(response.status).json({
                message: 'Notion API Error',
                details: errorData,
                sentPayload: payload
            });
        }

        return res.status(200).json({ message: 'Success' });
    } catch (error) {
        console.error('Submission Handler Error:', error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}
