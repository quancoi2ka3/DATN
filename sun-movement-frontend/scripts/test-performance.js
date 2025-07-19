#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Bắt đầu test performance...\n');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Test functions
function testBuildPerformance() {
  log('📦 Testing build performance...', 'blue');
  
  const startTime = Date.now();
  try {
    execSync('npm run build', { stdio: 'pipe' });
    const buildTime = Date.now() - startTime;
    
    log(`✅ Build completed in ${buildTime}ms`, 'green');
    
    if (buildTime < 30000) {
      log('🎉 Build performance: Excellent (< 30s)', 'green');
    } else if (buildTime < 60000) {
      log('👍 Build performance: Good (30-60s)', 'yellow');
    } else {
      log('⚠️ Build performance: Needs improvement (> 60s)', 'red');
    }
    
    return buildTime;
  } catch (error) {
    log('❌ Build failed', 'red');
    return null;
  }
}

function testBundleSize() {
  log('\n📊 Analyzing bundle size...', 'blue');
  
  try {
    // Check if .next directory exists
    const nextDir = path.join(process.cwd(), '.next');
    if (!fs.existsSync(nextDir)) {
      log('❌ Build directory not found. Run npm run build first.', 'red');
      return null;
    }
    
    // Analyze static files
    const staticDir = path.join(nextDir, 'static');
    let totalSize = 0;
    let fileCount = 0;
    
    if (fs.existsSync(staticDir)) {
      const files = fs.readdirSync(staticDir);
      files.forEach(file => {
        const filePath = path.join(staticDir, file);
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
          totalSize += stats.size;
          fileCount++;
        }
      });
    }
    
    const sizeInMB = (totalSize / 1024 / 1024).toFixed(2);
    log(`📁 Bundle size: ${sizeInMB}MB (${fileCount} files)`, 'blue');
    
    if (totalSize < 5 * 1024 * 1024) { // < 5MB
      log('🎉 Bundle size: Excellent (< 5MB)', 'green');
    } else if (totalSize < 10 * 1024 * 1024) { // < 10MB
      log('👍 Bundle size: Good (5-10MB)', 'yellow');
    } else {
      log('⚠️ Bundle size: Needs optimization (> 10MB)', 'red');
    }
    
    return totalSize;
  } catch (error) {
    log('❌ Bundle analysis failed', 'red');
    return null;
  }
}

function testLighthouse() {
  log('\n🔍 Testing Lighthouse performance...', 'blue');
  
  try {
    // Check if lighthouse is installed
    execSync('lighthouse --version', { stdio: 'pipe' });
    
    log('Running Lighthouse audit...', 'blue');
    const result = execSync('lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-report.json --only-categories=performance', { 
      stdio: 'pipe',
      timeout: 60000 // 60 seconds timeout
    });
    
    if (fs.existsSync('./lighthouse-report.json')) {
      const report = JSON.parse(fs.readFileSync('./lighthouse-report.json', 'utf8'));
      const score = report.categories.performance.score * 100;
      
      log(`📊 Lighthouse Performance Score: ${score.toFixed(0)}/100`, 'blue');
      
      if (score >= 90) {
        log('🎉 Performance: Excellent (90+)', 'green');
      } else if (score >= 70) {
        log('👍 Performance: Good (70-89)', 'yellow');
      } else {
        log('⚠️ Performance: Needs improvement (< 70)', 'red');
      }
      
      return score;
    }
  } catch (error) {
    log('❌ Lighthouse test failed. Make sure lighthouse is installed and server is running.', 'red');
    log('Install lighthouse: npm install -g lighthouse', 'yellow');
    return null;
  }
}

function generateReport(buildTime, bundleSize, lighthouseScore) {
  log('\n📋 Generating performance report...', 'blue');
  
  const report = {
    timestamp: new Date().toISOString(),
    buildTime: buildTime,
    bundleSize: bundleSize,
    lighthouseScore: lighthouseScore,
    recommendations: []
  };
  
  // Generate recommendations
  if (buildTime && buildTime > 30000) {
    report.recommendations.push('Optimize build time by reducing dependencies or improving webpack configuration');
  }
  
  if (bundleSize && bundleSize > 5 * 1024 * 1024) {
    report.recommendations.push('Reduce bundle size by implementing better code splitting and tree shaking');
  }
  
  if (lighthouseScore && lighthouseScore < 90) {
    report.recommendations.push('Improve Lighthouse score by optimizing images, reducing unused CSS/JS, and implementing lazy loading');
  }
  
  // Save report
  fs.writeFileSync('./performance-test-report.json', JSON.stringify(report, null, 2));
  log('✅ Performance report saved to performance-test-report.json', 'green');
  
  // Display summary
  log('\n📊 Performance Test Summary:', 'bold');
  log(`Build Time: ${buildTime ? buildTime + 'ms' : 'N/A'}`, buildTime && buildTime < 30000 ? 'green' : 'yellow');
  log(`Bundle Size: ${bundleSize ? (bundleSize / 1024 / 1024).toFixed(2) + 'MB' : 'N/A'}`, bundleSize && bundleSize < 5 * 1024 * 1024 ? 'green' : 'yellow');
  log(`Lighthouse Score: ${lighthouseScore ? lighthouseScore.toFixed(0) + '/100' : 'N/A'}`, lighthouseScore && lighthouseScore >= 90 ? 'green' : 'yellow');
  
  if (report.recommendations.length > 0) {
    log('\n💡 Recommendations:', 'bold');
    report.recommendations.forEach((rec, index) => {
      log(`${index + 1}. ${rec}`, 'yellow');
    });
  } else {
    log('\n🎉 All performance metrics are excellent!', 'green');
  }
}

// Main execution
async function main() {
  log('🚀 Sun Movement Performance Test Suite', 'bold');
  log('=====================================\n', 'blue');
  
  const buildTime = testBuildPerformance();
  const bundleSize = testBundleSize();
  const lighthouseScore = testLighthouse();
  
  generateReport(buildTime, bundleSize, lighthouseScore);
  
  log('\n✅ Performance test completed!', 'green');
}

// Run the test
if (require.main === module) {
  main().catch(error => {
    log(`❌ Test failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { testBuildPerformance, testBundleSize, testLighthouse }; 