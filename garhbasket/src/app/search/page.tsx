'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, Search, X, SlidersHorizontal, PackageSearch } from 'lucide-react'
import GroceryItemCard, { IGrocery } from '@/components/GroceryItemCard'
import { CATEGORIES_LIST } from '@/components/CategoryGrid'
import axios from 'axios'

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialQuery = searchParams.get('q') || ''
  const initialCategory = searchParams.get('category') || ''

  const [query, setQuery] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'name'>('default')
  const [groceries, setGroceries] = useState<IGrocery[]>([])
  const [loading, setLoading] = useState(true)
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Milk',
    'Potato',
    'Butter',
    'Juice',
    'Biscuits',
  ])

  useEffect(() => {
    const fetchGroceries = async () => {
      setLoading(true)
      try {
        const res = await axios.get('/api/admin/get-groceries')
        if (res.data && Array.isArray(res.data.groceries)) {
          setGroceries(res.data.groceries)
        } else if (Array.isArray(res.data)) {
          setGroceries(res.data)
        }
      } catch (err) {
        console.error('Failed to fetch groceries:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchGroceries()
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() && !recentSearches.includes(query.trim())) {
      setRecentSearches([query.trim(), ...recentSearches.slice(0, 4)])
    }
  }

  const handleRecentClick = (term: string) => {
    setQuery(term)
  }

  // Filter & Sort logic
  const filteredProducts = groceries.filter((item) => {
    const matchesQuery =
      !query ||
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    const matchesCategory =
      !selectedCategory ||
      item.category.toLowerCase() === selectedCategory.toLowerCase()

    return matchesQuery && matchesCategory
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return Number(a.price) - Number(b.price)
    if (sortBy === 'price-high') return Number(b.price) - Number(a.price)
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    return 0
  })

  return (
    <div className="min-h-screen bg-slate-50 pb-24 max-w-4xl mx-auto px-4 py-4 space-y-4">
      {/* Top Header with Back */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white text-slate-700 shadow-2xs hover:bg-slate-100 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="grow">
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 shadow-2xs">
            <Search className="w-4 h-4 text-emerald-600 mr-2.5 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search groceries, categories..."
              className="w-full bg-transparent outline-none text-xs sm:text-sm text-slate-800 placeholder-slate-400 font-medium"
              autoFocus
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Category Chips Horizontal Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            !selectedCategory
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          All Items
        </button>
        {CATEGORIES_LIST.map((cat, idx) => (
          <button
            key={idx}
            onClick={() =>
              setSelectedCategory(selectedCategory === cat.query ? '' : cat.query)
            }
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.query
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Sorting bar & Recent searches */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto">
          <span className="font-bold text-slate-700 shrink-0">Recent:</span>
          {recentSearches.map((term, i) => (
            <button
              key={i}
              onClick={() => handleRecentClick(term)}
              className="bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded-md hover:bg-slate-300 transition text-[11px] shrink-0"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2 py-1 text-xs font-semibold text-slate-700 shrink-0">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-transparent outline-none cursor-pointer"
          >
            <option value="default">Popularity</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
      </div>

      {/* Results Header */}
      <div className="text-xs text-slate-500 font-medium">
        Showing <span className="font-bold text-slate-800">{sortedProducts.length}</span> results
        {selectedCategory ? ` in "${selectedCategory}"` : ''}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white rounded-2xl h-56 animate-pulse p-4 flex flex-col justify-between">
              <div className="bg-slate-200 h-28 rounded-xl" />
              <div className="space-y-2">
                <div className="bg-slate-200 h-4 rounded w-3/4" />
                <div className="bg-slate-200 h-4 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-2xs space-y-3">
          <PackageSearch className="w-14 h-14 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No matching groceries found</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Try searching for another keyword or clear your category filters.
          </p>
          <button
            onClick={() => {
              setQuery('')
              setSelectedCategory('')
            }}
            className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-emerald-700 transition"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {sortedProducts.map((item) => (
            <GroceryItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  )
}
