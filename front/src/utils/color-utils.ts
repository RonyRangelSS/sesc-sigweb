export function getColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash * 137.508) % 360;

  const saturation = 65 + (Math.abs(hash) % 15);

  const lightness = 80 + (Math.abs(hash) % 5);

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
