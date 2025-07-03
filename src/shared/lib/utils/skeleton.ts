export function getSkeletonCount() {
  const width = window.innerWidth;
  if (width < 768) return 3;
  if (width < 1024) return 4;
  if (width < 1280) return 6;
  return 8;
}
