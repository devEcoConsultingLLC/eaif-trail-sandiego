import { supabase } from "./supabase"

export async function getJourneyCount(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("journey_count")
      .select("count")
      .single()

    if (error) throw error
    return data?.count ?? 0
  } catch {
    return 0
  }
}

export async function incrementJourneyCount(): Promise<void> {
  try {
    await supabase.rpc("increment_journey_count")
  } catch {
    // Silently fail — game should work without Supabase
  }
}
