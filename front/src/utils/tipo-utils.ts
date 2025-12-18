export function getColorFromTipo(tipo: string): string {
  let hash = 0;
  for (let i = 0; i < tipo.length; i++) {
    hash = tipo.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Constrain hue to pleasant pastel range (0-360, but we can filter out certain ranges)
  const hue = Math.abs(hash) % 360;

  // Pastel colors: lower saturation (30-40%) and higher lightness (80-90%)
  const saturation = 35 + (Math.abs(hash) % 10); // 35-45%
  const lightness = 80 + (Math.abs(hash) % 10); // 80-90%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
