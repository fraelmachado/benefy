export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      benefit_locations: {
        Row: {
          active: boolean
          address: string | null
          benefit_id: string
          city: string | null
          id: string
          lat: number
          lng: number
          name: string
          radius_m: number | null
          uf: string | null
        }
        Insert: {
          active?: boolean
          address?: string | null
          benefit_id: string
          city?: string | null
          id?: string
          lat: number
          lng: number
          name: string
          radius_m?: number | null
          uf?: string | null
        }
        Update: {
          active?: boolean
          address?: string | null
          benefit_id?: string
          city?: string | null
          id?: string
          lat?: number
          lng?: number
          name?: string
          radius_m?: number | null
          uf?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "benefit_locations_benefit_id_fkey"
            columns: ["benefit_id"]
            isOneToOne: false
            referencedRelation: "benefits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "benefit_locations_benefit_id_fkey"
            columns: ["benefit_id"]
            isOneToOne: false
            referencedRelation: "my_benefits"
            referencedColumns: ["id"]
          },
        ]
      }
      benefit_sources: {
        Row: {
          benefit_id: string
          source_item_id: string
        }
        Insert: {
          benefit_id: string
          source_item_id: string
        }
        Update: {
          benefit_id?: string
          source_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "benefit_sources_benefit_id_fkey"
            columns: ["benefit_id"]
            isOneToOne: false
            referencedRelation: "benefits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "benefit_sources_benefit_id_fkey"
            columns: ["benefit_id"]
            isOneToOne: false
            referencedRelation: "my_benefits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "benefit_sources_source_item_id_fkey"
            columns: ["source_item_id"]
            isOneToOne: false
            referencedRelation: "my_benefits"
            referencedColumns: ["via_source_item_id"]
          },
          {
            foreignKeyName: "benefit_sources_source_item_id_fkey"
            columns: ["source_item_id"]
            isOneToOne: false
            referencedRelation: "source_items"
            referencedColumns: ["id"]
          },
        ]
      }
      benefits: {
        Row: {
          action_label: string | null
          action_url: string | null
          active: boolean
          category: Database["public"]["Enums"]["benefit_category"]
          created_at: string
          id: string
          image_url: string | null
          partner_name: string | null
          scope: Database["public"]["Enums"]["benefit_scope"]
          steps: string | null
          summary: string
          title: string
          uf: string | null
          valid_until: string | null
        }
        Insert: {
          action_label?: string | null
          action_url?: string | null
          active?: boolean
          category: Database["public"]["Enums"]["benefit_category"]
          created_at?: string
          id?: string
          image_url?: string | null
          partner_name?: string | null
          scope?: Database["public"]["Enums"]["benefit_scope"]
          steps?: string | null
          summary: string
          title: string
          uf?: string | null
          valid_until?: string | null
        }
        Update: {
          action_label?: string | null
          action_url?: string | null
          active?: boolean
          category?: Database["public"]["Enums"]["benefit_category"]
          created_at?: string
          id?: string
          image_url?: string | null
          partner_name?: string | null
          scope?: Database["public"]["Enums"]["benefit_scope"]
          steps?: string | null
          summary?: string
          title?: string
          uf?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          is_admin: boolean
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          is_admin?: boolean
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          is_admin?: boolean
        }
        Relationships: []
      }
      source_items: {
        Row: {
          id: string
          label: string
          sort_order: number
          source_id: string
        }
        Insert: {
          id?: string
          label: string
          sort_order?: number
          source_id: string
        }
        Update: {
          id?: string
          label?: string
          sort_order?: number
          source_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "source_items_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      sources: {
        Row: {
          active: boolean
          id: string
          kind: Database["public"]["Enums"]["source_kind"]
          logo_url: string | null
          name: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          id?: string
          kind: Database["public"]["Enums"]["source_kind"]
          logo_url?: string | null
          name: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          id?: string
          kind?: Database["public"]["Enums"]["source_kind"]
          logo_url?: string | null
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      user_sources: {
        Row: {
          source_item_id: string
          user_id: string
        }
        Insert: {
          source_item_id: string
          user_id: string
        }
        Update: {
          source_item_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sources_source_item_id_fkey"
            columns: ["source_item_id"]
            isOneToOne: false
            referencedRelation: "my_benefits"
            referencedColumns: ["via_source_item_id"]
          },
          {
            foreignKeyName: "user_sources_source_item_id_fkey"
            columns: ["source_item_id"]
            isOneToOne: false
            referencedRelation: "source_items"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      my_benefits: {
        Row: {
          action_label: string | null
          action_url: string | null
          category: Database["public"]["Enums"]["benefit_category"] | null
          created_at: string | null
          id: string | null
          image_url: string | null
          partner_name: string | null
          scope: Database["public"]["Enums"]["benefit_scope"] | null
          steps: string | null
          summary: string | null
          title: string | null
          uf: string | null
          valid_until: string | null
          via: string | null
          via_source_item_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      benefit_category:
        | "viagem"
        | "entretenimento"
        | "saude"
        | "seguros"
        | "compras"
      benefit_scope: "nacional" | "regional" | "pontual"
      source_kind: "card" | "carrier" | "loyalty" | "cpf"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      benefit_category: [
        "viagem",
        "entretenimento",
        "saude",
        "seguros",
        "compras",
      ],
      benefit_scope: ["nacional", "regional", "pontual"],
      source_kind: ["card", "carrier", "loyalty", "cpf"],
    },
  },
} as const

