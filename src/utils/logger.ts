import pc from "picocolors";

export type Logger = {
  success(message: string): void;
  warn(message: string): void;
  info(message: string): void;
  blank(): void;
};

export const defaultLogger: Logger = {
  success(message: string) {
    console.log(pc.green(message));
  },
  warn(message: string) {
    console.warn(pc.yellow(message));
  },
  info(message: string) {
    console.log(message);
  },
  blank() {
    console.log("");
  }
};
