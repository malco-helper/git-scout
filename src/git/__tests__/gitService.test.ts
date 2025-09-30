import { describe, it, expect, vi, beforeEach } from "vitest";
import { GitService } from "../gitService";
import { Commit } from "../../types";

// Mock child_process
vi.mock("child_process", () => ({
  spawn: vi.fn(),
}));

describe("GitService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("parseCommitsWithStats", () => {
    it("should parse git log output with numstat correctly", () => {
      const mockOutput = `--commit--|abc1234|John Doe|john@example.com|2025-09-30T10:00:00+00:00|Initial commit
10	5	src/index.ts
0	0	README.md

--commit--|def5678|Jane Smith|jane@example.com|2025-09-30T11:00:00+00:00|Add feature
15	3	src/feature.ts
2	1	src/index.ts`;

      // Access private method for testing
      const parseMethod = (GitService as any).parseCommitsWithStats;
      const commits = parseMethod(mockOutput);

      expect(commits).toHaveLength(2);

      // First commit
      expect(commits[0].hash).toBe("abc1234");
      expect(commits[0].author).toBe("John Doe");
      expect(commits[0].email).toBe("john@example.com");
      expect(commits[0].message).toBe("Initial commit");
      expect(commits[0].filesChanged).toHaveLength(2);
      expect(commits[0].filesChanged![0]).toEqual({
        file: "src/index.ts",
        added: 10,
        deleted: 5,
      });

      // Second commit
      expect(commits[1].hash).toBe("def5678");
      expect(commits[1].author).toBe("Jane Smith");
      expect(commits[1].filesChanged).toHaveLength(2);
    });
  });

  describe("generateStats", () => {
    it("should generate correct statistics from commits", () => {
      const mockCommits: Commit[] = [
        {
          hash: "abc1234",
          shortHash: "abc1234",
          author: "John Doe",
          email: "john@example.com",
          date: new Date("2025-09-30T10:00:00Z"),
          message: "First commit",
          filesChanged: [
            { file: "src/index.ts", added: 10, deleted: 2 },
            { file: "src/utils.ts", added: 5, deleted: 0 },
          ],
        },
        {
          hash: "def5678",
          shortHash: "def5678",
          author: "John Doe",
          email: "john@example.com",
          date: new Date("2025-09-30T11:00:00Z"),
          message: "Second commit",
          filesChanged: [
            { file: "src/index.ts", added: 3, deleted: 1 },
            { file: "README.md", added: 20, deleted: 0 },
          ],
        },
        {
          hash: "ghi9012",
          shortHash: "ghi9012",
          author: "Jane Smith",
          email: "jane@example.com",
          date: new Date("2025-09-30T12:00:00Z"),
          message: "Third commit",
          filesChanged: [{ file: "src/feature.ts", added: 15, deleted: 5 }],
        },
      ];

      const stats = GitService.generateStats(mockCommits);

      // Check totals
      expect(stats.totalCommits).toBe(3);
      expect(stats.totalFiles).toBe(4); // index.ts, utils.ts, README.md, feature.ts
      expect(stats.totalLinesAdded).toBe(53); // 10+5+3+20+15
      expect(stats.totalLinesDeleted).toBe(8); // 2+0+1+0+5

      // Check author stats
      expect(stats.authorStats).toHaveLength(2);

      const johnStats = stats.authorStats.find((a) => a.author === "John Doe");
      expect(johnStats).toBeDefined();
      expect(johnStats!.commits).toBe(2);
      expect(johnStats!.filesChanged).toBe(3); // index.ts, utils.ts, README.md (unique files)
      expect(johnStats!.linesAdded).toBe(38); // 10+5+3+20
      expect(johnStats!.linesDeleted).toBe(3); // 2+0+1+0

      const janeStats = stats.authorStats.find(
        (a) => a.author === "Jane Smith"
      );
      expect(janeStats).toBeDefined();
      expect(janeStats!.commits).toBe(1);
      expect(janeStats!.linesAdded).toBe(15);
      expect(janeStats!.linesDeleted).toBe(5);

      // Check file stats
      expect(stats.fileStats).toHaveLength(4);

      const indexFileStats = stats.fileStats.find(
        (f) => f.file === "src/index.ts"
      );
      expect(indexFileStats).toBeDefined();
      expect(indexFileStats!.commits).toBe(2); // Modified in 2 commits
      expect(indexFileStats!.linesAdded).toBe(13); // 10+3
      expect(indexFileStats!.linesDeleted).toBe(3); // 2+1
    });

    it("should handle commits without file changes", () => {
      const mockCommits: Commit[] = [
        {
          hash: "abc1234",
          shortHash: "abc1234",
          author: "John Doe",
          email: "john@example.com",
          date: new Date("2025-09-30T10:00:00Z"),
          message: "Empty commit",
        },
      ];

      const stats = GitService.generateStats(mockCommits);

      expect(stats.totalCommits).toBe(1);
      expect(stats.totalFiles).toBe(0);
      expect(stats.totalLinesAdded).toBe(0);
      expect(stats.totalLinesDeleted).toBe(0);
      expect(stats.authorStats[0].commits).toBe(1);
      expect(stats.authorStats[0].filesChanged).toBe(0);
    });
  });

  describe("executeGitCommand", () => {
    it("should handle successful git command execution", async () => {
      const { spawn } = await import("child_process");
      const mockSpawn = spawn as any;

      const mockProcess = {
        stdout: { on: vi.fn() },
        stderr: { on: vi.fn() },
        on: vi.fn(),
      };

      mockSpawn.mockReturnValue(mockProcess);

      // Simulate successful execution
      setTimeout(() => {
        const stdoutCallback = mockProcess.stdout.on.mock.calls.find(
          (call) => call[0] === "data"
        )[1];
        stdoutCallback("test output\n");

        const closeCallback = mockProcess.on.mock.calls.find(
          (call) => call[0] === "close"
        )[1];
        closeCallback(0);
      }, 0);

      const executeMethod = (GitService as any).executeGitCommand;
      const result = await executeMethod(["status"], "/test/path");

      expect(result).toBe("test output");
      expect(mockSpawn).toHaveBeenCalledWith("git", ["status"], {
        cwd: "/test/path",
        stdio: ["pipe", "pipe", "pipe"],
      });
    });

    it("should handle git command errors", async () => {
      const { spawn } = await import("child_process");
      const mockSpawn = spawn as any;

      const mockProcess = {
        stdout: { on: vi.fn() },
        stderr: { on: vi.fn() },
        on: vi.fn(),
      };

      mockSpawn.mockReturnValue(mockProcess);

      // Simulate error
      setTimeout(() => {
        const stderrCallback = mockProcess.stderr.on.mock.calls.find(
          (call) => call[0] === "data"
        )[1];
        stderrCallback("fatal: not a git repository\n");

        const closeCallback = mockProcess.on.mock.calls.find(
          (call) => call[0] === "close"
        )[1];
        closeCallback(1);
      }, 0);

      const executeMethod = (GitService as any).executeGitCommand;

      await expect(executeMethod(["status"], "/test/path")).rejects.toThrow(
        "Git command failed"
      );
    });
  });
});
