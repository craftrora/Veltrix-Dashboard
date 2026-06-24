/**
 * Smooth a polyline through control points using a Catmull-Rom spline.
 * Turns hard, straight segments into natural curving roads/routes.
 *
 * @param {Array<[number, number]>} points control points [[lat, lng], ...]
 * @param {number} segments interpolation steps per span (higher = smoother)
 * @returns {Array<[number, number]>} densified, smoothed points
 */
export function catmullRom(points, segments = 18) {
  if (!points || points.length < 3) return points || [];
  const out = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];
    for (let t = 0; t < segments; t++) {
      const s = t / segments;
      const s2 = s * s;
      const s3 = s2 * s;
      const lat =
        0.5 *
        (2 * p1[0] +
          (-p0[0] + p2[0]) * s +
          (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * s2 +
          (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * s3);
      const lng =
        0.5 *
        (2 * p1[1] +
          (-p0[1] + p2[1]) * s +
          (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * s2 +
          (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * s3);
      out.push([lat, lng]);
    }
  }
  out.push(points[points.length - 1]);
  return out;
}
