#!/usr/bin/env node

/**
 * SmartMenu Layout Governance Checker
 * Verifies PR compliance with layout architecture rules
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const FORBIDDEN_PATTERNS = [
    {
        pattern: /100vh/g,
        exclude: /sizes=/,
        message: '❌ Forbidden: Use 100dvh instead of 100vh',
        fix: 'Replace with 100dvh for proper mobile viewport handling'
    },
    {
        pattern: /100vw/g,
        exclude: /sizes=/,
        message: '❌ Forbidden: width: 100vw causes horizontal scroll',
        fix: 'Use max-width with responsive padding instead'
    },
    {
        pattern: /position:\s*fixed/g,
        message: '❌ Forbidden: position: fixed in UI components',
        fix: 'Use AppShell for fixed positioning, not individual components'
    },
    {
        pattern: /min-width:\s*\d+px/g,
        message: '❌ Forbidden: min-width in px on flexible components',
        fix: 'Use fluid sizing or remove min-width'
    }
];

function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];

    FORBIDDEN_PATTERNS.forEach(({ pattern, exclude, message, fix }) => {
        const matches = content.match(pattern);
        if (matches) {
            // Filter out matches that should be excluded
            let validMatches = matches;
            if (exclude) {
                const lines = content.split('\n');
                validMatches = matches.filter(match => {
                    // Find the line containing this match
                    const lineIndex = lines.findIndex(line => line.includes(match));
                    if (lineIndex === -1) return true; // Keep if can't find line
                    const line = lines[lineIndex];
                    return !exclude.test(line);
                });
            }

            if (validMatches.length > 0) {
                issues.push({
                    file: filePath,
                    message,
                    fix,
                    occurrences: validMatches.length
                });
            }
        }
    });

    return issues;
}

function walkDirectory(dir, callback) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
            walkDirectory(filePath, callback);
        } else if ((file.endsWith('.tsx') || file.endsWith('.ts')) && !file.includes('tailwind-debug')) {
            callback(filePath);
        }
    }
}

function main() {
    console.log('🔍 SmartMenu Layout Governance Checker\n');

    const issues = [];
    const dirs = ['apps/web', 'apps/consumer', 'packages/ui'];

    dirs.forEach(dir => {
        if (fs.existsSync(dir)) {
            walkDirectory(dir, (filePath) => {
                const fileIssues = checkFile(filePath);
                issues.push(...fileIssues);
            });
        }
    });

    if (issues.length === 0) {
        console.log('✅ No layout governance violations found!');
        process.exit(0);
    }

    console.log(`❌ Found ${issues.length} layout governance violations:\n`);

    issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.message}`);
        console.log(`   File: ${issue.file}`);
        console.log(`   Fix: ${issue.fix}`);
        console.log(`   Occurrences: ${issue.occurrences}\n`);
    });

    console.log('💡 Run this checker before creating PRs to ensure compliance.');
    process.exit(1);
}

if (require.main === module) {
    main();
}