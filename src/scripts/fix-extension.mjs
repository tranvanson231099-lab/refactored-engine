
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const outDir = path.resolve('out');

async function fixExtension() {
  console.log('Fixing extension for Chrome (IME & CSP focus)...');

  // 1. Đổi tên thư mục _next vì Chrome cấm tên bắt đầu bằng "_"
  const oldNextDir = path.join(outDir, '_next');
  const newNextDir = path.join(outDir, 'nextAssets');
  if (fs.existsSync(oldNextDir)) {
    if (fs.existsSync(newNextDir)) {
      fs.rmSync(newNextDir, { recursive: true, force: true });
    }
    fs.renameSync(oldNextDir, newNextDir);
    console.log('Renamed _next to nextAssets');
  }

  // 2. Tìm tất cả các tệp HTML
  const htmlFiles = await glob('out/**/*.html');

  for (const file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf8');

    // Thay thế đường dẫn _next thành nextAssets
    content = content.replace(/\/_next\//g, './nextAssets/');
    content = content.replace(/_next\//g, './nextAssets/');

    // 3. QUAN TRỌNG: Bốc toàn bộ inline scripts ra tệp .js riêng để sửa lỗi CSP
    let scriptCounter = 0;
    content = content.replace(/<script(?![^>]*src)([^>]*)>([\s\S]*?)<\/script>/gi, (match, attrs, scriptBody) => {
      const trimmedBody = scriptBody.trim();
      if (trimmedBody.length === 0) return match;

      // Không bốc các script JSON (như __NEXT_DATA__)
      if (attrs.includes('type="application/json"') || attrs.includes("type='application/json'")) {
        return match;
      }

      const scriptName = `inline-js-${scriptCounter++}.js`;
      const scriptPath = path.join(path.dirname(file), scriptName);
      
      fs.writeFileSync(scriptPath, trimmedBody);
      console.log(`Extracted inline script to: ${scriptName}`);
      return `<script${attrs} src="./${scriptName}"></script>`;
    });

    fs.writeFileSync(file, content);
  }

  console.log('Extension fix process completed!');
}

fixExtension().catch(console.error);
