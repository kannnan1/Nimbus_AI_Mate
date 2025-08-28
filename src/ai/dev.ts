import { config } from 'dotenv';
config();

import '@/ai/flows/document-alignment-tool.ts';
import '@/ai/flows/insert-sections-from-past-documents.ts';
import '@/ai/flows/access-reference-repository.ts';
import '@/ai/flows/automated-section-quality-checks.ts';
import '@/ai/flows/interpret-selection.ts';
