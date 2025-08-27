'use server';
/**
 * @fileOverview This file defines a Genkit flow for automated section quality checks.
 *
 * - automatedSectionQualityChecks - A function that initiates the section quality check flow.
 * - AutomatedSectionQualityChecksInput - The input type for the automatedSectionQualityChecks function.
 * - AutomatedSectionQualityChecksOutput - The return type for the automatedSectionQualityChecks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomatedSectionQualityChecksInputSchema = z.object({
  sectionContent: z
    .string()
    .describe('The content of the section to be assessed.'),
  documentContext: z
    .string()
    .optional()
    .describe('Contextual information about the document as a whole.'),
});
export type AutomatedSectionQualityChecksInput = z.infer<
  typeof AutomatedSectionQualityChecksInputSchema
>;

const AutomatedSectionQualityChecksOutputSchema = z.object({
  qualityScore: z
    .number()
    .describe(
      'A numerical score representing the overall quality of the section.'
    ),
  feedback: z
    .string()
    .describe(
      'Detailed feedback on the section, including potential issues and suggestions for improvement.'
    ),
});
export type AutomatedSectionQualityChecksOutput = z.infer<
  typeof AutomatedSectionQualityChecksOutputSchema
>;

export async function automatedSectionQualityChecks(
  input: AutomatedSectionQualityChecksInput
): Promise<AutomatedSectionQualityChecksOutput> {
  return automatedSectionQualityChecksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'automatedSectionQualityChecksPrompt',
  input: {schema: AutomatedSectionQualityChecksInputSchema},
  output: {schema: AutomatedSectionQualityChecksOutputSchema},
  prompt: `You are an AI assistant that reviews documents and provides feedback on their quality, adhering to industry best practices.

You will be given a section of a document and, optionally, some context about the overall document.

Based on this, you will assess the quality of the section and provide a quality score and detailed feedback.

Section Content: {{{sectionContent}}}
Document Context: {{{documentContext}}}

Consider the following aspects when assessing the section:

*   Clarity: Is the section easy to understand?
*   Conciseness: Is the section free of unnecessary jargon?
*   Accuracy: Is the information presented accurate and up-to-date?
*   Completeness: Does the section cover all the necessary information?
*   Relevance: Is the section relevant to the overall document?

Provide a quality score between 0 and 100, where 0 is the lowest quality and 100 is the highest quality.

Provide detailed feedback on the section, including potential issues and suggestions for improvement.
`,
});

const automatedSectionQualityChecksFlow = ai.defineFlow(
  {
    name: 'automatedSectionQualityChecksFlow',
    inputSchema: AutomatedSectionQualityChecksInputSchema,
    outputSchema: AutomatedSectionQualityChecksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
