/**
 * Converts milliseconds to minutes + seconds
 * @param ms milliseconds
 * @returns a string in the format of 'mm:ss'
 */
export function msToMinsAndSecs(ms: number) {
  var minutes = Math.floor(ms / 60000)
  var seconds = parseInt(((ms % 60000) / 1000).toFixed(0), 10)
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}
