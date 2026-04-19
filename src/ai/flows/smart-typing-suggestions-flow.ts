'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing smart typing suggestions
 * for Vietnamese text, including word completions and tone mark corrections.
 *
 * - smartTypingSuggestions - A function that handles the generation of typing suggestions.
 * - SmartTypingSuggestionsInput - The input type for the smartTypingSuggestions function.
 * - SmartTypingSuggestionsOutput - The return type for the smartTypingSuggestions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input Schema
const SmartTypingSuggestionsInputSchema = z.object({
  currentInput:
    z.string()
    .describe('The current incomplete word or phrase the user is typing.'),
  fullSentenceContext:
    z.string()
    .describe(
      'The full sentence or phrase typed so far, providing context for suggestions.'
    ),
});
export type SmartTypingSuggestionsInput = z.infer<
  typeof SmartTypingSuggestionsInputSchema
>;

// Output Schema
const SmartTypingSuggestionsOutputSchema = z.object({
  wordCompletions:
    z.array(z.string())
    .describe('An array of suggested complete words based on the current input.'),
  toneMarkCorrections:
    z.array(z.string())
    .describe(
      'An array of suggested corrections for tone mark placement in the current input or last word.'
    ),
});
export type SmartTypingSuggestionsOutput = z.infer<
  typeof SmartTypingSuggestionsOutputSchema
>;

// Wrapper function
export async function smartTypingSuggestions(
  input: SmartTypingSuggestionsInput
): Promise<SmartTypingSuggestionsOutput> {
  return smartTypingSuggestionsFlow(input);
}

// Prompt Definition
const smartTypingSuggestionsPrompt = ai.definePrompt({
  name: 'smartTypingSuggestionsPrompt',
  input: { schema: SmartTypingSuggestionsInputSchema },
  output: { schema: SmartTypingSuggestionsOutputSchema },
  prompt: `You are an expert in Vietnamese linguistics and a smart typing assistant. Your task is to provide intelligent word completions and correct tone mark placements for Vietnamese text.
The user is currently typing. Provide suggestions based on the 'currentInput' and the 'fullSentenceContext'.

Current input fragment: "{{{currentInput}}}"
Full sentence context: "{{{fullSentenceContext}}}"

Analyze the input and provide:
1.  \`wordCompletions\`: Up to 3 most probable word completions for the 'currentInput'.
2.  \`toneMarkCorrections\`: If 'currentInput' appears to be a full word or an incomplete word that could be corrected, provide up to 3 corrected versions focusing on tone mark placement. If 'currentInput' is clearly incomplete and doesn't need tone correction yet, this array can be empty.

Ensure the suggestions are grammatically correct and natural in Vietnamese. Prioritize common words and correct diacritic usage.
The output MUST be a JSON object conforming to the SmartTypingSuggestionsOutputSchema.`,
});

// Flow Definition
const smartTypingSuggestionsFlow = ai.defineFlow(
  {
    name: 'smartTypingSuggestionsFlow',
    inputSchema: SmartTypingSuggestionsInputSchema,
    outputSchema: SmartTypingSuggestionsOutputSchema,
  },
  async (input) => {
    const { output } = await smartTypingSuggestionsPrompt(input);
    if (!output) {
      throw new Error('No output received from the prompt.');
    }
    return output;
  }
);
