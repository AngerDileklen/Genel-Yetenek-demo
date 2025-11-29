import { GoogleGenAI } from "@google/genai";
import { Puzzle, PuzzleType, TriangleData } from "../types";

// NOTE: In a real production app, you might proxy this through a backend.
// For this demo, we assume process.env.API_KEY is available or injected.
const API_KEY = process.env.API_KEY || ''; 

export const explainPuzzleWithAI = async (puzzle: Puzzle): Promise<string> => {
  if (!API_KEY) {
    return "API Key missing. Please configure your environment.";
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  let prompt = "";
  
  if (puzzle.type === PuzzleType.TRIANGLE_MATH) {
    const data = puzzle.data as TriangleData;
    prompt = `
      I am taking a Turkish Logic Exam (ALES/General Aptitude).
      Here is a Triangle Math puzzle:
      Triangle corners are: Top=${data.top}, Left=${data.left}, Right=${data.right}.
      The hidden logic results in the center number.
      The correct answer for the center is derived by this rule: ${puzzle.explanation}.
      
      Please act as a friendly tutor. Explain step-by-step how to reach the result using the numbers provided.
      Keep it concise (under 3 sentences) and encouraging.
    `;
  } else {
    prompt = `
      I am taking a Logic Exam.
      Explain the pattern: ${puzzle.explanation}.
      Keep it concise.
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate explanation.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Sorry, I couldn't connect to the AI tutor right now.";
  }
};