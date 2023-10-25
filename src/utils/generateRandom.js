import crypto from "crypto";

// Menghasilkan string acak dengan 4 karakter
function generateRandom(length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
}

export default generateRandom;
