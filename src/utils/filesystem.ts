import fs from "fs-extra";

export async function ensureDirectory(directoryPath: string): Promise<void> {
  await fs.ensureDir(directoryPath);
}

export async function pathExists(filePath: string): Promise<boolean> {
  return fs.pathExists(filePath);
}

export async function writeTextFile(filePath: string, contents: string): Promise<void> {
  await fs.writeFile(filePath, contents, "utf8");
}
