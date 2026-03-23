import React, { useEffect, useState } from "react"
import { useSearchParams, Link, useNavigate } from "react-router-dom"
import Footer from "../components/Common/Footer"
import { FiSearch, FiFilter, FiX, FiSliders } from "react-icons/fi"
import { apiConnector } from "../services/apiConnector"
import { homeEndpoints, categories } from "../services/apis"
import { CourseCardLarge } from "../components/core/HomePage/CourseGrid"

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get("q") || ""

  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [allCategories, setAllCategories] = useState([])
  const [searchInput, setSearchInput] = useState(query)

  // Filters
  const [selectedCat, setSelectedCat] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [minRating, setMinRating] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    apiConnector("GET", categories.CATEGORIES_API).then(res => {
      if (res.data.success) setAllCategories(res.data.data || [])
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (query) params.append("q", query)
        if (selectedCat) params.append("category", selectedCat)
        if (maxPrice) params.append("maxPrice", maxPrice)
        if (minRating) params.append("minRating", minRating)
        const res = await apiConnector("GET", `${homeEndpoints.SEARCH_COURSES}?${params}`)
        if (res.data.success) {
          let data = res.data.data
          if (sortBy === "rating") data = [...data].sort((a,b) => b.avgRating - a.avgRating)
          else if (sortBy === "popular") data = [...data].sort((a,b) => b.totalStudents - a.totalStudents)
          else if (sortBy === "price_low") data = [...data].sort((a,b) => a.price - b.price)
          else if (sortBy === "price_high") data = [...data].sort((a,b) => b.price - a.price)
          setCourses(data)
        }
      } catch (e) { setCourses([]) }
      setLoading(false)
    }
    fetchCourses()
  }, [query, selectedCat, maxPrice, minRating, sortBy])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim()) navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`)
  }

  const clearFilters = () => { setSelectedCat(""); setMaxPrice(""); setMinRating("") }
  const hasFilters = selectedCat || maxPrice || minRating

  return (
    <div className="bg-richblack-900 min-h-screen">
      {/* Search header */}
      <div className="bg-richblack-800 border-b border-richblack-700 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 flex items-center gap-3 bg-richblack-700 border border-richblack-600 focus-within:border-yellow-50 rounded-xl px-4 py-3 transition-all">
              <FiSearch className="text-richblack-400 flex-shrink-0" />
              <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
                placeholder="Search for courses, topics, skills..."
                className="bg-transparent text-white placeholder-richblack-500 outline-none flex-1 text-sm" />
              {searchInput && (
                <button type="button" onClick={() => setSearchInput("")} className="text-richblack-500 hover:text-richblack-300">
                  <FiX size={16} />
                </button>
              )}
            </div>
            <button type="submit" className="bg-yellow-50 hover:bg-yellow-100 text-richblack-900 font-bold px-6 rounded-xl transition-all text-sm">
              Search
            </button>
            <button type="button" onClick={() => setShowFilters(f => !f)}
              className={`flex items-center gap-2 px-4 rounded-xl border text-sm font-medium transition-all ${showFilters ? "bg-yellow-50/10 border-yellow-50/30 text-yellow-50" : "border-richblack-600 text-richblack-300 hover:border-richblack-400"}`}>
              <FiSliders size={16} /> Filters {hasFilters && <span className="w-2 h-2 rounded-full bg-yellow-400" />}
            </button>
          </form>

          {/* Result count */}
          <p className="text-richblack-400 text-sm mt-3">
            {loading ? "Searching..." : (
              <>
                {courses.length > 0 ? (
                  <><span className="text-white font-semibold">{courses.length}</span> results{query ? ` for "${query}"` : ""}</>
                ) : query ? (
                  <>No results for <span className="text-white">"{query}"</span></>
                ) : (
                  `${courses.length} courses`
                )}
              </>
            )}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">

          {/* Filters panel */}
          {showFilters && (
            <div className="w-64 flex-shrink-0 space-y-6">
              <div className="bg-richblack-800 border border-richblack-700 rounded-2xl p-5 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-richblack-5 font-semibold">Filters</h3>
                  {hasFilters && (
                    <button onClick={clearFilters} className="text-yellow-50 text-xs hover:text-yellow-200">Clear all</button>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="text-richblack-300 text-sm font-medium block mb-2">Category</label>
                  <select value={selectedCat} onChange={e => setSelectedCat(e.target.value)}
                    className="w-full bg-richblack-700 border border-richblack-600 text-richblack-200 text-sm rounded-lg px-3 py-2 outline-none">
                    <option value="">All Categories</option>
                    {allCategories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>

                {/* Rating */}
                <div>
                  <label className="text-richblack-300 text-sm font-medium block mb-2">Minimum Rating</label>
                  {[4.5, 4.0, 3.5, 0].map(r => (
                    <label key={r} className="flex items-center gap-2 py-1 cursor-pointer">
                      <input type="radio" value={r || ""} checked={minRating === (r ? String(r) : "")}
                        onChange={() => setMinRating(r ? String(r) : "")} className="accent-yellow-400" />
                      <span className="text-richblack-300 text-sm">
                        {r > 0 ? `${r} & up` : "Any rating"}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Price */}
                <div>
                  <label className="text-richblack-300 text-sm font-medium block mb-2">Max Price</label>
                  {[{ label: "Free", value: "0" }, { label: "Under ₹500", value: "500" }, { label: "Under ₹2000", value: "2000" }, { label: "Any", value: "" }].map(p => (
                    <label key={p.value} className="flex items-center gap-2 py-1 cursor-pointer">
                      <input type="radio" value={p.value} checked={maxPrice === p.value}
                        onChange={() => setMaxPrice(p.value)} className="accent-yellow-400" />
                      <span className="text-richblack-300 text-sm">{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Sort */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-richblack-400 text-sm">{!loading && `${courses.length} courses`}</p>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="bg-richblack-800 border border-richblack-700 text-richblack-200 text-sm rounded-lg px-3 py-2 outline-none cursor-pointer">
                <option value="newest">Newest</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Popular</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="bg-richblack-800 rounded-2xl overflow-hidden animate-pulse">
                    <div className="aspect-video bg-richblack-700" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-richblack-700 rounded w-3/4" />
                      <div className="h-3 bg-richblack-700 rounded w-1/2" />
                      <div className="h-5 bg-richblack-700 rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-richblack-5 text-xl font-semibold mb-2">No courses found</h3>
                <p className="text-richblack-400 mb-6">
                  {query ? `We couldn't find anything for "${query}". Try different keywords.` : "No courses match your filters."}
                </p>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-yellow-50 text-sm hover:underline">Clear filters</button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {courses.map(c => <CourseCardLarge key={c._id} course={c} showWishlist={true} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
