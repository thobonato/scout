import type { DogProfile } from "@/app/create-dog/types";

// Brand color hex values — only used here for canvas drawing, not in JSX
const WARM_WHITE = "#fffcf8";
const CREAM = "#fff8f0";
const CHEWY_BLUE = "#00aeef";
const CHEWY_ORANGE = "#f4791f";
const TEXT_DARK = "#1a1a2e";
const TEXT_MID = "#4a4a6a";
const TEXT_MUTED = "#7a7a9a";

const W = 600;
const PHOTO_H = 300;
const PADDING = 32;
const CARD_RADIUS = 24;
const SCALE = 2;

// ─── Helpers ────────────────────────────────────────────────────────────────

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load: ${src}`));
    img.src = src;
  });
}

function pawSvgToImage(color: string, opacity = 1): Promise<HTMLImageElement> {
  const svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g opacity="${opacity}">
      <ellipse cx="24" cy="28" rx="11" ry="13" fill="${color}"/>
      <ellipse cx="47" cy="18" rx="11" ry="13" fill="${color}"/>
      <ellipse cx="70" cy="22" rx="11" ry="13" fill="${color}"/>
      <ellipse cx="85" cy="44" rx="10" ry="12" fill="${color}"/>
      <ellipse cx="52" cy="68" rx="28" ry="24" fill="${color}"/>
    </g>
  </svg>`;
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  return loadImage(url).finally(() => URL.revokeObjectURL(url));
}

function getFontFamily(variable: string): string {
  return getComputedStyle(document.body).getPropertyValue(variable).trim();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      if (lines.length >= maxLines) {
        return lines;
      }
      line = word;
    } else {
      line = candidate;
    }
  }

  if (line && lines.length < maxLines) {
    lines.push(line);
  }

  return lines;
}

function formatSize(size: string | undefined): string | undefined {
  if (!size) {
    return undefined;
  }
  const labels: Record<string, string> = {
    small: "Small",
    medium: "Medium",
    large: "Large",
    "extra-large": "XL",
  };
  return labels[size] ?? size;
}

function formatGender(gender: string | undefined): string | undefined {
  if (!gender || gender === "unknown") {
    return undefined;
  }
  return gender.charAt(0).toUpperCase() + gender.slice(1);
}

// ─── Layout constants ────────────────────────────────────────────────────────

const CHIP_H = 46;
const CHIP_GAP = 8;
const CHIP_H_PAD = 14;
const CHIP_LABEL_SIZE = 10;
const CHIP_VALUE_SIZE = 13;
const NAME_ROW_H = 44;
const SECTION_GAP = 16;
const INFO_TOP_PAD = 28;
const INFO_BOT_PAD = 36;

// ─── Main export ─────────────────────────────────────────────────────────────

