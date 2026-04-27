import colors from "@/constants/colors";
import type { CustomCategory } from "@/constants/parked";

const BUILTIN_CAT = colors.light.category as Record<string, string>;

const SOFT_PALETTE = [
  "#F1C7D6",
  "#C7DBF1",
  "#D9C7F1",
  "#C7F1D9",
  "#F1ECC7",
  "#F1D6C7",
  "#C7F1EC",
  "#E0E7C0",
  "#F0CFB8",
  "#CDE4D5",
  "#E6D7BC",
  "#D6E0F1",
];

export function categoryColor(
  name: string | undefined,
  customs: CustomCategory[] = [],
): string {
  if (!name) return "#EFEAE0";
  if (BUILTIN_CAT[name]) return BUILTIN_CAT[name];
  const found = customs.find((c) => c.name === name);
  return found?.color ?? "#EAE6DB";
}

export function randomSoftColor(exclude: string[] = []): string {
  const pool = SOFT_PALETTE.filter((c) => !exclude.includes(c));
  const arr = pool.length ? pool : SOFT_PALETTE;
  return arr[Math.floor(Math.random() * arr.length)];
}
