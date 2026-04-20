
import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

/**
 * Script này giải quyết 2 vấn đề cực kỳ quan trọng của Chrome Extension:
 * 1. Đổi tên thư mục _next thành nextAssets (vì Chrome cấm dấu gạch dưới).
 * 2. Bốc toàn bộ mã "Inline Script" ra file .js riêng để sạch lỗi CSP.
 */

const outDir = path.resolve('out');

async function fixExtension() {
  console.log('🚀 Đang bắt đầu quy trình xử lý sạch lỗi CSP...');

  // 1. Đổi tên thư mục _next
  const oldPath = path.join(outDir, '_next');
  const newPath = path.join(outDir, 'nextAssets');

  if (fs.existsSync(oldPath)) {
    if (fs.existsSync(newPath)) {
      fs.rmSync(newPath, { recursive: true, force: true });
    }
    fs.renameSync(oldPath, newPath);
    console.log('✅ Đã đổi tên _next thành nextAssets');
  }

  // 2. Tìm tất cả các file HTML để xử lý mã Inline Script
  const htmlFiles = globSync(`${outDir}/**/*.html`);

  for (const file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Đổi link thư mục trong file HTML
    content = content.replace(/\/_next\//g, './nextAssets/');
    content = content.replace(/\.\.\/_next\//g, '../nextAssets/');

    // Tìm và bốc Inline Script
    const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/g;
    let match;
    let scriptCount = 0;

    while ((match = scriptRegex.exec(content)) !== null) {
      const fullTag = match[0];
      const inlineCode = match[1].trim();

      // Nếu thẻ script có thuộc tính src thì bỏ qua, chỉ xử lý script có code bên trong
      if (fullTag.includes('src=') || !inlineCode) continue;

      scriptCount++;
      const scriptFileName = `csp-fix-${path.basename(file, '.html')}-${scriptCount}.js`;
      const scriptPath = path.join(path.dirname(file), scriptFileName);

      // Ghi code ra file riêng
      fs.writeFileSync(scriptPath, inlineCode);

      // Thay thế thẻ script inline bằng thẻ script src
      const newTag = `<script src="./${scriptFileName}"></script>`;
      content = content.replace(fullTag, newTag);
    }

    fs.writeFileSync(file, content);
    if (scriptCount > 0) {
      console.log(`✅ Đã bốc ${scriptCount} script từ ${path.relative(outDir, file)}`);
    }
  }

  console.log('🎉 Xử lý hoàn tất! Thư mục "out" đã sẵn sàng để nạp.');
}

fixExtension().catch(console.error);
