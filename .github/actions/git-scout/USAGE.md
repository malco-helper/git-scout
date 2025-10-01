# Git Scout Action - Usage Guide

## 🎯 Overview

Git Scout Action automates repository analytics and sends formatted reports to Slack. Perfect for weekly team updates, monthly retrospectives, or on-demand analysis.

## 📋 When to Use This Action

| Use Case | Description |
|----------|-------------|
| Weekly Team Reports | Scheduled analytics sent to Slack every week |
| Monthly Summaries | Comprehensive monthly activity reports |
| On-Demand Analysis | Trigger manual analysis via workflow_dispatch |
| Multi-Repository Tracking | Analyze any Git repository automatically |

## 🚀 Quick Start

### Basic Weekly Report

```yaml
name: Weekly Analytics
on:
  schedule:
    - cron: '0 9 * * MON'  # Every Monday at 9 AM

jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Important: Get full history
      
      - uses: malcohelper/git-scout/.github/actions/git-scout@main
        with:
          slack-webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## 🎯 Configuration Options

### Required Inputs

| Input | Description | Example |
|-------|-------------|---------|
| `slack-webhook-url` | Slack webhook URL for sending reports | `${{ secrets.SLACK_WEBHOOK_URL }}` |

### Optional Inputs

| Input | Description | Default |
|-------|-------------|---------|
| `slack-channel` | Override webhook's default channel | (webhook default) |
| `slack-username` | Bot username in Slack | `Git Scout Bot` |
| `report-title` | Title for the report | `Weekly Analytics Report` |
| `send-to-slack` | Enable/disable Slack sending | `true` |

## 📝 Complete Examples

### Example 1: Weekly Team Report

**Use Case**: Send team activity report every Monday morning

```yaml
name: Weekly Team Report
on:
  schedule:
    - cron: '0 9 * * MON'  # 9 AM every Monday
  workflow_dispatch:  # Allow manual trigger

jobs:
  weekly-report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - uses: malcohelper/git-scout/.github/actions/git-scout@main
        with:
          slack-webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
          slack-channel: 'team-updates'
          slack-username: 'Git Scout Bot'
          report-title: 'Weekly Team Activity'
```

### Example 2: Monthly Summary

**Use Case**: Comprehensive monthly report on the 1st of each month

```yaml
name: Monthly Summary
on:
  schedule:
    - cron: '0 10 1 * *'  # 10 AM on 1st of each month

jobs:
  monthly-report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - uses: malcohelper/git-scout/.github/actions/git-scout@main
        with:
          slack-webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
          slack-channel: 'monthly-reports'
          report-title: 'Monthly Activity Summary'
```

### Example 3: Multi-Channel Reports

**Use Case**: Send different reports to different channels

```yaml
name: Multi-Channel Reports
on:
  schedule:
    - cron: '0 9 * * MON'

jobs:
  dev-team-report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - uses: malcohelper/git-scout/.github/actions/git-scout@main
        with:
          slack-webhook-url: ${{ secrets.SLACK_WEBHOOK_DEV }}
          slack-channel: 'dev-team'
          report-title: 'Dev Team Weekly'

  management-report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - uses: malcohelper/git-scout/.github/actions/git-scout@main
        with:
          slack-webhook-url: ${{ secrets.SLACK_WEBHOOK_MGMT }}
          slack-channel: 'management'
          report-title: 'Weekly Executive Summary'
```

### Example 4: Analysis Only (No Slack)

**Use Case**: Run analysis without sending to Slack

```yaml
name: Analysis Only
on: [push]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - uses: malcohelper/git-scout/.github/actions/git-scout@main
        with:
          slack-webhook-url: 'https://dummy.url'
          send-to-slack: false
```

## 📊 Report Format

### Slack Message Structure

The action sends a beautifully formatted Slack message with:

**Header Section**
- 📊 Report title
- Repository name
- Timestamp

**Key Metrics Section**
- Total commits
- Files changed
- Active contributors
- Lines added/deleted

**Top Contributors Section**
- Top 3 contributors by commit count
- Commit counts for each

**Action Link**
- Link to the GitHub Actions run

### Example Output

```
📊 Weekly Analytics Report

Repository: your-org/your-repo
Date: 2025-10-01 09:00 UTC

━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Key Metrics

Commits            19
Files Changed      23
Contributors       3
Lines Changed      +473 / -300

━━━━━━━━━━━━━━━━━━━━━━━━━━
👥 Top Contributors

• Alice: 12 commits
• Bob: 5 commits  
• Charlie: 2 commits

