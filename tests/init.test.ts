import os from "node:os";
import path from "node:path";
import fs from "fs-extra";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { runInit } from "../src/commands/init.js";
import type { Logger } from "../src/utils/logger.js";

const silentLogger: Logger = {
  success() {},
  warn() {},
  info() {},
  blank() {}
};

let tempDirs: string[] = [];

beforeEach(() => {
  tempDirs = [];
});

afterEach(async () => {
  await Promise.all(tempDirs.map((tempDir) => fs.remove(tempDir)));
});

describe("init", () => {
  it("creates .github/ISSUE_TEMPLATE/feature-handoff.yml", async () => {
    const cwd = await createTempDir();

    await runInit({ cwd, logger: silentLogger });

    await expect(
      fs.pathExists(path.join(cwd, ".github", "ISSUE_TEMPLATE", "feature-handoff.yml"))
    ).resolves.toBe(true);
  });

  it("creates .github/ISSUE_TEMPLATE/config.yml by default", async () => {
    const cwd = await createTempDir();

    await runInit({ cwd, logger: silentLogger });

    await expect(
      fs.pathExists(path.join(cwd, ".github", "ISSUE_TEMPLATE", "config.yml"))
    ).resolves.toBe(true);
  });

  it("does not create config.yml when config is disabled", async () => {
    const cwd = await createTempDir();

    await runInit({ cwd, config: false, logger: silentLogger });

    await expect(
      fs.pathExists(path.join(cwd, ".github", "ISSUE_TEMPLATE", "config.yml"))
    ).resolves.toBe(false);
  });

  it("does not overwrite existing files by default", async () => {
    const cwd = await createTempDir();
    const templatePath = path.join(cwd, ".github", "ISSUE_TEMPLATE", "feature-handoff.yml");
    await fs.ensureDir(path.dirname(templatePath));
    await fs.writeFile(templatePath, "existing template", "utf8");

    const result = await runInit({ cwd, logger: silentLogger });

    await expect(fs.readFile(templatePath, "utf8")).resolves.toBe("existing template");
    expect(result.status).toBe("skipped");
    expect(result.existing).toEqual([".github/ISSUE_TEMPLATE/feature-handoff.yml"]);
  });

  it("overwrites existing files with force", async () => {
    const cwd = await createTempDir();
    const templatePath = path.join(cwd, ".github", "ISSUE_TEMPLATE", "feature-handoff.yml");
    await fs.ensureDir(path.dirname(templatePath));
    await fs.writeFile(templatePath, "existing template", "utf8");

    const result = await runInit({ cwd, force: true, logger: silentLogger });
    const contents = await fs.readFile(templatePath, "utf8");

    expect(contents).toContain("name: Feature Handoff");
    expect(contents).not.toBe("existing template");
    expect(result.status).toBe("overwritten");
  });

  it("generates required GitHub Issue Form top-level keys", async () => {
    const cwd = await createTempDir();

    await runInit({ cwd, logger: silentLogger });

    const contents = await fs.readFile(
      path.join(cwd, ".github", "ISSUE_TEMPLATE", "feature-handoff.yml"),
      "utf8"
    );

    expect(contents).toMatch(/^name:/m);
    expect(contents).toMatch(/^description:/m);
    expect(contents).toMatch(/^title:/m);
    expect(contents).toMatch(/^labels:/m);
    expect(contents).toMatch(/^body:/m);
  });

  it("includes required problem-first handoff fields", async () => {
    const cwd = await createTempDir();

    await runInit({ cwd, logger: silentLogger });

    const contents = await fs.readFile(
      path.join(cwd, ".github", "ISSUE_TEMPLATE", "feature-handoff.yml"),
      "utf8"
    );

    expect(contents).toContain("label: Problem title");
    expect(contents).toContain("label: Problem");
    expect(contents).toContain("label: Who is affected?");
    expect(contents).toContain("label: Evidence type");
    expect(contents).toContain("label: Evidence details");
    expect(contents).toContain("label: Outcome to improve");
    expect(contents).toContain("label: Example solution");
    expect(contents).toContain("label: Design ask");
  });
});

async function createTempDir(): Promise<string> {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "feature-handoff-"));
  tempDirs.push(tempDir);
  return tempDir;
}
