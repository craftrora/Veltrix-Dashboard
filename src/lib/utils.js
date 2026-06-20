/**
 * Merge conditional class names, skipping falsy values.
 * Lightweight alternative to clsx + tailwind-merge for projects
 * that haven't installed those packages.
 * @param {...any} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return inputs
    .flat(Infinity)
    .filter(Boolean)
    .join(" ");
}
