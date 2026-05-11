// SPDX-License-Identifier: AGPL-3.0-or-later
const TINY_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP4z8AAAAMBAQDJ/pLvAAAAAElFTkSuQmCC";

function createUniqueBuffer() {
  const base = Buffer.from(TINY_PNG_BASE64, "base64");
  const randomByte = Buffer.from([Math.floor(Math.random() * 255)]);
  return Buffer.concat([base, randomByte]);
}

export const tinyPng = (name: string) => ({
  name,
  mimeType: "image/png",
  buffer: createUniqueBuffer(),
});
