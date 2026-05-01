"use server";

import OpenAI from "openai";

export async function generateReply(reviewText: string, tone: string) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: "OpenAI API key not configured. Add OPENAI_API_KEY to .env.local",
    };
  }

  if (!reviewText.trim()) {
    return { success: false, error: "Please enter a customer review" };
  }

  const toneInstruction =
    tone === "formal"
      ? "Use a formal, professional tone."
      : "Use a friendly, warm, and conversational tone.";

  const openai = new OpenAI({ apiKey });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that generates professional replies to customer reviews for a business. ${toneInstruction} Keep the reply concise (2-4 sentences). Be empathetic and constructive. Do not use placeholder names or brackets.`,
        },
        {
          role: "user",
          content: `Generate a reply to this customer review:\n\n"${reviewText}"`,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const reply = completion.choices[0]?.message?.content?.trim();

    if (!reply) {
      return { success: false, error: "Failed to generate a reply" };
    }

    return { success: true, reply };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to generate reply";
    return { success: false, error: message };
  }
}
