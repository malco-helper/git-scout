# Git Scout Action - Usage Guide

## 🎯 Hybrid Approach: Smart Token Management

Git Scout Action uses a **Hybrid Approach** for token management:
- ✅ **Auto-injection** - Token automatically provided by GitHub when available
- ✅ **Smart validation** - Clear errors when token is needed but missing
- ✅ **Flexible** - Works with or without token depending on use case
- ✅ **Fail-safe** - Never silent failures

## 📋 When Do You Need a Token?

| Use Case | Token Required | Reason |
|----------|----------------|--------|
| Post PR comments | ✅ Yes | Need GitHub API to create/update comments |
| Create issues | ✅ Yes | Need GitHub API to create issues |
| Local analysis only | ❌ No | Only reading local git history |
| Export JSON | ❌ No | No GitHub API interaction |
| Quality gate (display only) | ❌ No | Can calculate without posting |
| Quality gate (post results) | ✅ Yes | Need to post results to PR |

## 🚀 Usage Examples

### Example 1: Full Featured (With Token)

**Use Case**: Post PR comments with quality gates

```yaml
name: PR Analytics
on: [pull_request]

permissions:
  contents: read
  pull-requests: write  # Required!

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - uses: malcohelper/git-scout-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}  # Auto-provided
          post-comment: true
          quality-gate: true
```

### Example 2: Local Analysis (No Token)

**Use Case**: Analyze without posting to PR

```yaml
name: Local Analysis
on: [push]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - uses: malcohelper/git-scout-action@v1
        with:
          # No token needed
          command: 'stats --since 30d'
          post-comment: false
```

### Example 3: Strict Quality Gate

**Use Case**: Block PRs that don't meet quality standards

```yaml
name: Quality Gate
on: [pull_request]

permissions:
  contents: read
  pull-requests: write

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - uses: malcohelper/git-scout-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          quality-gate: true
          quality-threshold: 80
          fail-on-quality: true  # Block if < 80
```

### Example 4: Export Data Only

**Use Case**: Export JSON for external processing

```yaml
name: Export Analytics
on: [push]

jobs:
  export:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - uses: malcohelper/git-scout-action@v1
        id: scout
        with:
          command: 'stats --since 7d --json'
          post-comment: false
      
      - name: Send to External System
        run: |
          echo '${{ steps.scout.outputs.stats-json }}' | curl -X POST https://api.example.com/analytics
```

## ⚠️ Common Errors & Solutions

### Error 1: Token Required

```
❌ Configuration Error
You enabled post-comment but no GitHub token was provided.
```

**Solution**:
```yaml
# Add token
with:
  github-token: ${{ secrets.GITHUB_TOKEN }}
```

Or:
```yaml
# Disable comments
with:
  post-comment: false
```

### Error 2: Permission Denied

```
Error: Resource not accessible by integration
```

**Solution**: Add permissions to workflow

```yaml
permissions:
  contents: read
  pull-requests: write  # This is required!
```

### Error 3: Token Not Auto-Injected

```
ℹ️ Running in local-only mode (no GitHub API access)
```

**Solution**: Explicitly provide token

```yaml
with:
  github-token: ${{ secrets.GITHUB_TOKEN }}
```

## 🔧 Configuration Matrix

| Configuration | Token | post-comment | quality-gate | Result |
|---------------|-------|--------------|--------------|--------|
| **Full Featured** | ✅ | true | true | Posts to PR with quality gate |
| **Read-only** | ✅ | false | true | Quality check, no posting |
| **Local Analysis** | ❌ | false | false | Local git analysis only |
| **Invalid** | ❌ | true | - | ❌ Error: token required |

## 💡 Best Practices

### 1. **Always Use Fetch Depth 0**

```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0  # Critical for accurate analysis!
```

Without full history, analysis will be incomplete.

### 2. **Set Appropriate Permissions**

```yaml
permissions:
  contents: read
  pull-requests: write  # Only if posting comments
```

### 3. **Use Quality Gates Wisely**

```yaml
# Warning mode (recommended for new projects)
quality-gate: true
fail-on-quality: false

# Strict mode (for mature projects)
quality-gate: true
fail-on-quality: true
quality-threshold: 80
```

### 4. **Handle Failures Gracefully**

```yaml
- uses: malcohelper/git-scout-action@v1
  continue-on-error: true  # Don't block entire workflow
  with:
    fail-on-quality: false
```

## 🎓 Advanced Patterns

### Pattern 1: Multi-Stage Quality Checks

```yaml
jobs:
  quick-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Quick Check
        uses: malcohelper/git-scout-action@v1
        with:
          command: 'today --json'
          quality-threshold: 60  # Lower threshold for quick check
          fail-on-quality: true
  
  deep-analysis:
    needs: quick-check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Deep Analysis
        uses: malcohelper/git-scout-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          command: 'stats --since 30d'
          post-comment: true
```

### Pattern 2: Conditional Posting

```yaml
- uses: malcohelper/git-scout-action@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    post-comment: ${{ github.event_name == 'pull_request' }}
    # Only post on PRs, not pushes
```

### Pattern 3: Custom Thresholds per Branch

```yaml
- uses: malcohelper/git-scout-action@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    quality-threshold: ${{ github.base_ref == 'main' && 80 || 70 }}
    # Higher threshold for main branch
```

## 🔍 Debugging

### Enable Verbose Logging

The action provides detailed logs by default. Check:

1. **Configuration Validation** step
2. **Analysis** step output
3. **Quality Score Calculation** step
4. **Summary** step (always runs)

### Check Token Availability

```yaml
- name: Debug Token
  run: |
    if [ -n "${{ secrets.GITHUB_TOKEN }}" ]; then
      echo "Token is available"
    else
      echo "Token is NOT available"
    fi
```

## 📞 Support

- 📖 [Full Documentation](https://github.com/malcohelper/git-scout)
- 🐛 [Report Issues](https://github.com/malcohelper/git-scout/issues)
- 💬 [Discussions](https://github.com/malcohelper/git-scout/discussions)
- 🗺️ [Roadmap](https://github.com/malcohelper/git-scout/blob/main/ROADMAP.md)
