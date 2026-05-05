import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Order } from './useOrders';

export interface SchoolTerm {
  id: string;
  name: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  total_revenue: number;
  total_orders: number;
  created_at: string;
  updated_at: string;
}

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  pendingOrders: number;
  currentTerm: SchoolTerm | null;
  termRevenue: number;
  termOrders: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  order_count: number;
  total_spent: number;
  created_at: string;
}

export function useAdminData() {
  const [stats, setStats] = useState<AdminStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    pendingOrders: 0,
    currentTerm: null,
    termRevenue: 0,
    termOrders: 0
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch all orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch all users/profiles
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Fetch current school term
      const { data: currentTerm, error: termError } = await supabase
        .from('school_terms' as any)
        .select('*')
        .eq('is_active', true)
        .order('start_date', { ascending: false })
        .limit(1)
        .single();

      if (termError && termError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching current term:', termError);
      }

      setOrders(ordersData as any as Order[] || []);
      setUsers(usersData as any as AdminUser[] || []);

      // Calculate overall stats
      const totalRevenue = ordersData?.reduce((sum, order) => {
        if (order.status === 'completed') {
          return sum + Number(order.total);
        }
        return sum;
      }, 0) || 0;

      const pendingCount = ordersData?.filter(o => o.status === 'pending').length || 0;

      // Calculate term-specific stats
      let termRevenue = 0;
      let termOrders = 0;

      if (currentTerm && currentTerm && 'start_date' in currentTerm) {
        const term = currentTerm as any; // Use any to bypass type checking temporarily
        console.log('Current term data:', term);
        
        // Convert to local timezone to ensure accuracy
        const termStartDate = new Date(term.start_date);
        // Set start of day to be precise
        termStartDate.setHours(0, 0, 0, 0);
        
        const termEndDate = term.end_date ? new Date(term.end_date) : new Date();
        // Set end of day to be precise
        termEndDate.setHours(23, 59, 59, 999);

        console.log('Term calculation:', {
          termName: term.name,
          termStartDate: termStartDate.toISOString(),
          termEndDate: termEndDate.toISOString()
        });

        // Debug: Log all orders to see what we're working with
        console.log('All orders:', ordersData?.map(o => ({
          id: o.id,
          created_at: o.created_at,
          status: o.status,
          total: o.total
        })));

        termRevenue = ordersData?.reduce((sum, order) => {
          const orderDate = new Date(order.created_at);
          // Only include completed orders within term period
          if (order.status === 'completed' && orderDate >= termStartDate && orderDate <= termEndDate) {
            console.log('Order included in term revenue:', {
              orderId: order.id,
              orderDate: orderDate.toISOString(),
              total: order.total
            });
            return sum + Number(order.total);
          }
          return sum;
        }, 0) || 0;

        termOrders = ordersData?.filter(order => {
          const orderDate = new Date(order.created_at);
          // Include all orders (regardless of status) within term period
          const isInTerm = orderDate >= termStartDate && orderDate <= termEndDate;
          if (isInTerm) {
            console.log('Order included in term count:', {
              orderId: order.id,
              orderDate: orderDate.toISOString(),
              status: order.status
            });
          }
          return isInTerm;
        }).length || 0;

        console.log('Term stats calculated:', {
          termRevenue,
          termOrders,
          totalOrdersInData: ordersData?.length
        });
      } else {
        console.log('No current term found or term data is invalid:', currentTerm);
      }

      setStats({
        totalOrders: ordersData?.length || 0,
        totalRevenue,
        totalUsers: usersData?.length || 0,
        pendingOrders: pendingCount,
        currentTerm: currentTerm as any as SchoolTerm | null,
        termRevenue,
        termOrders
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    stats,
    orders,
    users,
    isLoading,
    refreshData: fetchData
  };
}
