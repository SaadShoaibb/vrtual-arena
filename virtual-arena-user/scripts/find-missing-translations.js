const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

// Load translation files
const loadTranslations = async () => {
  try {
    const enPath = path.join(process.cwd(), 'src', 'messages', 'en.json');
    const frPath = path.join(process.cwd(), 'src', 'messages', 'fr.json');
    
    const enContent = await readFile(enPath, 'utf8');
    const frContent = await readFile(frPath, 'utf8');
    
    return {
      en: JSON.parse(enContent),
      fr: JSON.parse(frContent)
    };
  } catch (error) {
    console.error('Error loading translation files:', error);
    return { en: {}, fr: {} };
  }
};

// Flatten nested objects for easier comparison
const flattenObject = (obj, prefix = '') => {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? `${prefix}.` : '';
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenObject(obj[k], `${pre}${k}`));
    } else {
      acc[`${pre}${k}`] = obj[k];
    }
    return acc;
  }, {});
};

// Find missing translations
const findMissingTranslations = (en, fr) => {
  const flatEn = flattenObject(en);
  const flatFr = flattenObject(fr);
  
  const missingInFr = Object.keys(flatEn).filter(key => !flatFr[key]);
  const missingInEn = Object.keys(flatFr).filter(key => !flatEn[key]);
  
  return { missingInFr, missingInEn };
};

// Find hardcoded text in components
const findHardcodedText = async (dir) => {
  const hardcoded = [];
  
  const walk = async (currentDir) => {
    const files = await readdir(currentDir);
    
    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stats = await stat(filePath);
      
      if (stats.isDirectory()) {
        await walk(filePath);
      } else if (
        stats.isFile() && 
        (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.tsx'))
      ) {
        const content = await readFile(filePath, 'utf8');
        
        // Skip files in node_modules
        if (filePath.includes('node_modules')) continue;
        
        // Look for potential hardcoded text (simple heuristic)
        const jsxTextRegex = />([^<>{}\n]+)</g;
        const stringLiteralsRegex = /['"`]([^'"`\n]{3,}?)['"`]/g;
        
        let match;
        while ((match = jsxTextRegex.exec(content)) !== null) {
          const text = match[1].trim();
          if (text.length > 2 && !/^[0-9\s.]+$/.test(text)) {
            hardcoded.push({
              file: filePath.replace(process.cwd(), ''),
              text,
              type: 'JSX Text'
            });
          }
        }
        
        while ((match = stringLiteralsRegex.exec(content)) !== null) {
          const text = match[1].trim();
          // Skip import paths, variable names, etc.
          if (
            text.length > 2 && 
            !/^[0-9\s.]+$/.test(text) &&
            !text.includes('/') && 
            !text.includes('\\') &&
            !text.startsWith('t(')
          ) {
            hardcoded.push({
              file: filePath.replace(process.cwd(), ''),
              text,
              type: 'String Literal'
            });
          }
        }
      }
    }
  };
  
  await walk(dir);
  return hardcoded;
};

const main = async () => {
  console.log('Analyzing translations and components...');
  
  // Load translations
  const translations = await loadTranslations();
  
  // Find missing translations
  const { missingInFr, missingInEn } = findMissingTranslations(translations.en, translations.fr);
  
  console.log('\n=== MISSING TRANSLATIONS ===');
  console.log('\nMissing in French:');
  missingInFr.forEach(key => console.log(` - ${key}`));
  
  console.log('\nMissing in English:');
  missingInEn.forEach(key => console.log(` - ${key}`));
  
  // Find potentially hardcoded text
  const componentsDir = path.join(process.cwd(), 'src', 'app', 'components');
  const hardcodedText = await findHardcodedText(componentsDir);
  
  console.log('\n=== POTENTIAL HARDCODED TEXT ===');
  console.log('(This is a heuristic and may include false positives)');
  
  const grouped = hardcodedText.reduce((acc, item) => {
    if (!acc[item.file]) acc[item.file] = [];
    acc[item.file].push(item);
    return acc;
  }, {});
  
  Object.keys(grouped).forEach(file => {
    console.log(`\nFile: ${file}`);
    grouped[file].forEach(item => {
      console.log(` - "${item.text}" (${item.type})`);
    });
  });
};

main().catch(console.error); 