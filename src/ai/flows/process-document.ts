
'use server';
/**
 * @fileOverview A flow for processing uploaded documents.
 *
 * - processDocument - A function that takes document content and returns a summary and metadata.
 * - ProcessDocumentInput - The input type for the processDocument function.
 * - ProcessDocumentOutput - The return type for the processDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProcessDocumentInputSchema = z.object({
  fileName: z.string().describe('The name of the uploaded file.'),
  documentContent: z.string().describe('The full text content of the document.'),
});
export type ProcessDocumentInput = z.infer<typeof ProcessDocumentInputSchema>;

const ProcessDocumentOutputSchema = z.object({
  title: z.string().describe('A suitable title for the document, derived from its content or filename.'),
  summary: z.string().describe('A concise, high-level summary of the document.'),
  metadata: z.object({
    keyTopics: z.array(z.string()).describe('A list of the main topics or keywords discussed in the document.'),
    wordCount: z.number().describe('The total word count of the document.'),
  }),
  vectorizationStatus: z.string().describe('The status of the vectorization process.'),
});
export type ProcessDocumentOutput = z.infer<typeof ProcessDocumentOutputSchema>;

export async function processDocument(
  input: ProcessDocumentInput
): Promise<ProcessDocumentOutput> {
  return processDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'processDocumentPrompt',
  input: {schema: ProcessDocumentInputSchema},
  output: {schema: ProcessDocumentOutputSchema},
  prompt: `You are an expert document analyst. Analyze the following document content and generate the required output.

The title should be extracted from the document content if a clear title exists, otherwise, use the filename as a basis for a good title.
The summary should be a concise paragraph that captures the main points of the document.
The key topics should be a list of 3-5 of the most important subjects.
The vectorization status should be "Completed".

**File Name:**
{{{fileName}}}

**Document Content:**
{{{documentContent}}}
`,
});

const processDocumentFlow = ai.defineFlow(
  {
    name: 'processDocumentFlow',
    inputSchema: ProcessDocumentInputSchema,
    outputSchema: ProcessDocumentOutputSchema,
  },
  async (input) => {
    // Calculate word count
    const wordCount = input.documentContent.trim().split(/\s+/).length;

    // Call the AI to generate title, summary, and key topics
    const {output} = await prompt(input);

    if (!output) {
      throw new Error("Failed to process document");
    }

    // In a real application, this is where you would interface with a vector database (e.g., Pinecone, ChromaDB).
    // For this example, we simulate the process and return a status.
    const vectorizationStatus = "Completed";

    return {
      ...output,
      metadata: {
        ...output.metadata,
        wordCount: wordCount,
      },
      vectorizationStatus: vectorizationStatus,
    };
  }
);
