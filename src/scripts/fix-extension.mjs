
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const outDir = path.resolve('out');

async function fixExtension() {
  console.log('--- Đang tối ưu hóa thư mục "out" cho Chrome Extension ---');

  // 1. Đổi tên thư mục _next thành nextAssets (Chrome cấm dấu gạch dưới ở đầu tên thư mục)
  const oldPath = path.join(outDir, '_next');
  const newPath = path.join(outDir, 'nextAssets');

  if (fs.existsSync(oldPath)) {
    if (fs.existsSync(newPath)) {
      fs.rmSync(newPath, { recursive: true });
    }
    fs.renameSync(oldPath, newPath);
    console.log('✓ Đã đổi tên _next thành nextAssets');
  }

  // 2. Xử lý tất cả các tệp HTML để loại bỏ Inline Scripts (Lỗi CSP)
  const htmlFiles = await glob('out/**/*.html');

  for (const file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Đổi link _next thành nextAssets
    content = content.replace(/\/_next\//g, './nextAssets/');
    content = content.replace(/_next\//g, 'nextAssets/');

    // Tìm và bốc tất cả inline scripts ra file riêng
    const scriptRegex = /<script(?![^>]*src)([^>]*)>([\s\S]*?)<\/script>/gi;
    let match;
    let scriptCount = 0;
    const fileBase = path.basename(file, '.html');
    const fileDir = path.dirname(file);

    while ((match = scriptRegex.exec(content)) !== null) {
      const attributes = match[1];
      const scriptContent = match[2].trim();
      
      if (scriptContent) {
        scriptCount++;
        const scriptName = `${fileBase}-inline-${scriptCount}.js`;
        const scriptPath = path.join(fileDir, scriptName);
        const relativePath = `./${scriptName}`;

        // Ghi nội dung script ra file .js
        fs.writeFileSync(scriptPath, scriptContent);
        
        // Thay thế thẻ script inline bằng thẻ script src
        const newTag = `<script src="${relativePath}"${attributes}></script>`;
        content = content.replace(match[0], newTag);
      }
    }

    if (scriptCount > 0) {
      console.log(`✓ Đã ngoại vi hóa ${scriptCount} scripts trong ${path.relative(outDir, file)}`);
    }

    fs.writeFileSync(file, content);
  }

  console.log('--- Hoàn tất! Hãy nạp thư mục "out" vào Chrome ---');
}

fixExtension().catch(console.error);
