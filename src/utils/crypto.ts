import CryptoJS from "crypto-js";

// AES
export const encryptAES = (text: string, key: string) => {
  return CryptoJS.AES.encrypt(text, key).toString();
};

export const decryptAES = (cipher: string, key: string) => {
  const bytes = CryptoJS.AES.decrypt(cipher, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// DES
export const encryptDES = (text: string, key: string) => {
  return CryptoJS.DES.encrypt(text, key).toString();
};

export const decryptDES = (cipher: string, key: string) => {
  const bytes = CryptoJS.DES.decrypt(cipher, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// 3DES
export const encrypt3DES = (text: string, key: string) => {
  return CryptoJS.TripleDES.encrypt(text, key).toString();
};

export const decrypt3DES = (cipher: string, key: string) => {
  const bytes = CryptoJS.TripleDES.decrypt(cipher, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Generate key
export const generateKey = (length = 16) => {
  return CryptoJS.lib.WordArray.random(length).toString();
};