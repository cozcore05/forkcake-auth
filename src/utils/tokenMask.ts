// Shared Secret - Must be identical in both apps!
const SALT = "ForkCake_Secure_Salt_2025_#9X";

export function maskToken(token: string): string {
  try {
    // 1. Append Salt
    const salted = token + SALT;
    // 2. Encode to Base64 (Browser native)
    return btoa(salted);
  } catch (e) {
    console.error("Token masking failed", e);
    return token; // Fallback to raw token if masking fails
  }
}

export function unmaskToken(maskedToken: string): string {
  try {
    // 1. Decode from Base64
    const decoded = atob(maskedToken);
    // 2. Remove Salt (We use slice to be safer than replace)
    if (decoded.endsWith(SALT)) {
      return decoded.slice(0, -SALT.length);
    }
    return decoded;
  } catch (e) {
    console.error("Token unmasking failed", e);
    return maskedToken; // Fallback
  }
}
