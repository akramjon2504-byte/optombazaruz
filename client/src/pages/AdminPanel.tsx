import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { apiRequest } from '@/lib/queryClient';
import { 
  Users, 
  Package, 
  BarChart3, 
  MessageSquare, 
  Settings,
  Send,
  Bot,
  FileText,
  TrendingUp
} from 'lucide-react';

function AdminPanel() {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [telegramMessage, setTelegramMessage] = useState('');
  const [blogTopic, setBlogTopic] = useState('');

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
      return apiRequest('/api/admin/blog/generate', 'POST', { topic });
    },
    onSuccess: () => {
      toast({
        title: t('success'),
        description: language === 'uz' ? 'Blog maqolasi yaratildi' : 'Блог статья создана',
      });
      setBlogTopic('');
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
    },
    onError: (error: Error) => {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {t('dashboard')}
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('users')}
            </TabsTrigger>
            <TabsTrigger value="marketing" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              {t('marketing')}
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t('blog')}
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              {t('orders')}
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
                      <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
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
                      <p className="text-2xl font-bold">{stats?.totalOrders || 0}</p>
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
                      <p className="text-2xl font-bold">{stats?.monthlySales || 0} so'm</p>
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
                      <p className="text-2xl font-bold">{stats?.totalMessages || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
                  {language === 'uz' ? 'Avtomatik marketing' : 'Автоматический маркетинг'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {language === 'uz' 
                    ? 'AI orqali kunlik marketing xabarlari avtomatik ravishda yuboriladi'
                    : 'AI автоматически отправляет ежедневные маркетинговые сообщения'}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-sm">
                      {language === 'uz' ? 'Ertalabki xabarlar' : 'Утренние сообщения'}
                    </span>
                    <Badge variant="secondary">09:00</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="text-sm">
                      {language === 'uz' ? 'Kechqurun aksiyalar' : 'Вечерние акции'}
                    </span>
                    <Badge variant="secondary">18:00</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blog" className="space-y-6">
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
                  disabled={blogMutation.isPending || !blogTopic.trim()}
                  className="w-full"
                  data-testid="button-generate-blog"
                >
                  {blogMutation.isPending ? t('loading') : 
                    (language === 'uz' ? 'AI orqali maqola yaratish' : 'Создать статью через AI')}
                </Button>
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
                  {users?.map((user: any) => (
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
                  {orders?.map((order: any) => (
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
        </Tabs>
      </div>
    </div>
  );
}

export default AdminPanel;