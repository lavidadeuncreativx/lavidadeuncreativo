import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';
import { questions } from '../../data/questions';

const NOTION_KEY = process.env.NOTION_KEY;
const NOTION_DB_ID = '2ff334aa15c1803b91d8cfbfa0e13f57';

const notion = new Client({ auth: NOTION_KEY });

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const properties: Record<string, any> = {};

        for (const [key, value] of Object.entries(body)) {
            // Find the question definition to know the Notion Type
            const question = questions.find(q => q.apiField === key);

            if (!question) continue;

            // Special handling for Name/Title
            if (key === 'Nombre completo') {
                properties[key] = {
                    title: [
                        {
                            text: {
                                content: value as string,
                            },
                        },
                    ],
                };
                continue;
            }

            // Specific Field Overrides based on error feedback
            if (key === 'Correo electrónico') {
                properties[key] = {
                    email: value as string,
                };
                continue;
            }

            if (key === 'WhatsApp') {
                properties[key] = {
                    phone_number: value as string,
                };
                continue;
            }

            if (key === '¿A qué te dedicas hoy principalmente?') {
                // Notion expects multi_select for this field, even if our form is single select
                properties[key] = {
                    multi_select: [{ name: value as string }],
                };
                continue;
            }

            switch (question.type) {
                case 'text':
                    properties[key] = {
                        rich_text: [
                            {
                                text: {
                                    content: value as string,
                                },
                            },
                        ],
                    };
                    break;

                case 'select':
                    properties[key] = {
                        select: {
                            name: value as string,
                        },
                    };
                    break;

                case 'multi-select':
                    properties[key] = {
                        multi_select: (value as string[]).map((v) => ({ name: v })),
                    };
                    break;
            }
        }

        await notion.pages.create({
            parent: { database_id: NOTION_DB_ID },
            properties: properties,
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Notion API Error:', error.body || error);
        return NextResponse.json({ error: 'Failed to submit to Notion', details: error.message }, { status: 500 });
    }
}
