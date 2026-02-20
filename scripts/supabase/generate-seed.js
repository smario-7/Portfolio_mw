import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../..');
const contentPath = path.join(root, 'src/lib/data/content.json');
const projectsPath = path.join(root, 'src/lib/data/projects.json');

const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));

function escapeSql(str) {
  return str.replace(/'/g, "''");
}

const contentJson = escapeSql(JSON.stringify(content));
const projectsJson = escapeSql(JSON.stringify(projects));

const sql = `-- Opcjonalny seed: content i projects z repozytorium (Supabase SQL Editor)
insert into public.app_data (key, value) values
  ('content', '${contentJson}'::jsonb),
  ('projects', '${projectsJson}'::jsonb)
on conflict (key) do update set
  value = excluded.value,
  updated_at = now();
`;

console.log(sql);
