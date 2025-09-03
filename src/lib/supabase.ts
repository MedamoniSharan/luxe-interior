import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl) {
  console.error('❌ Missing VITE_SUPABASE_URL environment variable');
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  console.error('❌ Missing VITE_SUPABASE_ANON_KEY environment variable');
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

console.log('🔗 Supabase Configuration:');
console.log('   URL:', supabaseUrl);
console.log('   Key exists:', !!supabaseAnonKey);
console.log('   Key preview:', supabaseAnonKey.substring(0, 20) + '...');

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type Item = Database['public']['Tables']['items']['Row'];

export async function getItems(category?: string, section?: string, limit?: number): Promise<Item[]> {
  console.log('🚀 getItems called with params:', { 
    category: category || 'ALL', 
    section: section || 'ALL', 
    limit: limit || 'NO_LIMIT' 
  });

  try {
    // Start building the query
    let query = supabase
      .from('items')
      .select('*');

    console.log('📋 Base query created for items table');

    // Apply category filter if provided and not 'all'
    if (category && category !== 'all') {
      query = query.eq('category', category);
      console.log('📂 Applied category filter:', category);
    }

    // Apply section filter if provided
    if (section) {
      query = query.eq('section', section);
      console.log('📋 Applied section filter:', section);
    }

    // Apply limit if provided
    if (limit) {
      query = query.limit(limit);
      console.log('🔢 Applied limit:', limit);
    }

    // Always order by created_at descending
    query = query.order('created_at', { ascending: false });
    console.log('📅 Applied ordering by created_at desc');

    console.log('⚡ Executing Supabase query...');
    const { data, error } = await query;

    if (error) {
      console.error('❌ Supabase query error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return [];
    } else {
      console.log('✅ Query executed successfully');
      console.log('📦 Raw data received:', data);
      console.log('📊 Items count:', data?.length || 0);

      if (data && data.length > 0) {
        console.log('🔍 Sample item structure:', {
          id: data[0].id,
          title: data[0].title,
          category: data[0].category,
          section: data[0].section,
          price_per_sqft: data[0].price_per_sqft,
        });
      } else {
        console.warn('⚠️ No items found with current filters');
      }

      return data || [];
    }
  } catch (error) {
    console.error('💥 Unexpected error in getItems:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return [];
  }
}

export async function getItem(id: string): Promise<Item | null> {
  console.log('🔍 getItem called with ID:', id);
  
  try {
    console.log('⚡ Executing single item query...');
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error('❌ Error fetching single item:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return null;
    }
    
    console.log('✅ Single item query result:', data ? 'FOUND' : 'NOT_FOUND');
    if (data) {
      console.log('📦 Item data:', {
        id: data.id,
        title: data.title,
        category: data.category
      });
    }
    
    return data;
  } catch (error) {
    console.error('💥 Unexpected error in getItem:', error);
    return null;
  }
}

export async function searchItems(query: string): Promise<Item[]> {
  console.log('🔍 searchItems called with query:', query);
  
  if (!query || query.trim().length < 2) {
    console.log('⚠️ Search query too short, returning empty array');
    return [];
  }

  try {
    console.log('⚡ Executing search query...');
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error in search query:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return [];
    }
    
    console.log('✅ Search query executed successfully');
    console.log('📊 Search results count:', data?.length || 0);
    
    return data || [];
  } catch (error) {
    console.error('💥 Unexpected error in searchItems:', error);
    return [];
  }
}

export async function getCategories() {
  console.log('🔍 getCategories called');
  
  try {
    console.log('⚡ Executing categories query...');
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('❌ Error fetching categories:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return [];
    }
    
    console.log('✅ Categories query executed successfully');
    console.log('📊 Categories count:', data?.length || 0);
    
    return data || [];
  } catch (error) {
    console.error('💥 Unexpected error in getCategories:', error);
    return [];
  }
}