View Full Report
```

## 🔧 Setup Guide

### Step 1: Create Slack Webhook

1. Go to https://api.slack.com/messaging/webhooks
2. Create a new webhook for your workspace
3. Choose the default channel
4. Copy the webhook URL

### Step 2: Add Secret to GitHub

1. Go to your repository Settings
2. Navigate to Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `SLACK_WEBHOOK_URL`
5. Value: Your webhook URL
6. Click "Add secret"

### Step 3: Create Workflow File

Create `.github/workflows/weekly-report.yml`:

```yaml
name: Weekly Analytics
on:
  schedule:
    - cron: '0 9 * * MON'
  workflow_dispatch:

jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - uses: malcohelper/git-scout/.github/actions/git-scout@main
        with:
          slack-webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Step 4: Test It

1. Go to Actions tab in your repository
2. Select "Weekly Analytics" workflow
3. Click "Run workflow"
4. Check your Slack channel!

## ⚠️ Troubleshooting

### Error: Analysis failed with exit code: 1

**Possible Causes:**
- No git history (missing `fetch-depth: 0`)
- No commits in the last 7 days
- Repository not properly checked out

**Solution:**
```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0  # This is required!
```

### Error: Failed to send to Slack

**Possible Causes:**
- Invalid webhook URL
- Webhook was revoked or expired
- Network issues

**Solution:**
- Verify webhook URL in Slack settings
- Regenerate webhook if needed
- Update `SLACK_WEBHOOK_URL` secret

### Warning: No configuration found

**Not actually an error!** The action auto-creates configuration. If you see this with successful analysis, everything is working correctly.

### Error: Configuration Error - No webhook URL

**Cause:** Slack webhook URL not provided

**Solution:**
```yaml
with:
  slack-webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## 💡 Best Practices

### 1. Always Use Full Git History

```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0  # Critical!
```

Without full history, analysis will be limited.

### 2. Use Meaningful Report Titles

```yaml
with:
  report-title: 'Frontend Team - Weekly Activity'
```

Helps distinguish multiple reports.

### 3. Schedule During Work Hours

```yaml
on:
  schedule:
    - cron: '0 9 * * MON'  # 9 AM Monday (UTC)
```

Adjust for your timezone.

### 4. Enable Manual Triggers

```yaml
on:
  schedule:
    - cron: '0 9 * * MON'
  workflow_dispatch:  # Allows manual runs
```

Useful for testing and on-demand reports.

### 5. Use Specific Channels

```yaml
with:
  slack-channel: 'team-updates'  # Override default
```

Send to specific channels as needed.

## 🎓 Advanced Patterns

### Pattern 1: Different Schedules

```yaml
on:
  schedule:
    - cron: '0 9 * * MON'    # Weekly
    - cron: '0 10 1 * *'     # Monthly (1st of month)
```

### Pattern 2: Conditional Sending

```yaml
- uses: malcohelper/git-scout/.github/actions/git-scout@main
  if: github.ref == 'refs/heads/main'  # Only on main branch
  with:
    slack-webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Pattern 3: Multiple Repositories

Set up the same workflow in multiple repos, all reporting to the same Slack channel for organization-wide visibility.

## 🔍 Debugging

### Enable Detailed Logs

The action provides comprehensive logs:

1. **Configuration Validation** - Check inputs
2. **Config Setup** - Repository configuration
3. **Analysis** - Git Scout execution
4. **Slack Sending** - Message delivery
5. **Summary** - Final status (always runs)

Check each step's output in the Actions tab.

### Test Webhook Manually

```bash
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"Test message"}' \
  YOUR_WEBHOOK_URL
```

### Verify Repository Access

```yaml
- name: Test Git Access
  run: |
    git log --since="7 days ago" --oneline
    git log --stat --since="7 days ago"
```

## 📞 Support

- 📖 [Git Scout Documentation](https://github.com/malcohelper/git-scout)
- 🐛 [Report Issues](https://github.com/malcohelper/git-scout/issues)
- 💬 [Discussions](https://github.com/malcohelper/git-scout/discussions)
- 🗺️ [Roadmap](https://github.com/malcohelper/git-scout/blob/main/ROADMAP.md)

## 🚀 What's Next?

See our [Roadmap](https://github.com/malcohelper/git-scout/blob/main/ROADMAP.md) for upcoming features:

- GitLab CI/CD integration
- Multiple messaging platforms (Discord, Teams)
- Custom report templates
- Advanced analytics and trends
