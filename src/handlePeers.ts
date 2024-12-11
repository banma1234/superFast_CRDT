import { Indexable } from "yorkie-js-sdk";

const randomPeers = [
  "Alice",
  "Bob",
  "Carol",
  "Chuck",
  "Dave",
  "Erin",
  "Frank",
  "Grace",
  "Ivan",
  "Justin",
  "Matilda",
  "Oscar",
  "Steve",
  "Victor",
  "Zoe",
];

/**
 * 접속중인 유저들 출력
 */
export function displayPeers(
  peers: Array<{ clientID: string; presence: Indexable }>,
) {
  const users = [];
  for (const { presence } of peers) {
    users.push(presence.userName);
  }

  return users;
}

/**
 * 랜덤하게 유저명 생성
 */
export function createRandomPeers() {
  const index = Math.floor(Math.random() * randomPeers.length);

  return randomPeers[index];
}
