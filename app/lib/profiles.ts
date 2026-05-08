import type { User } from "@supabase/supabase-js";

import { supabase, type UserProfile } from "@/lib/supabase-client";

export async function ensureUserProfile(user: User): Promise<UserProfile | null> {
  const { data: existingProfile, error: existingError } = await supabase
    .from("users")
    .select("id, organization_id, role, full_name, email, credit_balance")
    .eq("id", user.id)
    .maybeSingle<UserProfile>();

  if (existingError) throw existingError;
  if (existingProfile) return existingProfile;

  const organizationName =
    typeof user.user_metadata?.organization_name === "string"
      ? user.user_metadata.organization_name
      : null;

  if (!organizationName) return null;

  const { data: profile, error: profileError } = await supabase
    .rpc("create_user_workspace", { workspace_name: organizationName })
    .select("id, organization_id, role, full_name, email, credit_balance")
    .single<UserProfile>();

  if (profileError) throw profileError;

  return profile;
}
