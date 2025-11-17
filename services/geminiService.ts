import { GoogleGenAI, Type } from "@google/genai";

export interface Reminder {
  whatsapp: string;
  emailSubject: string;
  emailBody: string;
}

export const generateReminder = async (
  childName: string,
  guardianName: string,
  appointmentDate: string
): Promise<Reminder | null> => {
  try {
    if (!process.env.API_KEY) {
      console.warn("API_KEY not found. Using fallback template.");
      return {
        whatsapp: `Olá ${guardianName}! Lembrete da consulta de ${childName} no dia ${appointmentDate}.`,
        emailSubject: `Lembrete de Consulta: ${childName}`,
        emailBody: `Prezado(a) ${guardianName},\n\nEste é um lembrete amigável sobre a consulta de puericultura de ${childName}, agendada para o dia ${appointmentDate}.\n\nAtenciosamente,\nSua Equipe de Saúde.`
      };
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Gere um lembrete de consulta de puericultura para ${guardianName}, responsável por ${childName}. A consulta é em ${appointmentDate}. Crie duas versões: uma para WhatsApp (muito informal, amigável, com emojis) e uma para E-mail (um pouco mais formal, mas ainda calorosa e amigável, com um assunto e corpo da mensagem separados).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            whatsapp: {
              type: Type.STRING,
              description: "Texto para lembrete de WhatsApp.",
            },
            emailSubject: {
                type: Type.STRING,
                description: "Assunto para o lembrete de E-mail.",
            },
            emailBody: {
              type: Type.STRING,
              description: "Corpo do texto para lembrete de E-mail.",
            },
          },
          required: ["whatsapp", "emailSubject", "emailBody"],
        },
      },
    });

    const jsonText = response.text.trim();
    const data = JSON.parse(jsonText);
    return data as Reminder;

  } catch (error) {
    console.error("Error generating reminder with Gemini:", error);
    // Fallback to a template if API fails
    return {
      whatsapp: `Olá ${guardianName}! 😊 Passando para lembrar da consulta de acompanhamento de ${childName} no dia ${appointmentDate}. Estamos te esperando!`,
      emailSubject: `Lembrete da consulta de ${childName}`,
      emailBody: `Prezado(a) ${guardianName},\n\nEste é um lembrete amigável sobre a consulta de puericultura de ${childName}, agendada para o dia ${appointmentDate}.\n\nSua presença é muito importante para acompanharmos o desenvolvimento saudável do(a) seu(sua) filho(a).\n\nAtenciosamente,\nSua Equipe de Saúde.`
    };
  }
};