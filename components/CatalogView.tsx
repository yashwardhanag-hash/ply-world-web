'use client'

import { useState, useEffect, type FormEvent } from 'react'

const menuMapping: Record<string, string[]> = {
  'plywood': ['centuryply', 'globe', 'sigma'],
  'laminates': ['aica', 'acrylic'],
  'sanitaryware': ['roca', 'sato'],
  'hardware': ['hepo', 'vrinda']
}

// 1. DUMMY BANNER DATA (You will replace these images with your actual banners)
const promotionalBanners = [
  { id: 1, brand: 'all', title: 'The Ultimate Plywood Collection', subtitle: 'Explore our premium range of BWP and MR grade materials.', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80', tag: 'TRENDING' },
  { id: 2, brand: 'centuryply', title: 'CenturyPly Sainik 710', subtitle: 'Asli Waterproof Plywood for your interiors.', image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1200&q=80', tag: 'NEW LAUNCH' },
  { id: 3, brand: 'roca', title: 'Roca Inspira Series', subtitle: 'Minimalist sanitaryware for modern bathrooms.', image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80', tag: 'PREMIUM' },
]

const showcaseProducts = [
  { id: 'showcase-roca-inspira', title: 'Inspira Wall-Hung WC', description: 'Contemporary rimless toilet with a clean, compact profile.', base_price: 18990, image_urls: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=85'], brands: { slug: 'roca', name: 'Roca' }, categories: { slug: 'sanitaryware', name: 'Sanitaryware' }, product_variants: [{ id: 'roca-specs', size_ft: 'Wall-hung', thickness_mm: null }, { id: 'roca-finish', size_ft: 'Soft-close seat', thickness_mm: null }] },
  { id: 'showcase-sato-basin', title: 'SATO Countertop Basin', description: 'Elegant ceramic basin with a smooth alpine white finish.', base_price: 7490, image_urls: ['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=85'], brands: { slug: 'sato', name: 'SATO' }, categories: { slug: 'sanitaryware', name: 'Sanitaryware' }, product_variants: [{ id: 'sato-size', size_ft: '600 × 400 mm', thickness_mm: null }, { id: 'sato-finish', size_ft: 'Alpine white', thickness_mm: null }] },
  { id: 'showcase-century-ply', title: 'Sainik 710 BWP Plywood', description: 'Boiling waterproof plywood built for dependable interiors.', base_price: 4250, image_urls: ['https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=900&q=85'], brands: { slug: 'centuryply', name: 'CenturyPly' }, categories: { slug: 'plywood', name: 'Plywood' }, product_variants: [{ id: 'century-thickness', size_ft: '8 × 4 ft', thickness_mm: 18 }, { id: 'century-grade', size_ft: 'BWP 710', thickness_mm: 12 }] },
  { id: 'showcase-greenply', title: 'Green Club Plus Plywood', description: 'Premium calibrated plywood for high-performance cabinetry.', base_price: 5180, image_urls: ['https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=85'], brands: { slug: 'greenply', name: 'Greenply' }, categories: { slug: 'plywood', name: 'Plywood' }, product_variants: [{ id: 'green-thickness', size_ft: '8 × 4 ft', thickness_mm: 19 }, { id: 'green-grade', size_ft: 'BWP 710', thickness_mm: 12 }] },
  { id: 'showcase-hafele-handle', title: 'Hafele Matrix Cabinet Handle', description: 'Brushed brass architectural hardware for modern joinery.', base_price: 890, image_urls: ['https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=900&q=85'], brands: { slug: 'hafele', name: 'Hafele' }, categories: { slug: 'hardware', name: 'Hardware' }, product_variants: [{ id: 'hafele-length', size_ft: '160 mm centre', thickness_mm: null }, { id: 'hafele-finish', size_ft: 'Brushed brass', thickness_mm: null }] },
  { id: 'showcase-blum-hinge', title: 'Blum Clip-Top Soft-Close Hinge', description: 'Smooth, silent cabinet movement with dependable adjustment.', base_price: 620, image_urls: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=85'], brands: { slug: 'blum', name: 'Blum' }, categories: { slug: 'hardware', name: 'Hardware' }, product_variants: [{ id: 'blum-opening', size_ft: '110° opening', thickness_mm: null }, { id: 'blum-mount', size_ft: 'Full overlay', thickness_mm: null }] },
]

export default function CatalogView({
  initialProducts = [],
  categories = [],
  brands = [],
  series = [],
  defaultCategory = 'all' // <--- 1. We added this line
}: {
  initialProducts?: any[]
  categories?: any[]
  brands?: any[]
  series?: any[]
  defaultCategory?: string // <--- 2. We added this line
}) {
  const [mounted, setMounted] = useState(false)
  
  // States
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory) // <--- 3. We changed 'all' to defaultCategory
  const [selectedBrand, setSelectedBrand] = useState<string>('all')
  const [selectedSeries, setSelectedSeries] = useState<string>('all')
  const [selectedThickness, setSelectedThickness] = useState<string>('all')
  const [selectedSize, setSelectedSize] = useState<string>('all')
  const [openSidebarFilter, setOpenSidebarFilter] = useState<string | null>(null)
  const [inquiryProduct, setInquiryProduct] = useState<any | null>(null)
  const [customerName, setCustomerName] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [quantity, setQuantity] = useState('1')

  // Banner State
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-rotate banners
  const activeBanners = promotionalBanners.filter(b => selectedBrand === 'all' || b.brand === selectedBrand || b.brand === 'all')
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIdx((prev) => (prev + 1) % activeBanners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [activeBanners.length])

  if (!mounted) {
    return <div className="py-12 text-center text-slate-500 text-sm">Loading catalog...</div>
  }

  // Use live catalog data when available, with a curated six-card showcase for an empty catalog.
  const catalogProducts = initialProducts.length > 0 ? initialProducts : showcaseProducts

  // 1. Get products for current category context
  const currentCategoryProducts = catalogProducts.filter(
    p => selectedCategory === 'all' || p.categories?.slug === selectedCategory
  )

  // 2. BI-DIRECTIONAL FILTERING
  const allPossibleBrands = Array.from(new Set(currentCategoryProducts.map(p => p.brands?.slug))).filter(Boolean) as string[]
  const allPossibleSizes = Array.from(new Set(currentCategoryProducts.flatMap(p => p.product_variants?.map((v: any) => v.size_ft)))).filter(Boolean) as string[]

  const validBrands = new Set(
    currentCategoryProducts
      .filter(p => selectedSize === 'all' || p.product_variants?.some((v: any) => v.size_ft === selectedSize))
      .map(p => p.brands?.slug)
  )

  const validSizes = new Set(
    currentCategoryProducts
      .filter(p => selectedBrand === 'all' || p.brands?.slug === selectedBrand)
      .flatMap(p => p.product_variants?.map((v: any) => v.size_ft))
  )

  // 3. Final Output
  const finalFilteredProducts = currentCategoryProducts.filter((product: any) => {
    const matchesBrand = selectedBrand === 'all' || product.brands?.slug === selectedBrand
    const matchesSeries = selectedSeries === 'all' || product.series?.slug === selectedSeries
    const matchesThickness = selectedThickness === 'all' || product.product_variants?.some((v: any) => v.thickness_mm?.toString() === selectedThickness)
    const matchesSize = selectedSize === 'all' || product.product_variants?.some((v: any) => v.size_ft === selectedSize)
    
    return matchesBrand && matchesSeries && matchesThickness && matchesSize
  })

  // Dynamic Sidebar visibility based on Category
  const showThicknessFilter = selectedCategory === 'all' || selectedCategory === 'plywood'
  const showSizeFilter = selectedCategory === 'all' || selectedCategory === 'plywood' || selectedCategory === 'laminates'

  const openInquiry = (product: any) => {
    setInquiryProduct(product)
    setCustomerName('')
    setMobileNumber('')
    setQuantity('1')
  }

  const submitInquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!inquiryProduct) return

    const phone = '919876543210'
    const text = encodeURIComponent(`Hello PLY WORLD! I would like to place an inquiry.\n*Customer:* ${customerName}\n*Mobile:* ${mobileNumber}\n*Product:* ${inquiryProduct.title}\n*Brand:* ${inquiryProduct.brands?.name || 'Standard'}\n*Quantity:* ${quantity}`)
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer')
    setInquiryProduct(null)
  }

  return (
    <div className="space-y-8 relative">
      
      {/* 
        =====================================================================
        SIDEBAR: UNIFORM WIDTH & CONTEXT AWARE
        =====================================================================
      */}
      <aside className="hidden md:flex fixed top-32 left-0 h-[calc(100vh-160px)] min-h-[500px] bg-[#11101D] text-slate-300 rounded-r-2xl z-[60] w-16 hover:w-72 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group overflow-hidden flex-col shadow-2xl border-y border-r border-slate-800">
        
        <div className="p-4 border-b border-slate-800 flex items-center whitespace-nowrap h-16">
          <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-slate-800 text-white rounded-lg shadow-sm border border-slate-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M7 12h10M10 18h4" />
            </svg>
          </div>
          <span className="ml-4 font-bold text-white tracking-wider text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            DEEP FILTERS
          </span>
        </div>

        <div className="flex-1 py-4 overflow-y-auto overflow-x-hidden space-y-2">
          
          {/* Brand Filter (Always Visible) */}
          <div className="px-2 group/filter">
            <div className="w-full flex items-center px-2 py-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
              <svg className="w-6 h-6 flex-shrink-0 text-blue-400 group-hover/filter:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              <div className="ml-4 flex-1 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                <span className="text-sm font-semibold">Brands</span>
                <svg className="w-4 h-4 transition-transform duration-300 group-hover/filter:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
            
            <div className="overflow-hidden max-h-0 group-hover/filter:max-h-64 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
              <div className="pl-12 pr-4 py-2 space-y-1 opacity-0 group-hover/filter:opacity-100 transition-opacity duration-300 delay-100 flex flex-col">
                <button onClick={() => setSelectedBrand('all')} className={`text-left text-sm py-1.5 font-medium transition-colors ${selectedBrand === 'all' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}>All Brands</button>
                {allPossibleBrands.map(brandSlug => {
                  const brandObj = brands.find(b => b.slug === brandSlug)
                  const isValid = validBrands.has(brandSlug)
                  return (
                    <button
                      key={brandSlug}
                      onClick={() => isValid && setSelectedBrand(selectedBrand === brandSlug ? 'all' : brandSlug)}
                      disabled={!isValid}
                      className={`text-left text-sm py-1.5 font-medium transition-colors whitespace-nowrap ${!isValid ? 'opacity-30 cursor-not-allowed line-through' : selectedBrand === brandSlug ? 'text-blue-400' : 'text-slate-400 hover:text-white hover:translate-x-1'}`}
                    >
                      {brandObj?.name || brandSlug}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Size Filter (Only shows for Plywood/Laminates) */}
          {showSizeFilter && (
            <div className="px-2 group/filter">
              <div className="w-full flex items-center px-2 py-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
                <svg className="w-6 h-6 flex-shrink-0 text-purple-400 group-hover/filter:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                <div className="ml-4 flex-1 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  <span className="text-sm font-semibold">Dimensions & Sizes</span>
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover/filter:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              <div className="overflow-hidden max-h-0 group-hover/filter:max-h-64 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
                <div className="pl-12 pr-4 py-2 space-y-1 opacity-0 group-hover/filter:opacity-100 transition-opacity duration-300 delay-100 flex flex-col">
                  <button onClick={() => setSelectedSize('all')} className={`text-left text-sm py-1.5 font-medium transition-colors ${selectedSize === 'all' ? 'text-purple-400' : 'text-slate-400 hover:text-white'}`}>All Sizes</button>
                  {allPossibleSizes.map(size => {
                    const isValid = validSizes.has(size)
                    return (
                      <button
                        key={size}
                        onClick={() => isValid && setSelectedSize(selectedSize === size ? 'all' : size)}
                        disabled={!isValid}
                        className={`text-left text-sm py-1.5 font-medium transition-colors whitespace-nowrap ${!isValid ? 'opacity-30 cursor-not-allowed line-through' : selectedSize === size ? 'text-purple-400' : 'text-slate-400 hover:text-white hover:translate-x-1'}`}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Thickness Filter (Only shows for Plywood) */}
          {showThicknessFilter && (
            <div className="px-2 group/filter">
              <div className="w-full flex items-center px-2 py-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
                <svg className="w-6 h-6 flex-shrink-0 text-amber-400 group-hover/filter:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                <div className="ml-4 flex-1 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  <span className="text-sm font-semibold">Thickness (mm)</span>
                  <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* TOP NAVIGATION */}
      <nav className="relative z-50 flex flex-wrap items-start gap-2 pb-4 border-b border-slate-200">
        {[
          { label: 'All Products', slug: 'all', items: [] },
          { label: 'Plywood', slug: 'plywood', items: ['CenturyPly', 'Greenply', 'Archidply'] },
          { label: 'Laminates', slug: 'laminates', items: ['Aica', 'Merino', 'Greenlam'] },
          { label: 'Sanitaryware', slug: 'sanitaryware', items: ['Roca', 'SATO', 'Kohler', 'Jaquar'] },
          { label: 'Hardware', slug: 'hardware', items: ['Hafele', 'Ozone', 'Blum'] },
        ].map((item) => {
          const isActive = selectedCategory === item.slug
          const hasDropdown = item.items.length > 0

          return (
            <div key={item.slug} className="relative group">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory(item.slug)
                  setSelectedBrand('all')
                  setSelectedSeries('all')
                  setSelectedThickness('all')
                  setSelectedSize('all')
                }}
                className={`flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm transition-all duration-200 hover:bg-slate-50 ${isActive ? 'ring-2 ring-slate-200 ring-offset-1' : ''}`}
              >
                {item.label}
                {hasDropdown && (
                  <svg className="h-4 w-4 text-slate-500 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 9 6 6 6-6" />
                  </svg>
                )}
              </button>

              {hasDropdown && (
                <div className="pointer-events-none absolute left-0 top-full mt-1 min-w-[180px] translate-y-1 rounded-xl border border-slate-200 bg-white p-2 opacity-0 shadow-lg transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="space-y-1">
                    {item.items.map((brand) => (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(item.slug)
                          setSelectedBrand(brand.toLowerCase())
                          setSelectedSeries('all')
                          setSelectedThickness('all')
                          setSelectedSize('all')
                        }}
                        className="block w-full rounded-lg border border-slate-200/60 bg-slate-50 p-2 text-left text-sm font-medium text-slate-900 transition-all duration-200 ease-out hover:translate-x-1 hover:border-l-4 hover:border-l-blue-500 hover:bg-slate-100 hover:shadow-sm"
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* 
        =====================================================================
        MAIN CONTENT AREA
        =====================================================================
      */}
      <div className="flex relative min-h-[600px] items-start w-full">
        <div className="w-16 hidden md:block flex-shrink-0 mr-6"></div>

        <div className="flex-1 w-full relative z-10 space-y-12 pb-24">
          
          {/* SMART BANNER HERO */}
          {activeBanners.length > 0 && (
            <div className="w-full h-[280px] rounded-2xl overflow-hidden relative shadow-md group">
              {activeBanners.map((banner, idx) => (
                <div 
                  key={banner.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentBannerIdx ? 'opacity-100' : 'opacity-0'}`}
                >
                  <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent flex flex-col justify-center px-10">
                    <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded w-max mb-3">
                      {banner.tag}
                    </span>
                    <h2 className="text-3xl font-extrabold text-white mb-2 max-w-lg">{banner.title}</h2>
                    <p className="text-slate-300 text-sm max-w-md font-medium">{banner.subtitle}</p>
                  </div>
                </div>
              ))}
              {/* Slideshow Indicators */}
              <div className="absolute bottom-4 left-10 flex gap-2">
                {activeBanners.map((_, idx) => (
                  <div key={idx} className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentBannerIdx ? 'w-6 bg-white' : 'w-2 bg-white/40'}`} />
                ))}
              </div>
            </div>
          )}

          {/* 
            NETFLIX STYLE STRIPS (When No Brand is Selected)
          */}
          {selectedBrand === 'all' && selectedCategory !== 'all' ? (
            <div className="space-y-10">
              {allPossibleBrands.map(brandSlug => {
                const brandObj = brands.find(b => b.slug === brandSlug)
                const productsInStrip = finalFilteredProducts.filter(p => p.brands?.slug === brandSlug)
                
                if (productsInStrip.length === 0) return null

                return (
                  <div key={brandSlug} className="space-y-4">
                    <div className="flex items-end justify-between">
                      <h3 className="text-xl font-extrabold text-slate-800">{brandObj?.name || brandSlug} Collection</h3>
                      <button onClick={() => setSelectedBrand(brandSlug)} className="text-sm font-bold text-blue-600 hover:text-blue-700">View All →</button>
                    </div>
                    
                    {/* Horizontal Scroller */}
                    <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory hide-scrollbar">
                      {productsInStrip.map((item: any) => (
                        <div key={item.id} className="min-w-[280px] w-[280px] snap-start bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 flex-shrink-0">
                          {/* Card Content (Same as Grid) */}
                          <div className="h-40 bg-slate-100 relative overflow-hidden group/img">
                            <img src={item.image_urls?.[0] || 'https://via.placeholder.com/400'} alt={item.title} className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"/>
                            {item.series?.name && <span className="absolute top-3 right-3 bg-blue-600/95 text-white text-[10px] uppercase font-black px-2.5 py-1 rounded shadow-sm">{item.series.name}</span>}
                          </div>
                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] uppercase tracking-widest font-black text-slate-500">{item.brands?.name || 'Standard'}</span>
                              <h3 className="text-sm font-bold text-slate-900 mt-1 leading-snug truncate">{item.title}</h3>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                              <span className="text-sm font-black text-slate-900">₹{item.base_price?.toLocaleString('en-IN')}</span>
                              <button onClick={() => openInquiry(item)} className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded transition hover:bg-emerald-600">Inquire via WhatsApp</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* 
              STANDARD DEEP DIVE GRID (When Brand IS Selected, or Category is 'All')
            */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {finalFilteredProducts.map((item: any) => (
                <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300">
                  <div className="h-48 bg-slate-100 relative overflow-hidden group/img">
                    <img src={item.image_urls?.[0] || 'https://via.placeholder.com/400'} alt={item.title} className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 bg-slate-900/90 text-white text-[10px] uppercase font-black px-2.5 py-1 rounded backdrop-blur-sm shadow-sm">{item.categories?.name}</span>
                    {item.series?.name && <span className="absolute top-3 right-3 bg-blue-600/95 text-white text-[10px] uppercase font-black px-2.5 py-1 rounded shadow-sm">{item.series.name}</span>}
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-black text-slate-500">{item.brands?.name || 'Standard'}</span>
                      <h3 className="text-base font-bold text-slate-900 mt-1 leading-snug">{item.title}</h3>
                      <p className="text-slate-600 text-xs mt-2 line-clamp-2 leading-relaxed">{item.description}</p>
                      {item.product_variants && item.product_variants.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Available Specs:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {item.product_variants.map((v: any) => (
                              <span key={v.id} className="bg-slate-50 text-slate-600 text-[11px] font-semibold px-2 py-1 rounded border border-slate-200">
                                {v.thickness_mm ? `${v.thickness_mm}mm` : ''} {v.size_ft ? `(${v.size_ft})` : ''}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Starting Price</span>
                        <span className="text-lg font-black text-slate-900">₹{item.base_price?.toLocaleString('en-IN')}</span>
                      </div>
                      <button onClick={() => openInquiry(item)} className="bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all shadow-sm">Inquire via WhatsApp</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {finalFilteredProducts.length === 0 && (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300 w-full">
              <p className="text-slate-500 text-sm font-semibold">No items found matching the selected filters.</p>
            </div>
          )}
        </div>
      </div>

      {inquiryProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setInquiryProduct(null)}>
          <div role="dialog" aria-modal="true" aria-labelledby="inquiry-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Product inquiry</p>
                <h2 id="inquiry-title" className="mt-1 text-xl font-extrabold text-slate-900">{inquiryProduct.title}</h2>
                <p className="mt-1 text-sm text-slate-500">Share your details and we&apos;ll continue on WhatsApp.</p>
              </div>
              <button type="button" aria-label="Close inquiry form" onClick={() => setInquiryProduct(null)} className="rounded-full p-2 text-xl leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-900">×</button>
            </div>

            <form onSubmit={submitInquiry} className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700">Customer Name
                <input required value={customerName} onChange={(event) => setCustomerName(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" placeholder="Your full name" />
              </label>
              <label className="block text-sm font-semibold text-slate-700">Mobile Number
                <input required type="tel" inputMode="tel" pattern="[0-9+()\- ]{7,}" value={mobileNumber} onChange={(event) => setMobileNumber(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" placeholder="e.g. 9876543210" />
              </label>
              <label className="block text-sm font-semibold text-slate-700">Quantity
                <input required type="number" min="1" step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              </label>
              <button type="submit" className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2">Continue to WhatsApp</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
