export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          location: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          location: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          location?: string
          created_at?: string
        }
      }
      items: {
        Row: {
          id: string
          title: string
          description: string
          price_per_sqft: number
          category: string
          images: string[]
          material_type: string
          warranty: string
          origin: string
          created_at: string
          section: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          price_per_sqft: number
          category: string
          images: string[]
          material_type: string
          warranty: string
          origin: string
          created_at?: string
          section?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price_per_sqft?: number
          category?: string
          images?: string[]
          material_type?: string
          warranty?: string
          origin?: string
          created_at?: string
          section?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          item_id: string
          quantity: number
          width: number | null
          height: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          item_id: string
          quantity?: number
          width?: number | null
          height?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          item_id?: string
          quantity?: number
          width?: number | null
          height?: number | null
          notes?: string | null
          created_at?: string
        }
      }
    }
  }
}