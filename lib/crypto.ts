export async function generateX25519KeyPair(): Promise<CryptoKeyPair> {
  return await crypto.subtle.generateKey(
    {
      name: "X25519",
      namedCurve: "X25519",
    },
    true,
    ["deriveKey", "deriveBits"]
  );
}

export async function deriveSharedSecret(
  privateKey: CryptoKey,
  publicKey: CryptoKey
): Promise<ArrayBuffer> {
  return await crypto.subtle.deriveBits(
    {
      name: "X25519",
      public: publicKey,
    },
    privateKey,
    256
  );
}

export async function encryptMessage(
  plaintext: string,
  sharedKey: ArrayBuffer,
  nonce: Uint8Array
): Promise<ArrayBuffer> {
  const enc = new TextEncoder();
  const plaintextBuffer = enc.encode(plaintext);

  const key = await crypto.subtle.importKey(
    "raw",
    sharedKey,
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );

  return await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: nonce,
      tagLength: 128,
    },
    key,
    plaintextBuffer
  );
}

export async function decryptMessage(
  ciphertext: ArrayBuffer,
  sharedKey: ArrayBuffer,
  nonce: Uint8Array
): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    sharedKey,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: nonce,
      tagLength: 128,
    },
    key,
    ciphertext
  );

  const dec = new TextDecoder();
  return dec.decode(decrypted);
}
