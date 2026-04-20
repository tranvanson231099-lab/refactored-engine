
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.resolve(__dirname, '../../out');

function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(file));
    } else if (file.endsWith('.html')) {
      results.push(file);
    }
  });
  return results;
}

async function fixExtension() {
  console.log('--- Bắt đầu xử lý dọn dẹp CSP cho Chrome Extension ---');

  // 1. Đổi tên thư mục _next thành nextAssets
  const oldNextDir = path.join(outDir, '_next');
  const newNextDir = path.join(outDir, 'nextAssets');
  if (fs.existsSync(oldNextDir)) {
    if (fs.existsSync(newNextDir)) {
      fs.rmSync(newNextDir, { recursive: true, force: true });
    }
    fs.renameSync(oldNextDir, newNextDir);
    console.log('✅ Đã đổi tên _next thành nextAssets');
  }

  const htmlFiles = getAllHtmlFiles(outDir);

  htmlFiles.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');

    // 2. Thay đổi đường dẫn _next thành nextAssets trong HTML
    content = content.replace(/\/_next\//g, './nextAssets/');
    content = content.replace(/\.\/_next\//g, './nextAssets/');

    // 3. Ngoại vi hóa Inline Scripts (QUAN TRỌNG NHẤT)
    const scriptRegex = /<script(?![^>]*src)([^>]*)>([\s\S]*?)<\/script>/g;
    let match;
    let scriptCounter = 0;
    const fileDir = path.dirname(filePath);
    const fileName = path.basename(filePath, '.html');

    while ((match = scriptRegex.exec(content)) !== null) {
      const scriptContent = match[2].trim();
      if (scriptContent) {
        scriptCounter++;
        const scriptFileName = `inline-script-${fileName}-${scriptCounter}.js`;
        const scriptPath = path.join(fileDir, scriptFileName);
        
        fs.writeFileSync(scriptPath, scriptContent);
        
        const scriptTag = `<script src="./${scriptFileName}"></script>`;
        content = content.replace(match[0], scriptTag);
      }
    }

    // 4. Xóa bỏ các thuộc tính gây lỗi CSP khác nếu có
    content = content.replace(/<script[^>]*>\s*<\/script>/g, '');

    fs.writeFileSync(filePath, content);
    console.log(`✅ Đã xử lý xong: ${path.relative(outDir, filePath)} (${scriptCounter} scripts)`);
  });

  console.log('--- Hoàn tất! Hãy nạp thư mục "out" vào Chrome Extensions ---');
}

fixExtension().catch(console.error);
