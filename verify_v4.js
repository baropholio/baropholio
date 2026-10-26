const fs = require('fs');
const content = fs.readFileSync('admin_project_manager.html', 'utf8');
const scriptStart = content.indexOf('<script>');
const scriptEnd = content.lastIndexOf('</script>');
try {
  new Function(content.slice(scriptStart + 8, scriptEnd));
  console.log('JS Syntax: PASS');
} catch(e) {
  console.error('FAIL:', e.message);
  process.exit(1);
}
console.log('File size:', content.length, 'bytes,', content.split('\n').length, 'lines');

const checks = [
  ['STORAGE_KEY v4', 'baropholio_wix_portfolio_v4'],
  ['deepCopy utility', 'function deepCopy'],
  ['audio in accept', 'audio/*'],
  ['media-type-badge CSS', 'media-type-badge'],
  ['stt-badge CSS', 'stt-badge'],
  ['buildProjectExportRecord', 'function buildProjectExportRecord'],
  ['projects_master.json', 'projects_master.json'],
  ['subtitle field', "subtitle"],
  ['audio controls in modal', 'audio controls'],
  ['video controls in modal', 'video controls'],
  ['STT pad', 'padStart'],
];

checks.forEach(([label, search]) => {
  console.log((content.includes(search) ? 'OK' : 'MISSING') + ' | ' + label);
});
