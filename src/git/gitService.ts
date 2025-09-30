import { spawn } from "child_process";
import {
  Commit,
  FileChange,
  BranchInfo,
  GitLogOptions,
  AuthorStat,
  FileStat,
  StatsResult,
} from "../types";
import { DateParser } from "../utils/date";

export class GitService {
  /**
   * Execute git command and return output
   */
  private static async executeGitCommand(
    args: string[],
    cwd: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const gitProcess = spawn("git", args, {
        cwd,
        stdio: ["pipe", "pipe", "pipe"],
      });

      let stdout = "";
      let stderr = "";

      gitProcess.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      gitProcess.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      gitProcess.on("close", (code) => {
        if (code === 0) {
          resolve(stdout.trim());
        } else {
          reject(new Error(`Git command failed: ${stderr || stdout}`));
        }
      });

      gitProcess.on("error", (error) => {
        reject(new Error(`Failed to execute git: ${error.message}`));
      });
    });
  }

  /**
   * Get all branches (local and remote)
   */
  public static async getBranches(
    projectPath: string,
    includeRemote = false
  ): Promise<string[]> {
    const args = includeRemote
      ? ["branch", "-a", "--format=%(refname:short)"]
      : ["branch", "--format=%(refname:short)"];

    try {
      const output = await this.executeGitCommand(args, projectPath);
      return output
        .split("\n")
        .map((branch) => branch.trim())
        .filter((branch) => branch && !branch.startsWith("origin/HEAD"))
        .map((branch) => branch.replace("origin/", ""));
    } catch (error) {
      throw new Error(`Failed to get branches: ${error}`);
    }
  }

  /**
   * Get branch information with latest commit details
   */
  public static async getBranchInfo(
    projectPath: string,
    branchName?: string
  ): Promise<BranchInfo[]> {
    const pattern = branchName ? `refs/heads/${branchName}` : "refs/heads";
    const args = [
      "for-each-ref",
      "--format=%(refname:short)|%(committerdate:iso-strict)|%(authorname)|%(objectname:short)|%(subject)",
      pattern,
    ];

    try {
      const output = await this.executeGitCommand(args, projectPath);
      if (!output) return [];

      return output.split("\n").map((line) => {
        const [name, dateStr, author, hash, message] = line.split("|");
        return {
          name,
          lastCommitDate: new Date(dateStr),
          lastCommitAuthor: author,
          lastCommitHash: hash,
          lastCommitMessage: message || "",
        };
      });
    } catch (error) {
      throw new Error(`Failed to get branch info: ${error}`);
    }
  }

  /**
   * Get commits with basic info
   */
  public static async getCommits(options: GitLogOptions): Promise<Commit[]> {
    const args = [
      "log",
      "--pretty=format:%H|%an|%ae|%ad|%s",
      "--date=iso-strict",
    ];

    if (options.since) {
      const sinceDate = DateParser.parseDate(options.since);
      args.push(`--since=${DateParser.formatForGit(sinceDate)}`);
    }

    if (options.until) {
      const untilDate = DateParser.parseDate(options.until);
      args.push(`--until=${DateParser.formatForGit(untilDate)}`);
    }

    if (options.author) {
      args.push(`--author=${options.author}`);
    }

    if (options.branch) {
      args.push(options.branch);
    }

    try {
      const output = await this.executeGitCommand(args, options.projectPath);
      if (!output) return [];

      return output.split("\n").map((line) => {
        const [hash, author, email, dateStr, message] = line.split("|");
        return {
          hash,
          shortHash: hash.substring(0, 7),
          author,
          email,
          date: new Date(dateStr),
          message: message || "",
        };
      });
    } catch (error) {
      throw new Error(`Failed to get commits: ${error}`);
    }
  }

  /**
   * Get commits with file changes (numstat)
   */
  public static async getCommitsWithStats(
    options: GitLogOptions
  ): Promise<Commit[]> {
    const args = [
      "log",
      "--numstat",
      "--pretty=format:--commit--|%H|%an|%ae|%ad|%s",
      "--date=iso-strict",
    ];

    if (options.since) {
      const sinceDate = DateParser.parseDate(options.since);
      args.push(`--since=${DateParser.formatForGit(sinceDate)}`);
    }

    if (options.until) {
      const untilDate = DateParser.parseDate(options.until);
      args.push(`--until=${DateParser.formatForGit(untilDate)}`);
    }

    if (options.author) {
      args.push(`--author=${options.author}`);
    }

    if (options.branch) {
      args.push(options.branch);
    }

    try {
      const output = await this.executeGitCommand(args, options.projectPath);
      if (!output) return [];

      return this.parseCommitsWithStats(output);
    } catch (error) {
      throw new Error(`Failed to get commits with stats: ${error}`);
    }
  }

  /**
   * Parse git log output with numstat
   */
  private static parseCommitsWithStats(output: string): Commit[] {
    const commits: Commit[] = [];
    const sections = output
      .split("--commit--")
      .filter((section) => section.trim());

    for (const section of sections) {
      const lines = section.trim().split("\n");
      if (lines.length === 0) continue;

      // Parse commit header
      const headerLine = lines[0];
      if (!headerLine.includes("|")) continue;

      const [, hash, author, email, dateStr, message] = headerLine.split("|");

      const commit: Commit = {
        hash,
        shortHash: hash.substring(0, 7),
        author,
        email,
        date: new Date(dateStr),
        message: message || "",
        filesChanged: [],
      };

      // Parse file changes
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const parts = line.split("\t");
        if (parts.length >= 3) {
          const added = parts[0] === "-" ? 0 : parseInt(parts[0], 10) || 0;
          const deleted = parts[1] === "-" ? 0 : parseInt(parts[1], 10) || 0;
          const file = parts[2];

          commit.filesChanged!.push({
            file,
            added,
            deleted,
          });
        }
      }

      commits.push(commit);
    }

    return commits;
  }

  /**
   * Generate statistics from commits
   */
  public static generateStats(commits: Commit[]): StatsResult {
    const authorStats = new Map<string, AuthorStat>();
    const fileStats = new Map<string, FileStat>();

    for (const commit of commits) {
      const authorKey = `${commit.author} <${commit.email}>`;

      // Update author stats
      if (!authorStats.has(authorKey)) {
        authorStats.set(authorKey, {
          author: commit.author,
          email: commit.email,
          commits: 0,
          filesChanged: 0,
          linesAdded: 0,
          linesDeleted: 0,
        });
      }

      const authorStat = authorStats.get(authorKey)!;
      authorStat.commits++;

      // Process file changes
      if (commit.filesChanged) {
        const uniqueFiles = new Set(commit.filesChanged.map((fc) => fc.file));
        authorStat.filesChanged += uniqueFiles.size;

        for (const fileChange of commit.filesChanged) {
          authorStat.linesAdded += fileChange.added;
          authorStat.linesDeleted += fileChange.deleted;

          // Update file stats
          if (!fileStats.has(fileChange.file)) {
            fileStats.set(fileChange.file, {
              file: fileChange.file,
              commits: 0,
              linesAdded: 0,
              linesDeleted: 0,
            });
          }

          const fileStat = fileStats.get(fileChange.file)!;
          fileStat.commits++;
          fileStat.linesAdded += fileChange.added;
          fileStat.linesDeleted += fileChange.deleted;
        }
      }
    }

    const authorStatsArray = Array.from(authorStats.values()).sort(
      (a, b) => b.commits - a.commits
    );

    const fileStatsArray = Array.from(fileStats.values()).sort(
      (a, b) => b.linesAdded + b.linesDeleted - (a.linesAdded + a.linesDeleted)
    );

    const totalCommits = commits.length;
    const totalFiles = fileStats.size;
    const totalLinesAdded = authorStatsArray.reduce(
      (sum, stat) => sum + stat.linesAdded,
      0
    );
    const totalLinesDeleted = authorStatsArray.reduce(
      (sum, stat) => sum + stat.linesDeleted,
      0
    );

    return {
      authorStats: authorStatsArray,
      fileStats: fileStatsArray,
      totalCommits,
      totalFiles,
      totalLinesAdded,
      totalLinesDeleted,
    };
  }

  /**
   * Check if directory is a git repository
   */
  public static async isGitRepository(path: string): Promise<boolean> {
    try {
      await this.executeGitCommand(["status", "--porcelain"], path);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get current branch name
   */
  public static async getCurrentBranch(projectPath: string): Promise<string> {
    try {
      const output = await this.executeGitCommand(
        ["branch", "--show-current"],
        projectPath
      );
      return output.trim();
    } catch (error) {
      throw new Error(`Failed to get current branch: ${error}`);
    }
  }
}
