export function extractGoogleDriveFileId(url: string): string | null {
  const value = url.trim();

  const fileMatch = value.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch?.[1]) return fileMatch[1];

  const idMatch = value.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch?.[1]) return idMatch[1];

  return null;
}

export function normalizeResumeUrl(url: string): string {
  const value = url.trim();
  const driveId = extractGoogleDriveFileId(value);

  if (!driveId) return value;

  return `https://drive.google.com/file/d/${driveId}/view`;
}

export function getResumeLinks(url: string): {
  openUrl: string;
  downloadUrl: string;
  embedUrl: string;
  isGoogleDrive: boolean;
} {
  const normalized = normalizeResumeUrl(url);
  const driveId = extractGoogleDriveFileId(normalized);

  if (!driveId) {
    return {
      openUrl: normalized,
      downloadUrl: normalized,
      embedUrl: normalized,
      isGoogleDrive: false,
    };
  }

  return {
    openUrl: `https://drive.google.com/file/d/${driveId}/view`,
    downloadUrl: `https://drive.google.com/uc?export=download&id=${driveId}`,
    embedUrl: `https://drive.google.com/file/d/${driveId}/preview`,
    isGoogleDrive: true,
  };
}
