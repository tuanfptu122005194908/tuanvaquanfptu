import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Save, Clock, DollarSign, Package } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { SchoolTerm } from "@/hooks/useAdminData";

interface Order {
  id: number;
  created_at: string;
  status: string;
  total: number;
}

const SchoolTermsTab = () => {
  const [terms, setTerms] = useState<SchoolTerm[]>([]);
  const [currentTerm, setCurrentTerm] = useState<SchoolTerm | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newTermName, setNewTermName] = useState('');
  const [newTermStartDate, setNewTermStartDate] = useState('');

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const calculateTermStats = (term: SchoolTerm, allOrders: Order[]) => {
    const termStartDate = new Date(term.start_date);
    termStartDate.setHours(0, 0, 0, 0);
    
    const termEndDate = term.end_date ? new Date(term.end_date) : new Date();
    termEndDate.setHours(23, 59, 59, 999);

    console.log('Calculating stats for term:', {
      termName: term.name,
      termStartDate: termStartDate.toISOString(),
      termEndDate: termEndDate.toISOString()
    });

    const termRevenue = allOrders.reduce((sum, order) => {
      const orderDate = new Date(order.created_at);
      if (order.status === 'completed' && orderDate >= termStartDate && orderDate <= termEndDate) {
        console.log('Order included in revenue:', {
          orderId: order.id,
          orderDate: orderDate.toISOString(),
          total: order.total
        });
        return sum + Number(order.total);
      }
      return sum;
    }, 0);

    const termOrders = allOrders.filter(order => {
      const orderDate = new Date(order.created_at);
      const isInTerm = orderDate >= termStartDate && orderDate <= termEndDate;
      if (isInTerm) {
        console.log('Order included in count:', {
          orderId: order.id,
          orderDate: orderDate.toISOString(),
          status: order.status
        });
      }
      return isInTerm;
    }).length;

    console.log('Term stats calculated:', { termRevenue, termOrders });

    return { termRevenue, termOrders };
  };

  const fetchTerms = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('school_terms' as any)
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;

      setTerms(data as any || []);
      const active = (data as any)?.find((term: any) => term.is_active) || null;
      setCurrentTerm(active);
    } catch (error) {
      console.error('Error fetching school terms:', error);
      toast.error('Lỗi khi tải dữ liệu kỳ học');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
    fetchOrders();
  }, []);

  const createNewTerm = async () => {
    if (!newTermName.trim() || !newTermStartDate) {
      toast.error('Vui lòng nhập đủ thông tin kỳ học');
      return;
    }

    setIsCreating(true);
    try {
      const { data, error } = await supabase.rpc('create_new_term' as any, {
        term_name: newTermName.trim(),
        term_start_date: new Date(newTermStartDate).toISOString()
      });

      if (error) throw error;

      toast.success(`Đã tạo kỳ học mới: ${newTermName}`);
      setNewTermName('');
      setNewTermStartDate('');
      setIsCreating(false);
      fetchTerms();
      fetchOrders();
    } catch (error) {
      console.error('Error creating new term:', error);
      toast.error('Lỗi khi tạo kỳ học mới');
      setIsCreating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return `${(amount / 1000000).toFixed(1)}M₫`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/30 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Term Status */}
      {currentTerm && (() => {
        const { termRevenue, termOrders } = calculateTermStats(currentTerm as any, orders);
        return (
          <Card className="border-gradient-to-r from-primary to-purple-500 bg-gradient-to-br from-primary/5 to-purple-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-primary" />
                Kỳ học hiện tại
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Tên kỳ học</Label>
                  <p className="font-semibold text-lg">{currentTerm.name}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Ngày bắt đầu</Label>
                  <p className="font-medium">{formatDate(currentTerm.start_date)}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Doanh thu kỳ này</Label>
                  <p className="font-semibold text-emerald-600 text-lg">
                    {formatCurrency(termRevenue)}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Số đơn hàng</Label>
                  <p className="font-semibold text-blue-600 text-lg">
                    {termOrders} đơn
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })()}

      {/* Create New Term */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Plus className="h-5 w-5 text-primary" />
            Tạo kỳ học mới
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="termName">Tên kỳ học</Label>
              <Input
                id="termName"
                placeholder="Ví dụ: Học kỳ 1 2024-2025"
                value={newTermName}
                onChange={(e) => setNewTermName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Ngày bắt đầu</Label>
              <Input
                id="startDate"
                type="date"
                value={newTermStartDate}
                onChange={(e) => setNewTermStartDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={createNewTerm}
                disabled={isCreating || !newTermName.trim() || !newTermStartDate}
                className="w-full"
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Tạo kỳ học mới
                  </>
                )}
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Lưu ý: Khi tạo kỳ học mới, kỳ học hiện tại sẽ tự động kết thúc và doanh thu sẽ được lưu lại.
          </p>
        </CardContent>
      </Card>

      {/* Terms History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-primary" />
            Lịch sử kỳ học
          </CardTitle>
        </CardHeader>
        <CardContent>
          {terms.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Chưa có kỳ học nào được tạo</p>
            </div>
          ) : (
            <div className="space-y-4">
              {terms.map((term) => {
                const { termRevenue, termOrders } = calculateTermStats(term as any, orders);
                return (
                  <div 
                    key={term.id} 
                    className={`p-4 rounded-lg border ${
                      term.is_active 
                        ? 'bg-primary/5 border-primary/20' 
                        : 'bg-muted/30 border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{term.name}</h3>
                          {term.is_active && (
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              Đang hoạt động
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Bắt đầu:</span>
                            <p className="font-medium">{formatDate(term.start_date)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Kết thúc:</span>
                            <p className="font-medium">
                              {term.end_date ? formatDate(term.end_date) : 'Đang diễn ra'}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Doanh thu:</span>
                            <p className="font-semibold text-emerald-600">
                              {formatCurrency(termRevenue)}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Đơn hàng:</span>
                            <p className="font-semibold text-blue-600">
                              {termOrders} đơn
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SchoolTermsTab;
