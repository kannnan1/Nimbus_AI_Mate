
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
  alignmentScore: z.number().describe('A numerical score indicating the alignment of the current document with past standards (0-100).'),
  suggestions: z.string().describe('Suggestions for improving alignment with past documentation standards.'),
});

export type DocumentAlignmentOutput = z.infer<typeof DocumentAlignmentOutputSchema>;

export async function documentAlignmentTool(input: DocumentAlignmentInput): Promise<DocumentAlignmentOutput> {
  return documentAlignmentFlow(input);
}

const documentAlignmentPrompt = ai.definePrompt({
  name: 'documentAlignmentPrompt',
  input: {schema: DocumentAlignmentInputSchema},
  output: {schema: DocumentAlignmentOutputSchema},
  prompt: `You are an expert documentation reviewer. Your task is to evaluate a document against a set of standards.

  Current Document:
  {{{currentDocument}}}

  Documentation Standards:
  {{{pastDocumentStandards}}}

  Please perform the following:
  1.  **Analyze Completeness**: Check if the document includes all the required sections and information mentioned in the standards.
  2.  **Evaluate Other Dimensions**: Assess factors like tone, terminology, formatting, and content structure.
  3.  **Calculate Score**: Provide an "alignmentScore" from 0 to 100, where 100 represents perfect alignment with the standards. Be critical and objective in your scoring.
  4.  **Provide Suggestions**: Offer clear, actionable "suggestions" for how to improve the document to better meet the standards.
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
