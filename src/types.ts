export interface Project {
  name: string;
  path: string;
}

export interface Config {
  projects: Project[];
  defaultSinceDays: number;
}

export interface Commit {
  hash: string;
  shortHash: string;
  author: string;
  email: string;
  date: Date;
  message: string;
  filesChanged?: FileChange[];
}

export interface FileChange {
  file: string;
  added: number;
  deleted: number;
}

export interface AuthorStat {
  author: string;
  email: string;
  commits: number;
  filesChanged: number;
  linesAdded: number;
  linesDeleted: number;
}

export interface FileStat {
  file: string;
  commits: number;
  linesAdded: number;
  linesDeleted: number;
}

export interface BranchInfo {
  name: string;
  lastCommitDate: Date;
  lastCommitAuthor: string;
  lastCommitHash: string;
  lastCommitMessage: string;
}

export interface GitLogOptions {
  since?: string;
  until?: string;
  author?: string;
  branch?: string;
  projectPath: string;
}

export interface StatsResult {
  authorStats: AuthorStat[];
  fileStats: FileStat[];
  totalCommits: number;
  totalFiles: number;
  totalLinesAdded: number;
  totalLinesDeleted: number;
}

export interface DateRange {
  since?: Date;
  until?: Date;
}
