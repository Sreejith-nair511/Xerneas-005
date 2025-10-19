"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Heart, MessageCircle, ThumbsUp, Search, User, Clock, Users } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import ParticleBackground from "@/components/particle-background"

// Post structure
interface Post {
  id: string
  title: string
  content: string
  author: string
  timestamp: string
  likes: number
  comments: number
  category: string
  isLiked: boolean
}

// Comment structure
interface Comment {
  id: string
  postId: string
  content: string
  author: string
  timestamp: string
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      title: "How to improve sleep quality?",
      content: "I've been having trouble sleeping lately. Any tips for better sleep hygiene?",
      author: "Priya Sharma",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 8,
      category: "Sleep",
      isLiked: false
    },
    {
      id: "2",
      title: "Tips for staying hydrated in summer",
      content: "Summer is here and I'm struggling to drink enough water. What works for you?",
      author: "Raj Patel",
      timestamp: "5 hours ago",
      likes: 18,
      comments: 5,
      category: "Hydration",
      isLiked: true
    },
    {
      id: "3",
      title: "Managing stress during exams",
      content: "Exam season is stressful. How do you manage stress and stay focused?",
      author: "Ananya Desai",
      timestamp: "1 day ago",
      likes: 32,
      comments: 12,
      category: "Mental Health",
      isLiked: false
    },
    {
      id: "4",
      title: "Healthy lunch ideas for office workers",
      content: "Looking for quick, healthy lunch options that don't require heating. Any suggestions?",
      author: "Vikram Singh",
      timestamp: "1 day ago",
      likes: 15,
      comments: 7,
      category: "Nutrition",
      isLiked: false
    },
    {
      id: "5",
      title: "Best time for evening walks?",
      content: "Should I walk before or after dinner for maximum health benefits?",
      author: "Sunita Reddy",
      timestamp: "2 days ago",
      likes: 21,
      comments: 9,
      category: "Exercise",
      isLiked: true
    }
  ])
  
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      postId: "1",
      content: "Try keeping your bedroom cool and dark. Also, avoid screens an hour before bed.",
      author: "Dr. Mehta",
      timestamp: "1 hour ago"
    },
    {
      id: "2",
      postId: "1",
      content: "I find meditation apps really helpful for winding down.",
      author: "Neha Kumar",
      timestamp: "3 hours ago"
    }
  ])
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "General"
  })
  const [newComment, setNewComment] = useState("")
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)

  // Filter posts based on search and category
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddPost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: "Error",
        description: "Please enter both title and content for your post",
        variant: "destructive",
      })
      return
    }

    const post: Post = {
      id: Date.now().toString(),
      ...newPost,
      author: "You",
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      isLiked: false
    }

    setPosts([post, ...posts])
    setNewPost({
      title: "",
      content: "",
      category: "General"
    })
    setIsDialogOpen(false)
    
    toast({
      title: "Post Created",
      description: "Your post has been shared with the community",
    })
  }

  const handleLikePost = (id: string) => {
    setPosts(posts.map(post => 
      post.id === id 
        ? { 
            ...post, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked
          } 
        : post
    ))
  }

  const handleAddComment = (postId: string) => {
    if (!newComment.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive",
      })
      return
    }

    const comment: Comment = {
      id: Date.now().toString(),
      postId,
      content: newComment,
      author: "You",
      timestamp: "Just now"
    }

    setComments([...comments, comment])
    setNewComment("")
    setSelectedPostId(null)
    
    // Update comment count on the post
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, comments: post.comments + 1 } 
        : post
    ))
    
    toast({
      title: "Comment Added",
      description: "Your comment has been posted",
    })
  }

  // Get posts by category for quick links
  const categories = ["all", "Sleep", "Hydration", "Mental Health", "Nutrition", "Exercise", "General"]
  const postsByCategory = categories.reduce((acc, category) => {
    acc[category] = posts.filter(post => 
      category === "all" || post.category === category
    ).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="min-h-screen bg-tadashi-lightBlue dark:bg-gray-800 pt-24 pb-12 relative overflow-hidden">
      <ParticleBackground />
      
      <div className="tadashi-container relative z-10">
        <div className="text-center mb-12 animate-fadeInUp">
          <h1 className="tadashi-hero">Community & Support</h1>
          <p className="tadashi-tagline">
            Connect with others, share experiences, and get support on your health journey
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <Card className="tadashi-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Members</span>
                    <span className="font-semibold">1,248</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Posts</span>
                    <span className="font-semibold">{posts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Comments</span>
                    <span className="font-semibold">{comments.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="tadashi-card">
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "ghost"}
                      className={`w-full justify-between ${selectedCategory === category ? "bg-tadashi-blue hover:bg-tadashi-darkBlue" : ""}`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      <span>{category === "all" ? "All Topics" : category}</span>
                      <span className="bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-1 text-xs">
                        {postsByCategory[category]}
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ask Tadashi AI */}
            <Card className="tadashi-card">
              <CardHeader>
                <CardTitle>Ask Tadashi AI</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Get instant health advice from our AI assistant
                </p>
                <Button className="tadashi-button w-full">
                  Chat with Tadashi AI
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Create Post */}
            <Card className="tadashi-card mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search community posts..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="tadashi-button">
                        New Post
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
                      <DialogHeader>
                        <DialogTitle>Create New Post</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="title" className="text-right">
                            Title
                          </Label>
                          <Input
                            id="title"
                            value={newPost.title}
                            onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                            className="col-span-3"
                            placeholder="What would you like to discuss?"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="category" className="text-right">
                            Category
                          </Label>
                          <select
                            id="category"
                            value={newPost.category}
                            onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                            className="col-span-3 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            aria-label="Select category"
                            title="Select category"
                          >
                            <option value="General">General</option>
                            <option value="Sleep">Sleep</option>
                            <option value="Hydration">Hydration</option>
                            <option value="Mental Health">Mental Health</option>
                            <option value="Nutrition">Nutrition</option>
                            <option value="Exercise">Exercise</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="content" className="text-right">
                            Content
                          </Label>
                          <Textarea
                            id="content"
                            value={newPost.content}
                            onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                            className="col-span-3"
                            placeholder="Share your thoughts, questions, or experiences..."
                            rows={4}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="tadashi-button"
                          onClick={handleAddPost}
                        >
                          Post
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Posts List */}
            {filteredPosts.length === 0 ? (
              <Card className="tadashi-card">
                <CardContent className="py-12 text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">No posts found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {searchTerm || selectedCategory !== "all" 
                      ? "Try adjusting your search or filter" 
                      : "Be the first to start a discussion!"}
                  </p>
                  <Button 
                    className="tadashi-button"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    Create Your First Post
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="tadashi-card">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{post.title}</CardTitle>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <User className="h-4 w-4 mr-1" />
                            {post.author}
                            <Clock className="h-4 w-4 ml-3 mr-1" />
                            {post.timestamp}
                            <span className="mx-2">•</span>
                            <span className="bg-tadashi-blue/10 dark:bg-tadashi-blue/20 px-2 py-1 rounded-full text-xs">
                              {post.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">{post.content}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikePost(post.id)}
                            className={post.isLiked ? "text-red-500 hover:text-red-600" : ""}
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {post.likes}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedPostId(selectedPostId === post.id ? null : post.id)}
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {post.comments} Comments
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm">
                          Share
                        </Button>
                      </div>
                      
                      {/* Comments Section */}
                      {selectedPostId === post.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="space-y-3 mb-4">
                            {comments
                              .filter(comment => comment.postId === post.id)
                              .map(comment => (
                                <div key={comment.id} className="flex items-start">
                                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                                    <User className="h-4 w-4" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                                      <div className="flex justify-between">
                                        <span className="font-medium text-sm">{comment.author}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{comment.timestamp}</span>
                                      </div>
                                      <p className="text-sm mt-1">{comment.content}</p>
                                    </div>
                                  </div>
                                </div>
                              ))
                            }
                          </div>
                          
                          <div className="flex items-start">
                            <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                              <User className="h-4 w-4" />
                            </div>
                            <div className="flex-1 flex">
                              <Input
                                placeholder="Write a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="flex-1 mr-2"
                              />
                              <Button 
                                size="sm"
                                onClick={() => handleAddComment(post.id)}
                              >
                                Post
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}