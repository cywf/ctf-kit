# Contributing to CTF-Kit

Thank you for your interest in contributing to CTF-Kit! This document provides guidelines and instructions for contributing to this repository.

## Table of Contents
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Branch Naming Convention](#branch-naming-convention)
- [Contribution Guidelines](#contribution-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code of Conduct](#code-of-conduct)

## Getting Started

1. **Fork the Repository**: Click the "Fork" button at the top right of the repository page.
2. **Clone Your Fork**: 
   ```bash
   git clone https://github.com/YOUR_USERNAME/ctf-kit.git
   cd ctf-kit
   ```
3. **Set Up Remote**:
   ```bash
   git remote add upstream https://github.com/cywf/ctf-kit.git
   ```

## How to Contribute

### Types of Contributions

We welcome various types of contributions:

1. **CTF Event Documentation**: Create a branch for each CTF you participate in and document your solutions
2. **Scripts and Tools**: Add new scripts or improve existing ones
3. **Documentation**: Improve guides, add new writeups, or fix typos
4. **Bug Fixes**: Fix issues in existing scripts or documentation
5. **Feature Requests**: Suggest new features through GitHub Issues

## Branch Naming Convention

We use a **branch-per-CTF** strategy to track progress across different events:

### For CTF Events
Name your branch after the CTF event you're participating in:
```bash
git checkout -b metactf-august2024
git checkout -b hackthebox-season3
git checkout -b picoctf-2024
```

### For Features and Bug Fixes
For non-CTF contributions:
```bash
git checkout -b feature/add-new-enumeration-script
git checkout -b fix/nmap-script-bug
git checkout -b docs/improve-readme
```

## Contribution Guidelines

### Scripts

When contributing scripts:

1. **Documentation**: Include clear comments explaining what the script does
2. **Usage Instructions**: Add a header comment with usage examples
3. **Error Handling**: Include proper error handling and user feedback
4. **Dependencies**: Document all required tools and libraries
5. **Location**: Place scripts in the appropriate subdirectory:
   - Networking scripts → `scripts/Networking/`
   - Enumeration scripts → `scripts/Enumeration/`
6. **Permissions**: Ensure scripts are executable (`chmod +x script.sh`)

Example script header:
```bash
#!/bin/bash
#############################################################################
# Script Name
#############################################################################
# Purpose: Brief description of what the script does
# Usage: ./script_name.sh <arguments>
# Example: ./script_name.sh 192.168.1.0/24
# Dependencies: tool1, tool2, tool3
#############################################################################
```

### Documentation

When contributing documentation:

1. **Formatting**: Use proper Markdown formatting
2. **Clarity**: Write clear, concise explanations
3. **Examples**: Include practical examples where applicable
4. **Structure**: Follow the existing documentation structure
5. **Links**: Ensure all links work correctly

### CTF Writeups

When documenting CTF solutions:

1. **Respect Embargo Periods**: Don't publish solutions until the CTF organizers allow it
2. **Organization**: Create a clear folder structure:
   ```
   ctf-name-2024/
   ├── README.md
   ├── challenge1/
   │   ├── solution.md
   │   └── exploit.py
   └── challenge2/
       └── solution.md
   ```
3. **Content**: Include:
   - Challenge description
   - Approach and methodology
   - Step-by-step solution
   - Tools used
   - Lessons learned

## Pull Request Process

1. **Update Your Fork**:
   ```bash
   git fetch upstream
   git merge upstream/main
   ```

2. **Make Your Changes**: Create commits with clear, descriptive messages
   ```bash
   git add .
   git commit -m "Add web enumeration script for directory traversal"
   ```

3. **Push to Your Fork**:
   ```bash
   git push origin your-branch-name
   ```

4. **Create Pull Request**:
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Provide a clear title and description
   - Reference any related issues

5. **PR Description Should Include**:
   - Summary of changes
   - Type of contribution (script, docs, bugfix, etc.)
   - Testing performed
   - Any breaking changes

6. **Review Process**:
   - Maintainers will review your PR
   - Address any requested changes
   - Once approved, your PR will be merged

## Code Quality

### For Scripts
- Test your scripts before submitting
- Use shellcheck for bash scripts
- Handle errors gracefully
- Provide meaningful output messages

### For Documentation
- Check spelling and grammar
- Verify all commands work as documented
- Ensure proper formatting

## Testing

Before submitting:

1. **Scripts**: Test on a safe, isolated environment
2. **Documentation**: Verify all links and code examples
3. **Compatibility**: Ensure scripts work on major Linux distributions

## Questions?

If you have questions:
- Open an issue for general questions
- Tag maintainers in your PR for specific feedback
- Check existing issues and PRs for similar discussions

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Share knowledge openly
- Follow responsible disclosure practices

### Responsible Usage

- Only use tools and scripts in authorized environments
- Never use these tools for unauthorized access
- Respect CTF rules and embargo periods
- Follow all applicable laws and regulations

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## Recognition

Contributors will be recognized in the repository. Significant contributions may be highlighted in release notes.

---

Thank you for contributing to CTF-Kit! Your contributions help the entire community learn and grow.
