import { AtomaSDK } from "atoma-sdk";
import {
  decryptMessage,
  deriveSharedSecret,
  encryptMessage,
  generateX25519KeyPair,
} from "@/lib/crypto";
import { clearKeys, retrieveKeys, storeKeys } from "@/lib/key-manager";

export const atomaClient = new AtomaSDK({
  bearerAuth: process.env.ATOMA_API_KEY,
});

export const CHAT_MODEL = "meta-llama/Llama-3.3-70B-Instruct";
export const MAX_TOKENS = 1000;
export const TEMPERATURE = 0.7;

export async function prepareConfidentialRequest(
  request: any,
  publicKey: number[],
  stackSmallId: number,
  modelName: string
) {
  try {
    const clientKeyPair = await generateX25519KeyPair();
    const nodePublicKey = Uint8Array.from(publicKey);

    const nonce = crypto.getRandomValues(new Uint8Array(12));
    const salt = crypto.getRandomValues(new Uint8Array(32));

    const importedNodePublicKey = await crypto.subtle.importKey(
      "raw",
      nodePublicKey,
      {
        name: "X25519",
        namedCurve: "X25519",
      },
      true,
      []
    );

    await storeKeys({
      privateKey: clientKeyPair.privateKey,
      publicKey: clientKeyPair.publicKey,
      nodePublicKey: importedNodePublicKey,
    });

    const sharedSecret = await deriveSharedSecret(
      clientKeyPair.privateKey,
      importedNodePublicKey
    );

    const requestStr = JSON.stringify(request);
    const ciphertext = await encryptMessage(requestStr, sharedSecret, nonce);

    const clientPublicKeyRaw = await crypto.subtle.exportKey(
      "raw",
      clientKeyPair.publicKey
    );

    const plaintextHash = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(requestStr)
    );

    return {
      ciphertext: Buffer.from(ciphertext).toString("base64"),
      clientDhPublicKey: Buffer.from(clientPublicKeyRaw).toString("base64"),
      modelName,
      nodeDhPublicKey: Buffer.from(nodePublicKey).toString("base64"),
      nonce: Buffer.from(nonce).toString("base64"),
      plaintextBodyHash: Buffer.from(plaintextHash).toString("base64"),
      salt: Buffer.from(salt).toString("base64"),
      stackSmallId,
    };
  } catch (error) {
    throw new Error(`Failed to prepare encrypted request: ${error}`);
  }
}

export async function decryptResponse(encryptedResponse: any) {
  try {
    const keys = await retrieveKeys();
    if (!keys) {
      throw new Error("No encryption keys found in session");
    }

    const sharedSecret = await deriveSharedSecret(
      keys.privateKey,
      keys.nodePublicKey
    );

    const ciphertext = Uint8Array.from(
      Buffer.from(encryptedResponse.ciphertext, "base64")
    ).buffer;
    const nonce = Uint8Array.from(
      Buffer.from(encryptedResponse.nonce, "base64")
    );

    const decrypted = await decryptMessage(ciphertext, sharedSecret, nonce);

    await clearKeys();

    return JSON.parse(decrypted);
  } catch (error) {
    throw new Error(`Failed to decrypt response: ${error}`);
  }
}
