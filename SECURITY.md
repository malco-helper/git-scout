# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.0.x   | :white_check_mark: |

## Reporting a Vulnerability

The Git Scout team takes security bugs seriously. We appreciate your efforts to responsibly disclose your findings.

### How to Report a Security Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

1. **GitHub Security Advisories** (Preferred)

   - Go to the [Security tab](https://github.com/malcohelper/git-scout/security/advisories) of the repository
   - Click "Report a vulnerability"
   - Fill out the form with details

2. **Email**
   - Send an email to: **malcohelper@users.noreply.github.com**
   - Include the word "SECURITY" in the subject line
   - Provide a detailed description of the vulnerability

### What to Include in Your Report

To help us better understand and resolve the issue, please include:

- **Type of vulnerability** (e.g., XSS, CSRF, SQL injection, command injection, etc.)
- **Full paths of source file(s)** related to the vulnerability
- **Location of the affected source code** (tag/branch/commit or direct URL)
- **Step-by-step instructions to reproduce** the issue
- **Proof-of-concept or exploit code** (if possible)
- **Impact of the vulnerability** (what an attacker could do)
- **Suggested fix** (if you have one)

### Response Timeline

- **Initial Response**: Within 48 hours of receiving your report
- **Status Update**: Within 7 days with our assessment
- **Fix Release**: Varies depending on complexity, but typically within 30 days

### What to Expect

1. **Acknowledgment**: We'll confirm receipt of your vulnerability report
2. **Communication**: We'll keep you informed as we investigate and work on a fix
3. **Credit**: With your permission, we'll publicly acknowledge your contribution in the release notes
4. **Disclosure**: We'll coordinate with you on the disclosure timeline

## Security Best Practices for Users

When using Git Scout:

1. **Keep Updated**: Always use the latest version to get security patches
2. **Permissions**: Be cautious about granting file system access
3. **Configuration**: Protect your `~/.git-scout/config.json` file
4. **CI/CD Secrets**: Store Slack webhook URLs and other sensitive data in environment variables or secrets management systems
5. **Review Code**: When installing from source, review the code before running

## Known Security Considerations

- Git Scout requires read access to your Git repositories
- Configuration files may contain repository paths
- CI/CD integration may require webhook URLs (store securely)
- The tool executes Git commands on your local system

## Security Updates

Security updates will be announced via:

- GitHub Security Advisories
- Release notes in [CHANGELOG.md](CHANGELOG.md)
- GitHub Releases page

## Third-Party Dependencies

Git Scout uses several npm packages. We:

- Regularly audit dependencies for known vulnerabilities
- Keep dependencies up to date
- Run automated security scans via GitHub Dependabot

## Questions?

If you have questions about this security policy, please open a [GitHub Discussion](https://github.com/malcohelper/git-scout/discussions).

---

**Thank you for helping keep Git Scout and its users safe! 🔒**
