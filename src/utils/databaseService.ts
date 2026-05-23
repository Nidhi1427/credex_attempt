import { type LeadCaptureInput } from '../types';

export async function saveLeadToBackend(leadData: LeadCaptureInput): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Log the incoming transactional pay-load clearly for local system auditing
    console.log('Initiating database record write stream for lead:', leadData);

    // 2. Read existing historical lead records from local storage cache arrays
    const existingLeadsRaw = localStorage.getItem('credex_captured_leads');
    const leadsArray = existingLeadsRaw ? JSON.parse(existingLeadsRaw) : [];

    // 3. Append the new timestamped entry to preserve local database states
    const enrichedLead = {
      ...leadData,
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString()
    };
    leadsArray.push(enrichedLead);
    localStorage.setItem('credex_captured_leads', JSON.stringify(leadsArray));

    // 4. Simulate a real-world asynchronous API network transport delay latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    // 5. This structural setup makes it incredibly simple to swap in a real Supabase client fetch method tomorrow:
    /*
    const { data, error } = await supabaseClient
      .from('leads')
      .insert([leadData]);
    if (error) throw error;
    */

    return { success: true };
  } catch (err: any) {
    console.error('Database connection error occurred:', err);
    return { success: false, error: err.message || 'Internal connection failure' };
  }
}