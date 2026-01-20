export default function randomName(len: number = 5) {
  return (
    Math.random()
      .toString(36)
      .substring(2, len + 2) + Date.now()
  );
}