export async function drawDogCard(dog: DogProfile): Promise<string> {
  await document.fonts.ready;

  const fredoka = getFontFamily("--font-fredoka");
  const nunito = getFontFamily("--font-nunito");

  const [photoImg, avatarImg, orangePaw, bluePaw] = await Promise.all([
    dog.photoUrl ? loadImage(dog.photoUrl).catch(() => null) : null,
    dog.avatarUrl ? loadImage(dog.avatarUrl).catch(() => null) : null,
    pawSvgToImage(CHEWY_ORANGE),
    pawSvgToImage(CHEWY_BLUE),
  ]);

  // Build chip data
  const details: Array<{ label: string; value: string }> = [
    { label: "BREED", value: dog.breed },
    {
      label: "AGE",
      value: dog.age
        ? `${dog.age} ${Number(dog.age) === 1 ? "yr" : "yrs"}`
        : "",
    },
    { label: "SIZE", value: formatSize(dog.size) ?? "" },
    { label: "WEIGHT", value: dog.weight ? `${dog.weight} lbs` : "" },
    { label: "GENDER", value: formatGender(dog.gender) ?? "" },
    { label: "COAT", value: dog.coatColor ?? "" },
  ].filter((d) => d.value);

  // Measure chip widths using a temp canvas
  const measure = document.createElement("canvas").getContext("2d")!;

  const chips = details.map((d) => {
    measure.font = `700 ${CHIP_LABEL_SIZE}px ${nunito}`;
    const labelW = measure.measureText(d.label).width;
    measure.font = `600 ${CHIP_VALUE_SIZE}px ${nunito}`;
    const valueW = measure.measureText(d.value).width;
    const w = Math.max(80, Math.max(labelW, valueW) + CHIP_H_PAD * 2);
    return { ...d, w };
  });

  // Wrap chips into rows
  const INNER_W = W - PADDING * 2;
  const chipRows: (typeof chips)[] = [];
  let row: typeof chips = [];
  let rowUsed = 0;

  for (const chip of chips) {
    const needed = rowUsed === 0 ? chip.w : rowUsed + CHIP_GAP + chip.w;
    if (needed > INNER_W && row.length > 0) {
      chipRows.push(row);
      row = [chip];
      rowUsed = chip.w;
    } else {
      row.push(chip);
      rowUsed = needed;
    }
  }
  if (row.length > 0) {
    chipRows.push(row);
  }

  const chipsBlockH =
    chipRows.length * CHIP_H + Math.max(0, chipRows.length - 1) * CHIP_GAP;

  // Measure personality block
  measure.font = `italic 600 13px ${nunito}`;
  const personalityLines = dog.personality
    ? wrapText(measure, `"${dog.personality}"`, INNER_W - 32, 3)
    : [];
  const PERS_LINE_H = 22;
  const personalityBlockH =
    personalityLines.length > 0
      ? SECTION_GAP + 16 + personalityLines.length * PERS_LINE_H + 16
      : 0;

  const infoH =
    INFO_TOP_PAD +
    NAME_ROW_H +
    SECTION_GAP +
    chipsBlockH +
    personalityBlockH +
    INFO_BOT_PAD;

  const TOTAL_H = PHOTO_H + infoH;

  // Create final canvas
  const canvas = document.createElement("canvas");
  canvas.width = W * SCALE;
  canvas.height = TOTAL_H * SCALE;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(SCALE, SCALE);

  // ── Card background ──────────────────────────────────────────────────────
  roundRect(ctx, 0, 0, W, TOTAL_H, CARD_RADIUS);
  ctx.fillStyle = WARM_WHITE;
  ctx.fill();

  roundRect(ctx, 0.5, 0.5, W - 1, TOTAL_H - 1, CARD_RADIUS);
  ctx.strokeStyle = "rgba(0,0,0,0.06)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // ── Photo area (clipped to top rounded corners) ──────────────────────────
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(CARD_RADIUS, 0);
  ctx.lineTo(W - CARD_RADIUS, 0);
  ctx.quadraticCurveTo(W, 0, W, CARD_RADIUS);
  ctx.lineTo(W, PHOTO_H);
  ctx.lineTo(0, PHOTO_H);
  ctx.lineTo(0, CARD_RADIUS);
  ctx.quadraticCurveTo(0, 0, CARD_RADIUS, 0);
  ctx.closePath();
  ctx.clip();

  if (photoImg) {
    const imgAR = photoImg.naturalWidth / photoImg.naturalHeight;
    const areaAR = W / PHOTO_H;
    let sx = 0,
      sy = 0,
      sw = photoImg.naturalWidth,
      sh = photoImg.naturalHeight;
    if (imgAR > areaAR) {
      sw = sh * areaAR;
      sx = (photoImg.naturalWidth - sw) / 2;
    } else {
      sh = sw / areaAR;
      sy = (photoImg.naturalHeight - sh) / 2;
    }
    ctx.drawImage(photoImg, sx, sy, sw, sh, 0, 0, W, PHOTO_H);
  } else {
    ctx.fillStyle = CREAM;
    ctx.fillRect(0, 0, W, PHOTO_H);
    const pawSz = 80;
    ctx.globalAlpha = 0.15;
    ctx.drawImage(bluePaw, (W - pawSz) / 2, (PHOTO_H - pawSz) / 2, pawSz, pawSz);
    ctx.globalAlpha = 1;
  }

  ctx.restore();

  // ── Avatar (circle, bottom-right of photo) ───────────────────────────────
  if (avatarImg) {
    const AV = 56;
    const ax = W - 16 - AV;
    const ay = PHOTO_H - 16 - AV;
    const cx = ax + AV / 2;
    const cy = ay + AV / 2;

    // White border ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, AV / 2 + 3, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.restore();

    // Avatar image clipped to circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, AV / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(avatarImg, ax, ay, AV, AV);
    ctx.restore();
  }

  // ── Scout watermark (top-left of photo) ──────────────────────────────────
  {
    const PAW_SZ = 14;
    const FONT_SZ = 12;
    const PILL_H = 28;
    const GAP = 5;
    const H_PAD = 10;

    ctx.font = `600 ${FONT_SZ}px ${fredoka}`;
    const labelW = ctx.measureText("Scout").width;
    const pillW = H_PAD + PAW_SZ + GAP + labelW + H_PAD;

    const px = 14;
    const py = 14;

    roundRect(ctx, px, py, pillW, PILL_H, PILL_H / 2);
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fill();

    ctx.drawImage(
      bluePaw,
      px + H_PAD,
      py + (PILL_H - PAW_SZ) / 2,
      PAW_SZ,
      PAW_SZ,
    );

    ctx.fillStyle = CHEWY_BLUE;
    ctx.font = `600 ${FONT_SZ}px ${fredoka}`;
    ctx.textBaseline = "middle";
    ctx.fillText("Scout", px + H_PAD + PAW_SZ + GAP, py + PILL_H / 2);
  }

  // ── Info section ─────────────────────────────────────────────────────────
  let y = PHOTO_H + INFO_TOP_PAD;

  // Name row
  {
    const PAW_SZ = 22;
    ctx.drawImage(orangePaw, PADDING, y + (NAME_ROW_H - PAW_SZ) / 2, PAW_SZ, PAW_SZ);

    ctx.font = `600 28px ${fredoka}`;
    ctx.fillStyle = TEXT_DARK;
    ctx.textBaseline = "middle";
    const nameX = PADDING + PAW_SZ + 8;
    ctx.fillText(dog.name, nameX, y + NAME_ROW_H / 2);

    if (dog.isSpayedNeutered) {
      const BADGE_LABEL = "FIXED";
      const BADGE_H = 22;
      const B_FONT = 10;
      ctx.font = `700 ${B_FONT}px ${nunito}`;
      const nameW = (() => {
        ctx.font = `600 28px ${fredoka}`;
        const w = ctx.measureText(dog.name).width;
        return w;
      })();
      const badgeW = ctx.measureText(BADGE_LABEL).width + 22;
      const bx = nameX + nameW + 10;
      const by = y + (NAME_ROW_H - BADGE_H) / 2;

      roundRect(ctx, bx, by, badgeW, BADGE_H, BADGE_H / 2);
      ctx.fillStyle = "rgba(244,121,31,0.10)";
      ctx.fill();

      ctx.font = `700 ${B_FONT}px ${nunito}`;
      ctx.fillStyle = CHEWY_ORANGE;
      ctx.textBaseline = "middle";
      ctx.letterSpacing = "1px";
      ctx.fillText(BADGE_LABEL, bx + 11, by + BADGE_H / 2);
      ctx.letterSpacing = "0px";
    }
  }

  y += NAME_ROW_H + SECTION_GAP;

  // Detail chips
  for (const chipRow of chipRows) {
    let x = PADDING;
    for (const chip of chipRow) {
      roundRect(ctx, x, y, chip.w, CHIP_H, 10);
      ctx.fillStyle = CREAM;
      ctx.fill();

      ctx.font = `700 ${CHIP_LABEL_SIZE}px ${nunito}`;
      ctx.fillStyle = TEXT_MUTED;
      ctx.textBaseline = "top";
      ctx.letterSpacing = "1.5px";
      ctx.fillText(chip.label, x + CHIP_H_PAD, y + 10);
      ctx.letterSpacing = "0px";

      ctx.font = `600 ${CHIP_VALUE_SIZE}px ${nunito}`;
      ctx.fillStyle = TEXT_DARK;
      ctx.fillText(chip.value, x + CHIP_H_PAD, y + 10 + CHIP_LABEL_SIZE + 5);

      x += chip.w + CHIP_GAP;
    }
    y += CHIP_H + CHIP_GAP;
  }

  y += SECTION_GAP - CHIP_GAP;

  // Personality block
  if (personalityLines.length > 0) {
    const BOX_H = 16 + personalityLines.length * PERS_LINE_H + 16;

    roundRect(ctx, PADDING, y, INNER_W, BOX_H, 12);
    ctx.fillStyle = CREAM;
    ctx.fill();

    ctx.font = `italic 600 13px ${nunito}`;
    ctx.fillStyle = TEXT_MID;
    ctx.textBaseline = "top";
    for (let i = 0; i < personalityLines.length; i++) {
      ctx.fillText(personalityLines[i], PADDING + 16, y + 16 + i * PERS_LINE_H);
    }
  }

  return canvas.toDataURL("image/png");
}
