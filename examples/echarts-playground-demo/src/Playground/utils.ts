function compareVersions(v1: string, v2: string): number {
  const v1Parts = v1.split("-");
  const v2Parts = v2.split("-");
  const mainVersion1 = v1Parts[0].split(".").map(Number);
  const mainVersion2 = v2Parts[0].split(".").map(Number);

  for (let i = 0; i < Math.max(mainVersion1.length, mainVersion2.length); i++) {
    if ((mainVersion1[i] || 0) > (mainVersion2[i] || 0)) return -1;
    if ((mainVersion1[i] || 0) < (mainVersion2[i] || 0)) return 1;
  }

  // If main versions are equal, we then compare pre-release tags.
  if (v1Parts.length === 1 && v2Parts.length === 1) return 0; // both have no pre-release tag
  if (v1Parts.length === 1) return -1; // only v2 has a pre-release tag
  if (v2Parts.length === 1) return 1; // only v1 has a pre-release tag

  const preReleaseCompare = v1Parts[1].localeCompare(v2Parts[1]);
  if (preReleaseCompare !== 0) return preReleaseCompare;

  return 0;
}

export function sortVersionsDescending(versions: string[]): string[] {
  return versions.sort(compareVersions);
}
