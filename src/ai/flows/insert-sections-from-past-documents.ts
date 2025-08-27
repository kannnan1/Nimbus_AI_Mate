'use server';
/**
 * @fileOverview A flow that allows users to insert sections from past documents into their current document.
 *
 * - insertSectionsFromPastDocuments - A function that handles the insertion of sections from past documents.
 * - InsertSectionsFromPastDocumentsInput - The input type for the insertSectionsFromPastDocuments function.
 * - InsertSectionsFromPastDocumentsOutput - The return type for the insertSectionsFromPastDocuments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InsertSectionsFromPastDocumentsInputSchema = z.object({
  currentDocument: z.string().describe('The content of the current document.'),
  pastDocumentSection: z.string().describe('The specific section from a past document to insert.'),
});
export type InsertSectionsFromPastDocumentsInput = z.infer<typeof InsertSectionsFromPastDocumentsInputSchema>;

const InsertSectionsFromPastDocumentsOutputSchema = z.object({
  updatedDocument: z.string().describe('The updated document with the inserted section.'),
});
export type InsertSectionsFromPastDocumentsOutput = z.infer<typeof InsertSectionsFromPastDocumentsOutputSchema>;

export async function insertSectionsFromPastDocuments(input: InsertSectionsFromPastDocumentsInput): Promise<InsertSectionsFromPastDocumentsOutput> {
  return insertSectionsFromPastDocumentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'insertSectionsFromPastDocumentsPrompt',
  input: {schema: InsertSectionsFromPastDocumentsInputSchema},
  output: {schema: InsertSectionsFromPastDocumentsOutputSchema},
  prompt: `You are an AI assistant helping a user insert a section from a past document into their current document.\n\nCurrent Document: {{{currentDocument}}}\n\nPast Document Section: {{{pastDocumentSection}}}\n\nYour task is to insert the \"Past Document Section\" into the \"Current Document\" in a logical and coherent way.  Make sure that the section is inserted so that the final result is grammatically correct and well formatted.\n\nUpdated Document:`,
});

const insertSectionsFromPastDocumentsFlow = ai.defineFlow(
  {
    name: 'insertSectionsFromPastDocumentsFlow',
    inputSchema: InsertSectionsFromPastDocumentsInputSchema,
    outputSchema: InsertSectionsFromPastDocumentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
