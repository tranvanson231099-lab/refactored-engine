'use server';

/**
 * @fileOverview Flow AI dùng để tinh chỉnh và sửa lỗi toàn bộ văn bản tiếng Việt.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SmartTextRefinerInputSchema = z.object({
  text: z.string().describe('Đoạn văn bản cần được tinh chỉnh và sửa lỗi.'),
});

const SmartTextRefinerOutputSchema = z.object({
  refinedText: z.string().describe('Đoạn văn bản đã được sửa lỗi chính tả và dấu.'),
  explanation: z.string().describe('Giải thích ngắn gọn các lỗi đã sửa.'),
});

export type SmartTextRefinerInput = z.infer<typeof SmartTextRefinerInputSchema>;
export type SmartTextRefinerOutput = z.infer<typeof SmartTextRefinerOutputSchema>;

export async function smartTextRefiner(input: SmartTextRefinerInput): Promise<SmartTextRefinerOutput> {
  return smartTextRefinerFlow(input);
}

const smartTextRefinerPrompt = ai.definePrompt({
  name: 'smartTextRefinerPrompt',
  input: { schema: SmartTextRefinerInputSchema },
  output: { schema: SmartTextRefinerOutputSchema },
  prompt: `Bạn là một biên tập viên ngôn ngữ tiếng Việt chuyên nghiệp.
Nhiệm vụ của bạn là nhận vào một đoạn văn bản có thể thiếu dấu, sai dấu hoặc sai chính tả do gõ phím nhanh.
Hãy sửa lại đoạn văn bản đó sao cho tự nhiên, đúng ngữ pháp và đầy đủ dấu tiếng Việt.

Văn bản gốc: "{{{text}}}"

Yêu cầu:
1. Giữ nguyên ý nghĩa và phong cách của người viết.
2. Tập trung vào việc đặt dấu đúng vị trí chuẩn (ví dụ: "hòa" thay vì "hoà" nếu theo chuẩn mới, hoặc giữ chuẩn cũ nếu phù hợp ngữ cảnh).
3. Trả về văn bản đã sửa và một câu giải thích ngắn gọn.`,
});

const smartTextRefinerFlow = ai.defineFlow(
  {
    name: 'smartTextRefinerFlow',
    inputSchema: SmartTextRefinerInputSchema,
    outputSchema: SmartTextRefinerOutputSchema,
  },
  async (input) => {
    const { output } = await smartTextRefinerPrompt(input);
    if (!output) throw new Error('Không có phản hồi từ AI.');
    return output;
  }
);
