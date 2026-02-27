import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.vue')) results.push(file);
        }
    });
    return results;
}

const files = walk('./app');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace imports
  if (content.match(/import\s*\{\s*Motion\s*(,?)\s*\}\s*from\s+['"]motion-v['"]/g)) {
    content = content.replace(/import\s*\{\s*Motion\s*(,?)\s*\}\s*from\s+['"]motion-v['"]/g, "import { motion$1 } from 'motion-v'");
    changed = true;
  }

  // Also check for 'Motion' usage without '{'
  if (content.includes("<Motion ") || content.includes("<Motion\n") || content.includes("<Motion>")) {
    content = content.replace(/<Motion(\s|>|\n)/g, "<motion.div$1");
    changed = true;
  }

  // Check end tag
  if (content.includes("</Motion>")) {
    content = content.replace(/<\/Motion>/g, "</motion.div>");
    changed = true;
  }

  // Check in-view -> whileInView
  if (content.includes(":in-view") || content.includes("in-view")) {
    content = content.replace(/:in-view="/g, ':whileInView="');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log("Updated", file);
  }
}
