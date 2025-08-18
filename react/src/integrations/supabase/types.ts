export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      CHATS: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      link_analytics: {
        Row: {
          city: string | null
          country: string | null
          id: string
          link_id: string
          referrer: string | null
          user_agent: string | null
          viewed_at: string
          visitor_ip: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          id?: string
          link_id: string
          referrer?: string | null
          user_agent?: string | null
          viewed_at?: string
          visitor_ip?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          id?: string
          link_id?: string
          referrer?: string | null
          user_agent?: string | null
          viewed_at?: string
          visitor_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "link_analytics_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "shareable_links"
            referencedColumns: ["id"]
          },
        ]
      }
      link_permissions: {
        Row: {
          allowed_domains: string[] | null
          allowed_ips: string[] | null
          created_at: string
          id: string
          link_id: string
          permission_type: string
        }
        Insert: {
          allowed_domains?: string[] | null
          allowed_ips?: string[] | null
          created_at?: string
          id?: string
          link_id: string
          permission_type: string
        }
        Update: {
          allowed_domains?: string[] | null
          allowed_ips?: string[] | null
          created_at?: string
          id?: string
          link_id?: string
          permission_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "link_permissions_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "shareable_links"
            referencedColumns: ["id"]
          },
        ]
      }
      "LOGIN INFO": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      shareable_links: {
        Row: {
          content: Json
          content_type: string
          created_at: string
          current_views: number | null
          description: string | null
          expires_at: string | null
          file_id: string
          id: string
          link_type: Database["public"]["Enums"]["link_type"]
          max_views: number | null
          password_hash: string | null
          status: Database["public"]["Enums"]["link_status"]
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: Json
          content_type?: string
          created_at?: string
          current_views?: number | null
          description?: string | null
          expires_at?: string | null
          file_id: string
          id?: string
          link_type?: Database["public"]["Enums"]["link_type"]
          max_views?: number | null
          password_hash?: string | null
          status?: Database["public"]["Enums"]["link_status"]
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: Json
          content_type?: string
          created_at?: string
          current_views?: number | null
          description?: string | null
          expires_at?: string | null
          file_id?: string
          id?: string
          link_type?: Database["public"]["Enums"]["link_type"]
          max_views?: number | null
          password_hash?: string | null
          status?: Database["public"]["Enums"]["link_status"]
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_file_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      increment_link_views: {
        Args: { link_file_id: string }
        Returns: undefined
      }
    }
    Enums: {
      link_status: "active" | "disabled" | "expired"
      link_type: "profile" | "document" | "chat" | "settings" | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      link_status: ["active", "disabled", "expired"],
      link_type: ["profile", "document", "chat", "settings", "other"],
    },
  },
} as const
