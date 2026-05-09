import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Profile data type based on form structure (will be mapped to DB)
type ProfileData = {
  displayName?: string;
  esperantoName?: string;
  birthPlace?: string;
  birthCountry?: string;
  age?: string; // Form sends as string, will be converted to number in DB
  height?: string; // Form sends as string, will be converted to number in DB
  ethnicity?: string;
  bio?: string;
  esperantoLevel?: string; // Will be validated against allowed values
  esperantoSince?: string; // Form sends as string, will be converted to number in DB
  languages?: string[];
  educationLevel?: string; // Will be validated against allowed values
  occupation?: string;
  relationshipStatus?: string; // Will be validated against allowed values
  children?: string; // Will be validated against allowed values
  monthlyIncomeRange?: string; // Will be validated against allowed values
};

// Allowed values for constrained fields (must match database check constraints)
const CHILDREN_OPTIONS = ["Neniu", "1", "2", "3", "4", "5+", "Preferas ne diri"];
const EDUCATION_OPTIONS = [
  "Baza lernejo", "Meza lernejo", "Gimnazio / Liceo",
  "Teknika / Profesia", "Bakalaŭro", "Magistro", "Doktoro", "Postdoktora"
];
const RELATIONSHIP_OPTIONS = [
  "Fraŭlo/a", "Rilata (ne geedzita)", "Geedzita", "Disigita", "Vidvo/a", "Preferas ne diri"
];
const ESPERANTO_LEVELS = ["Komencanto", "Baza", "Meza", "Avancita", "Flua", "Denaska"];
const INCOME_OPTIONS = [
  "Preferas ne diri", "< 500 USD", "500–1.000 USD",
  "1.000–2.000 USD", "2.000–4.000 USD", "4.000–8.000 USD", "> 8.000 USD"
];

// Profile operations
export const profileOperations = {
  // Get user profile
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  },

  // Update or insert profile with validation
  async updateProfile(user_id: string, profileData: ProfileData) {
    // Validate constrained fields - only allow specific values or undefined
    const validatedChildren = profileData.children && CHILDREN_OPTIONS.includes(profileData.children) 
      ? profileData.children 
      : undefined;

    const validatedEducationLevel = profileData.educationLevel && EDUCATION_OPTIONS.includes(profileData.educationLevel)
      ? profileData.educationLevel
      : undefined;

    const validatedRelationshipStatus = profileData.relationshipStatus && RELATIONSHIP_OPTIONS.includes(profileData.relationshipStatus)
      ? profileData.relationshipStatus
      : undefined;

    const validatedEsperantoLevel = profileData.esperantoLevel && ESPERANTO_LEVELS.includes(profileData.esperantoLevel)
      ? profileData.esperantoLevel
      : undefined;

    const validatedMonthlyIncomeRange = profileData.monthlyIncomeRange && INCOME_OPTIONS.includes(profileData.monthlyIncomeRange)
      ? profileData.monthlyIncomeRange
      : undefined;

    // Map form field names to database column names
    const dbProfileData = {
      display_name: profileData.displayName,
      esperanto_name: profileData.esperantoName,
      birth_place: profileData.birthPlace,
      birth_country: profileData.birthCountry,
      age: profileData.age ? parseInt(profileData.age, 10) : undefined,
      height_cm: profileData.height ? parseInt(profileData.height, 10) : undefined,
      ethnicity: profileData.ethnicity,
      bio: profileData.bio,
      esperanto_level: validatedEsperantoLevel,
      esperanto_since: profileData.esperantoSince ? parseInt(profileData.esperantoSince, 10) : undefined,
      languages: profileData.languages,
      education_level: validatedEducationLevel,
      occupation: profileData.occupation,
      relationship_status: validatedRelationshipStatus,
      children: validatedChildren,
      monthly_income_range: validatedMonthlyIncomeRange,
    };

    // First check if profile exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user_id)
      .single();

    if (existingProfile) {
      // Profile exists, update it
      const { data, error } = await supabase
        .from("profiles")
        .update(dbProfileData)
        .eq("id", user_id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Profile doesn't exist, create it
      const { data, error } = await supabase
        .from("profiles")
        .insert({ id: user_id, ...dbProfileData })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },
};
