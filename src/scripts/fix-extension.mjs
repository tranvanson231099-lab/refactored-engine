
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import crypto from 'crypto';

const outDir = path.resolve(process.cwd(), 'out');

async function fixExtension() {
  console.log('--- ĐANG PHẪU THUẬT LỖI CSP & ĐỔI TÊN THƯ MỤC CẤM ---');

  // 1. Đổi tên thư mục _next thành nextAssets (Chrome cấm dấu gạch dưới)
  const oldPath = path.join(outDir, '_next');
  const newPath = path.join(outDir, 'nextAssets');
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log('✓ Đã đổi tên _next thành nextAssets');
  }

  // 2. Tìm tất cả file HTML để xử lý link và bóc tách inline script
  const htmlFiles = await glob('**/*.html', { cwd: outDir });

  for (const file of htmlFiles) {
    const filePath = path.join(outDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Sửa đường dẫn trong HTML
    content = content.replace(/\/_next\//g, './nextAssets/');
    content = content.replace(/src="\/nextAssets\//g, 'src="./nextAssets/');
    content = content.replace(/href="\/nextAssets\//g, 'href="./nextAssets/');

    // BÓC TÁCH INLINE SCRIPT (Sửa lỗi CSP 100%)
    const inlineScriptRegex = /<script\b(?![^>]*\bsrc\b)[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    let scriptCount = 0;

    while ((match = inlineScriptRegex.exec(content)) !== null) {
      const scriptContent = match[1].trim();
      if (scriptContent.length === 0) continue;

      const hash = crypto.createHash('sha256').update(scriptContent).digest('hex').substring(0, 8);
      const scriptFilename = `inline-${hash}.js`;
      const scriptRelPath = `scripts/${scriptFilename}`;
      const scriptAbsPath = path.join(outDir, scriptRelPath);

      // Tạo thư mục scripts nếu chưa có
      if (!fs.existsSync(path.dirname(scriptAbsPath))) {
        fs.mkdirSync(path.dirname(scriptAbsPath), { recursive: true });
      }

      fs.writeFileSync(scriptAbsPath, scriptContent);
      
      // Thay thế thẻ script inline bằng thẻ script src
      const fullMatch = match[0];
      const replacement = `<script src="./${scriptRelPath}"></script>`;
      content = content.replace(fullMatch, replacement);
      
      scriptCount++;
    }

    fs.writeFileSync(filePath, content);
    if (scriptCount > 0) {
      console.log(`✓ Đã bóc tách ${scriptCount} scripts từ ${file}`);
    }
  }

  console.log('--- HOÀN TẤT: BẢN BUILD ĐÃ SẴN SÀNG ---');
}

fixExtension().catch(console.error);
