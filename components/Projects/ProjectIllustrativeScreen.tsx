"use client";

import { PROJECT_ILLUSTRATION_COPY } from "data/projectIllustrations";

type ProjectIllustrativeScreenProps = {
  titleId: string;
  descId: string;
  variant: "emplifi" | "controltech";
};

const EmplifiIllustration = ({
  titleId,
  descId,
  bgGradientId,
}: Omit<ProjectIllustrativeScreenProps, "variant"> & { bgGradientId: string }) => {
  return (
    <svg
      viewBox="0 0 1600 1035"
      role="img"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="h-full w-full"
    >
      <title id={titleId}>{PROJECT_ILLUSTRATION_COPY.emplifi.title}</title>
      <desc id={descId}>{PROJECT_ILLUSTRATION_COPY.emplifi.description}</desc>
      <rect width="1600" height="1035" rx="36" fill={`url(#${bgGradientId})`} />
      <rect x="52" y="56" width="1496" height="84" rx="20" fill="#10131A" opacity="0.86" />
      <rect x="90" y="86" width="260" height="20" rx="10" fill="#E6E2D3" opacity="0.84" />
      <rect x="1258" y="80" width="204" height="34" rx="17" fill="#5F7ADB" opacity="0.92" />
      <rect x="52" y="176" width="314" height="804" rx="28" fill="#111720" opacity="0.78" />
      <rect x="98" y="226" width="222" height="18" rx="9" fill="#A7B1C6" opacity="0.7" />
      <rect x="98" y="276" width="226" height="118" rx="24" fill="#1F2A38" />
      <rect x="98" y="424" width="226" height="118" rx="24" fill="#1F2A38" />
      <rect x="98" y="572" width="226" height="118" rx="24" fill="#1F2A38" />
      <rect x="98" y="720" width="226" height="208" rx="24" fill="#182130" />
      <rect x="408" y="176" width="534" height="266" rx="28" fill="#111720" opacity="0.84" />
      <rect x="980" y="176" width="568" height="266" rx="28" fill="#111720" opacity="0.84" />
      <rect x="408" y="476" width="1140" height="504" rx="28" fill="#111720" opacity="0.84" />
      <g opacity="0.95">
        <path
          d="M446 368C515 312 592 340 666 264C746 182 820 218 900 204"
          stroke="#88E4FF"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="446" cy="368" r="14" fill="#88E4FF" />
        <circle cx="666" cy="264" r="14" fill="#88E4FF" />
        <circle cx="900" cy="204" r="14" fill="#88E4FF" />
      </g>
      <g opacity="0.96">
        <rect x="1022" y="222" width="114" height="150" rx="18" fill="#FFB86C" />
        <rect x="1170" y="276" width="114" height="96" rx="18" fill="#75D0A2" />
        <rect x="1318" y="238" width="114" height="134" rx="18" fill="#E6E2D3" />
      </g>
      <g opacity="0.88">
        <rect x="448" y="534" width="226" height="130" rx="22" fill="#1B2532" />
        <rect x="698" y="534" width="226" height="130" rx="22" fill="#1B2532" />
        <rect x="948" y="534" width="226" height="130" rx="22" fill="#1B2532" />
        <rect x="1198" y="534" width="310" height="130" rx="22" fill="#1B2532" />
      </g>
      <path
        d="M448 844C520 734 642 788 714 684C782 586 874 614 948 522C1004 454 1120 492 1200 458C1278 424 1374 444 1498 372"
        stroke="#D9C7FF"
        strokeWidth="16"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <path
        d="M448 900H1498"
        stroke="#39465B"
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.65"
      />
      <defs>
        <linearGradient
          id={bgGradientId}
          x1="145"
          y1="92"
          x2="1486"
          y2="998"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#17202B" />
          <stop offset="1" stopColor="#243244" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const ControlTechIllustration = ({
  titleId,
  descId,
  bgGradientId,
}: Omit<ProjectIllustrativeScreenProps, "variant"> & { bgGradientId: string }) => {
  return (
    <svg
      viewBox="0 0 1600 1035"
      role="img"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="h-full w-full"
    >
      <title id={titleId}>{PROJECT_ILLUSTRATION_COPY.controltech.title}</title>
      <desc id={descId}>{PROJECT_ILLUSTRATION_COPY.controltech.description}</desc>
      <rect width="1600" height="1035" rx="36" fill={`url(#${bgGradientId})`} />
      <rect x="54" y="54" width="312" height="926" rx="30" fill="#10171B" opacity="0.86" />
      <rect x="96" y="98" width="180" height="22" rx="11" fill="#EBE3D0" opacity="0.9" />
      <rect x="96" y="154" width="224" height="68" rx="18" fill="#163039" />
      <rect x="96" y="248" width="224" height="68" rx="18" fill="#163039" />
      <rect x="96" y="342" width="224" height="68" rx="18" fill="#163039" />
      <rect x="96" y="472" width="224" height="188" rx="24" fill="#142831" />
      <rect x="406" y="54" width="1140" height="126" rx="30" fill="#10171B" opacity="0.86" />
      <rect x="454" y="94" width="394" height="20" rx="10" fill="#EBE3D0" opacity="0.8" />
      <rect x="1302" y="88" width="186" height="42" rx="21" fill="#F08C44" />
      <rect x="406" y="218" width="548" height="350" rx="30" fill="#10171B" opacity="0.86" />
      <rect x="998" y="218" width="548" height="350" rx="30" fill="#10171B" opacity="0.86" />
      <rect x="406" y="604" width="1140" height="376" rx="30" fill="#10171B" opacity="0.86" />
      <rect x="452" y="264" width="456" height="26" rx="13" fill="#9EB5BA" opacity="0.68" />
      <rect x="1042" y="264" width="300" height="26" rx="13" fill="#9EB5BA" opacity="0.68" />
      <path d="M460 510H906" stroke="#33484F" strokeWidth="12" strokeLinecap="round" />
      <path d="M1040 510H1488" stroke="#33484F" strokeWidth="12" strokeLinecap="round" />
      <rect x="458" y="326" width="180" height="152" rx="24" fill="#21424B" />
      <rect x="664" y="326" width="244" height="152" rx="24" fill="#EBE3D0" opacity="0.9" />
      <rect x="1042" y="326" width="180" height="152" rx="24" fill="#F08C44" />
      <rect x="1248" y="326" width="244" height="152" rx="24" fill="#21424B" />
      <g opacity="0.95">
        <rect x="454" y="654" width="320" height="118" rx="24" fill="#173139" />
        <rect x="804" y="654" width="320" height="118" rx="24" fill="#173139" />
        <rect x="1154" y="654" width="344" height="118" rx="24" fill="#173139" />
      </g>
      <path
        d="M454 882C562 770 678 826 782 728C874 642 936 678 1030 596C1102 534 1196 562 1298 474C1366 416 1432 434 1494 398"
        stroke="#F0A568"
        strokeWidth="16"
        strokeLinecap="round"
        fill="none"
        opacity="0.88"
      />
      <defs>
        <linearGradient
          id={bgGradientId}
          x1="170"
          y1="72"
          x2="1510"
          y2="1006"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1B2428" />
          <stop offset="1" stopColor="#23383E" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const ProjectIllustrativeScreen = ({
  titleId,
  descId,
  variant,
}: ProjectIllustrativeScreenProps) => {
  const bgGradientId = `${titleId}-bg`;

  if (variant === "controltech") {
    return (
      <ControlTechIllustration titleId={titleId} descId={descId} bgGradientId={bgGradientId} />
    );
  }
  return <EmplifiIllustration titleId={titleId} descId={descId} bgGradientId={bgGradientId} />;
};
