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

const ScoreSchema = z.object({
    score: z.number().describe('A numerical score from 0 to 100.'),
    reasoning: z.string().describe('A brief justification for the score.')
});

const AutomatedSectionQualityChecksOutputSchema = z.object({
  clarity: ScoreSchema.describe('Assessment of how easy the section is to understand.'),
  conciseness: ScoreSchema.describe('Assessment of whether the section is free of unnecessary jargon or wordiness.'),
  accuracy: ScoreSchema.describe('Assessment of the likely factual accuracy and up-to-dateness of the information.'),
  completeness: ScoreSchema.describe('Assessment of whether the section covers all necessary information relevant to its topic.'),
  overallFeedback: z
    .string()
    .describe(
      'A summary of potential issues and suggestions for improvement.'
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
  prompt: `You are an expert documentation reviewer. Analyze the provided section content and score it on a scale of 0 to 100 for each of the following four categories: Clarity, Conciseness, Accuracy, and Completeness.

You must provide a score and a brief reasoning for each category.

Finally, provide a brief "overallFeedback" with actionable suggestions for improvement.

**Section Content to Analyze:**
{{{sectionContent}}}

{{#if documentContext}}
**Overall Document Context:**
{{{documentContext}}}
{{/if}}
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
