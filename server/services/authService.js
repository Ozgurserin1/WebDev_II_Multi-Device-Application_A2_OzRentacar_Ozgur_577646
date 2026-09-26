import crypto from "crypto";
import fs from "fs";
import { readJsonFile } from "./dataService.js";

export function normaliseEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normaliseEmail(email));
}

export function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedPassword) {
  const [salt, storedHash] = String(storedPassword || "").split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const candidateHash = crypto.scryptSync(password, salt, 64);
  const storedBuffer = Buffer.from(storedHash, "hex");

  return storedBuffer.length === candidateHash.length && crypto.timingSafeEqual(storedBuffer, candidateHash);
}

export function createUser(usersFile, { name, email, password }) {
  const users = readJsonFile(usersFile);
  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normaliseEmail(email),
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString()
  };

  users.push(user);
  fs.writeFileSync(usersFile, `${JSON.stringify(users, null, 2)}\n`, "utf8");
  return user;
}

export function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}
