
import { GoogleGenAI, Type } from "@google/genai";
import { Proficiency, DialogueResponse } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const dialogueSchema = {
    type: Type.OBJECT,
    properties: {
      dialogue: {
        type: Type.ARRAY,
        description: "A list of dialogue lines.",
        items: {
          type: Type.OBJECT,
          properties: {
            speaker: {
              type: Type.STRING,
              description: "The name of the speaker (e.g., 'Barista', 'Customer')."
            },
            line: {
              type: Type.STRING,
              description: "The text spoken by the speaker."
            },
          },
          required: ['speaker', 'line'],
        },
      },
    },
    required: ['dialogue'],
};

export const generateDialogue = async (
    imageBase64: string,
    mimeType: string,
    nativeLanguage: string,
    targetLanguage: string,
    age: number,
    proficiency: Proficiency
): Promise<DialogueResponse | null> => {
    
    const prompt = `You are an expert language learning assistant. Your task is to generate a short, conversational dialogue based on the provided image.

    The user's profile is:
    - Native Language: ${nativeLanguage}
    - Learning: ${targetLanguage}
    - Age Group: ${age} years old
    - Proficiency Level: ${proficiency}

    Based on the image, create a dialogue that is appropriate for this learner. The dialogue should be simple, natural, and relevant to the scene in the image. It should have two distinct speakers.

    For a '${Proficiency.Beginner}' level, use very simple vocabulary and short sentence structures.
    For an '${Proficiency.Intermediate}' level, use slightly more complex sentences and common expressions.
    For an '${Proficiency.Advanced}' level, use more natural, idiomatic language and nuanced vocabulary.

    Generate the dialogue in ${targetLanguage}.
    
    Respond ONLY with a JSON object that matches the provided schema.`;

    try {
        const imagePart = {
            inlineData: {
                data: imageBase64,
                mimeType: mimeType,
            },
        };

        const textPart = {
            text: prompt,
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: dialogueSchema,
            }
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);

        // Basic validation
        if (parsedJson && Array.isArray(parsedJson.dialogue)) {
            return parsedJson as DialogueResponse;
        }

        return null;

    } catch (error) {
        console.error("Error generating dialogue:", error);
        throw new Error("Failed to communicate with the AI model. Please check your API key and try again.");
    }
};
