#!/usr/bin/env node

/**
 * Auto-fix common React performance issues
 */

const fs = require('fs');
const path = require('path');

class ReactPerformanceFixer {
  constructor() {
    this.fixedFiles = 0;
    this.totalFixes = 0;
  }

  processDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        this.processDirectory(fullPath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        this.fixFile(fullPath);
      }
    }
  }

  fixFile(filePath) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content;
      let fixCount = 0;

      // Fix 1: Add useCallback import if missing but inline functions are used
      if (this.hasInlineFunctions(content) && !content.includes('useCallback')) {
        content = this.addUseCallbackImport(content);
        fixCount++;
      }

      // Fix 2: Replace simple inline onClick functions with useCallback
      const inlineFixResult = this.fixSimpleInlineFunctions(content);
      content = inlineFixResult.content;
      fixCount += inlineFixResult.fixes;

      // Fix 3: Add empty dependency arrays to useEffect without dependencies
      const dependencyFixResult = this.fixMissingDependencyArrays(content);
      content = dependencyFixResult.content;
      fixCount += dependencyFixResult.fixes;

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        this.fixedFiles++;
        this.totalFixes += fixCount;
        console.log(`✅ Fixed ${fixCount} issues in ${this.getRelativePath(filePath)}`);
      }

    } catch (error) {
      console.error(`❌ Error fixing ${filePath}:`, error.message);
    }
  }

  hasInlineFunctions(content) {
    return /(?:onClick|onChange|onSubmit|on[A-Z]\w*)\s*=\s*\{\s*\(\s*\)\s*=>/.test(content);
  }

  addUseCallbackImport(content) {
    // If React import exists, modify it
    if (content.includes('import { ') && content.includes(' } from "react"')) {
      return content.replace(
        /import\s*{\s*([^}]+)\s*}\s*from\s*["']react["']/,
        (match, imports) => {
          if (!imports.includes('useCallback')) {
            return `import { ${imports}, useCallback } from "react"`;
          }
          return match;
        }
      );
    }
    
    // If no React import, add it
    if (!content.includes('from "react"') && !content.includes('from \'react\'')) {
      return `import { useCallback } from "react";\n${content}`;
    }
    
    return content;
  }

  fixSimpleInlineFunctions(content) {
    let fixes = 0;
    let newContent = content;

    // Pattern for simple state setters: onClick={() => setState(value)}
    const simpleSetterPattern = /onClick=\{\(\)\s*=>\s*set(\w+)\(([^}]+)\)\}/g;
    
    const matches = [...content.matchAll(simpleSetterPattern)];
    
    if (matches.length > 0) {
      // Add callbacks at the end of the component
      let callbacks = '\n  // Stable callbacks to prevent re-renders\n';
      
      matches.forEach(match => {
        const [fullMatch, stateName, value] = match;
        const callbackName = `handle${stateName}Change`;
        
        // Clean up the value (remove quotes if it's a simple boolean)
        let cleanValue = value.trim();
        if (cleanValue === '!show' + stateName) {
          cleanValue = `prev => !prev`;
        }
        
        callbacks += `  const ${callbackName} = useCallback(() => {\n`;
        callbacks += `    set${stateName}(${cleanValue});\n`;
        callbacks += `  }, []);\n\n`;
        
        // Replace the inline function
        newContent = newContent.replace(fullMatch, `onClick={${callbackName}}`);
        fixes++;
      });
      
      // Insert callbacks before the return statement
      newContent = newContent.replace(
        /(\s*return\s*\()/,
        `${callbacks}$1`
      );
    }

    return { content: newContent, fixes };
  }

  fixMissingDependencyArrays(content) {
    let fixes = 0;
    let newContent = content;

    // Fix useEffect without dependency arrays (but only simple cases)
    const useEffectPattern = /useEffect\(\(\)\s*=>\s*\{[^}]*\}\s*\);/g;
    
    newContent = newContent.replace(useEffectPattern, (match) => {
      if (!match.includes('[')) {
        fixes++;
        return match.replace(/\)\s*;/, ', []);');
      }
      return match;
    });

    return { content: newContent, fixes };
  }

  getRelativePath(fullPath) {
    return fullPath.replace(process.cwd(), '.');
  }

  generateReport() {
    console.log('\n🔧 Auto-Fix Report');
    console.log('==================');
    console.log(`📁 Files fixed: ${this.fixedFiles}`);
    console.log(`🛠️  Total fixes applied: ${this.totalFixes}`);
    
    if (this.totalFixes > 0) {
      console.log('\n✅ Auto-fixes completed! Please review the changes and test your application.');
      console.log('💡 Note: Some complex cases may still need manual review.');
    } else {
      console.log('\n✅ No auto-fixable issues found!');
    }
  }
}

// Run the fixer
const fixer = new ReactPerformanceFixer();
const targetDir = process.argv[2] || './src';

console.log(`🔧 Auto-fixing React performance issues in ${targetDir}...`);
fixer.processDirectory(targetDir);
fixer.generateReport();
