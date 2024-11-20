export default function useColorModeImages(): (path: string, ext?: string) => string {
  return (path, ext = '.png') => `${path}_${useColorMode().value}${ext}`;
}
