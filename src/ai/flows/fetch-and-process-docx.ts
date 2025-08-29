
'use server';
/**
 * @fileOverview A flow for fetching a .docx file from a URL and converting it to HTML.
 *
 * - fetchAndProcessDocx - Fetches a .docx file and converts it to HTML using Mammoth.js.
 * - FetchAndProcessDocxInput - The input type for the fetchAndProcessDocx function.
 * - FetchAndProcessDocxOutput - The return type for the fetchAndProcessDocx function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import mammoth from 'mammoth';
import { a } from 'vitest/dist/reporters-5f784f42';

const FetchAndProcessDocxInputSchema = z.object({
  url: z.string().url().describe('The URL of the .docx file to fetch.'),
});
export type FetchAndProcessDocxInput = z.infer<typeof FetchAndProcessDocxInputSchema>;

const FetchAndProcessDocxOutputSchema = z.object({
  html: z.string().describe('The converted HTML content of the document.'),
});
export type FetchAndProcessDocxOutput = z.infer<typeof FetchAndProcessDocxOutputSchema>;

export async function fetchAndProcessDocx(
  input: FetchAndProcessDocxInput
): Promise<FetchAndProcessDocxOutput> {
  return fetchAndProcessDocxFlow(input);
}

const fetchAndProcessDocxFlow = ai.defineFlow(
  {
    name: 'fetchAndProcessDocxFlow',
    inputSchema: FetchAndProcessDocxInputSchema,
    outputSchema: FetchAndProcessDocxOutputSchema,
  },
  async (input) => {
    try {
      // Convert github blob url to raw url
      const rawUrl = input.url
        .replace('github.com', 'raw.githubusercontent.com')
        .replace('/blob/', '/');
      
      const response = await fetch(rawUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch document: ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
      
      return { html: result.value };

    } catch (error: any) {
      console.error("Error processing DOCX file:", error);
      // In case of an error, return a user-friendly message in HTML format.
      return { html: `<p>Error processing document: ${error.message}</p>` };
    }
  }
);
