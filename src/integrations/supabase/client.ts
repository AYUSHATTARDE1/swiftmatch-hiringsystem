
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jnjmdfocauohxalifytr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impuam1kZm9jYXVvaHhhbGlmeXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NDk5MDMsImV4cCI6MjA1ODAyNTkwM30.BvHrAXbcoh3dEBpXRoaPRu7WFXnLslMh-mtbML4Sd9M";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
