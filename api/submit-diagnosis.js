
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const {
        fullName,
        email,
        whatsapp,
        socialLink,
        focusType,
        hardSkill,
        personalAvatar,
        personalPain,
        differentiator,
        starProduct,
        businessAvatar,
        marketGap,
        infrastructure,
        objective
    } = req.body;

    // CREDENTIALS CHECK
    const NOTION_API_KEY = process.env.NOTION_API_KEY || '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';
    const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID || '2f9334aa15c1803b96fdf7a5bc4bbf0c';

    if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
        return res.status(500).json({ message: 'Server Configuration Error: Missing Credentials' });
    }

    // Map fields based on Focus Type
    let section3Content = [];

    if (focusType === 'Marca Personal') {
        section3Content = [
            { heading_2: { rich_text: [{ text: { content: 'Marca Personal Details' } }] } },
            { paragraph: { rich_text: [{ text: { content: `Hard Skill: ${hardSkill || '-'}` } }] } },
            { paragraph: { rich_text: [{ text: { content: `Avatar: ${personalAvatar || '-'}` } }] } },
            { paragraph: { rich_text: [{ text: { content: `Pain Point: ${personalPain || '-'}` } }] } },
            { paragraph: { rich_text: [{ text: { content: `Differentiator: ${differentiator || '-'}` } }] } }
        ];
    } else {
        section3Content = [
            { heading_2: { rich_text: [{ text: { content: 'Negocio Establecido Details' } }] } },
            { paragraph: { rich_text: [{ text: { content: `Producto Estrella: ${starProduct || '-'}` } }] } },
            { paragraph: { rich_text: [{ text: { content: `Cliente Ideal: ${businessAvatar || '-'}` } }] } },
            { paragraph: { rich_text: [{ text: { content: `Brecha Mercado: ${marketGap || '-'}` } }] } },
            { paragraph: { rich_text: [{ text: { content: `Infraestructura: ${infrastructure || '-'}` } }] } }
        ];
    }

    try {
        const payload = {
            parent: { database_id: NOTION_DATABASE_ID },
            icon: { emoji: "📝" },
            properties: {
                Name: {
                    title: [{ text: { content: fullName || 'Anonymous' } }]
                },
                Email: {
                    email: email
                },
                Phone: {
                    // Attempting rich_text first as it's safer if unsure, but if it fails we see why
                    // If user set it as 'Phone' type, this will fail.
                    rich_text: [{ text: { content: whatsapp || '' } }]
                },
                Type: {
                    select: { name: focusType }
                },
                Objective: {
                    select: { name: objective || 'Not Specified' }
                },
                Link: {
                    url: socialLink || null
                },
                Status: {
                    status: { name: "New" }
                }
            },
            children: [
                {
                    heading_1: {
                        rich_text: [{ text: { content: 'Diagnóstico Submission' } }]
                    }
                },
                ...section3Content
            ]
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
            // Return the error details to the client for debugging
            return res.status(response.status).json({
                message: 'Notion API Error',
                details: errorData,
                sentPayload: payload // debug info
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
