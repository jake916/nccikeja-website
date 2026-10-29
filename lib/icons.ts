/**
 * Icons editors pick by name in Sanity (see studio/schemaTypes/shared/icon-options.ts).
 * Each maps to an SVG exported from the Figma design, with its native size.
 */
export type IconAsset = { src: string; width: number; height: number };

const who = (name: string, width: number, height: number): IconAsset => ({
  src: `/icons/who/${name}.svg`,
  width,
  height,
});

export const valueIcons: Record<string, IconAsset> = {
  faithfulness: who("value-faithfulness", 22, 21),
  excellence: who("value-excellence", 19.25, 17.1),
  spirit: who("value-spirit", 16, 18),
  love: who("value-love", 20, 18.35),
};

export const pillarIcons: Record<string, IconAsset> = {
  book: who("pillar-book", 27.5, 20),
  flame: who("pillar-flame", 20, 25),
  family: who("pillar-family", 26.25, 25.625),
  identity: who("pillar-identity", 15, 22.5),
  healing: who("pillar-healing", 24.9375, 24.9375),
  prayer: who("pillar-prayer", 27.5, 20),
  prosperity: who("pillar-prosperity", 27.5, 20),
  vision: who("pillar-vision", 20, 25),
  wisdom: who("pillar-wisdom", 25, 25),
};

export const programmeIcons: Record<string, IconAsset> = {
  heart: who("programme-heart", 66.6667, 61.1667),
  book: who("programme-book", 73.3333, 53.3333),
  school: who("programme-school", 53.3333, 66.6667),
  trophy: who("programme-trophy", 66.6667, 66.6667),
};
