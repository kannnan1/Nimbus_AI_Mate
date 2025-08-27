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
  input: {schema: AccessReferenceRepositoryInputSchema},
  output: {schema: AccessReferenceRepositoryOutputSchema},
  prompt: `You are a helpful assistant that accesses a reference repository of past documents.
  The user will provide a query, and you should search the repository and return the results.
  Query: {{{query}}}
  Results: {{results}}`,
});

const accessReferenceRepositoryFlow = ai.defineFlow(
  {
    name: 'accessReferenceRepositoryFlow',
    inputSchema: AccessReferenceRepositoryInputSchema,
    outputSchema: AccessReferenceRepositoryOutputSchema,
  },
  async input => {
    // In a real application, this would involve searching a database or other data source.
    // For this example, we'll just return some dummy data.
    const dummyResults = [
      'Document 1: Example of a past project report.',
      'Document 2: Template for a new project proposal.',
      'Document 3: Guidelines for writing a standard operating procedure.',
    ];

    // Simulate searching the repository and filtering the results based on the query.
    const searchResults = dummyResults.filter(result =>
      result.toLowerCase().includes(input.query.toLowerCase())
    );

    const {output} = await accessReferenceRepositoryPrompt({
      ...input,
      results: searchResults,
    });

    return {
      results: searchResults,
    };
  }
);
