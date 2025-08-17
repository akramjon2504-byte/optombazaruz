import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Plus, Edit, Trash2, Eye, Users, ShoppingCart, TrendingUp, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";

interface BlogPost {
  id: string;
  titleUz: string;
  titleRu: string;
  contentUz: string;
  contentRu: string;
  excerpt: string | null;
  slug: string;
  imageUrl: string | null;
  isAiGenerated: boolean | null;
  isPublished: boolean | null;
  publishedAt: Date | null;
  createdAt: Date | null;
}

export default function Admin() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [newPost, setNewPost] = useState({
    titleUz: "",
    titleRu: "",
    contentUz: "",
    contentRu: "",
    excerpt: "",
    isPublished: false
  });

  // Redirect to home if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user?.isAdmin)) {
      toast({
        title: "Ruxsatsiz kirish",
        description: "Administrator paneliga kirish uchun admin huquqlariga ega bo'lishingiz kerak.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const { data: blogPosts, isLoading: isLoadingPosts, refetch } = useQuery({
    queryKey: ["/api/admin/blog"],
    retry: false,
    enabled: isAuthenticated && user?.isAdmin
  });

  const { data: analytics } = useQuery({
    queryKey: ["/api/admin/analytics"], 
    retry: false,
    enabled: isAuthenticated && user?.isAdmin
  });

  const generateAIBlogPost = async () => {
    setIsGenerating(true);
    try {
      const response = await apiRequest("POST", "/api/admin/generate-blog-post", {
        topic: "O'zbekiston optom bozori va e-tijorat tendensiyalari"
      });
      
      setNewPost({
        titleUz: response.titleUz,
        titleRu: response.titleRu,
        contentUz: response.contentUz,
        contentRu: response.contentRu,
        excerpt: response.excerpt,
        isPublished: false
      });
      
      toast({
        title: "Muvaffaqiyat!",
        description: "AI yordamida blog maqola yaratildi",
      });
    } catch (error) {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Ruxsatsiz kirish",
          description: "Siz tizimdan chiqib kettingiz. Qayta kiring...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      toast({
        title: "Xato",
        description: "Blog maqola yaratishda xatolik yuz berdi",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveBlogPost = async () => {
    try {
      await apiRequest("POST", "/api/admin/blog", newPost);
      toast({
        title: "Muvaffaqiyat!",
        description: "Blog maqola saqlandi",
      });
      setNewPost({
        titleUz: "",
        titleRu: "",
        contentUz: "",
        contentRu: "", 
        excerpt: "",
        isPublished: false
      });
      refetch();
    } catch (error) {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Ruxsatsiz kirish",
          description: "Siz tizimdan chiqib kettingiz. Qayta kiring...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      toast({
        title: "Xato",
        description: "Blog maqola saqlashda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  const togglePublishStatus = async (postId: string, isPublished: boolean) => {
    try {
      await apiRequest("PATCH", `/api/admin/blog/${postId}`, { isPublished: !isPublished });
      toast({
        title: "Muvaffaqiyat!",
        description: isPublished ? "Maqola nashrdan olib tashlandi" : "Maqola nashr qilindi",
      });
      refetch();
    } catch (error) {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Ruxsatsiz kirish", 
          description: "Siz tizimdan chiqib kettingiz. Qayta kiring...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      toast({
        title: "Xato",
        description: "Maqola holatini o'zgartirishda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user?.isAdmin) {
    return null; // Component will redirect
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Administrator paneli</h1>
        <p className="text-muted-foreground">OptomBazar platformasini boshqaring</p>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analitika
          </TabsTrigger>
          <TabsTrigger value="blog" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Blog
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Foydalanuvchilar
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Buyurtmalar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Jami foydalanuvchilar</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-users">
                  {analytics?.totalUsers || 0}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Jami buyurtmalar</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-orders">
                  {analytics?.totalOrders || 0}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Jami sotuv</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-revenue">
                  {analytics?.totalRevenue || 0} so'm
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blog maqolalari</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-posts">
                  {blogPosts?.length || 0}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="blog" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Yangi blog maqola
              </CardTitle>
              <CardDescription>
                AI yordamida maqola yarating yoki qo'lda yozing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={generateAIBlogPost}
                disabled={isGenerating}
                className="w-full"
                data-testid="button-generate-ai-post"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    AI yordamida yaratilmoqda...
                  </>
                ) : (
                  "AI yordamida maqola yaratish"
                )}
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titleUz">Sarlavha (O'zbek tilida)</Label>
                  <Input
                    id="titleUz"
                    data-testid="input-title-uz"
                    value={newPost.titleUz}
                    onChange={(e) => setNewPost({...newPost, titleUz: e.target.value})}
                    placeholder="Maqola sarlavhasi..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="titleRu">Sarlavha (Rus tilida)</Label>
                  <Input
                    id="titleRu"
                    data-testid="input-title-ru"
                    value={newPost.titleRu}
                    onChange={(e) => setNewPost({...newPost, titleRu: e.target.value})}
                    placeholder="Заголовок статьи..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Qisqacha mazmuni</Label>
                <Input
                  id="excerpt"
                  data-testid="input-excerpt"
                  value={newPost.excerpt}
                  onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})}
                  placeholder="Maqola haqida qisqacha..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contentUz">Matn (O'zbek tilida)</Label>
                  <Textarea
                    id="contentUz"
                    data-testid="textarea-content-uz"
                    value={newPost.contentUz}
                    onChange={(e) => setNewPost({...newPost, contentUz: e.target.value})}
                    placeholder="Maqola matni..."
                    rows={10}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contentRu">Matn (Rus tilida)</Label>
                  <Textarea
                    id="contentRu"
                    data-testid="textarea-content-ru" 
                    value={newPost.contentRu}
                    onChange={(e) => setNewPost({...newPost, contentRu: e.target.value})}
                    placeholder="Текст статьи..."
                    rows={10}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublished"
                  data-testid="switch-is-published"
                  checked={newPost.isPublished}
                  onCheckedChange={(checked) => setNewPost({...newPost, isPublished: checked})}
                />
                <Label htmlFor="isPublished">Darhol nashr qilish</Label>
              </div>

              <Button onClick={saveBlogPost} className="w-full" data-testid="button-save-post">
                Maqolani saqlash
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mavjud maqolalar</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingPosts ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : blogPosts?.length > 0 ? (
                <div className="space-y-4">
                  {blogPosts.map((post: BlogPost) => (
                    <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{post.titleUz}</h3>
                        <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs px-2 py-1 rounded ${post.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {post.isPublished ? 'Nashr qilingan' : 'Qoralama'}
                          </span>
                          {post.isAiGenerated && (
                            <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                              AI yaratgan
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => togglePublishStatus(post.id, post.isPublished || false)}
                          data-testid={`button-toggle-publish-${post.id}`}
                        >
                          {post.isPublished ? <Eye className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  Hali maqola yo'q
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Foydalanuvchilar</CardTitle>
              <CardDescription>
                Tizimda ro'yxatdan o'tgan foydalanuvchilar ro'yxati
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Bu bo'lim hali ishlab chiqilmoqda...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Buyurtmalar</CardTitle>
              <CardDescription>
                Barcha buyurtmalarni ko'ring va boshqaring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Bu bo'lim hali ishlab chiqilmoqda...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}