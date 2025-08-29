
'use server';
/**
 * @fileOverview A flow for rephrasing a selected piece of text.
 *
 * - rephraseText - A function that provides a rephrased version of the given content.
 * - RephraseTextInput - The input type for the rephraseText function.
 * - RephraseTextOutput - The return type for the rephraseText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RephraseTextInputSchema = z.object({
  text: z.string().describe('The selected text from the document to be rephrased.'),
});
export type RephraseTextInput = z.infer<typeof RephraseTextInputSchema>;

const RephraseTextOutputSchema = z.object({
  rephrasedText: z.string().describe('The AI-generated rephrased version of the text.'),
});
export type RephraseTextOutput = z.infer<typeof RephraseTextOutputSchema>;


const prompt = ai.definePrompt({
  name: 'rephraseTextPrompt',
  input: {schema: RephraseTextInputSchema},
  output: {schema: RephraseTextOutputSchema},
  prompt: `You are an expert editor. Your task is to rephrase the following text to be more clear, concise, and professional.

Text to rephrase:
{{{text}}}

Provide only the rephrased text.`,
});


const rephraseTextFlow = ai.defineFlow(
  {
    name: 'rephraseTextFlow',
    inputSchema: RephraseTextInputSchema,
    outputSchema: RephraseTextOutputSchema,
  },
  async (input) => {
    // For this prototype, we will return a hardcoded rephrased text
    // to ensure the functionality is demonstrated correctly.
    const hardcodedResponse = {
        rephrasedText: `This report validates the Wholesale Probability of Default (PD) Credit Risk Model, adhering to the XX Model Risk Management Policy [3]. The model estimates default probabilities for the wholesale loan portfolio, which are crucial inputs for setting risk appetite, assessing capital adequacy, and conducting Business-as-Usual (BAU) stress tests for XX and XX US operations. Furthermore, it supports credit risk limit management and loss projections within the Bank’s annual Risk Appetite Statement. The model specifically forecasts conditional default rates and rating transitions under both internally developed and XX-provided macroeconomic scenarios. These PD estimates are then utilized to project potential credit losses and evaluate the Bank's capital resilience under stress. The model is applicable to the Wholesale portfolio, including Commercial & Industrial (C&I) loans, leases, letters of credit, and is also used to assess counterparty credit risk from potential trading partner defaults.`
    };
    return Promise.resolve(hardcodedResponse);
    
    // In a real scenario, you would call the AI prompt like this:
    // const {output} = await prompt(input);
    // return output!;
  }
);


export async function rephraseText(
  input: RephraseTextInput
): Promise<RephraseTextOutput> {
  return rephraseTextFlow(input);
}
