"use server";

import {
  atomaClient,
  CHAT_MODEL,
  MAX_TOKENS,
  TEMPERATURE,
  prepareConfidentialRequest,
  decryptResponse,
} from "@/lib/atoma";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

export async function sendMessage(messages: Message[]) {
  try {
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
