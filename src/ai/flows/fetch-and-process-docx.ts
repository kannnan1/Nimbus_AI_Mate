
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
      const response = await fetch(input.url);

      if (!response.ok) {
        throw new Error(`Failed to fetch document: ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();

      const mammothOptions = {
        convertImage: mammoth.images.imgElement(function(image) {
            return image.read("base64").then(function(imageBuffer) {
                return {
                    src: "data:" + image.contentType + ";base64," + imageBuffer
                };
            });
        }),
        styleMap: [
            "p[style-name='Table'] => table > tr > td:fresh",
        ]
      };

      const result = await mammoth.convertToHtml({ buffer: Buffer.from(arrayBuffer) }, mammothOptions);
      
      return { html: result.value };

    } catch (error: any) {
      console.error("Error processing DOCX file:", error.message, error.stack);
      // In case of an error, return a user-friendly message in HTML format.
      return { html: `<p>Error processing document: ${error.message}</p>` };
    }
  }
);
