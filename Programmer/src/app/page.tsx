'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Product {
  id: number;
  category_id: number;
  name: string;
  description: string;
  price: string | number;
  stock_quantity: number;
  image_url: string;
  category_name?: string;
  main_type?: string;
}

const BANNERS = [
  {
    id: 1,
    title: 'Organic Vegetables',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdEyFvY50vwZScc2ZUCyhwxU9gzZgcKJnSglEqWk3CSLKtLjkVzv6D9Gq2uyUqAEvIjfJ9vGfW0-Ht2Gh82V1tKXiunYJfUgEyPDxY7KyDFENqwo6kjX8zLkNF5Va4i_QJWVeU5EZcuYR45mJCw5QDVXuedp2fYeUYr-Rwbvg373vLd_vXDwE-y7VJyy6j0y9E5ratEnCSBjLueaIMlXmC9xUnl02HycAaOkbC1fH-h0LeOmI0SSGo_pP-e05Ehi0Jn4OgtdqowkCp',
    headline: 'สดใหม่จากสวนออร์แกนิคเลิศรส',
    subheadline: 'ปลูกด้วยรัก ดูแลด้วยวิถีธรรมชาติ 100%',
  },
  {
    id: 2,
    title: 'Seasonal Fruits',
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLtPj2-aCOiaTCWwL25YIX8XeMk8m1V5FPr54JCWgxj8Dc99SIvWX7c87M_RyAJIIpJ_QFiy699FNPJS9r4nW_dd8UeEB8kL40lOnqKIqhw_7oJ60mSS_Y-SmKVe2ct5lsv-TdMnaG5DmREcLk0TNEbNEYFg1JwqGZ6AG5nOVtd2ZWjkcF1YN26zlgqMw_DWHk64uxR_WfUchcv8sLyEL3q00RVypNDUcJqCN-rZQT52W33AWJjP320Y4uPX',
    headline: 'ผลไม้ตามฤดูกาลรสหวานฉ่ำ',
    subheadline: 'ส่งตรงถึงบ้านรักษาความเย็นและสดใหม่',
  },
  {
    id: 3,
    title: 'Farmer with Harvest',
    image: 'https://lh3.googleusercontent.com/aida/AP1WRLux-qgrv3qb4wxhBrlNjAX4BGWyuGlcgZTw-Gw_UNXA4KkDCLdm-oawjYwMidrWjuV2zmGSKpd8Hoq-h86EpdYlTcv2WwQVbPc0a6U8TUm_JecTCBa1CsgmUQCF4mYZWSWEs6GGcA3jg-l0ha2RmW_c-3e58tamn9kJbQoLFMOuLi1JhrAPLkz7aI7wPWbDwd0bptTJFkAOC2Dl-W9CD70ckFxXc9RHiYL-xnZTOrSsmZ_5dh7yCpC-RqTN',
    headline: 'จากมือเกษตรกรถึงโต๊ะอาหารคุณ',
    subheadline: 'สนับสนุนเกษตรกรไทยโดยตรง ได้สินค้าคุณภาพดีราคายุติธรรม',
  },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    category_id: 2,
    name: 'แครอทออร์แกนิค (500g)',
    description: 'แครอทสดใหม่จากสวนเกษตรอินทรีย์ ปลอดภัยไร้สารเคมี',
    price: 45.00,
    stock_quantity: 50,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKxj_O4Ii3B1pH-lKpdIhIojjXNi77FbrTSoFU78MU2CLQjedEzYi04cDpNKJ73AQ-DP4v2jZjjjkI9bcaDYWDuKELatvd4BB_oRyvd9JYHXf2yxGtEH3HJLn49XosKoMeLjgaFPnUbxeBVMjMz81dg4y5pCxqgReEOYiW2cYPU4CWzUaNkjjWIGu-xmmWtpU-aRbVcFZIugC_Ieaoq9Ut_GSf-4UJX89mhjq5PmdcudE5AcudyrzIzGwE9ryWhMufvxujSgKPDC71',
    category_name: 'ผักกินหัวหรือราก',
    main_type: 'vegetable'
  },
  {
    id: 2,
    category_id: 4,
    name: 'มะเขือเทศเชอร์รี่ (250g)',
    description: 'มะเขือเทศเชอร์รี่รสหวานอมเปรี้ยว สดกรอบ อุดมด้วยวิตามินซี',
    price: 65.00,
    stock_quantity: 30,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2F5eSsHpmqp_ZqzwaZbV3CrjREvmYD9PssxhI9A98bgeYHbNJ9k6nrIGoYWO0XVWibS3k9WYi-N_PFGm0flm-Lzhcqkc3yp1bKPS3G24YwtFe0TwjR1igkPI0CP8jxMB4P39xvvcsits33lQWACcr7N7K1qg3STKYozAmg24QiQ6kk1qg9KfKGncpfqq33fADuH9G1xxYXC49xqEpz2Kx36KWINn7EnVVl3dQVicMcl1YKK3xCM1VMV3HCNPcaPAUMo1RB_4ptLy0',
    category_name: 'ผักกินผล',
    main_type: 'vegetable'
  },
  {
    id: 3,
    category_id: 1,
    name: 'บรอกโคลีพรีเมียม (1 หัว)',
    description: 'บรอกโคลีออร์แกนิคหัวใหญ่ ดอกแน่น กรอบอร่อย',
    price: 55.00,
    stock_quantity: 25,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4obRn2UP7lbHZGum891fYJ0X0ThVq6V_dlBkTJtjO7biJlkKKr133g-AM-1ANN2qtRlaANVVlsZTl6yS-9udf9HjV5m0zFhR5CzE0zTqZBZjQjyFwtfb_WCBPKlGuse1KPh_kLfbE3cCuZqD6R1NCT52VfG2-EMDc93KsOuyGLFoTAsp0zx7pHlYSsRH7i_2ZJYoA7N6YvA96_ZAR4kC1Y-Pt0uedz7TH4br370YxAPy1w1wQ1hxQL2LPAIpViVUJ5T8oDX4hyzbG',
    category_name: 'ผักใบเขียว',
    main_type: 'vegetable'
  },
  {
    id: 4,
    category_id: 8,
    name: 'แอปเปิ้ลฟูจิ (4 ผล)',
    description: 'แอปเปิ้ลฟูจินำเข้า รสหวานกรอบ อร่อยเต็มคำ',
    price: 120.00,
    stock_quantity: 15,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDQIVvNMzIAvECEo3B1CKJ4bmveZ3rUy0KurX2geGEvFiLekKmSsU3JJ85evm3ajvjvzQsBTHx1y0VgdLdBRYR2JhnNVxwQSRrAxKRexrblOgFT9gCwOua96FCfhi4dTy85An7lTAYxv4GLiT4ZJbIGC13khMpcxKIr3FYbKE03MzRvwHEV4fSJxc8AGrcznVUyV_MUjkcd1R4acdeV7KYUgxMQFPHFobj4XYN7uVa_l5SlsWteKfLjRgvSfcx4tOKZzNXitfvvbFz',
    category_name: 'ผลไม้เมืองหนาว / นำเข้า',
    main_type: 'fruit'
  }
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [selectedMainType, setSelectedMainType] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const slideInterval = useRef<NodeJS.Timeout | null>(null);

  // Load products from API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success && data.data) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error('Failed to load products from API:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Header scroll shadow effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Banner slider automatic cycle
  const startSlideShow = () => {
    stopSlideShow();
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
  };

  const stopSlideShow = () => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
  };

  useEffect(() => {
    startSlideShow();
    return () => stopSlideShow();
  }, []);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    startSlideShow();
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
    startSlideShow();
  };

  const handleSelectDot = (index: number) => {
    setCurrentSlide(index);
    startSlideShow();
  };

  // Add to cart action with dynamic indicator
  const handleAddToCart = (productName: string) => {
    setCartCount((prev) => prev + 1);
  };

  // Toggle favorite list
  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Filtered products list based on search and main category type
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (p.category_name && p.category_name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedMainType ? p.main_type === selectedMainType : true;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col font-body-md text-body-md bg-surface text-on-surface">
      {/* TopNavBar */}
      <header
        className={`sticky top-0 z-50 w-full bg-surface/95 dark:bg-inverse-surface/95 backdrop-blur-md transition-all duration-300 ${
          hasScrolled ? 'shadow-sm border-transparent' : 'border-b border-outline-variant/30'
        }`}
      >
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-stack-md max-w-container-max mx-auto">
          {/* Brand Logo */}
          <a
            className="text-headline-md font-headline-md font-bold text-primary dark:text-primary-fixed-dim flex items-center gap-2 group cursor-pointer"
            onClick={() => {
              setSelectedMainType(null);
              setSearchQuery('');
            }}
          >
            <span
              className="material-symbols-outlined text-primary dark:text-primary-fixed-dim text-3xl group-hover:-rotate-12 transition-transform duration-300"
              data-weight="fill"
            >
              eco
            </span>
            Smart Farm Marketplace
          </a>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-gutter">
            <button
              className={`font-label-lg text-label-lg pb-1 hover:text-primary dark:hover:text-primary-fixed-dim transition-all duration-200 ${
                !selectedMainType
                  ? 'text-primary dark:text-primary-fixed-dim border-b-2 border-primary dark:border-primary-fixed-dim font-semibold'
                  : 'text-on-surface-variant dark:text-outline-variant'
              }`}
              onClick={() => setSelectedMainType(null)}
            >
              หน้าหลัก
            </button>

            <div className="relative group">
              <button
                className={`font-label-lg text-label-lg hover:text-primary dark:hover:text-primary-fixed-dim transition-colors flex items-center gap-1 py-2 ${
                  selectedMainType === 'vegetable'
                    ? 'text-primary dark:text-primary-fixed-dim border-b-2 border-primary dark:border-primary-fixed-dim font-semibold'
                    : 'text-on-surface-variant dark:text-outline-variant'
                }`}
                onClick={() => setSelectedMainType('vegetable')}
              >
                ผักสด
                <span className="material-symbols-outlined text-[18px] group-hover:rotate-180 transition-transform duration-300">
                  expand_more
                </span>
              </button>
              <div className="absolute top-full left-0 w-64 bg-surface-bright border border-outline-variant/30 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 py-2">
                {['ผักใบเขียว', 'ผักกินผล', 'ผักกินดอก', 'ผักกินฝักและเมล็ด', 'ผักกินหัวหรือราก'].map((cat) => (
                  <button
                    key={cat}
                    className="w-full text-left px-4 py-2 text-body-md font-headline-md hover:bg-surface-container-low hover:text-primary transition-colors"
                    onClick={() => {
                      setSelectedMainType('vegetable');
                      setSearchQuery(cat);
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative group">
              <button
                className={`font-label-lg text-label-lg hover:text-primary dark:hover:text-primary-fixed-dim transition-colors flex items-center gap-1 py-2 ${
                  selectedMainType === 'fruit'
                    ? 'text-primary dark:text-primary-fixed-dim border-b-2 border-primary dark:border-primary-fixed-dim font-semibold'
                    : 'text-on-surface-variant dark:text-outline-variant'
                }`}
                onClick={() => setSelectedMainType('fruit')}
              >
                ผลไม้
                <span className="material-symbols-outlined text-[18px] group-hover:rotate-180 transition-transform duration-300">
                  expand_more
                </span>
              </button>
              <div className="absolute top-full left-0 w-64 bg-surface-bright border border-outline-variant/30 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 py-2">
                {['ผลไม้เมืองร้อน', 'ผลไม้เมืองหนาว / นำเข้า', 'ตระกูลส้มและมะนาว', 'ตระกูลแตง'].map((cat) => (
                  <button
                    key={cat}
                    className="w-full text-left px-4 py-2 text-body-md font-headline-md hover:bg-surface-container-low hover:text-primary transition-colors"
                    onClick={() => {
                      setSelectedMainType('fruit');
                      setSearchQuery(cat);
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Actions (Search, Cart, Profile) */}
          <div className="flex items-center gap-stack-md">
            {/* Search Input */}
            <div className="relative hidden sm:block">
              <input
                className="bg-surface-container-low border border-outline-variant/50 text-on-surface rounded-full py-2 pl-4 pr-10 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-300 w-48 lg:w-64"
                placeholder="ค้นหาสินค้าเกษตร..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="material-symbols-outlined absolute right-3 top-2.5 text-outline">search</span>
            </div>

            {/* Shopping Cart button */}
            <button className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container-highest flex items-center justify-center relative">
              <span className="material-symbols-outlined" data-icon="shopping_cart">
                shopping_cart
              </span>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-error text-on-error text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Registration/User buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login" className="text-on-surface-variant hover:text-primary font-label-lg transition-colors px-4 py-2 cursor-pointer">
                เข้าสู่ระบบ
              </Link>
              <Link href="/register" className="bg-primary text-on-primary font-label-lg px-4 py-2 rounded-full hover:bg-surface-tint transition-all shadow-sm cursor-pointer">
                สมัครสมาชิก
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section Slider */}
        <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden bg-primary-container">
          <div className="relative h-full w-full">
            {BANNERS.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
                  index === currentSlide ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-95'
                }`}
              >
                {/* Image */}
                <img
                  alt={banner.title}
                  className="absolute inset-0 w-full h-full object-cover brightness-[0.85] contrast-[1.05]"
                  src={banner.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />


              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-colors border border-white/10"
            aria-label="Previous slide"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            onClick={handleNextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-colors border border-white/10"
            aria-label="Next slide"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>

          {/* Pagination Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {BANNERS.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSelectDot(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80 w-3'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Main Content Area */}
        <div id="products-section" className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap flex flex-col gap-stack-lg">
          {/* Section Headers */}
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-outline-variant/30 pb-4">
            <div>
              <span className="text-label-lg text-outline uppercase tracking-wider font-semibold">
                {selectedMainType === 'vegetable' ? 'ผักสดอินทรีย์' : selectedMainType === 'fruit' ? 'ผลไม้พรีเมียม' : 'สินค้าเกษตรคุณภาพ'}
              </span>
              <h2 className="text-3xl font-headline-lg text-primary mt-1">
                {selectedMainType === 'vegetable' ? 'ผักสดจากสวนออร์แกนิค' : selectedMainType === 'fruit' ? 'ผลไม้สดหวานฉ่ำตามฤดูกาล' : 'สินค้าแนะนำสัปดาห์นี้'}
              </h2>
              <p className="text-body-lg text-on-surface-variant mt-1">คัดสรรความสดใหม่ คุณภาพระดับพรีเมียม ส่งตรงถึงมือคุณ</p>
            </div>

            {/* Filtering Quick Tags */}
            <div className="flex gap-2 mt-4 md:mt-0 flex-wrap">
              <button
                onClick={() => {
                  setSelectedMainType(null);
                  setSearchQuery('');
                }}
                className={`px-4 py-2 rounded-full font-label-md transition-all ${
                  !selectedMainType && !searchQuery
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'
                }`}
              >
                ทั้งหมด
              </button>
              <button
                onClick={() => setSelectedMainType('vegetable')}
                className={`px-4 py-2 rounded-full font-label-md transition-all ${
                  selectedMainType === 'vegetable'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'
                }`}
              >
                ผักสวนครัว
              </button>
              <button
                onClick={() => setSelectedMainType('fruit')}
                className={`px-4 py-2 rounded-full font-label-md transition-all ${
                  selectedMainType === 'fruit'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'
                }`}
              >
                ผลไม้สด
              </button>
            </div>
          </div>

          {/* Search info text if filter active */}
          {searchQuery && (
            <div className="flex items-center justify-between bg-surface-container-low p-3 px-4 rounded-xl border border-outline-variant/30">
              <span className="text-body-md text-on-surface-variant">
                ผลการค้นหาสำหรับ: <strong className="text-primary">"{searchQuery}"</strong> ({filteredProducts.length} รายการ)
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-primary hover:text-error transition-colors text-label-md font-semibold"
              >
                ล้างตัวค้นหา
              </button>
            </div>
          )}

          {/* Dynamic Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-gutter gap-y-stack-lg animate-pulse">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="flex flex-col">
                  <div className="bg-surface-container-low rounded-xl aspect-[4/5] mb-stack-md" />
                  <div className="h-4 bg-surface-container-low rounded w-1/3 mb-2" />
                  <div className="h-6 bg-surface-container-low rounded w-3/4 mb-2" />
                  <div className="h-8 bg-surface-container-low rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-surface-container-low rounded-3xl border border-outline-variant/20">
              <span className="material-symbols-outlined text-outline text-5xl mb-4">search_off</span>
              <h3 className="text-xl font-headline-md text-on-surface-variant">ไม่พบสินค้าเกษตรที่ระบุ</h3>
              <p className="text-body-md text-outline mt-1">กรุณาลองเปลี่ยนคำค้นหาหรือตัวกรองหมวดหมู่อื่น</p>
              <button
                onClick={() => {
                  setSelectedMainType(null);
                  setSearchQuery('');
                }}
                className="bg-primary text-on-primary font-label-md px-6 py-2 rounded-full hover:bg-surface-tint transition-all mt-4"
              >
                แสดงสินค้าทั้งหมด
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-gutter gap-y-stack-lg">
              {filteredProducts.map((product) => (
                <article key={product.id} className="flex flex-col group relative">
                  {/* Card Container */}
                  <div className="bg-surface-container-low rounded-xl aspect-[4/5] p-6 mb-stack-md relative overflow-hidden flex items-center justify-center border border-outline-variant/20 group-hover:border-primary/30 transition-all duration-300 shadow-sm group-hover:shadow-md">
                    {/* Tags */}
                    {product.id === 1 && (
                      <span className="absolute top-3 left-3 bg-tertiary-container text-on-tertiary-container text-xs px-2 py-1 rounded-full font-label-md z-10 shadow-sm">
                        ขายดี
                      </span>
                    )}
                    {product.id === 3 && (
                      <span className="absolute top-3 left-3 bg-secondary text-on-secondary text-xs px-2 py-1 rounded-full font-label-md z-10 shadow-sm">
                        ใหม่
                      </span>
                    )}

                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute top-3 right-3 text-on-surface-variant hover:text-error transition-colors p-2 rounded-full hover:bg-surface-bright z-10 opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-sm"
                      aria-label="Add to favorites"
                    >
                      <span
                        className="material-symbols-outlined text-[20px] transition-transform duration-200 active:scale-125"
                        data-weight={favorites.includes(product.id) ? 'fill' : undefined}
                        style={{ color: favorites.includes(product.id) ? 'var(--color-error)' : undefined }}
                      >
                        favorite
                      </span>
                    </button>

                    {/* Product Image */}
                    <img
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-lg"
                      src={product.image_url}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col gap-1 px-1">
                    <span className="text-label-md text-outline font-label-md uppercase tracking-wider">
                      {product.category_name || (product.main_type === 'vegetable' ? 'ผักสด' : 'ผลไม้')}
                    </span>
                    <h3 className="text-body-lg font-body-lg text-on-surface font-medium line-clamp-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-body-sm text-on-surface-variant line-clamp-1 font-light" title={product.description}>
                      {product.description || 'สดสะอาด คุณภาพออร์แกนิคแท้ 100%'}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-headline-md font-headline-md text-primary font-bold">
                        ฿{typeof product.price === 'number' ? product.price.toFixed(0) : parseFloat(product.price).toFixed(0)}
                      </span>
                      <button
                        onClick={() => handleAddToCart(product.name)}
                        aria-label="เพิ่มลงตะกร้า"
                        className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-surface-tint active:scale-95 hover:scale-105 transition-all shadow-sm focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      >
                        <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Brand Values section */}
          <section className="bg-surface-container py-section-gap px-margin-mobile md:px-margin-desktop rounded-3xl mt-stack-lg border border-outline-variant/10">
            <div className="text-center mb-stack-lg">
              <h2 className="text-headline-lg font-headline-lg text-primary font-bold">ทำไมต้อง Smart Farm?</h2>
              <p className="text-body-lg font-body-lg text-on-surface-variant mt-2 max-w-2xl mx-auto">
                เรามุ่งมั่นส่งมอบวัตถุดิบที่ดีที่สุด เพื่อสุขภาพที่ดีของคุณและครอบครัว
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {/* Value 1 */}
              <div className="flex flex-col items-center text-center p-6 bg-surface-bright rounded-2xl shadow-sm border border-outline-variant/10">
                <div className="w-16 h-16 bg-secondary-container rounded-full flex items-center justify-center mb-stack-md">
                  <span className="material-symbols-outlined text-[32px] text-surface-tint">agriculture</span>
                </div>
                <h3 className="text-headline-md font-headline-md text-on-surface mb-2 font-semibold">
                  สดจากฟาร์ม (Fresh from Farm)
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  เก็บเกี่ยวสดใหม่ทุกวัน ไม่ผ่านพ่อค้าคนกลาง เพื่อให้คุณได้รับความสดใหม่ที่สุด
                </p>
              </div>
              {/* Value 2 */}
              <div className="flex flex-col items-center text-center p-6 bg-surface-bright rounded-2xl shadow-sm border border-outline-variant/10">
                <div className="w-16 h-16 bg-secondary-container rounded-full flex items-center justify-center mb-stack-md">
                  <span className="material-symbols-outlined text-[32px] text-surface-tint">verified</span>
                </div>
                <h3 className="text-headline-md font-headline-md text-on-surface mb-2 font-semibold">
                  รับรองออร์แกนิค (Organic Certified)
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  ปลูกด้วยวิธีธรรมชาติ ปลอดภัยจากสารเคมี 100% ผ่านการรับรองมาตรฐานสากล
                </p>
              </div>
              {/* Value 3 */}
              <div className="flex flex-col items-center text-center p-6 bg-surface-bright rounded-2xl shadow-sm border border-outline-variant/10">
                <div className="w-16 h-16 bg-secondary-container rounded-full flex items-center justify-center mb-stack-md">
                  <span className="material-symbols-outlined text-[32px] text-surface-tint">local_shipping</span>
                </div>
                <h3 className="text-headline-md font-headline-md text-on-surface mb-2 font-semibold">
                  จัดส่งรวดเร็ว (Fast Delivery)
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  ระบบจัดส่งควบคุมอุณหภูมิ ส่งตรงถึงหน้าบ้านคุณภายใน 24 ชั่วโมง
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary dark:bg-primary-container text-on-primary py-12 border-t border-outline-variant/20 mt-auto">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <a className="text-headline-md font-headline-md font-bold text-on-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-3xl" data-weight="fill">
                eco
              </span>
              Smart Farm Marketplace
            </a>
            <p className="text-body-md text-on-primary/80 max-w-xs">
              ตลาดออนไลน์สำหรับคนรักสุขภาพ รวบรวมสินค้าเกษตรอินทรีย์คุณภาพสูงจากเกษตรกรไทย
            </p>
            <p className="text-label-md text-on-primary/60 mt-4">
              © 2024 Smart Farm Marketplace. All rights reserved. Cultivating transparency.
            </p>
          </div>
          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-body-lg font-headline-md font-semibold">ลิงก์ด่วน</h3>
            <nav className="flex flex-col gap-2">
              {['About Us', 'Quick Links', 'Privacy Policy', 'Shipping Info'].map((link) => (
                <a key={link} className="text-body-md text-on-primary/80 hover:text-secondary-fixed transition-colors cursor-pointer w-fit">
                  {link}
                </a>
              ))}
            </nav>
          </div>
          {/* Newsletter */}
          <div className="flex flex-col gap-4">
            <h3 className="text-body-lg font-headline-md font-semibold">ติดตามเรา (Follow Us)</h3>
            <div className="flex gap-4">
              {['share', 'photo_camera', 'mail'].map((icon) => (
                <a
                  key={icon}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-on-primary hover:bg-white/20 hover:text-secondary-fixed transition-all cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-[20px]">{icon}</span>
                </a>
              ))}
            </div>
            <div className="mt-4">
              <p className="text-label-md text-on-primary/80 mb-2">สมัครรับข่าวสารและโปรโมชั่นพิเศษ</p>
              <div className="flex max-w-sm rounded-lg overflow-hidden border border-white/20">
                <input
                  className="bg-white/10 border-none text-on-primary placeholder-on-primary/50 px-4 py-2 w-full focus:ring-0 outline-none"
                  placeholder="อีเมลของคุณ"
                  type="email"
                />
                <button className="bg-secondary text-on-secondary px-6 py-2 font-label-md hover:bg-surface-tint hover:text-on-primary transition-all">
                  สมัคร
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
