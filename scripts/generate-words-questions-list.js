/**
 * Generates ALL_WORDS_AND_QUESTIONS.md from data/categories.ts and data/quizQuestions.ts.
 * Run from project root: node scripts/generate-words-questions-list.js
 * Requires the app to be built first, or use a TS runner. This script reads the .ts files as text.
 */

const fs = require('fs');
const path = require('path');

const categoriesPath = path.join(__dirname, '../data/categories.ts');
const quizPath = path.join(__dirname, '../data/quizQuestions.ts');

let categoriesContent, quizContent;
try {
  categoriesContent = fs.readFileSync(categoriesPath, 'utf8');
  quizContent = fs.readFileSync(quizPath, 'utf8');
} catch (e) {
  console.error('Could not read data files:', e.message);
  process.exit(1);
}

// Parse categories: only from defaultCategories array (before "];")
const catArray = categoriesContent.split('export const defaultCategories: Category[] = [')[1].split('];')[0];
const categoryBlocks = catArray.split(/\n  \},\s*\n  \{\s*\n/);
const categories = [];
for (const block of categoryBlocks) {
  const id = block.match(/id: '([^']+)'/)?.[1];
  const name = block.match(/name: '([^']+)'/)?.[1];
  const wordsMatch = block.match(/words: \[\s*([\s\S]*?)\s*\],/);
  const words = wordsMatch
    ? wordsMatch[1].match(/'([^']+)'/g)?.map(w => w.slice(1, -1)) || []
    : [];
  if (id && name) categories.push({ id, name, words });
}

// Parse quiz questions: only from quizQuestions array
const quizArray = quizContent.split('export const quizQuestions: QuizQuestion[] = [')[1].split('];')[0];
const questionBlocks = quizArray.split(/\n  \},\s*\n  \{\s*\n/);
const questions = [];
for (const block of questionBlocks) {
  const id = block.match(/id: '([^']+)'/)?.[1];
  const categoryId = block.match(/categoryId: '([^']+)'/)?.[1];
  const question = block.match(/question: '([^']+)'/)?.[1];
  const answer = block.match(/answer: '([^']+)'/)?.[1];
  const difficulty = block.match(/difficulty: '([^']+)'/)?.[1];
  if (id && categoryId && question !== undefined && answer !== undefined) {
    questions.push({ id, categoryId, question, answer, difficulty: difficulty || '' });
  }
}

let md = `# Khafī – All Words and Quiz Questions

**To remove or edit content:** edit the source files and re-run this script (or edit the list for reference).

- **Words (Word + Clue mode):** \`data/categories.ts\` – each category has a \`words: [ ... ]\` array.
- **Quiz questions (Quiz mode):** \`data/quizQuestions.ts\` – each entry has \`id\`, \`categoryId\`, \`question\`, \`answer\`, \`difficulty\`.

Regenerate this file: \`node scripts/generate-words-questions-list.js\`

---

## Categories and Words

`;

for (const cat of categories) {
  md += `### ${cat.name} (\`${cat.id}\`)\n\n`;
  md += cat.words.map(w => `- ${w}`).join('\n') + '\n\n';
}

md += `---

## Quiz Questions (id | categoryId | question | answer | difficulty)

`;

for (const q of questions) {
  md += `- **${q.id}** | \`${q.categoryId}\` | ${q.question} | **${q.answer}** | ${q.difficulty}\n`;
}

const outPath = path.join(__dirname, '../ALL_WORDS_AND_QUESTIONS.md');
fs.writeFileSync(outPath, md, 'utf8');
console.log('Wrote', outPath);
console.log('Categories:', categories.length, '| Questions:', questions.length);
