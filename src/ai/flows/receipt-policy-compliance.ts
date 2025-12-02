'use server';

/**
 * @fileOverview Implements a Genkit flow to analyze uploaded payment receipts for policy violations.
 *
 * - analyzeReceiptForCompliance - Analyzes a receipt for policy compliance.
 * - AnalyzeReceiptInput - The input type for the analyzeReceiptForCompliance function.
 * - AnalyzeReceiptOutput - The return type for the analyzeReceiptForCompliance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeReceiptInputSchema = z.object({
  receiptDataUri: z
    .string()
    .describe(
      "A photo of a payment receipt, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  paymentAmount: z.number().describe('The expected payment amount on the receipt.'),
  paymentMethod: z.string().describe('The payment method used (e.g., bank transfer).'),
  expectedAccountNumber: z.string().describe('The expected account number for the payment.'),
});
export type AnalyzeReceiptInput = z.infer<typeof AnalyzeReceiptInputSchema>;

const AnalyzeReceiptOutputSchema = z.object({
  isCompliant: z.boolean().describe('Whether the receipt complies with the payment policy.'),
  violations: z.array(z.string()).describe('A list of policy violations detected on the receipt.'),
  confidenceScore: z.number().describe('A confidence score (0-1) indicating the reliability of the analysis.'),
});
export type AnalyzeReceiptOutput = z.infer<typeof AnalyzeReceiptOutputSchema>;

export async function analyzeReceiptForCompliance(input: AnalyzeReceiptInput): Promise<AnalyzeReceiptOutput> {
  return analyzeReceiptFlow(input);
}

const analyzeReceiptPrompt = ai.definePrompt({
  name: 'analyzeReceiptPrompt',
  input: {schema: AnalyzeReceiptInputSchema},
  output: {schema: AnalyzeReceiptOutputSchema},
  prompt: `You are an expert in detecting fraudulent payment receipts and ensuring compliance with payment policies.

You will analyze the provided receipt image and information to determine if it complies with the stated payment policy.

Specifically, check for the following:
1.  If the receipt seems forged or altered.
2.  If the payment amount matches the expected amount of {{{paymentAmount}}} Naira.
3.  If the payment method is valid ({{{paymentMethod}}}).
4.  If the account number on the receipt matches the expected account number ({{{expectedAccountNumber}}}).

Based on your analysis, determine if the receipt is compliant or not. Provide a confidence score (0-1) for your analysis.

Receipt Image: {{media url=receiptDataUri}}

Output in JSON format.
`,
});

const analyzeReceiptFlow = ai.defineFlow(
  {
    name: 'analyzeReceiptFlow',
    inputSchema: AnalyzeReceiptInputSchema,
    outputSchema: AnalyzeReceiptOutputSchema,
  },
  async input => {
    const {output} = await analyzeReceiptPrompt(input);
    return output!;
  }
);
