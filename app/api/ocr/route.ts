import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const maxDuration = 30; // Max execution time 30s

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY environment variable is missing.' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { imageBase64, mimeType = 'image/jpeg' } = body;

    if (!imageBase64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Prepare exactly structured response using Gemini JSON schema
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        business_name: { type: Type.STRING },
        contact_person: { type: Type.STRING },
        mobile: { type: Type.STRING },
        alternate_mobile: { type: Type.STRING },
        whatsapp: { type: Type.STRING },
        city: { type: Type.STRING },
        address: { type: Type.STRING },
        email: { type: Type.STRING },
        website: { type: Type.STRING },
        gst_number: { type: Type.STRING },
        confidence_score: { type: Type.STRING, enum: ['high', 'low'] },
      },
      required: ['confidence_score']
    };

    const prompt = `
      You are an expert OCR AI specializing in Indian Business Cards.
      Analyze this business card image. Extract the requested fields.
      
      RULES:
      1. If a field is not present, leave it empty or null.
      2. For 'mobile', prefer mobile numbers over landlines. If multiple mobile numbers exist, prefer ones starting with 6, 7, 8, or 9. Extract as exactly 10 digits without spaces or country codes.
      3. For 'city', intelligently extract just the city name from the address block (e.g., if address says 'Gandhi Nagar, Delhi 110031', city is 'Delhi').
      4. For 'confidence_score', output 'high' if the card is clearly readable, and 'low' if it is blurry, severely damaged, or handwriting is illegible.
      5. The image may be rotated. Auto-correct the orientation mentally before reading.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mimeType,
                data: imageBase64
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.1,
      }
    });

    const textResult = response.text;
    if (!textResult) {
       throw new Error('Empty response from AI');
    }

    // Clean potential markdown formatting
    let cleanedText = textResult.trim();
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
    }
    const data = JSON.parse(cleanedText);

    return NextResponse.json({ data }, { status: 200 });

  } catch (error: any) {
    console.error('OCR Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process image' },
      { status: 500 }
    );
  }
}
