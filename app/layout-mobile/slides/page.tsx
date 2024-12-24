"use client"

import { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Bell, Menu, Trash2, ChevronLeft, ChevronRight, Edit2, X } from 'lucide-react'
import Image from 'next/image'

interface Slide {
  id: string;
  image: string;
}

interface Banner {
  id: string;
  image: string;
  title: string;
}

export default function SlidesAndBannersPage() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [banners, setBanners] = useState<Banner[]>([])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [bannerTitle, setBannerTitle] = useState('')
  const [bannerImage, setBannerImage] = useState<string | null>(null)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)

  const onDropSlide = useCallback((acceptedFiles: File[]) => {
    if (slides.length < 3) {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onload = () => {
          setSlides(prevSlides => [
            ...prevSlides,
            { id: Date.now().toString(), image: reader.result as string }
          ])
        }
        reader.readAsDataURL(file)
      })
    }
  }, [slides])

  const onDropBanner = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      const reader = new FileReader()
      reader.onload = () => {
        setBannerImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps: getSlideRootProps, getInputProps: getSlideInputProps } = useDropzone({ 
    onDrop: onDropSlide, 
    accept: { 'image/*': [] }, 
    maxFiles: 1 
  })
  const { getRootProps: getBannerRootProps, getInputProps: getBannerInputProps } = useDropzone({ 
    onDrop: onDropBanner, 
    accept: { 'image/*': [] }, 
    maxFiles: 1 
  })

  const deleteSlide = (id: string) => {
    setSlides(prevSlides => prevSlides.filter(slide => slide.id !== id))
  }

  const deleteBanner = (id: string) => {
    setBanners(prevBanners => prevBanners.filter(banner => banner.id !== id))
  }

  const addBanner = () => {
    if (bannerTitle && bannerImage) {
      setBanners(prevBanners => [
        ...prevBanners,
        { id: Date.now().toString(), image: bannerImage, title: bannerTitle }
      ])
      setBannerTitle('')
      setBannerImage(null)
    }
  }

  const editBanner = (banner: Banner) => {
    setEditingBanner(banner)
    setBannerTitle(banner.title)
    setBannerImage(banner.image)
  }

  const updateBanner = () => {
    if (editingBanner && bannerTitle && bannerImage) {
      setBanners(prevBanners => prevBanners.map(banner => 
        banner.id === editingBanner.id ? { ...banner, title: bannerTitle, image: bannerImage } : banner
      ))
      setEditingBanner(null)
      setBannerTitle('')
      setBannerImage(null)
    }
  }

  const cancelEdit = () => {
    setEditingBanner(null)
    setBannerTitle('')
    setBannerImage(null)
  }

  useEffect(() => {
    if (slides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length)
      }, 3000)
      return () => clearInterval(timer)
    }
  }, [slides])

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <h1 className="text-2xl font-bold mb-6">Cadastro de Slides</h1>
          <Card className="p-6 mb-8">
            <div {...getSlideRootProps()} className="border-2 border-dashed rounded-md p-8 mb-4 text-center cursor-pointer">
              <input {...getSlideInputProps()} />
              <p>Arraste e solte uma imagem aqui, ou clique para selecionar um arquivo</p>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {slides.map((slide, index) => (
                <div key={slide.id} className="relative">
                  <img src={slide.image} alt={`Slide ${index + 1}`} className="w-full h-24 object-cover rounded" />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1"
                    onClick={() => deleteSlide(slide.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          <h2 className="text-2xl font-bold mb-6">Cadastro de Banners</h2>
          <Card className="p-6">
            <div className="mb-4">
              <Label htmlFor="bannerTitle">Título do Banner</Label>
              <Input
                id="bannerTitle"
                value={bannerTitle}
                onChange={(e) => setBannerTitle(e.target.value)}
                placeholder="Digite o título do banner"
              />
            </div>
            <div {...getBannerRootProps()} className="border-2 border-dashed rounded-md p-8 mb-4 text-center cursor-pointer">
              <input {...getBannerInputProps()} />
              <p>Arraste e solte uma imagem aqui, ou clique para selecionar um arquivo</p>
            </div>
            {bannerImage && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Pré-visualização:</h3>
                <img src={bannerImage} alt="Banner preview" className="w-full h-40 object-cover rounded" />
              </div>
            )}
            {editingBanner ? (
              <div className="flex gap-2">
                <Button 
                  onClick={updateBanner} 
                  className="flex-1 bg-[#0078FF] hover:bg-blue-600"
                >
                  Atualizar Banner
                </Button>
                <Button 
                  onClick={cancelEdit}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            ) : (
              <Button 
                onClick={addBanner} 
                disabled={!bannerTitle || !bannerImage}
                className="w-full bg-[#0078FF] hover:bg-blue-600"
              >
                Adicionar Banner
              </Button>
            )}
            <div className="grid grid-cols-1 gap-4 mt-4">
              {banners.map((banner, index) => (
                <div key={banner.id} className="relative">
                  <img src={banner.image} alt={`Banner ${index + 1}`} className="w-full h-24 object-cover rounded" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1 text-xs">
                    {banner.title}
                  </div>
                  <div className="absolute top-1 right-1 flex gap-1">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => editBanner(banner)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteBanner(banner.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
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
                    {slides.length > 0 && (
                      <div className="slide-container">
                        <img src={slides[currentSlideIndex].image} alt={`Slide ${currentSlideIndex + 1}`} className="slide-image" />
                        <div className="slide-controls">
                          <ChevronLeft className="slide-arrow" />
                          <div className="slide-indicators">
                            {slides.map((_, index) => (
                              <div
                                key={index}
                                className={`slide-indicator ${index === currentSlideIndex ? 'active' : ''}`}
                              />
                            ))}
                          </div>
                          <ChevronRight className="slide-arrow" />
                        </div>
                      </div>
                    )}
                    <div className="banner-container">
                      {banners.map((banner, index) => (
                        <div key={banner.id} className="banner-item">
                          <h3 className="banner-title">{banner.title}</h3>
                          <img src={banner.image} alt={`Banner ${index + 1}`} className="banner-image" />
                        </div>
                      ))}
                    </div>
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
          background-color: #fff;
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
          padding-bottom: 60px;
        }
        .slide-container {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        .slide-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .slide-controls {
          position: absolute;
          bottom: 10px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 10px;
        }
        .slide-arrow {
          color: white;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          padding: 5px;
        }
        .slide-indicators {
          display: flex;
          gap: 5px;
        }
        .slide-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.5);
        }
        .slide-indicator.active {
          background-color: white;
        }
        .banner-container {
          padding: 10px;
        }
        .banner-item {
          margin-bottom: 20px;
          background-color: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0, 0, 0.1);
        }
        .banner-title {
          padding: 10px;
          font-size: 16px;
          font-weight: bold;
          text-align: center;
        }
        .banner-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
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

