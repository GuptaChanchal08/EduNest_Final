const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Course = require("./models/Course");
const Category = require("./models/Category");
const Section = require("./models/Section");
const SubSection = require("./models/Subsection");
const Profile = require("./models/Profile");

const NUM_INSTRUCTORS = 10;
const NUM_STUDENTS = 30;
const NUM_COURSES = 50;

const sampleCategories = [
  "Web Development", "Data Science", "Mobile Development", "UI/UX Design",
  "Cloud Computing", "Cyber Security", "Digital Marketing", "Business Strategies"
];

const adjectives = ["Advanced", "Mastering", "Complete", "Beginner's", "Essential", "Modern", "Practical", "Ultimate"];
const nouns = ["Bootcamp", "Course", "Masterclass", "Guide", "Training", "Workshop", "Series", "Tutorials"];

function getRandomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomCourseName(category) {
  return `${getRandomChoice(adjectives)} ${category} ${getRandomChoice(nouns)} ${Math.floor(Math.random() * 2024 + 1)}`;
}

async function runSeed() {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected Successfully.");

    // 1. Categories
    let cats = [];
    for (const cat of sampleCategories) {
      let doc = await Category.findOne({ name: cat });
      if (!doc) {
        doc = await Category.create({ name: cat, description: `All about ${cat}` });
      }
      cats.push(doc);
    }
    console.log("Categories ready.");

    // 2. Instructors
    const hashedPassword = await bcrypt.hash("Password@123", 10);
    let instructors = [];
    for (let i = 1; i <= NUM_INSTRUCTORS; i++) {
      const email = `instructor${i}@edunest.com`;
      let ins = await User.findOne({ email });
      if (!ins) {
        const prof = await Profile.create({ gender: "Male", dateOfBirth: null, about: `Pro instructor ${i}`, contactNumber: null });
        ins = await User.create({
          firstName: "Pro",
          lastName: `Instructor ${i}`,
          email,
          password: hashedPassword,
          accountType: "Instructor",
          approved: true,
          additionalDetails: prof._id,
          image: `https://api.dicebear.com/5.x/initials/svg?seed=Pro Instructor ${i}`,
          courses: []
        });
      }
      instructors.push(ins);
    }
    console.log(`Created ${instructors.length} Instructors.`);

    // 3. Students
    let students = [];
    for (let i = 1; i <= NUM_STUDENTS; i++) {
      const email = `student${i}@edunest.com`;
      let stu = await User.findOne({ email });
      if (!stu) {
        const prof = await Profile.create({ gender: "Female", dateOfBirth: null, about: `Eager student ${i}`, contactNumber: null });
        stu = await User.create({
          firstName: "Smart",
          lastName: `Student ${i}`,
          email,
          password: hashedPassword,
          accountType: "Student",
          approved: true,
          additionalDetails: prof._id,
          image: `https://api.dicebear.com/5.x/initials/svg?seed=Smart Student ${i}`,
          courses: []
        });
      }
      students.push(stu);
    }
    console.log(`Created ${students.length} Students.`);

    // 4. Courses
    console.log("Generating dummy courses. This may take a minute...");
    let coursesCreated = 0;
    for (let i = 1; i <= NUM_COURSES; i++) {
      const ins = getRandomChoice(instructors);
      const cat = getRandomChoice(cats);
      
      const courseName = getRandomCourseName(cat.name);
      
      // Check if course exists
      const exists = await Course.findOne({ courseName });
      if (exists) continue;

      // Create Sections
      const sectionIds = [];
      const numSections = Math.floor(Math.random() * 3) + 2; // 2 to 4 sections
      for (let s = 1; s <= numSections; s++) {
        const subSecIds = [];
        const numLectures = Math.floor(Math.random() * 3) + 2; // 2 to 4 lectures
        for (let l = 1; l <= numLectures; l++) {
          const sub = await SubSection.create({
            title: `Lecture ${s}.${l}: Understanding the Basics`,
            timeDuration: `${Math.floor(Math.random() * 20) + 5}`,
            description: "Dummy lecture description for seed data.",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            contentType: "video"
          });
          subSecIds.push(sub._id);
        }
        const sec = await Section.create({ sectionName: `Module ${s}`, subSection: subSecIds });
        sectionIds.push(sec._id);
      }

      const course = await Course.create({
        courseName,
        courseDescription: `A comprehensive guide covering the A to Z of ${cat.name}. Highly rated and robust!`,
        instructor: ins._id,
        whatYouWillLearn: "Everything you need to know to become a pro.",
        courseContent: sectionIds,
        category: cat._id,
        price: Math.floor(Math.random() * 5000) + 500,
        thumbnail: `https://picsum.photos/800/450?random=${Math.floor(Math.random() * 10000)}`,
        tag: [cat.name, "Bootcamp", "Learn"],
        instructions: ["Good internet connection", "Dedication"],
        status: "Published",
        studentsEnrolled: [],
        ratingAndReviews: []
      });

      // Optionally enroll a few students
      const enrolledCount = Math.floor(Math.random() * 10) + 1;
      const enrolledStudents = students.slice(0, enrolledCount);
      for (const s of enrolledStudents) {
        await User.findByIdAndUpdate(s._id, { $push: { courses: course._id } });
        await Course.findByIdAndUpdate(course._id, { $push: { studentsEnrolled: s._id } }); // Note: schema says studentsEnroled
      }

      // Re-fetch to fix schema typo (studentsEnroled vs studentsEnrolled)
      if(course.studentsEnroled !== undefined) {
         await Course.findByIdAndUpdate(course._id, { $addToSet: { studentsEnroled: { $each: enrolledStudents.map(st=>st._id) } } });
      }

      await User.findByIdAndUpdate(ins._id, { $push: { courses: course._id } });
      await Category.findByIdAndUpdate(cat._id, { $push: { courses: course._id } });
      
      coursesCreated++;
    }
    
    console.log(`Successfully generated ${coursesCreated} courses!`);
    console.log("MASSIVE SEED COMPLETE. You can now log in with the new accounts (Password@123).");
    process.exit(0);

  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}

runSeed();
