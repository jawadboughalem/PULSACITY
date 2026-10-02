const drawCircle = (centerX: number, centerY: number, radius: number) =>
  `M${centerX - radius} ${centerY}a${radius} ${radius} 0 1 0 ${2 * radius} 0a${radius} ${radius} 0 1 0 ${-2 * radius} 0`;

export const STAR_PATH = "M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z";

export const ICON_PATHS = {
  alert: ["M12 4l9 16H3z", "M12 10v4", "M12 17.2v.1"],
  valid: [drawCircle(12, 12, 9), "M8 12.5l2.8 2.8L16 10"],
  clock: [drawCircle(12, 12, 9), "M12 7v5l3 2"],
  photo: ["M4 8h3l2-3h6l2 3h3v11H4z", drawCircle(12, 13, 3.5)],
  email: ["M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z", "M3.5 6l8.5 7 8.5-7"],
  copy: [
    "M10 9h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z",
    "M15 9V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h4",
  ],
  connection: [
    "M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1",
    "M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1",
  ],
  share: ["M12 4v11", "M8 8l4-4 4 4", "M5 13v6h14v-6"],
  home: ["M4 11l8-7 8 7v9h-5v-6h-6v6H4z"],
  quote: ["M5 5h14v10H9l-4 4z"],
  tag: ["M3 12V4h8l10 10-8 8z", drawCircle(7.5, 7.5, 1.5)],
  grid: ["M4 4h7v7H4z", "M13 4h7v7h-7z", "M4 13h7v7H4z", "M13 13h7v7h-7z"],
  mail: ["M3 5h18v14H3z", "M3.5 6l8.5 7 8.5-7"],
  sliders: ["M4 7h10M18 7h2M4 17h4M12 17h8", drawCircle(16, 7, 2), drawCircle(10, 17, 2)],
  more: [drawCircle(5, 12, 1.2), drawCircle(12, 12, 1.2), drawCircle(19, 12, 1.2)],
  user: [drawCircle(12, 8, 4), "M4 20.5c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"],
  card: ["M3 6h18v12H3z", "M3 10h18"],
  help: [drawCircle(12, 12, 9), "M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6", "M12 17.2v.1"],
  logout: ["M14 4H5v16h9", "M10 12h10", "M17 9l3 3-3 3"],
  chevronDown: ["M6 9l6 6 6-6"],
  chevronRight: ["M9 6l6 6-6 6"],
  chevronLeft: ["M15 6l-6 6 6 6"],
  bookmark: ["M6 3h12v18l-6-5-6 5z"],
  search: [drawCircle(11, 11, 6.5), "M16 16l4.5 4.5"],
  plus: ["M12 5v14", "M5 12h14"],
  info: [drawCircle(12, 12, 9), "M12 11v6", "M12 7.2v.1"],
  hidden: ["M4 12s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z", drawCircle(12, 12, 2.5), "M4 4l16 16"],
  upload: ["M12 15V4", "M8 8l4-4 4 4", "M5 15v5h14v-5"],
  download: ["M12 4v11", "M8 11l4 4 4-4", "M5 15v5h14v-5"],
  wall: ["M4 4h6.5v9.5H4z", "M13.5 4H20v4.5h-6.5z", "M4 16.5h6.5V20H4z", "M13.5 11.5H20V20h-6.5z"],
  carousel: ["M6.5 5h11v14h-11z", "M3.5 8v8", "M20.5 8v8"],
  badge: ["M3.5 8.5h17v7h-17z", drawCircle(8, 12, 1.5)],
} as const;

export type IconName = keyof typeof ICON_PATHS;
