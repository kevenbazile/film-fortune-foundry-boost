export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      community_fund_applications: {
        Row: {
          additional_documents: Json | null
          created_at: string | null
          description: string
          expected_deliverables: string | null
          film_id: string | null
          funding_date: string | null
          id: string
          invoice_id: string | null
          marketing_plan: string | null
          previous_work: string | null
          project_title: string
          project_type: string | null
          requested_amount: number
          revenue_projections: Json | null
          review_date: string | null
          review_notes: string | null
          reviewed_by: string | null
          status: string | null
          submission_date: string | null
          target_audience: string | null
          team_info: string | null
          timeline: string | null
          updated_at: string | null
          use_of_funds: string
          user_id: string
        }
        Insert: {
          additional_documents?: Json | null
          created_at?: string | null
          description: string
          expected_deliverables?: string | null
          film_id?: string | null
          funding_date?: string | null
          id?: string
          invoice_id?: string | null
          marketing_plan?: string | null
          previous_work?: string | null
          project_title: string
          project_type?: string | null
          requested_amount: number
          revenue_projections?: Json | null
          review_date?: string | null
          review_notes?: string | null
          reviewed_by?: string | null
          status?: string | null
          submission_date?: string | null
          target_audience?: string | null
          team_info?: string | null
          timeline?: string | null
          updated_at?: string | null
          use_of_funds: string
          user_id: string
        }
        Update: {
          additional_documents?: Json | null
          created_at?: string | null
          description?: string
          expected_deliverables?: string | null
          film_id?: string | null
          funding_date?: string | null
          id?: string
          invoice_id?: string | null
          marketing_plan?: string | null
          previous_work?: string | null
          project_title?: string
          project_type?: string | null
          requested_amount?: number
          revenue_projections?: Json | null
          review_date?: string | null
          review_notes?: string | null
          reviewed_by?: string | null
          status?: string | null
          submission_date?: string | null
          target_audience?: string | null
          team_info?: string | null
          timeline?: string | null
          updated_at?: string | null
          use_of_funds?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_fund_applications_film_id_fkey"
            columns: ["film_id"]
            isOneToOne: false
            referencedRelation: "films"
            referencedColumns: ["id"]
          },
        ]
      }
      distributions: {
        Row: {
          completed_at: string | null
          created_at: string
          film_id: string
          id: string
          metadata: Json | null
          platform: string
          platform_id: string | null
          platform_url: string | null
          status: Database["public"]["Enums"]["distribution_status"]
          submitted_at: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          film_id: string
          id?: string
          metadata?: Json | null
          platform: string
          platform_id?: string | null
          platform_url?: string | null
          status?: Database["public"]["Enums"]["distribution_status"]
          submitted_at?: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          film_id?: string
          id?: string
          metadata?: Json | null
          platform?: string
          platform_id?: string | null
          platform_url?: string | null
          status?: Database["public"]["Enums"]["distribution_status"]
          submitted_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "distributions_film_id_fkey"
            columns: ["film_id"]
            isOneToOne: false
            referencedRelation: "films"
            referencedColumns: ["id"]
          },
        ]
      }
      film_analytics: {
        Row: {
          film_id: string
          growth_rate: number
          id: string
          last_updated: string
          total_revenue: number
        }
        Insert: {
          film_id: string
          growth_rate?: number
          id?: string
          last_updated?: string
          total_revenue?: number
        }
        Update: {
          film_id?: string
          growth_rate?: number
          id?: string
          last_updated?: string
          total_revenue?: number
        }
        Relationships: [
          {
            foreignKeyName: "film_analytics_film_id_fkey"
            columns: ["film_id"]
            isOneToOne: false
            referencedRelation: "films"
            referencedColumns: ["id"]
          },
        ]
      }
      film_assets: {
        Row: {
          asset_type: string
          asset_url: string
          created_at: string
          film_id: string
          id: string
          mime_type: string
        }
        Insert: {
          asset_type: string
          asset_url: string
          created_at?: string
          film_id: string
          id?: string
          mime_type: string
        }
        Update: {
          asset_type?: string
          asset_url?: string
          created_at?: string
          film_id?: string
          id?: string
          mime_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "film_assets_film_id_fkey"
            columns: ["film_id"]
            isOneToOne: false
            referencedRelation: "films"
            referencedColumns: ["id"]
          },
        ]
      }
      films: {
        Row: {
          created_at: string
          description: string | null
          director: string | null
          duration: number | null
          film_url: string | null
          genre: string[]
          id: string
          main_cast: string[] | null
          poster_url: string | null
          release_year: number | null
          review_notes: string | null
          service_id: string | null
          status: Database["public"]["Enums"]["film_status"]
          title: string
          trailer_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          director?: string | null
          duration?: number | null
          film_url?: string | null
          genre: string[]
          id?: string
          main_cast?: string[] | null
          poster_url?: string | null
          release_year?: number | null
          review_notes?: string | null
          service_id?: string | null
          status?: Database["public"]["Enums"]["film_status"]
          title: string
          trailer_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          director?: string | null
          duration?: number | null
          film_url?: string | null
          genre?: string[]
          id?: string
          main_cast?: string[] | null
          poster_url?: string | null
          release_year?: number | null
          review_notes?: string | null
          service_id?: string | null
          status?: Database["public"]["Enums"]["film_status"]
          title?: string
          trailer_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "films_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "films_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fund_payments: {
        Row: {
          amount: number
          application_id: string
          created_at: string | null
          entered_by: string | null
          id: string
          payment_date: string
          payment_method: string | null
          status: string | null
          transaction_id: string | null
        }
        Insert: {
          amount: number
          application_id: string
          created_at?: string | null
          entered_by?: string | null
          id?: string
          payment_date: string
          payment_method?: string | null
          status?: string | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          application_id?: string
          created_at?: string | null
          entered_by?: string | null
          id?: string
          payment_date?: string
          payment_method?: string | null
          status?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fund_payments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "community_fund_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_requests: {
        Row: {
          amount: number | null
          cashapp_tag: string
          created_at: string
          email: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          cashapp_tag: string
          created_at?: string
          email: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number | null
          cashapp_tag?: string
          created_at?: string
          email?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      platform_earnings: {
        Row: {
          amount: number
          currency: string
          entered_at: string | null
          entered_by: string | null
          film_id: string
          id: string
          notes: string | null
          payment_date: string
          payment_period_end: string | null
          payment_period_start: string | null
          platform: string
          status: string
          transaction_id: string | null
          views: number | null
        }
        Insert: {
          amount: number
          currency?: string
          entered_at?: string | null
          entered_by?: string | null
          film_id: string
          id?: string
          notes?: string | null
          payment_date: string
          payment_period_end?: string | null
          payment_period_start?: string | null
          platform: string
          status?: string
          transaction_id?: string | null
          views?: number | null
        }
        Update: {
          amount?: number
          currency?: string
          entered_at?: string | null
          entered_by?: string | null
          film_id?: string
          id?: string
          notes?: string | null
          payment_date?: string
          payment_period_end?: string | null
          payment_period_start?: string | null
          platform?: string
          status?: string
          transaction_id?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_earnings_film_id_fkey"
            columns: ["film_id"]
            isOneToOne: false
            referencedRelation: "films"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_revenue: {
        Row: {
          created_at: string
          film_id: string
          id: string
          platform_name: string
          revenue: number
        }
        Insert: {
          created_at?: string
          film_id: string
          id?: string
          platform_name: string
          revenue?: number
        }
        Update: {
          created_at?: string
          film_id?: string
          id?: string
          platform_name?: string
          revenue?: number
        }
        Relationships: [
          {
            foreignKeyName: "platform_revenue_film_id_fkey"
            columns: ["film_id"]
            isOneToOne: false
            referencedRelation: "films"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          company_name: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          profile_image_url: string | null
          role: Database["public"]["Enums"]["user_role"]
          tier: Database["public"]["Enums"]["user_tier"] | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          company_name?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          profile_image_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          tier?: Database["public"]["Enums"]["user_tier"] | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          company_name?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          profile_image_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          tier?: Database["public"]["Enums"]["user_tier"] | null
          updated_at?: string
        }
        Relationships: []
      }
      revenue_growth: {
        Row: {
          created_at: string
          film_id: string
          id: string
          month: string
          revenue: number
        }
        Insert: {
          created_at?: string
          film_id: string
          id?: string
          month: string
          revenue?: number
        }
        Update: {
          created_at?: string
          film_id?: string
          id?: string
          month?: string
          revenue?: number
        }
        Relationships: [
          {
            foreignKeyName: "revenue_growth_film_id_fkey"
            columns: ["film_id"]
            isOneToOne: false
            referencedRelation: "films"
            referencedColumns: ["id"]
          },
        ]
      }
      revenue_shares: {
        Row: {
          company_commission: number
          created_at: string
          film_id: string
          filmmaker_share: number
          id: string
          is_paid: boolean | null
          payment_date: string | null
          platform: string
          platform_fee: number
          revenue_period_end: string
          revenue_period_start: string
          total_revenue: number
          updated_at: string
        }
        Insert: {
          company_commission: number
          created_at?: string
          film_id: string
          filmmaker_share: number
          id?: string
          is_paid?: boolean | null
          payment_date?: string | null
          platform: string
          platform_fee: number
          revenue_period_end: string
          revenue_period_start: string
          total_revenue: number
          updated_at?: string
        }
        Update: {
          company_commission?: number
          created_at?: string
          film_id?: string
          filmmaker_share?: number
          id?: string
          is_paid?: boolean | null
          payment_date?: string | null
          platform?: string
          platform_fee?: number
          revenue_period_end?: string
          revenue_period_start?: string
          total_revenue?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "revenue_shares_film_id_fkey"
            columns: ["film_id"]
            isOneToOne: false
            referencedRelation: "films"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          commission_rate: number
          created_at: string
          description: string
          features: Json
          id: string
          is_highlighted: boolean | null
          name: string
          platforms: string[]
          price: number
          timeline_days: number
          updated_at: string
        }
        Insert: {
          commission_rate: number
          created_at?: string
          description: string
          features: Json
          id?: string
          is_highlighted?: boolean | null
          name: string
          platforms: string[]
          price: number
          timeline_days: number
          updated_at?: string
        }
        Update: {
          commission_rate?: number
          created_at?: string
          description?: string
          features?: Json
          id?: string
          is_highlighted?: boolean | null
          name?: string
          platforms?: string[]
          price?: number
          timeline_days?: number
          updated_at?: string
        }
        Relationships: []
      }
      staff_activity_log: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          staff_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          staff_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          staff_id?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          metadata: Json | null
          plan_id: string
          product_id: string
          start_date: string
          status: string
          subscription_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          metadata?: Json | null
          plan_id: string
          product_id: string
          start_date: string
          status: string
          subscription_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          metadata?: Json | null
          plan_id?: string
          product_id?: string
          start_date?: string
          status?: string
          subscription_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string
          film_id: string | null
          id: string
          payment_method: string | null
          payment_reference: string | null
          service_id: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          transaction_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          film_id?: string | null
          id?: string
          payment_method?: string | null
          payment_reference?: string | null
          service_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          film_id?: string | null
          id?: string
          payment_method?: string | null
          payment_reference?: string | null
          service_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_film_id_fkey"
            columns: ["film_id"]
            isOneToOne: false
            referencedRelation: "films"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      distribution_status:
        | "encoding"
        | "metadata"
        | "submission"
        | "live"
        | "completed"
      film_status:
        | "pending"
        | "in_review"
        | "approved"
        | "rejected"
        | "active"
        | "archived"
      transaction_status: "pending" | "completed" | "failed" | "refunded"
      user_role: "filmmaker" | "admin"
      user_tier: "basic" | "premium" | "elite"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      distribution_status: [
        "encoding",
        "metadata",
        "submission",
        "live",
        "completed",
      ],
      film_status: [
        "pending",
        "in_review",
        "approved",
        "rejected",
        "active",
        "archived",
      ],
      transaction_status: ["pending", "completed", "failed", "refunded"],
      user_role: ["filmmaker", "admin"],
      user_tier: ["basic", "premium", "elite"],
    },
  },
} as const
