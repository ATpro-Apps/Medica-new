import { GoogleGenAI, Type, Schema } from "@google/genai";
import type { GenerateQuizResponse, QuizData } from "../types.ts";

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelId = "gemini-3-flash-preview";

const quizSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          question: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          correctAnswer: { type: Type.STRING },
          explanation: { type: Type.STRING },
          difficulty: {
            type: Type.STRING,
            enum: ["High", "Medium"],
          },
        },
        required: ["id", "question", "options", "correctAnswer", "explanation", "difficulty"],
      },
    },
  },
  required: ["questions"],
};

export const generateQuizFromText = async (text: string): Promise<GenerateQuizResponse> => {
  try {
    const systemPrompt = `
      You are "Medica", an advanced IQ and cognitive assessment expert specializing in medical and scientific education.
      
      TASK:
      Exhaustively analyze the provided text and generate the MAXIMUM possible number of high-quality MCQ questions. 
      The goal is total information density: if a fact exists, a question should exist for it.
      
      CRITICAL RULES:
      1. NO SELF-REFERENCES: Do NOT use phrases like "According to the text", "In the article", or "The text states". 
         Ask the questions as if they are general knowledge facts derived from the source.
      2. EXHAUSTIVE COVERAGE: Extract every single unique data point, logical inference, and factual statement. 
      3. QUALITY: Ensure 4 distinct options per question. Only one must be correct.
      4. DIFFICULTY: Categorize as "High" (deep reasoning/inference) or "Medium" (factual understanding).
      5. FORMAT: Return strict JSON.
    `;

    const response = await genAI.models.generateContent({
      model: modelId,
      contents: [
        {
          role: "user",
          parts: [
            { text: systemPrompt },
            { text: `SOURCE CONTENT:\n${text}` }
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        temperature: 0.3,
      },
    });

    const outputText = response.text;
    if (!outputText) {
      throw new Error("No content generated");
    }

    const quizData = JSON.parse(outputText) as QuizData;

    // Post-processing to ensure IDs are unique if the model hallucinates duplicates
    const processedQuestions = quizData.questions.map((q, index) => ({
      ...q,
      id: index + 1,
    }));

    return {
      success: true,
      data: { questions: processedQuestions },
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate assessment.",
    };
  }
};