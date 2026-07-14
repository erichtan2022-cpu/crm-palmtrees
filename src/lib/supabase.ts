import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://vtnwvrzufbpvumitvhvp.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjJkYzZkZjIzLTVmOWYtNGFmMi1hODllLTE0ZGM1NGM5ODUwNCJ9.eyJwcm9qZWN0SWQiOiJ2dG53dnJ6dWZicHZ1bWl0dmh2cCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzc5NjQ4OTYxLCJleHAiOjIwOTUwMDg5NjEsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.sVXstedCqGuIxOPNRkwfSD80KGBfEbwvkRO8yHqNdBI';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };