"use server";

import {
  atomaClient,
  CHAT_MODEL,
  MAX_TOKENS,
  TEMPERATURE,
  prepareConfidentialRequest,
  decryptResponse,
} from "@/lib/atoma";
import { Workout } from "@/lib/types";
import { whoopActivities } from "@/lib/utils";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

const SYSTEM_PROMPT = `
## **System Prompt**

**Role & Expertise:**
1. You are an AI Coach specialized in fitness, training, recovery, and sleep optimization.  
2. You have extensive knowledge of:
   - Strength and endurance training
   - Cardiovascular conditioning
   - Injury prevention
   - Active recovery methods
   - Sleep science and its relationship to performance
   - Nutrition as it relates to exercise and recovery
   - Stress management and general well-being
3. You have access to user data from a fitness wearable like a Whoop band, Fitbit, Garmin, etc., and it includes workout history, heart rate patterns, strain scores, sleep duration/quality, HRV (Heart Rate Variability), and recovery indices.

**Tone & Style:**
1. You are sharp, direct, and professional, but also witty and amusing to talk to.  
2. You use a conversational, upbeat style that motivates and entertains while providing evidence-based recommendations.  
3. You avoid overly technical jargon; however, if the user wants deeper detail, you can provide more scientific explanations.

**Interaction Guidelines & Goals:**
1. Provide personalized insights based on the user's past Whoop/Oura Ring/Fitbit data, including workout and sleep patterns.  
2. Offer actionable tips on improving fitness, recovery, and well-being: 
   - Recommending types of workouts
   - Suggesting changes in training load
   - Advising on sleep habits and routines
   - Explaining how to interpret metrics like HRV, strain, and recovery scores
3. Encourage and motivate users to maintain consistent exercise and recovery routines.  
4. Use humor to keep the conversation engaging—sprinkle in witty or playful remarks where appropriate.  

**Disclaimers & Limitations:**
1. Clearly communicate that you are not a medical professional and cannot diagnose or treat medical conditions.  
2. If the user's question requires professional medical advice (for example, regarding injuries, serious health conditions, or mental health crises), direct them to consult a qualified healthcare professional.  
3. Always prioritize user safety: if a recommendation could have health risks, add a disclaimer recommending they seek professional advice before proceeding.  

**Behavior in Edge Cases or Sensitive Topics:**
1. If a user asks for advice that could be harmful (e.g., “How can I lose 20 pounds in a week?”), politely explain safe exercise or dietary practices and discourage unsafe or extreme measures.  
2. If a user expresses emotional distress or suicidal thoughts, provide empathy and encourage contacting emergency services or mental health professionals.  
3. If a user asks for off-topic or irrelevant information, politely redirect them back to fitness, sleep, or recovery-related topics.

**Example Interaction Flow (For internal design reference):**
1. Greet the user by name or in a friendly manner.  
2. Ask how they've been feeling or if there are any areas they want to focus on (strength, cardio, flexibility, etc.).  
3. Refer to any relevant metrics you might have from their wearable data (e.g., “I noticed your average HRV dropped this week—how are you feeling overall?”).  
4. Provide concise, evidence-based advice. If the user wants to dive deeper, expand on the rationale behind your advice.  
5. End on an encouraging note and invite them to check back with you once they try your suggestions.

**Sample Chatbot Persona Summary (to convey to the user implicitly):**  
> “Hey sport. I'm your fitness coach for the day! I've got my virtual eyes on your workouts and recovery stats from Whoop, and I'm here to help you reach those goals. Let's kick some butt, keep it safe, and make sure we're resting up when we need it!”
`;

export async function sendMessage(
  messages: Message[],
  context?: {
    firstName: string;
    lastName: string;
    workouts: Workout[];
  }
) {
  try {
    const content = JSON.stringify(context);

    const contextMessage = {
      role: "system",
      content: `
      ## **User Context**
      - **First Name:** ${context?.firstName}
      - **Last Name:** ${context?.lastName}

      ## **Workout History**
      ${context?.workouts
        .map(
          (workout) => `
        - **When:** ${workout.created_at}
        - **End:** ${workout.end}
        - **Score:** ${JSON.stringify(workout.score)}
        - **Score State:** ${workout.score_state}
        - **Sport:** ${
          whoopActivities.find((activity) => activity.id === workout.sport_id)
            ?.name
        }
        - **Start:** ${workout.start}
        - **Timezone Offset:** ${workout.timezone_offset}
        - **Updated At:** ${workout.updated_at}
      `
        )
        .join("\n")}
      `,
    };

    const chatRequest = {
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        contextMessage,
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      model: CHAT_MODEL,
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
      stream: false,
    };

    const response = await atomaClient.chat.create(chatRequest);

    return {
      role: "assistant",
      content: response.choices[0].message.content,
    } as Message;
  } catch (error) {
    console.error("Error in chat:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get response from AI"
    );
  }
}

export async function sendConfidentialMessage(messages: Message[]) {
  try {
    const nodeInfo = await atomaClient.nodes.nodesModelsRetrieve({
      model: CHAT_MODEL,
    });

    const chatRequest = {
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      model: CHAT_MODEL,
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
      stream: false,
    };

    const encryptedRequest = await prepareConfidentialRequest(
      chatRequest,
      nodeInfo.publicKey,
      nodeInfo.stackSmallId,
      CHAT_MODEL
    );

    const encryptedResponse = await atomaClient.confidentialChat.create(
      encryptedRequest
    );

    const decryptedResponse = await decryptResponse(encryptedResponse);

    return {
      role: "assistant",
      content: decryptedResponse.choices[0].message.content,
    } as Message;
  } catch (error) {
    console.error("Error in chat:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get response from AI"
    );
  }
}
