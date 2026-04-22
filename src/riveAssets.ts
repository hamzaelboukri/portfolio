/**
 * Expected Rive files (place them in `public/rive/` with these exact names):
 * - reef.riv — helmets
 * - signature.riv — signature
 * - circuits.riv — F1 circuit maps
 * - btn-ui.riv — button arrows
 * - phrases.riv — text animations
 *
 * You must own or have rights to use these files. If a local file is missing,
 * HeroRive falls back to a generic CDN animation until you add the asset.
 */
export const RIVE_DIR = "/rive";

export const RIVE_ASSETS = {
  helmets: `${RIVE_DIR}/reef.riv`,
  /** Expected: artboard `helmet_main`, state machine `helmet_interaction`, inputs per `InteractiveHelmetRive` */
  helmetInteractive: `${RIVE_DIR}/helmet-interactive.riv`,
  signature: `${RIVE_DIR}/signature.riv`,
  circuits: `${RIVE_DIR}/circuits.riv`,
  btnUi: `${RIVE_DIR}/btn-ui.riv`,
  phrases: `${RIVE_DIR}/phrases.riv`,
} as const;

export type RiveAssetKey = keyof typeof RIVE_ASSETS;

/** Known-good sample used when a local `/…riv` is missing or is HTML (Vite SPA) / 404. */
export const RIVE_CDN_FALLBACK = "https://cdn.rive.app/animations/vehicles.riv";

/** Rive binary fingerprint — see https://rive.app/docs/runtimes/advanced-topic/format */
const RIVE_MAGIC = new Uint8Array([0x52, 0x49, 0x56, 0x45]); // "RIVE"

export function isLikelyRivFile(buf: ArrayBuffer): boolean {
  if (buf.byteLength < 4) return false;
  const u8 = new Uint8Array(buf, 0, 4);
  for (let i = 0; i < 4; i++) {
    if (u8[i] !== RIVE_MAGIC[i]) return false;
  }
  return true;
}
