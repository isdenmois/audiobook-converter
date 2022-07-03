export function formatDuration(duration: number): string {
  let k = Math.round(duration)

  const seconds = (k % 60).toString().padStart(2, '0')
  k = Math.floor(k / 60)

  const minutes = (k % 60).toString().padStart(2, '0')
  k = Math.floor(k / 60)

  const hours = (k % 60).toString().padStart(2, '0')

  return `${hours}:${minutes}:${seconds}`
}
