const Section = require("../models/Section");
const SubSection = require("../models/Subsection");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Helper: extract YouTube video ID from various URL formats
function extractYoutubeId(input) {
  if (!input) return null;
  // Already just an ID (11 chars)
  if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) return input.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Create a new sub-section
exports.createSubSection = async (req, res) => {
  try {
    const { sectionId, title, description, contentType = "video", youtubeUrl, notes, quiz } = req.body;

    if (!sectionId || !title) {
      return res.status(400).json({ success: false, message: "sectionId and title are required" });
    }

    let subSectionData = { title, description, contentType };

    if (contentType === "video") {
      // Traditional video upload
      if (!req.files || !req.files.video) {
        return res.status(400).json({ success: false, message: "Video file is required for video content" });
      }
      const video = req.files.video;
      const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
      subSectionData.videoUrl = uploadDetails.secure_url;
      subSectionData.timeDuration = `${uploadDetails.duration || 0}`;

    } else if (contentType === "youtube") {
      // YouTube embed
      const youtubeId = extractYoutubeId(youtubeUrl);
      if (!youtubeId) {
        return res.status(400).json({ success: false, message: "Invalid YouTube URL or video ID" });
      }
      subSectionData.youtubeVideoId = youtubeId;
      subSectionData.videoUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
      subSectionData.timeDuration = "0"; // Can't auto-detect from YouTube

    } else if (contentType === "quiz") {
      // Quiz content
      let parsedQuiz = quiz;
      if (typeof quiz === "string") parsedQuiz = JSON.parse(quiz);
      if (!parsedQuiz || !parsedQuiz.questions || parsedQuiz.questions.length === 0) {
        return res.status(400).json({ success: false, message: "Quiz must have at least one question" });
      }
      subSectionData.quiz = parsedQuiz;
      subSectionData.timeDuration = "0";

    } else if (contentType === "notes") {
      // Notes/Article
      if (!notes || !notes.trim()) {
        return res.status(400).json({ success: false, message: "Notes content is required" });
      }
      subSectionData.notes = notes;
      subSectionData.timeDuration = "0";
    }

    const newSubSection = await SubSection.create(subSectionData);

    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subSection: newSubSection._id } },
      { new: true }
    ).populate("subSection");

    return res.status(200).json({ success: true, data: updatedSection });
  } catch (error) {
    console.error("Error creating sub-section:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

// Update a sub-section
exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description, contentType, youtubeUrl, notes, quiz } = req.body;

    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({ success: false, message: "SubSection not found" });
    }

    if (title !== undefined) subSection.title = title;
    if (description !== undefined) subSection.description = description;
    if (contentType !== undefined) subSection.contentType = contentType;

    const effectiveType = contentType || subSection.contentType;

    if (effectiveType === "video" && req.files && req.files.video) {
      const uploadDetails = await uploadImageToCloudinary(req.files.video, process.env.FOLDER_NAME);
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration || 0}`;
    }

    if (effectiveType === "youtube" && youtubeUrl) {
      const youtubeId = extractYoutubeId(youtubeUrl);
      if (!youtubeId) return res.status(400).json({ success: false, message: "Invalid YouTube URL" });
      subSection.youtubeVideoId = youtubeId;
      subSection.videoUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
    }

    if (effectiveType === "quiz" && quiz) {
      let parsedQuiz = quiz;
      if (typeof quiz === "string") parsedQuiz = JSON.parse(quiz);
      subSection.quiz = parsedQuiz;
    }

    if (effectiveType === "notes" && notes !== undefined) {
      subSection.notes = notes;
    }

    await subSection.save();

    const updatedSection = await Section.findById(sectionId).populate("subSection");
    return res.status(200).json({ success: true, data: updatedSection });
  } catch (error) {
    console.error("Error updating sub-section:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

// Delete a sub-section
exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;
    await Section.findByIdAndUpdate(sectionId, { $pull: { subSection: subSectionId } });
    const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId });
    if (!subSection) return res.status(404).json({ success: false, message: "SubSection not found" });
    const updatedSection = await Section.findById(sectionId).populate("subSection");
    return res.status(200).json({ success: true, message: "SubSection deleted successfully", data: updatedSection });
  } catch (error) {
    console.error("Error deleting sub-section:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};
