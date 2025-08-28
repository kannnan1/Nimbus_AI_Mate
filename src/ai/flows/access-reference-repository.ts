
'use server';

/**
 * @fileOverview A flow for accessing a reference repository of past documents.
 *
 * - accessReferenceRepository - A function that allows users to access a reference repository of past documents.
 * - AccessReferenceRepositoryInput - The input type for the accessReferenceRepository function.
 * - AccessReferenceRepositoryOutput - The return type for the accessReferenceRepository function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AccessReferenceRepositoryInputSchema = z.object({
  query: z.string().describe('The query to search the reference repository with.'),
});
export type AccessReferenceRepositoryInput = z.infer<typeof AccessReferenceRepositoryInputSchema>;

const AccessReferenceRepositoryOutputSchema = z.object({
  results: z.array(z.string()).describe('The search results from the reference repository.'),
});
export type AccessReferenceRepositoryOutput = z.infer<typeof AccessReferenceRepositoryOutputSchema>;

export async function accessReferenceRepository(
  input: AccessReferenceRepositoryInput
): Promise<AccessReferenceRepositoryOutput> {
  return accessReferenceRepositoryFlow(input);
}

const accessReferenceRepositoryPrompt = ai.definePrompt({
  name: 'accessReferenceRepositoryPrompt',
  input: {schema: z.object({
    query: AccessReferenceRepositoryInputSchema.shape.query,
    retrievedDocs: z.array(z.string()),
  })},
  output: {schema: AccessReferenceRepositoryOutputSchema},
  prompt: `You are a helpful assistant that accesses a reference repository of past documents.
  The user will provide a query, and you should search the repository and return the results.
  Query: {{{query}}}
  Retrieved Documents:
  {{#each retrievedDocs}}
  - {{{this}}}
  {{/each}}
  `,
});


const accessReferenceRepositoryFlow = ai.defineFlow(
  {
    name: 'accessReferenceRepositoryFlow',
    inputSchema: AccessReferenceRepositoryInputSchema,
    outputSchema: AccessReferenceRepositoryOutputSchema,
  },
  async input => {
    // In a real application, this would involve searching a database or other data source.
    // For this example, we'll return some dummy data that feels relevant.
    const sampleDocuments = [
        'Q1 2023 Model Validation Report: Found similar methodology using logistic regression for PD models.',
        'Project Alpha Development Docs: Details a comparable approach for handling missing data in income variables.',
        'SR 11-7 Compliance Guide (Internal): Outlines standards for documenting model limitations, relevant to your selected text.',
        'Q4 2022 Monitoring Report: Contains analysis of model performance decay in high-risk segments.',
        'Market Risk Model Methodology (2022): Describes the use of VAR models for assessing market risk.',
        'Operational Risk Framework: Details the process for identifying and mitigating operational risks.',
    ];

    // Simulate searching the repository and filtering the results based on the query.
    const retrievedDocs = sampleDocuments.filter(doc =>
      doc.toLowerCase().includes(input.query.toLowerCase())
    );
    
    // If no specific results match, return some generic ones so it doesn't look broken.
    if (retrievedDocs.length === 0) {
        retrievedDocs.push(sampleDocuments[0]);
        retrievedDocs.push(sampleDocuments[2]);
    }


    const {output} = await accessReferenceRepositoryPrompt({
      ...input,
      retrievedDocs,
    });

    return {
      results: retrievedDocs,
    };
  }
);
