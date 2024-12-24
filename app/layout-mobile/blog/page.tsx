"use client"

import { useState, useCallback, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Menu, Trash2, ChevronLeft, ChevronRight, Edit2, Eye, MessageSquare, Calendar, Search, X, Upload } from 'lucide-react'
import Image from 'next/image'
import { Editor } from '@tinymce/tinymce-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useDropzone } from 'react-dropzone'
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

interface BlogPost {
  id: string;
  title: string;
  category: string;
  content: string;
  image: string;
  date: string;
  views: number;
  comments: Comment[];
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  date: string;
}

const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Os benefícios da meditação para a saúde mental',
    category: 'Bem-estar',
    content: 'A meditação tem se mostrado uma prática eficaz para reduzir o estresse e melhorar a saúde mental. Estudos recentes demonstram que a prática regular de meditação pode ajudar a diminuir a ansiedade, melhorar o foco e aumentar a sensação de bem-estar geral. Além disso, a meditação pode ser facilmente incorporada à rotina diária, não requerendo equipamentos especiais ou muito tempo. Começar com apenas 5-10 minutos por dia pode trazer benefícios significativos para a saúde mental a longo prazo.',
    image: '/placeholder.svg',
    date: '2023-06-15',
    views: 1200,
    comments: [
      {
        id: '1',
        author: 'Maria Silva',
        avatar: '/placeholder.svg',
        content: 'Ótimo artigo! Comecei a meditar recentemente e já sinto os benefícios.',
        date: '2023-06-16'
      },
      {
        id: '2',
        author: 'João Santos',
        avatar: '/placeholder.svg',
        content: 'Você poderia recomendar alguns apps de meditação guiada?',
        date: '2023-06-17'
      }
    ]
  },
  {
    id: '2',
    title: 'Novos avanços no tratamento do câncer',
    category: 'Medicina',
    content: 'Pesquisadores descobriram uma nova abordagem promissora para o tratamento de certos tipos de câncer...',
    image: '/placeholder.svg',
    date: '2023-06-10',
    views: 3500,
    comments: []
  },
  {
    id: '3',
    title: 'Dicas para uma alimentação saudável',
    category: 'Nutrição',
    content: 'Uma dieta equilibrada é fundamental para manter a saúde. Confira algumas dicas simples para melhorar sua alimentação...',
    image: '/placeholder.svg',
    date: '2023-06-05',
    views: 2800,
    comments: []
  },
]

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50]

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(MOCK_BLOG_POSTS)
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [newPost, setNewPost] = useState<Partial<BlogPost>>({
    title: '',
    category: '',
    content: '',
    image: '/placeholder.svg',
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [categories, setCategories] = useState(['Bem-estar', 'Medicina', 'Nutrição'])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [newComment, setNewComment] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null)
  
  const editorRef = useRef<any>(null)

  const filteredPosts = blogPosts.filter(post => 
    (post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     post.content.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (categoryFilter === 'all' || post.category === categoryFilter)
  )

  const pageCount = Math.ceil(filteredPosts.length / itemsPerPage)
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, categoryFilter, itemsPerPage])

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR })
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (editingPost) {
          setEditingPost({ ...editingPost, image: reader.result as string })
        } else {
          setNewPost({ ...newPost, image: reader.result as string })
        }
      }
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100
          setUploadProgress(progress)
        }
      }
      reader.readAsDataURL(file)
    }
  }, [newPost, editingPost])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp']
    },
    multiple: false
  })

  const handleAddOrUpdatePost = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent()
      if (editingPost) {
        const updatedPost = {
          ...editingPost,
          title: newPost.title || editingPost.title,
          category: newPost.category || editingPost.category,
          content: content,
          image: newPost.image || editingPost.image,
        }
        setBlogPosts(prevPosts => prevPosts.map(post => post.id === editingPost.id ? updatedPost : post))
      } else {
        const newBlogPost: BlogPost = {
          ...newPost as BlogPost,
          id: Date.now().toString(),
          date: format(new Date(), 'yyyy-MM-dd'),
          views: 0,
          comments: [],
          content: content,
        }
        setBlogPosts(prevPosts => [newBlogPost, ...prevPosts])
      }
      setIsPostModalOpen(false)
      setNewPost({
        title: '',
        category: '',
        content: '',
        image: '/placeholder.svg',
      })
      setEditingPost(null)
      setUploadProgress(0)
    }
  }

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post)
    setNewPost({
      title: post.title,
      category: post.category,
      content: post.content,
      image: post.image,
    })
    setIsPostModalOpen(true)
  }

  const handleDeletePost = (post: BlogPost) => {
    setPostToDelete(post)
    setIsDeleteAlertOpen(true)
  }

  const confirmDeletePost = () => {
    if (postToDelete) {
      setBlogPosts(prevPosts => prevPosts.filter(post => post.id !== postToDelete.id))
      setIsDeleteAlertOpen(false)
      setPostToDelete(null)
    }
  }

  const handleAddComment = () => {
    if (selectedPost && newComment.trim() !== '') {
      const newCommentObj: Comment = {
        id: Date.now().toString(),
        author: 'Usuário Anônimo',
        avatar: '/placeholder.svg',
        content: newComment,
        date: format(new Date(), 'yyyy-MM-dd')
      }
      setSelectedPost({
        ...selectedPost,
        comments: [...selectedPost.comments, newCommentObj]
      })
      setNewComment('')
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Gerenciamento de Blog</h1>
            <Button 
              onClick={() => {
                setEditingPost(null)
                setNewPost({
                  title: '',
                  category: '',
                  content: '',
                  image: '/placeholder.svg',
                })
                setIsPostModalOpen(true)
              }}
              className="bg-[#0078FF] hover:bg-blue-600"
            >
              Cadastrar Novo Post
            </Button>
          </div>

          <Card className="p-6 mb-6">
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Buscar posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="w-48">
                <Label htmlFor="category-filter">Categoria</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger id="category-filter">
                    <SelectValue placeholder="Filtrar por categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={() => setIsNewCategoryModalOpen(true)}>
                  Adicionar Categoria
                </Button>
              </div>
            </div>
          </Card>

          <Card>
            <Table>
              <TableHeader>
                <TableRow className="bg-[#0078FF] text-white hover:bg-[#0078FF]/90">
                  <TableHead className="text-white">Título</TableHead>
                  <TableHead className="text-white">Categoria</TableHead>
                  <TableHead className="text-white">Data</TableHead>
                  <TableHead className="text-white">Visualizações</TableHead>
                  <TableHead className="text-white">Comentários</TableHead>
                  <TableHead className="text-right text-white">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPosts.map((post) => (
                  <TableRow key={post.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>{formatDate(post.date)}</TableCell>
                    <TableCell>{post.views}</TableCell>
                    <TableCell>{post.comments.length}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditPost(post)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600" onClick={() => handleDeletePost(post)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  Mostrando {Math.min(itemsPerPage, filteredPosts.length)} de {filteredPosts.length} resultados
                </span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => setItemsPerPage(Number(value))}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Itens por página" />
                  </SelectTrigger>
                  <SelectContent>
                    {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option.toString()}>
                        {option} por página
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <span className="text-sm text-gray-700">
                  Página {currentPage} de {pageCount}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
                  disabled={currentPage === pageCount}
                >
                  Próximo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="w-full md:w-1/3 relative">
          <div className="md:sticky md:top-4 md:pt-4">
            <div className="iphone-container mx-auto">
              <div className="iphone">
                <div className="iphone-top">
                  <div className="iphone-speaker"></div>
                  <div className="iphone-camera"></div>
                </div>
                <div className="iphone-screen">
                  <div className="status-bar">
                    <Menu size={16} />
                    <Bell size={16} />
                  </div>
                  <div className="iphone-content">
                    {selectedPost ? (
                      <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <Image src={selectedPost.image} alt={selectedPost.title} width={375} height={200} className="w-full h-40 object-cover" />
                        <div className="p-4">
                          <button 
                            className="mb-4 text-[#0078FF] flex items-center"
                            onClick={() => setSelectedPost(null)}
                          >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Voltar
                          </button>
                          <h3 className="font-bold text-xl mb-2">{selectedPost.title}</h3>
                          <div className="text-sm text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
                          <div className="flex justify-between text-xs text-gray-500 mb-4">
                            <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" />{formatDate(selectedPost.date)}</span>
                            <span className="flex items-center"><Eye className="h-3 w-3 mr-1" />{selectedPost.views}</span>
                            <span className="flex items-center"><MessageSquare className="h-3 w-3 mr-1" />{selectedPost.comments.length}</span>
                          </div>
                          <div className="border-t pt-4">
                            <h4 className="font-bold mb-2">Comentários</h4>
                            {selectedPost.comments.map((comment) => (
                              <div key={comment.id} className="mb-4 bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center mb-2">
                                  <Avatar className="h-8 w-8 mr-2">
                                    <AvatarImage src={comment.avatar} alt={comment.author} />
                                    <AvatarFallback>{comment.author[0]}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{comment.author}</p>
                                    <p className="text-xs text-gray-500">{formatDate(comment.date)}</p>
                                  </div>
                                </div>
                                <p className="text-sm">{comment.content}</p>
                              </div>
                            ))}
                            <div className="mt-4">
                              <textarea
                                className="w-full p-2 border rounded"
                                rows={3}
                                placeholder="Adicione um comentário..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                              ></textarea>
                              <Button 
                                onClick={handleAddComment}
                                className="mt-2 w-full bg-[#0078FF] hover:bg-blue-600"
                              >
                                Enviar Comentário
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h2 className="text-xl font-bold mb-4">Blog Posts</h2>
                        <div className="mb-6 bg-white rounded-lg shadow-md p-4">
                          <h3 className="font-bold text-lg mb-3">Índice</h3>
                          <div className="grid gap-2">
                            {filteredPosts.map((post) => (
                              <button 
                                key={post.id}
                                className="flex items-center justify-between w-full text-left p-2 rounded-md hover:bg-gray-100 transition-colors"
                                onClick={() => setSelectedPost(post)}
                              >
                                <span className="text-[#0078FF] hover:underline">{post.title}</span>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                              </button>
                            ))}
                          </div>
                        </div>
                        {paginatedPosts.map((post) => (
                          <div key={post.id} className="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
                            <Image src={post.image} alt={post.title} width={375} height={200} className="w-full h-40 object-cover" />
                            <div className="p-4">
                              <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                              <div className="text-sm text-gray-600 mb-2 line-clamp-3" dangerouslySetInnerHTML={{ __html: post.content }} />
                              <div className="flex justify-between text-xs text-gray-500 mb-2">
                                <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" />{formatDate(post.date)}</span>
                                <span className="flex items-center"><Eye className="h-3 w-3 mr-1" />{post.views}</span>
                                <span className="flex items-center"><MessageSquare className="h-3 w-3 mr-1" />{post.comments.length}</span>
                              </div>
                              <Button 
                                onClick={() => setSelectedPost(post)}
                                className="mt-2 w-full bg-[#0078FF] hover:bg-blue-600"
                              >
                                Ler mais
                              </Button>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
                <div className="iphone-bottom">
                  <div className="iphone-home"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isPostModalOpen} onOpenChange={setIsPostModalOpen}>
        <DialogContent className="sm:max-w-[900px] h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost ? 'Editar Post' : 'Cadastrar Novo Conteúdo'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Título
              </Label>
              <Input
                id="title"
                value={editingPost ? editingPost.title : newPost.title}
                onChange={(e) => editingPost ? setEditingPost({...editingPost, title: e.target.value}) : setNewPost({ ...newPost, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Categoria
              </Label>
              <Select
                value={editingPost ? editingPost.category : newPost.category}
                onValueChange={(value) => editingPost ? setEditingPost({...editingPost, category: value}) : setNewPost({ ...newPost, category: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="content" className="text-right mt-2">
                Conteúdo
              </Label>
              <div className="col-span-3">
                <Editor
                  apiKey="pj12x8b23iiq4mdxbgdzjfyuyyjtashh7ui090dfgfxtuoe8"
                  onInit={(evt, editor) => editorRef.current = editor}
                  initialValue={editingPost ? editingPost.content : newPost.content}
                  init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                      'bold italic forecolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    readonly: false,
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Imagem
              </Label>
              <div className="col-span-3">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer ${
                    isDragActive ? 'border-[#0078FF] bg-blue-50' : 'border-gray-300'
                  }`}
                >
                  <input {...getInputProps()} />
                  {(editingPost ? editingPost.image : newPost.image) !== '/placeholder.svg' ? (
                    <div className="flex items-center justify-center">
                      <Image
                        src={editingPost ? editingPost.image : newPost.image}
                        alt="Uploaded image"
                        width={100}
                        height={100}
                        className="mr-2"
                      />
                      <span>{(editingPost ? editingPost.image : newPost.image).split('/').pop()}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (editingPost) {
                            setEditingPost({ ...editingPost, image: '/placeholder.svg' })
                          } else {
                            setNewPost({ ...newPost, image: '/placeholder.svg' })
                          }
                          setUploadProgress(0)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p>Arraste e solte uma imagem aqui, ou clique para selecionar</p>
                      <p className="text-sm text-gray-500">(PNG, JPG, JPEG, WebP)</p>
                    </div>
                  )}
                </div>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <Progress value={uploadProgress} className="mt-2" />
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsPostModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleAddOrUpdatePost} className="bg-[#0078FF] hover:bg-blue-600">
              {editingPost ? 'Atualizar' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isNewCategoryModalOpen} onOpenChange={setIsNewCategoryModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Categoria</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newCategory" className="text-right">
                Nome
              </Label>
              <Input
                id="newCategory"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsNewCategoryModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (newCategory) {
                  setCategories([...categories, newCategory])
                  setNewCategory('')
                  setIsNewCategoryModalOpen(false)
                }
              }}
              className="bg-[#0078FF] hover:bg-blue-600"
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja excluir este post?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O post será permanentemente removido do blog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletePost} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <style jsx>{`
        .iphone-container {
          perspective: 1000px;
          width: 375px;
          margin: 0 auto;
        }
        .iphone {
          width: 375px;
          height: 812px;
          background-color: #1c1c1e;
          border-radius: 50px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 0 0 11px #1c1c1e, 0 0 0 13px #191919, 0 0 0 20px #111;
        }
        .iphone-top {
          height: 30px;
          background-color: #1c1c1e;
          border-top-left-radius: 50px;
          border-top-right-radius: 50px;
          position: relative;
        }
        .iphone-speaker {
          width: 60px;
          height: 6px;
          background-color: #2c2c2e;
          border-radius: 3px;
          position: absolute;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
        }
        .iphone-camera {
          width: 12px;
          height: 12px;
          background-color: #2c2c2e;
          border-radius: 50%;
          position: absolute;
          top: 9px;
          right: 90px;
        }
        .iphone-screen {
          height: 712px;
          background-color: #f2f2f7;
          overflow-y: auto;
          position: relative;
        }
        .status-bar {
          height: 44px;
          background-color: #f2f2f7;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 16px;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .iphone-content {
          padding: 16px;
        }
        .iphone-bottom {
          height: 70px;
          background-color: #1c1c1e;
          border-bottom-left-radius: 50px;
          border-bottom-right-radius: 50px;
          position: relative;
        }
        .iphone-home {
          width: 140px;
          height: 5px;
          background-color: #2c2c2e;
          border-radius: 2.5px;
          position: absolute;
          bottom: 25px;
          left: 50%;
          transform: translateX(-50%);
        }
      `}</style>
    </div>
  )
}

