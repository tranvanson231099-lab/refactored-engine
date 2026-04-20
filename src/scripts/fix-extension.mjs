
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const outDir = path.resolve('out');

async function fixExtension() {
  console.log('--- Đang phẫu thuật mã nguồn VietFlex (Gỡ lỗi CSP) ---');

  // 1. Đổi tên thư mục _next (Chrome cấm dấu gạch dưới)
  const oldPath = path.join(outDir, '_next');
  const newPath = path.join(outDir, 'nextAssets');
  if (fs.existsSync(oldPath)) {
    if (fs.existsSync(newPath)) {
      fs.rmSync(newPath, { recursive: true });
    }
    fs.renameSync(oldPath, newPath);
    console.log('✔ Đã đổi tên _next thành nextAssets');
  }

  // 2. Xử lý toàn bộ file HTML để bóc tách inline scripts
  const htmlFiles = await glob('out/**/*.html');
  
  for (const file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf8');

    // Cập nhật đường dẫn tệp
    content = content.replace(/\/_next\//g, './nextAssets/');
    content = content.replace(/_next\//g, 'nextAssets/');

    // Tìm và bóc tách các đoạn script inline (thứ gây lỗi CSP)
    const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/g;
    let match;
    let scriptCount = 0;
    const baseName = path.basename(file, '.html');
    const dirName = path.dirname(file);

    while ((match = scriptRegex.exec(content)) !== null) {
      const scriptContent = match[1].trim();
      // Chỉ bóc nếu có nội dung và không phải là script nạp từ file (không có src)
      if (scriptContent && !match[0].includes('src=')) {
        const scriptFilename = `${baseName}-inline-${scriptCount}.js`;
        const scriptFilePath = path.join(dirName, scriptFilename);
        
        fs.writeFileSync(scriptFilePath, scriptContent);
        
        const scriptTag = `<script src="./${scriptFilename}"></script>`;
        content = content.replace(match[0], scriptTag);
        scriptCount++;
      }
    }

    fs.writeFileSync(file, content);
  }

  console.log('✔ Đã bóc tách toàn bộ mã inline scripts ra file riêng.');
  console.log('✔ Hoàn tất! Bạn có thể nạp thư mục "out" vào Chrome ngay bây giờ.');
}

fixExtension().catch(err => {
  console.error('✘ Lỗi khi xử lý extension:', err);
});
