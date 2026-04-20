
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

async function fixExtension() {
  const outDir = path.resolve('out');

  console.log('--- Đang tối ưu hóa Extension cho Chrome OS ---');

  // 1. Đổi tên thư mục _next (Chrome cấm thư mục bắt đầu bằng _)
  const oldPath = path.join(outDir, '_next');
  const newPath = path.join(outDir, 'nextAssets');
  if (fs.existsSync(oldPath)) {
    if (fs.existsSync(newPath)) fs.rmSync(newPath, { recursive: true });
    fs.renameSync(oldPath, newPath);
    console.log('[OK] Đã đổi tên _next thành nextAssets');
  }

  // 2. Quét và sửa lỗi CSP trong tất cả các file HTML
  const htmlFiles = await glob('out/**/*.html');
  for (const file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf8');

    // Sửa đường dẫn dẫn đến nextAssets
    content = content.replace(/\/_next\//g, './nextAssets/');
    content = content.replace(/_next\//g, './nextAssets/');

    // Bốc script inline ra file riêng (Sửa lỗi CSP)
    const scriptRegex = /<script(?![^>]*src)([^>]*)>([\s\S]*?)<\/script>/g;
    let match;
    let scriptCount = 0;
    const scriptsToReplace = [];

    while ((match = scriptRegex.exec(content)) !== null) {
      const attributes = match[1];
      const inlineCode = match[2].trim();
      
      if (inlineCode) {
        const fileName = path.basename(file, '.html');
        const scriptName = `js-csp-fix-${fileName}-${scriptCount}.js`;
        const scriptPath = path.join(path.dirname(file), scriptName);
        
        fs.writeFileSync(scriptPath, inlineCode);
        scriptsToReplace.push({
          fullTag: match[0],
          newTag: `<script src="./${scriptName}"${attributes}></script>`
        });
        scriptCount++;
      }
    }

    for (const item of scriptsToReplace) {
      content = content.replace(item.fullTag, item.newTag);
    }
    
    fs.writeFileSync(file, content);
    if (scriptCount > 0) {
      console.log(`[OK] Đã gỡ ${scriptCount} đoạn inline script trong ${path.basename(file)}`);
    }
  }

  console.log('--- Hoàn tất! Hãy nạp thư mục "out" vào Chrome ---');
}

fixExtension().catch(console.error);
