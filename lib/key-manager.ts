import { getSession } from "./session";

export interface KeySet {
  privateKey: CryptoKey;
  publicKey: CryptoKey;
  nodePublicKey: CryptoKey;
}

async function exportKeyToString(key: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey("raw", key);
  return Buffer.from(exported).toString("base64");
}

async function importKeyFromString(
  keyStr: string,
  isPrivate: boolean = false
): Promise<CryptoKey> {
  const keyData = Buffer.from(keyStr, "base64");
  return await crypto.subtle.importKey(
    "raw",
    keyData,
    {
      name: "X25519",
      namedCurve: "X25519",
    },
    true,
    isPrivate ? ["deriveKey", "deriveBits"] : []
  );
}

export async function storeKeys(keySet: KeySet): Promise<void> {
  const session = await getSession();

  const [privateKeyStr, publicKeyStr, nodePublicKeyStr] = await Promise.all([
    exportKeyToString(keySet.privateKey),
    exportKeyToString(keySet.publicKey),
    exportKeyToString(keySet.nodePublicKey),
  ]);

  session.clientPrivateKey = privateKeyStr;
  session.clientPublicKey = publicKeyStr;
  session.nodePublicKey = nodePublicKeyStr;

  await session.save();
}

export async function retrieveKeys(): Promise<KeySet | null> {
  const session = await getSession();

  if (
    !session.clientPrivateKey ||
    !session.clientPublicKey ||
    !session.nodePublicKey
  ) {
    return null;
  }

  try {
    const [privateKey, publicKey, nodePublicKey] = await Promise.all([
      importKeyFromString(session.clientPrivateKey, true),
      importKeyFromString(session.clientPublicKey),
      importKeyFromString(session.nodePublicKey),
    ]);

    return { privateKey, publicKey, nodePublicKey };
  } catch (error) {
    console.error("Error retrieving keys:", error);
    return null;
  }
}

export async function clearKeys(): Promise<void> {
  const session = await getSession();
  session.clientPrivateKey = undefined;
  session.clientPublicKey = undefined;
  session.nodePublicKey = undefined;
  await session.save();
}
