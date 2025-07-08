#!/usr/bin/env node

/**
 * React Performance Scanner
 * Scans for common patterns that can cause infinite re-renders and performance issues
 */

const fs = require('fs');
const path = require('path');

class ReactPerformanceScanner {
  constructor() {
    this.issues = [];
    this.scannedFiles = 0;
  }

  scanDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        this.scanDirectory(fullPath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        this.scanFile(fullPath);
      }
    }
  }

  scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      this.scannedFiles++;
      
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        const lineNumber = index + 1;
        
        // Check for useEffect with callback dependencies
        if (this.hasUseEffectWithCallbackDependency(line)) {
          this.issues.push({
            type: 'useEffect-callback-dependency',
            file: filePath,
            line: lineNumber,
            code: line.trim(),
            severity: 'high',
            description: 'useEffect includes callback function in dependency array'
          });
        }
        
        // Check for inline functions in JSX
        if (this.hasInlineFunction(line)) {
          this.issues.push({
            type: 'inline-function',
            file: filePath,
            line: lineNumber,
            code: line.trim(),
            severity: 'medium',
            description: 'Inline function in JSX props can cause unnecessary re-renders'
          });
        }
        
        // Check for missing dependency array
        if (this.hasMissingDependencyArray(line, lines[index + 1])) {
          this.issues.push({
            type: 'missing-dependency-array',
            file: filePath,
            line: lineNumber,
            code: line.trim(),
            severity: 'medium',
            description: 'useEffect without dependency array runs on every render'
          });
        }
        
        // Check for useState in loops or conditional blocks
        if (this.hasConditionalState(line)) {
          this.issues.push({
            type: 'conditional-state',
            file: filePath,
            line: lineNumber,
            code: line.trim(),
            severity: 'high',
            description: 'useState inside conditional blocks violates rules of hooks'
          });
        }
      });
      
    } catch (error) {
      console.error(`Error scanning ${filePath}:`, error.message);
    }
  }

  hasUseEffectWithCallbackDependency(line) {
    // Look for useEffect with dependencies that include 'on' prefixed functions
    return /useEffect\s*\([\s\S]*,\s*\[[\s\S]*on[A-Z]\w*[\s\S]*\]/.test(line);
  }

  hasInlineFunction(line) {
    // Look for inline arrow functions in JSX
    return /(?:onClick|onChange|onSubmit|on[A-Z]\w*)\s*=\s*\{\s*\(\s*\)\s*=>/.test(line);
  }

  hasMissingDependencyArray(line, nextLine) {
    // Check if useEffect doesn't have dependency array
    if (line.includes('useEffect')) {
      const combined = line + (nextLine || '');
      return !combined.includes('[') || combined.includes('});');
    }
    return false;
  }

  hasConditionalState(line) {
    // Check for useState inside if statements or loops
    return /^\s*(if|for|while)[\s\S]*useState/.test(line);
  }

  generateReport() {
    console.log('\n🔍 React Performance Scan Report');
    console.log('==================================');
    console.log(`📁 Files scanned: ${this.scannedFiles}`);
    console.log(`⚠️  Issues found: ${this.issues.length}\n`);

    if (this.issues.length === 0) {
      console.log('✅ No performance issues detected!');
      return;
    }

    // Group issues by severity
    const groupedIssues = this.issues.reduce((acc, issue) => {
      acc[issue.severity] = acc[issue.severity] || [];
      acc[issue.severity].push(issue);
      return acc;
    }, {});

    // High severity issues
    if (groupedIssues.high) {
      console.log('🚨 HIGH SEVERITY ISSUES:');
      groupedIssues.high.forEach(issue => {
        console.log(`   ${this.getRelativePath(issue.file)}:${issue.line}`);
        console.log(`   ${issue.description}`);
        console.log(`   Code: ${issue.code}`);
        console.log('');
      });
    }

    // Medium severity issues
    if (groupedIssues.medium) {
      console.log('⚠️  MEDIUM SEVERITY ISSUES:');
      groupedIssues.medium.forEach(issue => {
        console.log(`   ${this.getRelativePath(issue.file)}:${issue.line}`);
        console.log(`   ${issue.description}`);
        console.log(`   Code: ${issue.code}`);
        console.log('');
      });
    }

    // Recommendations
    console.log('💡 RECOMMENDATIONS:');
    console.log('   1. Use useCallback for stable function references');
    console.log('   2. Remove callback functions from useEffect dependencies');
    console.log('   3. Move inline functions outside JSX or use useCallback');
    console.log('   4. Always include dependency arrays in useEffect');
    console.log('   5. Follow rules of hooks - no hooks in loops/conditions');
  }

  getRelativePath(fullPath) {
    return fullPath.replace(process.cwd(), '.');
  }
}

// Run the scanner
const scanner = new ReactPerformanceScanner();
const targetDir = process.argv[2] || './src';

console.log(`🔍 Scanning ${targetDir} for React performance issues...`);
scanner.scanDirectory(targetDir);
scanner.generateReport();
