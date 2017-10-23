export function imagePath(path, repo = 'cq-assets', ext = '.png') {
  return `https://raw.githubusercontent.com/Johj/${repo}/master/${path}${ext}`;
}
