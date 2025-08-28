
'use server';

/**
 * @fileOverview Implements a Genkit flow for comparing a document's alignment with past documentation standards.
 *
 * - documentAlignmentTool - A function that initiates the document alignment comparison.
 * - DocumentAlignmentInput - The input type for the documentAlignmentTool function.
 * - DocumentAlignmentOutput - The return type for the documentAlignmentTool function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DocumentAlignmentInputSchema = z.object({
  currentDocument: z.string().describe('The text content of the current document.'),
  pastDocumentStandards: z.string().describe('The text content representing past documentation standards.'),
});

export type DocumentAlignmentInput = z.infer<typeof DocumentAlignmentInputSchema>;

const DocumentAlignmentOutputSchema = z.object({
  alignmentScore: z.number().describe('A numerical score from 0 to 100 indicating how well the document aligns with the standards. A higher score means better alignment.'),
  suggestions: z.string().describe('Clear, actionable suggestions for how to improve the document to better meet the standards.'),
});

export type DocumentAlignmentOutput = z.infer<typeof DocumentAlignmentOutputSchema>;

export async function documentAlignmentTool(input: DocumentAlignmentInput): Promise<DocumentAlignmentOutput> {
  // Return sample data instead of calling the AI flow
  return Promise.resolve({
    alignmentScore: 75,
    suggestions: "The document is well-structured but is missing a required 'Risk Assessment' section. The tone is mostly formal, but consider rephrasing the introduction to be more objective. Adding a 'Stakeholders' section would also improve alignment.",
  });
}

const documentAlignmentPrompt = ai.definePrompt({
  name: 'documentAlignmentPrompt',
  input: {schema: DocumentAlignmentInputSchema},
  output: {schema: DocumentAlignmentOutputSchema},
  prompt: `As an expert documentation reviewer, evaluate the following document against the provided standards. 

  **Current Document:**
  {{{currentDocument}}}

  ---

  **Documentation Standards:**
  {{{pastDocumentStandards}}}

  ---

  Based on your analysis, provide a strict but fair 'alignmentScore' from 0 to 100. If required sections are missing or the tone is completely off, the score should be low. Also, provide concrete 'suggestions' for improvement.
  `,
});

const documentAlignmentFlow = ai.defineFlow(
  {
    name: 'documentAlignmentFlow',
    inputSchema: DocumentAlignmentInputSchema,
    outputSchema: DocumentAlignmentOutputSchema,
  },
  async input => {
    const {output} = await documentAlignmentPrompt(input);
    return output!;
  }
);
