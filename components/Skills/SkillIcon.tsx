"use client";

import {
  BookIcon,
  BoxIcon,
  BranchIcon,
  ChartIcon,
  CheckIcon,
  CloudIcon,
  CodeIcon,
  CubeIcon,
  DatabaseIcon,
  LayersIcon,
  PenIcon,
  PlayIcon,
  ShieldIcon,
  WrenchIcon,
  ZapIcon,
} from "components/Skills/icons";
import { SKILL_TO_ICON } from "data/skillIcons";

const ICON_CLASS = "shrink-0 text-muted";

const ICON_MAP = {
  code: CodeIcon,
  database: DatabaseIcon,
  chart: ChartIcon,
  play: PlayIcon,
  cube: CubeIcon,
  check: CheckIcon,
  cloud: CloudIcon,
  box: BoxIcon,
  branch: BranchIcon,
  zap: ZapIcon,
  book: BookIcon,
  pen: PenIcon,
  wrench: WrenchIcon,
  shield: ShieldIcon,
  layers: LayersIcon,
} as const;

export function SkillIcon({ skill }: { skill: string }) {
  const iconKey = (SKILL_TO_ICON[skill] ?? "code") as keyof typeof ICON_MAP;
  const Icon = ICON_MAP[iconKey] ?? CodeIcon;
  return <Icon className={ICON_CLASS} />;
}
