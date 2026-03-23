const User = require("../models/User")
const Course = require("../models/Course")

exports.toggleWishlist = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id
    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ success: false, message: "User not found" })
    
    const wishlist = user.wishlist || []
    const idx = wishlist.findIndex(id => id.toString() === courseId)
    let added
    if (idx === -1) { wishlist.push(courseId); added = true }
    else { wishlist.splice(idx, 1); added = false }
    
    await User.findByIdAndUpdate(userId, { wishlist })
    return res.status(200).json({ success: true, added, wishlist })
  } catch (err) { return res.status(500).json({ success: false, message: err.message }) }
}

exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findById(userId).populate({
      path: "wishlist",
      populate: [
        { path: "instructor", select: "firstName lastName image" },
        { path: "ratingAndReviews" },
        { path: "category", select: "name" }
      ]
    })
    if (!user) return res.status(404).json({ success: false, message: "User not found" })
    
    const enriched = (user.wishlist || []).map(c => ({
      ...c.toObject(),
      avgRating: c.ratingAndReviews?.length
        ? (c.ratingAndReviews.reduce((a, r) => a + r.rating, 0) / c.ratingAndReviews.length).toFixed(1) : 0,
      totalStudents: c.studentsEnroled?.length || 0,
    }))
    return res.status(200).json({ success: true, data: enriched })
  } catch (err) { return res.status(500).json({ success: false, message: err.message }) }
}
