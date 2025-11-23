// Test validation function
const fs = require('fs');

// Read test backup
const testBackup = JSON.parse(fs.readFileSync('./test-backup.json', 'utf8'));

console.log('Test Backup Data:');
console.log(JSON.stringify(testBackup, null, 2));

// Manually run validation logic
const data = testBackup;
const warnings = [];
let recoveredFolders = 0;
let recoveredItems = 0;

// 1. Cek struktur dasar
if (!data || typeof data !== 'object') {
  console.log('FAIL: Invalid data structure');
  process.exit(1);
}

// 2. Sanitasi Folders
let sanitizedFolders = [];
const originalFoldersCount = Array.isArray(data.folders) ? data.folders.length : 0;

if (Array.isArray(data.folders)) {
  sanitizedFolders = data.folders
    .filter((f) => f && typeof f.id === 'string' && typeof f.name === 'string')
    .map((f) => {
      const needsRecovery = typeof f.createdAt !== 'number';
      if (needsRecovery) {
        recoveredFolders++;
        warnings.push(`Folder "${f.name}" dipulihkan (timestamp hilang)`);
      }
      return {
        id: f.id,
        name: f.name,
        createdAt: typeof f.createdAt === 'number' ? f.createdAt : Date.now()
      };
    });

  const invalidFolders = originalFoldersCount - sanitizedFolders.length;
  if (invalidFolders > 0) {
    warnings.push(`${invalidFolders} folder rusak dan dibuang`);
  }
}

// 3. Sanitasi SavedItems
let sanitizedItems = [];
const originalItemsCount = Array.isArray(data.savedItems) ? data.savedItems.length : 0;

if (Array.isArray(data.savedItems)) {
  sanitizedItems = data.savedItems
    .filter((i) => i && typeof i.id === 'string' && typeof i.interestName === 'string')
    .map((i) => {
      let needsRecovery = false;

      const targetFolderId = (typeof i.folderId === 'string' && i.folderId.length > 0)
        ? i.folderId
        : (sanitizedFolders.length > 0 ? sanitizedFolders[0].id : 'restored_default');

      if (!i.folderId || !i.timestamp) {
        needsRecovery = true;
        recoveredItems++;
      }

      return {
        id: i.id,
        interestName: i.interestName,
        folderId: targetFolderId,
        timestamp: typeof i.timestamp === 'number' ? i.timestamp : Date.now(),
        funFact: typeof i.funFact === 'string' ? i.funFact : undefined
      };
    });

  const invalidItems = originalItemsCount - sanitizedItems.length;
  if (invalidItems > 0) {
    warnings.push(`${invalidItems} item rusak dan dibuang`);
  }
}

console.log('\n=== Validation Results ===');
console.log('Sanitized Folders:', sanitizedFolders.length);
console.log('Sanitized Items:', sanitizedItems.length);
console.log('Recovered Folders:', recoveredFolders);
console.log('Recovered Items:', recoveredItems);
console.log('Warnings:', warnings);
console.log('\nValidation: SUCCESS');
