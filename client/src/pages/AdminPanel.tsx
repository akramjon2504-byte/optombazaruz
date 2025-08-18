import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { apiRequest } from '@/lib/queryClient';

// Type definitions
interface Category {
  id: string;
  nameUz: string;
  nameRu: string;
  descriptionUz?: string;
  descriptionRu?: string;
  imageUrl?: string;
  slug: string;
}

interface Product {
  id: string;
  nameUz: string;
  nameRu: string;
  descriptionUz: string;
  descriptionRu: string;
  categoryId: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  imageUrl2?: string;
  imageUrl3?: string;
  slug: string;
  isHit: boolean;
  isPromo: boolean;
  stock: number;
}

interface ChatMessage {
  id: string;
  sessionId: string;
  userName?: string;
  userPhone?: string;
  message: string;
  isFromUser: boolean;
  createdAt: string;
}
import { 
  Users, 
  Package, 
  BarChart3, 
  MessageSquare, 
  Settings,
  Send,
  Bot,
  FileText,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  FolderPlus
} from 'lucide-react';



function AdminPanel() {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [telegramMessage, setTelegramMessage] = useState('');
  const [blogTopic, setBlogTopic] = useState('');
  
  // Blog editing states
  const [showBlogEditDialog, setShowBlogEditDialog] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const [blogEditForm, setBlogEditForm] = useState({
    titleUz: '',
    titleRu: '',
    contentUz: '',
    contentRu: '',
    excerpt: '',
    imageUrl: '',
    slug: '',
    isPublished: true
  });
  
  // Category form states
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    nameUz: '',
    nameRu: '',
    descriptionUz: '',
    descriptionRu: '',
    imageUrl: '',
    slug: ''
  });

  // Product form states  
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    nameUz: '',
    nameRu: '',
    descriptionUz: '',
    descriptionRu: '',
    categoryId: '',
    price: '0',
    originalPrice: '0',
    imageUrl: '',
    imageUrl2: '',
    imageUrl3: '',
    slug: '',
    isHit: false,
    isPromo: false,
    stock: 0
  });

  // Marketing states
  const [marketingType, setMarketingType] = useState('daily');
  const [marketingTopic, setMarketingTopic] = useState('');



  // Fetch admin data
  const { data: stats } = useQuery({
    queryKey: ['/api/admin/stats'],
  });

  const { data: users } = useQuery({
    queryKey: ['/api/admin/users'],
  });

  const { data: orders } = useQuery({
    queryKey: ['/api/admin/orders'],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
  });

  const { data: products = [] } = useQuery({
    queryKey: ['/api/products'],
  });

  const { data: chatMessages = [], isLoading: isLoadingChatMessages } = useQuery({
    queryKey: ['/api/admin/chat-messages'],
    enabled: selectedTab === 'chat'
  });

  const { data: blogPosts = [], isLoading: isLoadingBlogPosts } = useQuery({
    queryKey: ['/api/admin/blog'],
    enabled: selectedTab === 'blog'
  });

  // Send Telegram message
  const telegramMutation = useMutation({
    mutationFn: async (message: string) => {
      return apiRequest('/api/admin/telegram/send', 'POST', { message });
    },
    onSuccess: () => {
      toast({
        title: t('success'),
        description: language === 'uz' ? 'Telegram xabari yuborildi' : 'Telegram сообщение отправлено',
      });
      setTelegramMessage('');
    },
    onError: (error: Error) => {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Generate blog post
  const blogMutation = useMutation({
    mutationFn: async (topic: string) => {
      return apiRequest('/api/admin/generate-blog-post', 'POST', { topic });
    },
    onSuccess: (data) => {
      // Auto-save generated blog post
      saveBlogPostMutation.mutate(data);
    },
    onError: (error: Error) => {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Save blog post
  const saveBlogPostMutation = useMutation({
    mutationFn: async (blogPost: any) => {
      return apiRequest('/api/admin/blog', 'POST', blogPost);
    },
    onSuccess: () => {
      toast({
        title: t('success'),
        description: language === 'uz' ? 'Blog maqola saqlandi' : 'Статья блога сохранена',
      });
      setBlogTopic('');
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog'] });
    },
    onError: (error: Error) => {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update blog post status
  const updateBlogPostMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: any }) => {
      return apiRequest(`/api/admin/blog/${id}`, 'PATCH', updates);
    },
    onSuccess: () => {
      toast({
        title: t('success'),
        description: language === 'uz' ? 'Blog maqola yangilandi' : 'Статья блога обновлена',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog'] });
      setShowBlogEditDialog(false);
      setEditingBlog(null);
    },
    onError: (error: Error) => {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete blog post
  const deleteBlogPostMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/admin/blog/${id}`, 'DELETE');
    },
    onSuccess: () => {
      toast({
        title: t('success'),
        description: language === 'uz' ? 'Blog maqola o\'chirildi' : 'Статья блога удалена',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog'] });
    },
    onError: (error: Error) => {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Handle blog edit functions
  const handleEditBlog = (blog: any) => {
    setEditingBlog(blog);
    setBlogEditForm({
      titleUz: blog.titleUz,
      titleRu: blog.titleRu,
      contentUz: blog.contentUz,
      contentRu: blog.contentRu,
      excerpt: blog.excerpt || '',
      imageUrl: blog.imageUrl || '',
      slug: blog.slug,
      isPublished: blog.isPublished
    });
    setShowBlogEditDialog(true);
  };

  const handleSaveBlogEdit = () => {
    if (editingBlog) {
      updateBlogPostMutation.mutate({
        id: editingBlog.id,
        updates: blogEditForm
      });
    }
  };

  const handleSendTelegram = () => {
    if (telegramMessage.trim()) {
      telegramMutation.mutate(telegramMessage);
    }
  };

  const handleGenerateBlog = () => {
    if (blogTopic.trim()) {
      blogMutation.mutate(blogTopic);
    }
  };

  // Category mutations
  const createCategoryMutation = useMutation({
    mutationFn: async (categoryData: typeof categoryForm) => {
      return apiRequest('/api/admin/categories', 'POST', categoryData);
    },
    onSuccess: () => {
      toast({
        title: language === 'uz' ? 'Muvaffaqiyat' : 'Успех',
        description: language === 'uz' ? 'Kategoriya yaratildi' : 'Категория создана',
      });
      setShowCategoryDialog(false);
      resetCategoryForm();
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
    },
    onError: (error: Error) => {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof categoryForm }) => {
      return apiRequest(`/api/admin/categories/${id}`, 'PUT', data);
    },
    onSuccess: () => {
      toast({
        title: language === 'uz' ? 'Muvaffaqiyat' : 'Успех',
        description: language === 'uz' ? 'Kategoriya yangilandi' : 'Категория обновлена',
      });
      setShowCategoryDialog(false);
      resetCategoryForm();
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
    },
    onError: (error: Error) => {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/admin/categories/${id}`, 'DELETE');
    },
    onSuccess: () => {
      toast({
        title: language === 'uz' ? 'Muvaffaqiyat' : 'Успех',
        description: language === 'uz' ? 'Kategoriya o\'chirildi' : 'Категория удалена',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
    },
    onError: (error: Error) => {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Auto marketing mutation  
  const autoMarketingMutation = useMutation({
    mutationFn: async ({ type, topic }: { type: string; topic?: string }) => {
      return apiRequest('/api/admin/auto-marketing', 'POST', { type, topic });
    },
    onSuccess: () => {
      toast({
        title: language === 'uz' ? 'Muvaffaqiyat' : 'Успех',
        description: language === 'uz' ? 'AI xabar yaratildi va yuborildi' : 'AI сообщение создано и отправлено',
      });
      setMarketingTopic('');
    },
    onError: (error: Error) => {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Product mutations
  const createProductMutation = useMutation({
    mutationFn: async (productData: typeof productForm) => {
      return apiRequest('/api/admin/products', 'POST', productData);
    },
    onSuccess: () => {
      toast({
        title: language === 'uz' ? 'Muvaffaqiyat' : 'Успех',
        description: language === 'uz' ? 'Mahsulot yaratildi va marketing xabari yuborildi' : 'Продукт создан и маркетинговое сообщение отправлено',
      });
      setShowProductDialog(false);
      resetProductForm();
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
    onError: (error: Error) => {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof productForm }) => {
      return apiRequest(`/api/admin/products/${id}`, 'PUT', data);
    },
    onSuccess: () => {
      toast({
        title: language === 'uz' ? 'Muvaffaqiyat' : 'Успех',
        description: language === 'uz' ? 'Mahsulot yangilandi' : 'Продукт обновлен',
      });
      setShowProductDialog(false);
      resetProductForm();
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
    onError: (error: Error) => {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/admin/products/${id}`, 'DELETE');
    },
    onSuccess: () => {
      toast({
        title: language === 'uz' ? 'Muvaffaqiyat' : 'Успех',
        description: language === 'uz' ? 'Mahsulot o\'chirildi' : 'Продукт удален',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
    onError: (error: Error) => {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });



  // Helper functions
  const resetCategoryForm = () => {
    setCategoryForm({
      nameUz: '',
      nameRu: '',
      descriptionUz: '',
      descriptionRu: '',
      imageUrl: '',
      slug: ''
    });
    setEditingCategory(null);
  };

  const resetProductForm = () => {
    setProductForm({
      nameUz: '',
      nameRu: '',
      descriptionUz: '',
      descriptionRu: '',
      categoryId: '',
      price: '0',
      originalPrice: '0',
      imageUrl: '',
      imageUrl2: '',
      imageUrl3: '',
      slug: '',
      isHit: false,
      isPromo: false,
      stock: 0
    });
    setEditingProduct(null);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      nameUz: category.nameUz,
      nameRu: category.nameRu,
      descriptionUz: category.descriptionUz || '',
      descriptionRu: category.descriptionRu || '',
      imageUrl: category.imageUrl || '',
      slug: category.slug
    });
    setShowCategoryDialog(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      nameUz: product.nameUz,
      nameRu: product.nameRu,
      descriptionUz: product.descriptionUz || '',
      descriptionRu: product.descriptionRu || '',
      categoryId: product.categoryId,
      price: product.price.toString(),
      originalPrice: (product.originalPrice || 0).toString(),
      imageUrl: product.imageUrl || '',
      imageUrl2: product.imageUrl2 || '',
      imageUrl3: product.imageUrl3 || '',
      slug: product.slug,
      isHit: product.isHit || false,
      isPromo: product.isPromo || false,
      stock: product.stock
    });
    setShowProductDialog(true);
  };

  const handleSaveCategory = () => {
    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, data: categoryForm });
    } else {
      createCategoryMutation.mutate(categoryForm);
    }
  };

  const handleSaveProduct = () => {
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data: productForm });
    } else {
      createProductMutation.mutate(productForm);
    }
  };

  const handleAutoMarketing = () => {
    if (marketingTopic.trim() || marketingType === 'daily') {
      autoMarketingMutation.mutate({ type: marketingType, topic: marketingTopic || '' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="border-b bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Settings className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">{t('adminPanel')}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Button variant="outline" onClick={() => window.location.href = '/api/auth/logout'}>
                {t('logout')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-8 gap-1">
            <TabsTrigger value="dashboard" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
              <BarChart3 className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden md:inline">{t('dashboard')}</span>
              <span className="md:hidden">📊</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
              <FolderPlus className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden md:inline">{language === 'uz' ? 'Kategoriyalar' : 'Категории'}</span>
              <span className="md:hidden">📁</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
              <Package className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden md:inline">{language === 'uz' ? 'Mahsulotlar' : 'Продукты'}</span>
              <span className="md:hidden">📦</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
              <Users className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden md:inline">{language === 'uz' ? 'Foydalanuvchilar' : 'Пользователи'}</span>
              <span className="md:hidden">👥</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
              <MessageSquare className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden md:inline">{language === 'uz' ? 'Chat Xabarlari' : 'Чат Сообщения'}</span>
              <span className="md:hidden">💬</span>
            </TabsTrigger>
            <TabsTrigger value="marketing" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
              <Send className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden md:inline">{language === 'uz' ? 'Marketing' : 'Маркетинг'}</span>
              <span className="md:hidden">📢</span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
              <FileText className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden md:inline">{t('blog')}</span>
              <span className="md:hidden">📝</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
              <Bot className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden md:inline">{language === 'uz' ? 'Buyurtmalar' : 'Заказы'}</span>
              <span className="md:hidden">🛒</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {language === 'uz' ? 'Jami foydalanuvchilar' : 'Всего пользователей'}
                      </p>
                      <p className="text-2xl font-bold">{(users as any[])?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Package className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {language === 'uz' ? 'Jami buyurtmalar' : 'Всего заказов'}
                      </p>
                      <p className="text-2xl font-bold">{(orders as any[])?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {language === 'uz' ? 'Oylik savdo' : 'Месячные продажи'}
                      </p>
                      <p className="text-2xl font-bold">0 so'm</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-8 w-8 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {language === 'uz' ? 'Chat xabarlari' : 'Чат сообщения'}
                      </p>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {language === 'uz' ? 'Kategoriyalar' : 'Категории'}
              </h2>
              <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
                <DialogTrigger asChild>
                  <Button onClick={() => { 
                    setEditingCategory(null); 
                    setCategoryForm({ nameUz: '', nameRu: '', descriptionUz: '', descriptionRu: '', slug: '', imageUrl: '' });
                    setShowCategoryDialog(true); 
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    {language === 'uz' ? 'Yangi kategoriya' : 'Новая категория'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingCategory 
                        ? (language === 'uz' ? 'Kategoriyani tahrirlash' : 'Редактировать категорию')
                        : (language === 'uz' ? 'Yangi kategoriya' : 'Новая категория')
                      }
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="nameUz" className="text-right">
                        {language === 'uz' ? 'Nom (O\'zbek)' : 'Название (Узбекский)'}
                      </Label>
                      <Input
                        id="nameUz"
                        value={categoryForm.nameUz}
                        onChange={(e) => setCategoryForm({...categoryForm, nameUz: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="nameRu" className="text-right">
                        {language === 'uz' ? 'Nom (Rus)' : 'Название (Русский)'}
                      </Label>
                      <Input
                        id="nameRu"
                        value={categoryForm.nameRu}
                        onChange={(e) => setCategoryForm({...categoryForm, nameRu: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="descriptionUz" className="text-right">
                        {language === 'uz' ? 'Tavsif (O\'zbek)' : 'Описание (Узбекский)'}
                      </Label>
                      <Textarea
                        id="descriptionUz"
                        value={categoryForm.descriptionUz}
                        onChange={(e) => setCategoryForm({...categoryForm, descriptionUz: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="descriptionRu" className="text-right">
                        {language === 'uz' ? 'Tavsif (Rus)' : 'Описание (Русский)'}
                      </Label>
                      <Textarea
                        id="descriptionRu"
                        value={categoryForm.descriptionRu}
                        onChange={(e) => setCategoryForm({...categoryForm, descriptionRu: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="slug" className="text-right">
                        Slug
                      </Label>
                      <Input
                        id="slug"
                        value={categoryForm.slug}
                        onChange={(e) => setCategoryForm({...categoryForm, slug: e.target.value})}
                        className="col-span-3"
                        placeholder="kategoriya-slug"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="imageUrl" className="text-right">
                        {language === 'uz' ? 'Rasm URL' : 'URL изображения'}
                      </Label>
                      <Input
                        id="imageUrl"
                        value={categoryForm.imageUrl}
                        onChange={(e) => setCategoryForm({...categoryForm, imageUrl: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
                      {language === 'uz' ? 'Bekor qilish' : 'Отмена'}
                    </Button>
                    <Button onClick={handleSaveCategory} disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}>
                      {createCategoryMutation.isPending || updateCategoryMutation.isPending 
                        ? (language === 'uz' ? 'Saqlanmoqda...' : 'Сохранение...')
                        : (language === 'uz' ? 'Saqlash' : 'Сохранить')
                      }
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>{language === 'uz' ? 'Nom (O\'zbek)' : 'Название (Узбекский)'}</TableHead>
                      <TableHead>{language === 'uz' ? 'Nom (Rus)' : 'Название (Русский)'}</TableHead>
                      <TableHead>{language === 'uz' ? 'Amallar' : 'Действия'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(categories as Category[])?.map((category: Category) => (
                      <TableRow key={category.id}>
                        <TableCell>{category.id}</TableCell>
                        <TableCell>{category.nameUz}</TableCell>
                        <TableCell>{category.nameRu}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditCategory(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => deleteCategoryMutation.mutate(category.id)}
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

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {language === 'uz' ? 'Mahsulotlar' : 'Продукты'}
              </h2>
              <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
                <DialogTrigger asChild>
                  <Button onClick={() => { resetProductForm(); setShowProductDialog(true); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    {language === 'uz' ? 'Yangi mahsulot' : 'Новый продукт'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProduct 
                        ? (language === 'uz' ? 'Mahsulotni tahrirlash' : 'Редактировать продукт')
                        : (language === 'uz' ? 'Yangi mahsulot' : 'Новый продукт')
                      }
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="productNameUz" className="text-right">
                        {language === 'uz' ? 'Nom (O\'zbek)' : 'Название (Узбекский)'}
                      </Label>
                      <Input
                        id="productNameUz"
                        value={productForm.nameUz}
                        onChange={(e) => setProductForm({...productForm, nameUz: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="productNameRu" className="text-right">
                        {language === 'uz' ? 'Nom (Rus)' : 'Название (Русский)'}
                      </Label>
                      <Input
                        id="productNameRu"
                        value={productForm.nameRu}
                        onChange={(e) => setProductForm({...productForm, nameRu: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="productCategory" className="text-right">
                        {language === 'uz' ? 'Kategoriya' : 'Категория'}
                      </Label>
                      <Select value={productForm.categoryId} onValueChange={(value) => setProductForm({...productForm, categoryId: value})}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder={language === 'uz' ? 'Kategoriya tanlang' : 'Выберите категорию'} />
                        </SelectTrigger>
                        <SelectContent>
                          {(categories as Category[])?.map((category: Category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {language === 'uz' ? category.nameUz : category.nameRu}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="productSlug" className="text-right">
                        Slug
                      </Label>
                      <Input
                        id="productSlug"
                        value={productForm.slug}
                        onChange={(e) => setProductForm({...productForm, slug: e.target.value})}
                        className="col-span-3"
                        placeholder="mahsulot-slug"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="productDescUz" className="text-right">
                        {language === 'uz' ? 'Tavsif (O\'zbek)' : 'Описание (Узбекский)'}
                      </Label>
                      <Textarea
                        id="productDescUz"
                        value={productForm.descriptionUz}
                        onChange={(e) => setProductForm({...productForm, descriptionUz: e.target.value})}
                        className="col-span-3"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="productDescRu" className="text-right">
                        {language === 'uz' ? 'Tavsif (Rus)' : 'Описание (Русский)'}
                      </Label>
                      <Textarea
                        id="productDescRu"
                        value={productForm.descriptionRu}
                        onChange={(e) => setProductForm({...productForm, descriptionRu: e.target.value})}
                        className="col-span-3"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="productPrice" className="text-right">
                        {language === 'uz' ? 'Narx (so\'m)' : 'Цена (сум)'}
                      </Label>
                      <Input
                        id="productPrice"
                        type="number"
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="productStock" className="text-right">
                        {language === 'uz' ? 'Soni' : 'Количество'}
                      </Label>
                      <Input
                        id="productStock"
                        type="number"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({...productForm, stock: parseInt(e.target.value) || 0})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="productImage1" className="text-right">
                        {language === 'uz' ? 'Rasm URL 1' : 'URL изображения 1'}
                      </Label>
                      <Input
                        id="productImage1"
                        value={productForm.imageUrl}
                        onChange={(e) => setProductForm({...productForm, imageUrl: e.target.value})}
                        className="col-span-3"
                        placeholder="https://example.com/image1.jpg"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="productImage2" className="text-right">
                        {language === 'uz' ? 'Rasm URL 2' : 'URL изображения 2'}
                      </Label>
                      <Input
                        id="productImage2"
                        value={productForm.imageUrl2}
                        onChange={(e) => setProductForm({...productForm, imageUrl2: e.target.value})}
                        className="col-span-3"
                        placeholder="https://example.com/image2.jpg"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="productImage3" className="text-right">
                        {language === 'uz' ? 'Rasm URL 3' : 'URL изображения 3'}
                      </Label>
                      <Input
                        id="productImage3"
                        value={productForm.imageUrl3}
                        onChange={(e) => setProductForm({...productForm, imageUrl3: e.target.value})}
                        className="col-span-3"
                        placeholder="https://example.com/image3.jpg"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowProductDialog(false)}>
                      {language === 'uz' ? 'Bekor qilish' : 'Отмена'}
                    </Button>
                    <Button onClick={handleSaveProduct} disabled={createProductMutation.isPending || updateProductMutation.isPending}>
                      {createProductMutation.isPending || updateProductMutation.isPending 
                        ? (language === 'uz' ? 'Saqlanmoqda...' : 'Сохранение...')
                        : (language === 'uz' ? 'Saqlash' : 'Сохранить')
                      }
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>{language === 'uz' ? 'Nom' : 'Название'}</TableHead>
                      <TableHead>{language === 'uz' ? 'Narx' : 'Цена'}</TableHead>
                      <TableHead>{language === 'uz' ? 'Soni' : 'Количество'}</TableHead>
                      <TableHead>{language === 'uz' ? 'Amallar' : 'Действия'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(products as Product[])?.map((product: Product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.id}</TableCell>
                        <TableCell>{language === 'uz' ? product.nameUz : product.nameRu}</TableCell>
                        <TableCell>{product.price?.toLocaleString()} so'm</TableCell>
                        <TableCell>{product.stock}</TableCell>
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
                              onClick={() => deleteProductMutation.mutate(product.id)}
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

          <TabsContent value="marketing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Telegram Marketing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="telegramMessage">
                    {language === 'uz' ? 'Telegram kanaliga xabar yuborish' : 'Отправить сообщение в Telegram канал'}
                  </Label>
                  <Textarea
                    id="telegramMessage"
                    placeholder={language === 'uz' 
                      ? '🔥 Yangi aksiya! OptomBazar.uz da...' 
                      : '🔥 Новая акция! На OptomBazar.uz...'}
                    value={telegramMessage}
                    onChange={(e) => setTelegramMessage(e.target.value)}
                    rows={4}
                    data-testid="textarea-telegram-message"
                  />
                </div>
                <Button 
                  onClick={handleSendTelegram}
                  disabled={telegramMutation.isPending || !telegramMessage.trim()}
                  className="w-full"
                  data-testid="button-send-telegram"
                >
                  {telegramMutation.isPending ? t('loading') : 
                    (language === 'uz' ? 'Telegram ga yuborish' : 'Отправить в Telegram')}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  {language === 'uz' ? 'Avtomatik AI marketing' : 'Автоматический AI маркетинг'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {language === 'uz' 
                    ? 'Gemini 1.5 Flash AI orqali avtomatik marketing xabarlari yaratish va yuborish'
                    : 'Автоматическое создание и отправка маркетинговых сообщений через Gemini 1.5 Flash AI'}
                </p>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="marketingType" className="text-right">
                      {language === 'uz' ? 'Marketing turi' : 'Тип маркетинга'}
                    </Label>
                    <Select value={marketingType} onValueChange={setMarketingType}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder={language === 'uz' ? 'Tur tanlang' : 'Выберите тип'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">{language === 'uz' ? 'Kunlik aksiya' : 'Ежедневная акция'}</SelectItem>
                        <SelectItem value="product">{language === 'uz' ? 'Mahsulot tanishuvi' : 'Презентация продукта'}</SelectItem>
                        <SelectItem value="seasonal">{language === 'uz' ? 'Mavsumiy aksiya' : 'Сезонная акция'}</SelectItem>
                        <SelectItem value="custom">{language === 'uz' ? 'Maxsus xabar' : 'Особое сообщение'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(marketingType === 'product' || marketingType === 'seasonal' || marketingType === 'custom') && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="marketingTopic" className="text-right">
                        {language === 'uz' ? 'Mavzu/Mahsulot' : 'Тема/Продукт'}
                      </Label>
                      <Input
                        id="marketingTopic"
                        value={marketingTopic}
                        onChange={(e) => setMarketingTopic(e.target.value)}
                        placeholder={language === 'uz' 
                          ? 'Masalan: Polietilen paketlar' 
                          : 'Например: Полиэтиленовые пакеты'}
                        className="col-span-3"
                      />
                    </div>
                  )}

                  <Button 
                    onClick={handleAutoMarketing}
                    disabled={autoMarketingMutation.isPending}
                    className="w-full"
                  >
                    {autoMarketingMutation.isPending 
                      ? (language === 'uz' ? 'AI xabar yaratmoqda...' : 'AI создает сообщение...')
                      : (language === 'uz' ? 'AI orqali xabar yaratish va yuborish' : 'Создать и отправить через AI')
                    }
                  </Button>
                </div>

                <div className="mt-6 space-y-2">
                  <h4 className="font-medium">{language === 'uz' ? 'Avtomatik rejim' : 'Автоматический режим'}</h4>
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-sm">
                      {language === 'uz' ? 'Ertalabki AI xabarlar' : 'Утренние AI сообщения'}
                    </span>
                    <Badge variant="secondary">09:00</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="text-sm">
                      {language === 'uz' ? 'Kechqurun AI aksiyalar' : 'Вечерние AI акции'}
                    </span>
                    <Badge variant="secondary">18:00</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blog" className="space-y-6">
            {/* AI Blog Generator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  AI Blog Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="blogTopic">
                    {language === 'uz' ? 'Blog mavzusi' : 'Тема блога'}
                  </Label>
                  <Input
                    id="blogTopic"
                    placeholder={language === 'uz' 
                      ? 'Masalan: Optom savdoda muvaffaqiyat sirlari' 
                      : 'Например: Секреты успеха в оптовой торговле'}
                    value={blogTopic}
                    onChange={(e) => setBlogTopic(e.target.value)}
                    data-testid="input-blog-topic"
                  />
                </div>
                <Button 
                  onClick={handleGenerateBlog}
                  disabled={blogMutation.isPending || saveBlogPostMutation.isPending || !blogTopic.trim()}
                  className="w-full"
                  data-testid="button-generate-blog"
                >
                  {(blogMutation.isPending || saveBlogPostMutation.isPending) ? 
                    (language === 'uz' ? 'AI maqola yaratmoqda...' : 'AI создает статью...') :
                    (language === 'uz' ? 'AI orqali maqola yaratish' : 'Создать статью через AI')}
                </Button>
              </CardContent>
            </Card>

            {/* Blog Posts List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {language === 'uz' ? 'Blog maqolalari' : 'Статьи блога'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingBlogPosts ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="text-sm text-muted-foreground">
                      {language === 'uz' ? 'Maqolalar yuklanmoqda...' : 'Загрузка статей...'}
                    </div>
                  </div>
                ) : (blogPosts as any[]).length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {language === 'uz' ? 'Hali blog maqolalari yo\'q' : 'Пока нет статей блога'}
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{language === 'uz' ? 'Sarlavha' : 'Заголовок'}</TableHead>
                        <TableHead>{language === 'uz' ? 'Holat' : 'Статус'}</TableHead>
                        <TableHead>{language === 'uz' ? 'AI yaratgan' : 'Создано AI'}</TableHead>
                        <TableHead>{language === 'uz' ? 'Sana' : 'Дата'}</TableHead>
                        <TableHead>{language === 'uz' ? 'Harakatlar' : 'Действия'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(blogPosts as any[]).map((post: any) => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium">
                            <div>
                              <p className="font-semibold">{post.titleUz}</p>
                              <p className="text-sm text-muted-foreground">{post.titleRu}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={post.isPublished ? 'default' : 'secondary'}>
                              {post.isPublished 
                                ? (language === 'uz' ? 'Chop etilgan' : 'Опубликовано')
                                : (language === 'uz' ? 'Qoralama' : 'Черновик')
                              }
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {post.isAiGenerated ? (
                              <Badge variant="outline" className="text-blue-600">
                                <Bot className="h-3 w-3 mr-1" />
                                AI
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-gray-600">
                                {language === 'uz' ? 'Qo\'lda' : 'Ручное'}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditBlog(post)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                {language === 'uz' ? 'Tahrirlash' : 'Редактировать'}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updateBlogPostMutation.mutate({ 
                                  id: post.id, 
                                  updates: { isPublished: !post.isPublished } 
                                })}
                                disabled={updateBlogPostMutation.isPending}
                              >
                                {post.isPublished 
                                  ? (language === 'uz' ? 'Yashirish' : 'Скрыть')
                                  : (language === 'uz' ? 'Chop etish' : 'Опубликовать')
                                }
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => deleteBlogPostMutation.mutate(post.id)}
                                disabled={deleteBlogPostMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('users')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(users as any[])?.map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={user.isAdmin ? 'default' : 'secondary'}>
                          {user.isAdmin ? 'Admin' : language === 'uz' ? 'Foydalanuvchi' : 'Пользователь'}
                        </Badge>
                        <Badge variant="outline">
                          {user.preferredLanguage === 'uz' ? '🇺🇿' : '🇷🇺'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('orders')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(orders as any[])?.map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">#{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          order.status === 'delivered' ? 'default' :
                          order.status === 'cancelled' ? 'destructive' :
                          'secondary'
                        }>
                          {order.status}
                        </Badge>
                        <span className="font-medium">{order.totalAmount} so'm</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'uz' ? 'Chat Xabarlari' : 'Чат Сообщения'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {isLoadingChatMessages ? (
                    <div className="text-center py-4">{t('loading')}</div>
                  ) : (
                    (chatMessages as ChatMessage[])?.map((message: ChatMessage) => (
                      <div key={message.id} className="p-4 border rounded-lg space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            {message.userName && (
                              <p className="font-semibold">{message.userName}</p>
                            )}
                            {message.userPhone && (
                              <p className="text-sm text-muted-foreground">{message.userPhone}</p>
                            )}
                          </div>
                          <Badge variant={message.isFromUser ? "default" : "secondary"}>
                            {message.isFromUser ? "Foydalanuvchi" : "AI"}
                          </Badge>
                        </div>
                        <p className="text-sm">{message.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(message.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Blog Edit Dialog */}
      <Dialog open={showBlogEditDialog} onOpenChange={setShowBlogEditDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {language === 'uz' ? 'Blog maqolasini tahrirlash' : 'Редактировать статью блога'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titleUz">
                  {language === 'uz' ? 'Sarlavha (O\'zbek)' : 'Заголовок (Узбекский)'}
                </Label>
                <Input
                  id="titleUz"
                  value={blogEditForm.titleUz}
                  onChange={(e) => setBlogEditForm({...blogEditForm, titleUz: e.target.value})}
                  placeholder={language === 'uz' ? 'Maqola sarlavhasi...' : 'Заголовок статьи...'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="titleRu">
                  {language === 'uz' ? 'Sarlavha (Rus)' : 'Заголовок (Русский)'}
                </Label>
                <Input
                  id="titleRu"
                  value={blogEditForm.titleRu}
                  onChange={(e) => setBlogEditForm({...blogEditForm, titleRu: e.target.value})}
                  placeholder={language === 'uz' ? 'Maqola sarlavhasi...' : 'Заголовок статьи...'}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">
                {language === 'uz' ? 'Qisqacha tavsif' : 'Краткое описание'}
              </Label>
              <Textarea
                id="excerpt"
                value={blogEditForm.excerpt}
                onChange={(e) => setBlogEditForm({...blogEditForm, excerpt: e.target.value})}
                placeholder={language === 'uz' ? 'Maqola haqida qisqacha...' : 'Кратко о статье...'}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">
                  {language === 'uz' ? 'Rasm URL' : 'URL изображения'}
                </Label>
                <Input
                  id="imageUrl"
                  value={blogEditForm.imageUrl}
                  onChange={(e) => setBlogEditForm({...blogEditForm, imageUrl: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={blogEditForm.slug}
                  onChange={(e) => setBlogEditForm({...blogEditForm, slug: e.target.value})}
                  placeholder="maqola-slug"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contentUz">
                {language === 'uz' ? 'Matn (O\'zbek)' : 'Текст (Узбекский)'}
              </Label>
              <Textarea
                id="contentUz"
                value={blogEditForm.contentUz}
                onChange={(e) => setBlogEditForm({...blogEditForm, contentUz: e.target.value})}
                placeholder={language === 'uz' ? 'Maqola matni...' : 'Текст статьи...'}
                rows={8}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contentRu">
                {language === 'uz' ? 'Matn (Rus)' : 'Текст (Русский)'}
              </Label>
              <Textarea
                id="contentRu"
                value={blogEditForm.contentRu}
                onChange={(e) => setBlogEditForm({...blogEditForm, contentRu: e.target.value})}
                placeholder={language === 'uz' ? 'Maqola matni...' : 'Текст статьи...'}
                rows={8}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={blogEditForm.isPublished}
                onChange={(e) => setBlogEditForm({...blogEditForm, isPublished: e.target.checked})}
                className="rounded"
              />
              <Label htmlFor="isPublished">
                {language === 'uz' ? 'Maqolani chop etish' : 'Опубликовать статью'}
              </Label>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowBlogEditDialog(false)}>
              {language === 'uz' ? 'Bekor qilish' : 'Отмена'}
            </Button>
            <Button onClick={handleSaveBlogEdit} disabled={updateBlogPostMutation.isPending}>
              {updateBlogPostMutation.isPending 
                ? (language === 'uz' ? 'Saqlanmoqda...' : 'Сохранение...')
                : (language === 'uz' ? 'Saqlash' : 'Сохранить')
              }
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminPanel;