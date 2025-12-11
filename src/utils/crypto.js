import CryptoJS from "crypto-js";

// Derive AES key from passphrase using SHA-256
export function deriveKey(passphrase) {
  return CryptoJS.SHA256(passphrase).toString();
}

export function encrypt(text, passphrase) {
  const key = CryptoJS.enc.Hex.parse(deriveKey(passphrase));
  const iv = CryptoJS.lib.WordArray.random(16);

  const encrypted = CryptoJS.AES.encrypt(text, key, { iv });
  const payload = iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);

  return payload;
}

export function decrypt(payload, passphrase) {
  try {
    const key = CryptoJS.enc.Hex.parse(deriveKey(passphrase));
    const payloadWords = CryptoJS.enc.Base64.parse(payload);

    const iv = CryptoJS.lib.WordArray.create(payloadWords.words.slice(0, 4), 16);
    const ciphertext = CryptoJS.lib.WordArray.create(payloadWords.words.slice(4), payloadWords.sigBytes - 16);

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext },
      key,
      { iv }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch {
    return null;
  }
}
