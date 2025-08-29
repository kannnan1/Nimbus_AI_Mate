
'use server';
/**
 * @fileOverview A flow for interpreting a selected piece of content (text, table, or image).
 *
 * - interpretSelection - A function that provides an interpretation of the given content.
 * - InterpretSelectionInput - The input type for the interpretSelection function.
 * - InterpretSelectionOutput - The return type for the interpretSelection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterpretSelectionInputSchema = z.object({
  selection: z.string().describe('The selected content from the document.'),
  contentType: z.enum(['table', 'image', 'text']).describe('The type of content selected.'),
});
export type InterpretSelectionInput = z.infer<typeof InterpretSelectionInputSchema>;

const InterpretSelectionOutputSchema = z.object({
  interpretation: z.string().describe('The AI-generated interpretation of the content.'),
});
export type InterpretSelectionOutput = z.infer<typeof InterpretSelectionOutputSchema>;


const prompt = ai.definePrompt({
  name: 'interpretSelectionPrompt',
  input: {schema: InterpretSelectionInputSchema},
  output: {schema: InterpretSelectionOutputSchema},
  prompt: `You are an expert analyst. Your task is to interpret the provided content based on its type.

Content Type: {{{contentType}}}

Content:
{{{selection}}}

Provide a concise and insightful interpretation of the content.`,
});


const interpretSelectionFlow = ai.defineFlow(
  {
    name: 'interpretSelectionFlow',
    inputSchema: InterpretSelectionInputSchema,
    outputSchema: InterpretSelectionOutputSchema,
  },
  async input => {
    // In a real application, you would call the prompt.
    // For now, we return sample data based on the content type.
    if (input.contentType === 'table') {
      return {
        interpretation: "The model demonstrates strong explanatory power, with an adjusted R² of 78.3% and a significant F-statistic of 52.3, indicating robustness. The intercept sets the baseline at –3.59. Government debt-to-GDP (log) has a positive and significant effect (0.26), suggesting rising debt increases the dependent variable. In contrast, the lagged four-quarter change in the House Price Index (–1.91) and crude oil production growth lagged four quarters (–2.32) both exert significant negative effects. Together, these results imply fiscal pressures drive the variable upward, while housing dynamics and energy output exert dampening effects, highlighting meaningful macroeconomic linkages and predictive strength.",
      };
    }
    if (input.contentType === 'image') {
       return {
        interpretation: "The ROC curve demonstrates strong model performance. The curve is positioned high in the upper-left corner, signifying a high true positive rate and a low false positive rate across all thresholds, which is indicative of a robust and accurate model.",
      };
    }
    // Fallback for general text
    const {output} = await prompt(input);
    return output!;
  }
);


export async function interpretSelection(
  input: InterpretSelectionInput
): Promise<InterpretSelectionOutput> {
  return interpretSelectionFlow(input);
}
