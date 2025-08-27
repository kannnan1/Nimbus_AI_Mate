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
  prompt: `You are an AI assistant that evaluates the alignment of a document with past documentation standards and provides suggestions for improvement.

  Current Document:
  {{currentDocument}}

  Past Documentation Standards:
  {{pastDocumentStandards}}

  Based on the current document and provided past documentation standards, generate an alignment score (0-100) and suggestions for improving alignment.
  Consider factors such as formatting, tone, terminology, and content structure.  The alignment score should represent the degree to which the document matches the past documentation standards. Be critical and objective.
  Suggestions should be clear, actionable, and specific to the provided document.
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
