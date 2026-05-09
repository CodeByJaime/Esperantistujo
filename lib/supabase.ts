import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// User settings type for settings table
export type UserSettings = {
  interface_language?: 'eo' | 'en' | 'es' | 'fr' | 'de';
  notifications_email?: boolean;
  notifications_newsletter?: boolean;
  profile_public?: boolean;
  privacy_show_age?: boolean;
  privacy_show_relationship?: boolean;
  privacy_show_ethnicity?: boolean;
  privacy_show_income?: boolean;
  security_two_factor?: boolean;
  security_session_alerts?: boolean;
};

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

// User settings operations
export const settingsOperations = {
  // Get user settings
  async getSettings(userId: string): Promise<UserSettings | null> {
    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No settings found, return null instead of throwing
        return null;
      }
      throw error;
    }
    return data;
  },

  // Update user settings
  async updateSettings(userId: string, settings: Partial<UserSettings>) {
    // First check if settings exist, if not create default
    try {
      const existingSettings = await settingsOperations.getSettings(userId);
      
      if (!existingSettings) {
        // No settings exist, create default ones first
        await settingsOperations.createDefaultSettings(userId);
      }
      
      // Now update the settings
      const { data, error } = await supabase
        .from("user_settings")
        .update(settings)
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Create default settings for new user
  async createDefaultSettings(userId: string) {
    const defaultSettings: UserSettings = {
      interface_language: 'eo',
      notifications_email: true,
      notifications_newsletter: false,
      profile_public: true,
      privacy_show_age: true,
      privacy_show_relationship: true,
      privacy_show_ethnicity: false,
      privacy_show_income: false,
      security_two_factor: false,
      security_session_alerts: true,
    };

    const { data, error } = await supabase
      .from("user_settings")
      .insert({ id: userId, ...defaultSettings })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
