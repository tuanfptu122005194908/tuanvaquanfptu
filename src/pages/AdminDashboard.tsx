import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Package, DollarSign, Users, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  in_stock: boolean;
  created_at: string;
}

interface Order {
  id: string;
  order_code: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  customers: {
    full_name: string;
    email: string;
  };
}

interface ContactRequest {
  id: string;
  full_name: string;
  email: string;
  service: string;
  message?: string;
  status: string;
  created_at: string;
}

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalContacts: number;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalContacts: 0
  });
  const [loading, setLoading] = useState(true);
  
  // Product form state
  const [productForm, setProductForm] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    image_url: "",
    in_stock: true
  });
  const [editingProduct, setEditingProduct] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      // Fetch orders with customer data
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          customers (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch contact requests
      const { data: contactsData, error: contactsError } = await supabase
        .from('contact_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (contactsError) throw contactsError;

      setProducts(productsData || []);
      setOrders(ordersData || []);
      setContacts(contactsData || []);

      // Calculate stats
      const totalRevenue = ordersData?.filter(o => o.payment_status === 'paid')
        .reduce((sum, order) => sum + order.total_amount, 0) || 0;

      setStats({
        totalOrders: ordersData?.length || 0,
        totalRevenue,
        totalProducts: productsData?.length || 0,
        totalContacts: contactsData?.length || 0
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name: productForm.name,
      description: productForm.description,
      price: parseInt(productForm.price),
      image_url: productForm.image_url || "",
      in_stock: productForm.in_stock
    };

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', productForm.id);
        
        if (error) throw error;
        toast.success('Cập nhật sản phẩm thành công');
      } else {
        const { error } = await supabase
          .from('products')
          .insert(productData);
        
        if (error) throw error;
        toast.success('Thêm sản phẩm thành công');
      }

      setProductForm({
        id: "",
        name: "",
        description: "",
        price: "",
        image_url: "",
        in_stock: true
      });
      setEditingProduct(false);
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Có lỗi xảy ra khi lưu sản phẩm');
    }
  };

  const handleEditProduct = (product: Product) => {
    setProductForm({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image_url: product.image_url || "",
      in_stock: product.in_stock
    });
    setEditingProduct(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        toast.success('Xóa sản phẩm thành công');
        fetchData();
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Có lỗi xảy ra khi xóa sản phẩm');
      }
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      
      if (error) throw error;
      toast.success('Cập nhật trạng thái đơn hàng thành công');
      fetchData();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Có lỗi xảy ra');
    }
  };

  const updateContactStatus = async (contactId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_requests')
        .update({ status })
        .eq('id', contactId);
      
      if (error) throw error;
      toast.success('Cập nhật trạng thái liên hệ thành công');
      fetchData();
    } catch (error) {
      console.error('Error updating contact status:', error);
      toast.error('Có lỗi xảy ra');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-8 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng đơn hàng</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Doanh thu</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sản phẩm</p>
                <p className="text-2xl font-bold">{stats.totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Liên hệ</p>
                <p className="text-2xl font-bold">{stats.totalContacts}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">Quản lý sản phẩm</TabsTrigger>
          <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
          <TabsTrigger value="contacts">Liên hệ</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          {/* Product Form */}
          <Card>
            <CardHeader>
              <CardTitle>{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Tên sản phẩm</Label>
                    <Input
                      id="name"
                      value={productForm.name}
                      onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Giá (VND)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={productForm.description}
                    onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="image_url">URL hình ảnh</Label>
                  <Input
                    id="image_url"
                    value={productForm.image_url}
                    onChange={(e) => setProductForm(prev => ({ ...prev, image_url: e.target.value }))}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="in_stock"
                    checked={productForm.in_stock}
                    onChange={(e) => setProductForm(prev => ({ ...prev, in_stock: e.target.checked }))}
                  />
                  <Label htmlFor="in_stock">Còn hàng</Label>
                </div>
                <div className="flex space-x-4">
                  <Button type="submit">
                    {editingProduct ? 'Cập nhật' : 'Thêm'} sản phẩm
                  </Button>
                  {editingProduct && (
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setProductForm({
                          id: "",
                          name: "",
                          description: "",
                          price: "",
                          image_url: "",
                          in_stock: true
                        });
                        setEditingProduct(false);
                      }}
                    >
                      Hủy
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Products List */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>{formatCurrency(product.price)}</TableCell>
                      <TableCell>
                        <Badge variant={product.in_stock ? "default" : "secondary"}>
                          {product.in_stock ? "Còn hàng" : "Hết hàng"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã đơn</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Tổng tiền</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thanh toán</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.order_code}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customers?.full_name}</p>
                          <p className="text-sm text-muted-foreground">{order.customers?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(order.total_amount)}</TableCell>
                      <TableCell>
                        <Badge variant={
                          order.status === 'delivered' ? 'default' :
                          order.status === 'confirmed' ? 'secondary' :
                          order.status === 'cancelled' ? 'destructive' : 'outline'
                        }>
                          {order.status === 'pending' ? 'Chờ xác nhận' :
                           order.status === 'confirmed' ? 'Đã xác nhận' :
                           order.status === 'delivered' ? 'Đã giao' : 'Đã hủy'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={order.payment_status === 'paid' ? 'default' : 'outline'}>
                          {order.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(order.created_at)}</TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value) => updateOrderStatus(order.id, value)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Chờ xác nhận</SelectItem>
                            <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                            <SelectItem value="delivered">Đã giao</SelectItem>
                            <SelectItem value="cancelled">Đã hủy</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách liên hệ</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Họ tên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Dịch vụ</TableHead>
                    <TableHead>Tin nhắn</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">{contact.full_name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.service}</TableCell>
                      <TableCell className="max-w-xs truncate">{contact.message}</TableCell>
                      <TableCell>
                        <Badge variant={
                          contact.status === 'replied' ? 'default' :
                          contact.status === 'closed' ? 'secondary' : 'outline'
                        }>
                          {contact.status === 'new' ? 'Mới' :
                           contact.status === 'replied' ? 'Đã trả lời' : 'Đã đóng'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(contact.created_at)}</TableCell>
                      <TableCell>
                        <Select
                          value={contact.status}
                          onValueChange={(value) => updateContactStatus(contact.id, value)}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">Mới</SelectItem>
                            <SelectItem value="replied">Đã trả lời</SelectItem>
                            <SelectItem value="closed">Đã đóng</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}