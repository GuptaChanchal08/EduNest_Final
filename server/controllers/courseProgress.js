const mongoose = require("mongoose");
const SubSection = require("../models/Subsection");
const CourseProgress = require("../models/CourseProgress");

// Helper: get or create progress doc
async function getOrCreateProgress(courseId, userId) {
  let progress = await CourseProgress.findOne({ courseID: courseId, userId });
  if (!progress) {
    progress = await CourseProgress.create({ courseID: courseId, userId, completedVideos: [], quizResults: [] });
  }
  return progress;
}

// Mark a lecture/content as complete
exports.updateCourseProgress = async (req, res) => {
  const { courseId, subsectionId } = req.body;
  const userId = req.user.id;

  try {
    const subsection = await SubSection.findById(subsectionId);
    if (!subsection) {
      return res.status(404).json({ success: false, error: "Invalid subsection" });
    }

    let courseProgress = await getOrCreateProgress(courseId, userId);

    if (courseProgress.completedVideos.includes(subsectionId)) {
      return res.status(200).json({ success: true, message: "Already marked complete" });
    }

    courseProgress.completedVideos.push(subsectionId);
    await courseProgress.save();

    return res.status(200).json({ message: "Course progress updated", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Submit a quiz attempt
exports.submitQuiz = async (req, res) => {
  const { courseId, subsectionId, answers } = req.body; // answers: [0, 2, 1, ...]
  const userId = req.user.id;

  try {
    const subsection = await SubSection.findById(subsectionId);
    if (!subsection || subsection.contentType !== "quiz") {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    const questions = subsection.quiz.questions;
    const passingScore = subsection.quiz.passingScore || 60;

    let correct = 0;
    const results = questions.map((q, i) => {
      const isCorrect = answers[i] === q.correctAnswerIndex;
      if (isCorrect) correct++;
      return {
        question: q.question,
        yourAnswer: answers[i],
        correctAnswer: q.correctAnswerIndex,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= passingScore;

    // Save result to progress
    let courseProgress = await getOrCreateProgress(courseId, userId);
    const existingResult = courseProgress.quizResults.find(
      (r) => r.subsectionId.toString() === subsectionId
    );

    if (existingResult) {
      existingResult.score = Math.max(existingResult.score, score); // keep best score
      existingResult.passed = existingResult.passed || passed;
      existingResult.attempts += 1;
      existingResult.lastAttemptAt = new Date();
    } else {
      courseProgress.quizResults.push({ subsectionId, score, passed, attempts: 1, lastAttemptAt: new Date() });
    }

    // Auto-mark as complete if passed
    if (passed && !courseProgress.completedVideos.includes(subsectionId)) {
      courseProgress.completedVideos.push(subsectionId);
    }

    await courseProgress.save();

    return res.status(200).json({
      success: true,
      score,
      passed,
      correct,
      total: questions.length,
      passingScore,
      results,
    });
  } catch (error) {
    console.error("Quiz submit error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get progress percentage for a course
exports.getProgressPercentage = async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user.id;

  try {
    const courseProgress = await getOrCreateProgress(courseId, userId);
    return res.status(200).json({
      success: true,
      completedVideos: courseProgress.completedVideos,
      quizResults: courseProgress.quizResults,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};
