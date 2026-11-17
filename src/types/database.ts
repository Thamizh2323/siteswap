export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type MaterialUnit = "nos" | "kg" | "bags" | "sqft" | "cft";
export type UserRole = "seller" | "buyer" | "both" | "admin";
export type PreferredLang = "en" | "ta";
export type ListingCondition = "unused" | "good" | "fair" | "damaged";
export type PickupType = "self" | "seller_delivers";
export type ListingStatus = "draft" | "active" | "reserved" | "sold" | "expired" | "removed";
export type ReservationStatus = "pending" | "accepted" | "completed" | "declined" | "expired" | "cancelled";
export type WantedStatus = "active" | "matched" | "closed";
export type ReportStatus = "pending" | "resolved" | "dismissed";

export interface Database {
  public: {
    Tables: {
      materials: {
        Row: {
          id: string;
          key: string;
          name_en: string;
          name_ta: string;
          unit: MaterialUnit;
          kg_per_unit: number;
          co2_per_kg: number;
          new_price_ref: number;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          name_en: string;
          name_ta: string;
          unit: MaterialUnit;
          kg_per_unit: number;
          co2_per_kg: number;
          new_price_ref: number;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          name_en?: string;
          name_ta?: string;
          unit?: MaterialUnit;
          kg_per_unit?: number;
          co2_per_kg?: number;
          new_price_ref?: number;
          active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          name: string | null;
          phone: string | null;
          role: UserRole;
          lang: PreferredLang;
          area_text: string | null;
          location: unknown | null;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          phone?: string | null;
          role?: UserRole;
          lang?: PreferredLang;
          area_text?: string | null;
          location?: unknown | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          phone?: string | null;
          role?: UserRole;
          lang?: PreferredLang;
          area_text?: string | null;
          location?: unknown | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      listings: {
        Row: {
          id: string;
          seller_id: string;
          material_id: string;
          qty_total: number;
          qty_available: number;
          unit: string;
          qty_ai_estimate: number | null;
          ai_confidence: number | null;
          condition: ListingCondition;
          original_price: number;
          ask_price: number;
          negotiable: boolean;
          photos: string[];
          location: unknown;
          area_text: string | null;
          pickup_type: PickupType;
          available_until: string | null;
          status: ListingStatus;
          is_demo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          seller_id: string;
          material_id: string;
          qty_total: number;
          qty_available: number;
          unit: string;
          qty_ai_estimate?: number | null;
          ai_confidence?: number | null;
          condition: ListingCondition;
          original_price: number;
          ask_price: number;
          negotiable?: boolean;
          photos?: string[];
          location: unknown;
          area_text?: string | null;
          pickup_type?: PickupType;
          available_until?: string | null;
          status?: ListingStatus;
          is_demo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          seller_id?: string;
          material_id?: string;
          qty_total?: number;
          qty_available?: number;
          unit?: string;
          qty_ai_estimate?: number | null;
          ai_confidence?: number | null;
          condition?: ListingCondition;
          original_price?: number;
          ask_price?: number;
          negotiable?: boolean;
          photos?: string[];
          location?: unknown;
          area_text?: string | null;
          pickup_type?: PickupType;
          available_until?: string | null;
          status?: ListingStatus;
          is_demo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      reservations: {
        Row: {
          id: string;
          listing_id: string;
          buyer_id: string;
          qty: number;
          status: ReservationStatus;
          expires_at: string;
          contact_revealed_at: string | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          listing_id: string;
          buyer_id: string;
          qty: number;
          status?: ReservationStatus;
          expires_at?: string;
          contact_revealed_at?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          listing_id?: string;
          buyer_id?: string;
          qty?: number;
          status?: ReservationStatus;
          expires_at?: string;
          contact_revealed_at?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      wanted_requests: {
        Row: {
          id: string;
          buyer_id: string;
          material_id: string;
          qty: number;
          max_price: number | null;
          radius_km: number;
          location: unknown;
          status: WantedStatus;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          buyer_id: string;
          material_id: string;
          qty: number;
          max_price?: number | null;
          radius_km?: number;
          location: unknown;
          status?: WantedStatus;
          expires_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          buyer_id?: string;
          material_id?: string;
          qty?: number;
          max_price?: number | null;
          radius_km?: number;
          location?: unknown;
          status?: WantedStatus;
          expires_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      impact_log: {
        Row: {
          id: string;
          reservation_id: string;
          material_id: string;
          qty: number;
          kg_diverted: number;
          co2_avoided_kg: number;
          money_saved: number;
          is_demo: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          reservation_id: string;
          material_id: string;
          qty: number;
          kg_diverted: number;
          co2_avoided_kg: number;
          money_saved: number;
          is_demo?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          reservation_id?: string;
          material_id?: string;
          qty?: number;
          kg_diverted?: number;
          co2_avoided_kg?: number;
          money_saved?: number;
          is_demo?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      ratings: {
        Row: {
          id: string;
          reservation_id: string;
          rater_id: string;
          rated_id: string;
          score: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          reservation_id: string;
          rater_id: string;
          rated_id: string;
          score: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          reservation_id?: string;
          rater_id?: string;
          rated_id?: string;
          score?: number;
          comment?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      reports: {
        Row: {
          id: string;
          listing_id: string;
          reporter_id: string;
          reason: string;
          status: ReportStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          reporter_id: string;
          reason: string;
          status?: ReportStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          listing_id?: string;
          reporter_id?: string;
          reason?: string;
          status?: ReportStatus;
          created_at?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string | null;
          data: Json;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          body?: string | null;
          data?: Json;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          body?: string | null;
          data?: Json;
          read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      telegram_links: {
        Row: {
          id: string;
          user_id: string;
          chat_id: number;
          linked_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          chat_id: number;
          linked_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          chat_id?: number;
          linked_at?: string;
        };
        Relationships: [];
      };
      rate_limits: {
        Row: {
          key: string;
          window_start: string;
          count: number;
        };
        Insert: {
          key: string;
          window_start?: string;
          count?: number;
        };
        Update: {
          key?: string;
          window_start?: string;
          count?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      public_profiles: {
        Row: {
          id: string;
          name: string | null;
          role: UserRole;
          area_text: string | null;
          created_at: string;
        };
        Relationships: [];
      };
    };
    Functions: {
      nearby_listings: {
        Args: {
          lat: number;
          lng: number;
          radius_km?: number;
          material_key?: string | null;
          lim?: number;
          off?: number;
        };
        Returns: {
          id: string;
          seller_id: string;
          material_id: string;
          qty_available: number;
          unit: string;
          condition: string;
          ask_price: number;
          original_price: number;
          negotiable: boolean;
          photos: string[];
          area_text: string | null;
          status: string;
          is_demo: boolean;
          created_at: string;
          distance_m: number;
          material_key_out: string;
          material_name_en: string;
          material_name_ta: string;
        }[];
      };
      get_contact: {
        Args: {
          res_id: string;
        };
        Returns: string;
      };
      impact_summary: {
        Args: {
          include_demo?: boolean;
        };
        Returns: {
          kg_diverted: number;
          co2_avoided_kg: number;
          money_saved: number;
          deals_count: number;
        };
      };
      check_rate_limit: {
        Args: {
          p_key: string;
          p_limit: number;
          p_window_seconds: number;
        };
        Returns: boolean;
      };
      reserve_listing: {
        Args: {
          p_listing: string;
          p_qty: number;
        };
        Returns: string;
      };
      respond_reservation: {
        Args: {
          p_res: string;
          p_accept: boolean;
        };
        Returns: void;
      };
      complete_reservation: {
        Args: {
          p_res: string;
        };
        Returns: void;
      };
      expire_reservations: {
        Args: Record<string, never>;
        Returns: number;
      };
    };
  };
}
