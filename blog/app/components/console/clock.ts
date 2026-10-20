/**
 * Clock-driven orbit model, matching the motion on imsaud.me.
 * Seven particles, six degrees of separation per elapsed second, transformed
 * by Rz(-πs) · Rx(πs/2 + minute tilt) · Rz(hour angle).
 * These are clock angles, not accumulated animation-frame deltas.
 * Reference: https://www.imsaud.me/ (PS2 clock-system animation).
 */
export interface ClockOrb {
  x: number;
  y: number;
  z: number;
}

export function getClockOrbs(date: Date): ClockOrb[] {
  const seconds = date.getSeconds() + date.getMilliseconds() / 1000;
  const minute = date.getMinutes();
  const hours = (date.getHours() + minute / 60 + seconds / 3600) % 12;
  const hourAngle = Math.PI / 2 - (hours * Math.PI) / 6;
  const minuteTilts = [Math.PI / 2, (7 * Math.PI) / 6, 0];
  const minuteTilt =
    minuteTilts[minute % 3] +
    (seconds / 60) * (minuteTilts[(minute + 1) % 3] - minuteTilts[minute % 3]);
  const pitch = (seconds * Math.PI) / 2 + minuteTilt;
  const spin = -seconds * Math.PI;
  const cosHour = Math.cos(hourAngle);
  const sinHour = Math.sin(hourAngle);
  const cosPitch = Math.cos(pitch);
  const sinPitch = Math.sin(pitch);
  const cosSpin = Math.cos(spin);
  const sinSpin = Math.sin(spin);

  return Array.from({ length: 7 }, (_, index) => {
    const angle = (index * seconds * Math.PI) / 30;
    const x = Math.cos(angle);
    const y = Math.sin(angle);
    const z = index / 450; // The reference uses a 0.2px depth step on a 90px radius.
    const hourX = cosHour * x - sinHour * y;
    const hourY = sinHour * x + cosHour * y;
    const tiltedY = cosPitch * hourY - sinPitch * z;
    return {
      x: cosSpin * hourX - sinSpin * tiltedY,
      y: sinSpin * hourX + cosSpin * tiltedY,
      z: sinPitch * hourY + cosPitch * z,
    };
  });
}
