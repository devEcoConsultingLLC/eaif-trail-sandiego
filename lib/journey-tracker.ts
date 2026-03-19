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

export async function getPeteCallCount(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("journey_count")
      .select("pete_calls")
      .single()

    if (error) throw error
    return data?.pete_calls ?? 0
  } catch {
    return 0
  }
}

export async function incrementPeteCallCount(): Promise<void> {
  try {
    await supabase.rpc("increment_pete_calls")
  } catch {
    // Silently fail — game should work without Supabase
  }
}
