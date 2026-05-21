import path from "node:path";
import { githubConfigTemplate } from "../templates/githubConfig.js";
import { githubFeatureHandoffTemplate } from "../templates/githubFeatureHandoff.js";
import { ensureDirectory, pathExists, writeTextFile } from "../utils/filesystem.js";
import { defaultLogger, type Logger } from "../utils/logger.js";

const ISSUE_TEMPLATE_DIR = ".github/ISSUE_TEMPLATE";
const FEATURE_TEMPLATE_FILE = `${ISSUE_TEMPLATE_DIR}/feature-handoff.yml`;
const CONFIG_FILE = `${ISSUE_TEMPLATE_DIR}/config.yml`;

type InitOptions = {
  cwd?: string;
  force?: boolean;
  config?: boolean;
  logger?: Logger;
};

type InitResult = {
  status: "created" | "overwritten" | "skipped";
  created: string[];
  existing: string[];
};

type TargetFile = {
  relativePath: string;
  contents: string;
};

export async function runInit(options: InitOptions = {}): Promise<InitResult> {
  const cwd = options.cwd ?? process.cwd();
  const logger = options.logger ?? defaultLogger;
  const shouldCreateConfig = options.config ?? true;
  const force = options.force ?? false;

  const targets: TargetFile[] = [
    {
      relativePath: FEATURE_TEMPLATE_FILE,
      contents: githubFeatureHandoffTemplate
    }
  ];

  if (shouldCreateConfig) {
    targets.push({
      relativePath: CONFIG_FILE,
      contents: githubConfigTemplate
    });
  }

  const existing = await findExistingTargets(cwd, targets);

  if (existing.length > 0 && !force) {
    printExistingFiles(logger, existing);

    return {
      status: "skipped",
      created: [],
      existing
    };
  }

  await ensureDirectory(path.join(cwd, ISSUE_TEMPLATE_DIR));

  for (const target of targets) {
    await writeTextFile(path.join(cwd, target.relativePath), target.contents);
  }

  const created = targets.map((target) => target.relativePath);

  if (force && existing.length > 0) {
    logger.success("Overwrote existing Feature Handoff template files.");
  } else {
    printSuccess(logger, created);
  }

  return {
    status: force && existing.length > 0 ? "overwritten" : "created",
    created,
    existing
  };
}

async function findExistingTargets(cwd: string, targets: TargetFile[]): Promise<string[]> {
  const existing: string[] = [];

  for (const target of targets) {
    if (await pathExists(path.join(cwd, target.relativePath))) {
      existing.push(target.relativePath);
    }
  }

  return existing;
}

function printSuccess(logger: Logger, created: string[]): void {
  logger.success("Feature Handoff template created.");
  logger.blank();
  logger.info("Created:");

  for (const filePath of created) {
    logger.info(`- ${filePath}`);
  }

  logger.blank();
  logger.info("Next steps:");
  logger.info("1. Review the generated template.");
  logger.info("2. Commit the files:");
  logger.info("   git add .github/ISSUE_TEMPLATE");
  logger.info('   git commit -m "Add feature handoff issue template"');
  logger.info("   git push");
  logger.info("3. Open GitHub and create a new issue using the Feature Handoff template.");
}

function printExistingFiles(logger: Logger, existing: string[]): void {
  logger.warn("Some template files already exist.");
  logger.blank();
  logger.info("Existing:");

  for (const filePath of existing) {
    logger.info(`- ${filePath}`);
  }

  logger.blank();
  logger.info("Run with --force to overwrite, or delete the file manually.");
}
