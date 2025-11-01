const fs = require('fs');
const path = require('path');

function getRelativePath(from, to) {
  const relativePath = path.relative(path.dirname(from), to);
  // Ensure the path starts with ./ or ../
  if (!relativePath.startsWith('.')) {
    return './' + relativePath;
  }
  return relativePath;
}

function convertImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Find all @/ imports
    const importRegex = /from\s+['"]@\/(.*?)['"]/g;
    const matches = [...content.matchAll(importRegex)];
    
    if (matches.length === 0) return false;
    
    console.log(`\nProcessing: ${filePath}`);
    
    matches.forEach(match => {
      const originalImport = match[0];
      const importPath = match[1];
      
      // Construct the absolute path to the imported file
      const frontendRoot = path.join(__dirname);
      const targetPath = path.join(frontendRoot, importPath);
      
      // Get relative path from current file to target
      const relativePath = getRelativePath(filePath, targetPath);
      
      // Convert backslashes to forward slashes for consistency
      const normalizedPath = relativePath.replace(/\\/g, '/');
      
      const newImport = `from '${normalizedPath}'`;
      
      console.log(`  ${originalImport} -> ${newImport}`);
      
      content = content.replace(originalImport, newImport);
      modified = true;
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  ✓ Updated`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function walkDirectory(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and .next directories
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        walkDirectory(filePath, fileList);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Main execution
const frontendRoot = __dirname;
console.log(`Starting import conversion in: ${frontendRoot}\n`);

const allFiles = walkDirectory(frontendRoot);
console.log(`Found ${allFiles.length} TypeScript files\n`);

let updatedCount = 0;
allFiles.forEach(file => {
  if (convertImportsInFile(file)) {
    updatedCount++;
  }
});

console.log(`\n✓ Conversion complete! Updated ${updatedCount} files.`);
