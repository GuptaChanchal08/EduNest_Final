const path = require("path")
require("dotenv").config({ path: path.join(__dirname, "../.env") })
const User = require("../models/User")
const Course = require("../models/Course")
const Category = require("../models/Category")
const Section = require("../models/Section")
const SubSection = require("../models/Subsection")
const Profile = require("../models/Profile")
const bcrypt = require("bcryptjs")

exports.seedData = async (req, res) => {
  try {
    // 1. Create Categories
    const categoryData = [
      { name: "Web Development", description: "Frontend and backend web development courses" },
      { name: "Data Science", description: "Data analysis, ML and AI courses" },
      { name: "Mobile Development", description: "iOS and Android app development" },
      { name: "UI/UX Design", description: "Design and user experience courses" },
    ]

    const categories = []
    for (const cat of categoryData) {
      let category = await Category.findOne({ name: cat.name })
      if (!category) {
        category = await Category.create(cat)
        console.log("Created category:", cat.name)
      }
      categories.push(category)
    }

    // 2. Create Demo Instructor
    let instructor = await User.findOne({ email: "instructor@edunest.com" })
    if (!instructor) {
      const profile = await Profile.create({ gender: "Male", dateOfBirth: "1990-01-01", about: "Expert instructor", contactNumber: "9999999999" })
      instructor = await User.create({
        firstName: "Demo",
        lastName: "Instructor",
        email: "instructor@edunest.com",
        password: await bcrypt.hash("Demo@1234", 10),
        accountType: "Instructor",
        approved: true,
        additionalDetails: profile._id,
        image: "https://api.dicebear.com/5.x/initials/svg?seed=Demo Instructor",
        courses: [],
      })
      console.log("Created instructor: instructor@edunest.com / Demo@1234")
    }

    // 2b. Create Demo Admin
    let admin = await User.findOne({ email: "admin@edunest.com" })
    if (!admin) {
      const adminProfile = await Profile.create({ gender: null, dateOfBirth: null, about: "Platform Administrator", contactNumber: null })
      admin = await User.create({
        firstName: "Admin",
        lastName: "EduNest",
        email: "admin@edunest.com",
        password: await bcrypt.hash("Admin@1234", 10),
        accountType: "Admin",
        approved: true,
        additionalDetails: adminProfile._id,
        image: "https://api.dicebear.com/5.x/initials/svg?seed=Admin EduNest",
        courses: [],
      })
      console.log("Created admin: admin@edunest.com / Admin@1234")
    }

    // 2c. Create Demo Student
    let student = await User.findOne({ email: "student@edunest.com" })
    if (!student) {
      const studentProfile = await Profile.create({ gender: null, dateOfBirth: null, about: "Demo Student", contactNumber: null })
      student = await User.create({
        firstName: "Demo",
        lastName: "Student",
        email: "student@edunest.com",
        password: await bcrypt.hash("Demo@1234", 10),
        accountType: "Student",
        approved: true,
        additionalDetails: studentProfile._id,
        image: "https://api.dicebear.com/5.x/initials/svg?seed=Demo Student",
        courses: [],
      })
      console.log("Created student: student@edunest.com / Demo@1234")
    }


    // 3. Create Demo Courses
    const coursesData = [
      {
        courseName: "Complete Web Development Bootcamp",
        courseDescription: "Learn HTML, CSS, JavaScript, React, Node.js and MongoDB from scratch. Build real-world projects and become a full-stack developer.",
        whatYouWillLearn: "Build responsive websites, Create REST APIs, Work with databases, Deploy applications",
        price: 2999,
        category: categories[0]._id,
        tag: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
        instructions: ["Basic computer knowledge", "No prior coding experience needed"],
        sections: [
          { name: "Getting Started", lessons: ["Introduction to Web Development", "Setting Up Your Environment", "How the Web Works"] },
          { name: "HTML Fundamentals", lessons: ["HTML Structure", "HTML Tags and Elements", "Forms and Tables"] },
          { name: "CSS Styling", lessons: ["CSS Selectors", "Flexbox Layout", "Responsive Design"] },
        ]
      },
      {
        courseName: "Python for Data Science & ML",
        courseDescription: "Master Python programming for data analysis, visualization, and machine learning. Work with Pandas, NumPy, Matplotlib and Scikit-learn.",
        whatYouWillLearn: "Python programming, Data analysis with Pandas, Machine learning basics, Data visualization",
        price: 3499,
        category: categories[1]._id,
        tag: ["Python", "Data Science", "Machine Learning", "Pandas"],
        instructions: ["Basic math knowledge", "Computer with internet access"],
        sections: [
          { name: "Python Basics", lessons: ["Variables and Data Types", "Control Flow", "Functions and Modules"] },
          { name: "Data Analysis", lessons: ["Introduction to Pandas", "Data Cleaning", "Data Visualization"] },
          { name: "Machine Learning", lessons: ["ML Concepts", "Linear Regression", "Classification Algorithms"] },
        ]
      },
      {
        courseName: "React Native Mobile App Development",
        courseDescription: "Build iOS and Android apps using React Native. Learn navigation, state management, API integration and app deployment.",
        whatYouWillLearn: "React Native fundamentals, Navigation and routing, API integration, Publishing to App Store",
        price: 3999,
        category: categories[2]._id,
        tag: ["React Native", "Mobile", "iOS", "Android"],
        instructions: ["Basic JavaScript knowledge", "Smartphone for testing"],
        sections: [
          { name: "React Native Basics", lessons: ["Setup and Installation", "Core Components", "Styling in React Native"] },
          { name: "Navigation", lessons: ["Stack Navigation", "Tab Navigation", "Drawer Navigation"] },
        ]
      },
      {
        courseName: "UI/UX Design Masterclass",
        courseDescription: "Learn professional UI/UX design using Figma. Master design principles, wireframing, prototyping and user research.",
        whatYouWillLearn: "Design principles, Figma proficiency, Wireframing and prototyping, User research methods",
        price: 1999,
        category: categories[3]._id,
        tag: ["Figma", "UI Design", "UX Design", "Prototyping"],
        instructions: ["No design experience needed", "Figma (free) installed"],
        sections: [
          { name: "Design Fundamentals", lessons: ["Color Theory", "Typography", "Layout Principles"] },
          { name: "Figma Basics", lessons: ["Figma Interface", "Creating Frames", "Components and Styles"] },
        ]
      },
      {
        courseName: "Node.js & Express Backend Development",
        courseDescription: "Build scalable backend applications with Node.js and Express. Learn REST APIs, authentication, databases and deployment.",
        whatYouWillLearn: "Node.js fundamentals, RESTful API design, JWT authentication, MongoDB integration",
        price: 2499,
        category: categories[0]._id,
        tag: ["Node.js", "Express", "REST API", "MongoDB"],
        instructions: ["Basic JavaScript knowledge", "Understanding of HTML"],
        sections: [
          { name: "Node.js Fundamentals", lessons: ["Node.js Introduction", "Modules and NPM", "File System Operations"] },
          { name: "Express Framework", lessons: ["Routing", "Middleware", "Error Handling"] },
          { name: "Database Integration", lessons: ["MongoDB Basics", "Mongoose ODM", "CRUD Operations"] },
        ]
      },
    ]

    let created = 0
    for (const courseData of coursesData) {
      const exists = await Course.findOne({ courseName: courseData.courseName })
      if (exists) { console.log("Skipping (exists):", courseData.courseName); continue }

      // Create sections
      const sectionIds = []
      for (const sec of courseData.sections) {
        const subSectionIds = []
        for (const lessonTitle of sec.lessons) {
          const subSection = await SubSection.create({
            title: lessonTitle,
            timeDuration: "10",
            description: `Learn about ${lessonTitle} in detail with practical examples.`,
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          })
          subSectionIds.push(subSection._id)
        }
        const section = await Section.create({ sectionName: sec.name, subSection: subSectionIds })
        sectionIds.push(section._id)
      }

      const course = await Course.create({
        courseName: courseData.courseName,
        courseDescription: courseData.courseDescription,
        instructor: instructor._id,
        whatYouWillLearn: courseData.whatYouWillLearn,
        courseContent: sectionIds,
        category: courseData.category,
        price: courseData.price,
        thumbnail: `https://picsum.photos/800/450?random=${Math.floor(Math.random()*1000)}`,
        tag: courseData.tag,
        instructions: courseData.instructions,
        status: "Published",
        studentsEnrolled: [],
        ratingAndReviews: [],
      })

      // Update instructor courses
      await User.findByIdAndUpdate(instructor._id, { $push: { courses: course._id } })
      // Update category
      await Category.findByIdAndUpdate(courseData.category, { $push: { courses: course._id } })

      console.log("Created course:", courseData.courseName)
      created++
    }

    return res.status(200).json({
      success: true,
      demoAccounts: {
        admin: { email: "admin@edunest.com", password: "Admin@1234" },
        instructor: { email: "instructor@edunest.com", password: "Demo@1234" },
        student: { email: "student@edunest.com", password: "Demo@1234" },
      },
      message: `Seed complete! Created ${created} courses, ${categories.length} categories.`,
      loginCredentials: {
        instructor: { email: "instructor@edunest.com", password: "Demo@1234" }
      }
    })
  } catch (error) {
    console.error("SEED ERROR:", error)
    return res.status(500).json({ success: false, message: error.message })
  }
}

// Standalone: Create or reset admin account (accessible even without seed data)
exports.createAdmin = async (req, res) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@edunest.com"
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@1234"
    
    // Check if admin already exists
    let admin = await User.findOne({ email: adminEmail })
    if (admin) {
      return res.status(200).json({ 
        success: true, 
        message: `Admin already exists: ${adminEmail}`,
        email: adminEmail
      })
    }
    
    const profile = await Profile.create({ gender: null, dateOfBirth: null, about: "Platform Administrator", contactNumber: null })
    admin = await User.create({
      firstName: "Admin",
      lastName: "EduNest",
      email: adminEmail,
      password: await require("bcryptjs").hash(adminPassword, 10),
      accountType: "Admin",
      approved: true,
      additionalDetails: profile._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=Admin EduNest`,
      courses: [],
    })
    
    return res.status(200).json({ 
      success: true, 
      message: "Admin account created successfully",
      email: adminEmail,
      password: adminPassword,
      note: "Please change the password after first login"
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

// ─── Seed Blogs ─────────────────────────────────────────────────────────────
exports.seedBlogs = async (req, res) => {
  try {
    const Blog = require("../models/Blog");
    const User = require("../models/User");

    const admin = await User.findOne({ email: "admin@edunest.com" });
    const instructor = await User.findOne({ email: "instructor@edunest.com" });
    if (!admin || !instructor) {
      return res.status(400).json({ success: false, message: "Please run /api/v1/seed first to create demo users" });
    }

    const existing = await Blog.countDocuments();
    if (existing >= 15) {
      return res.status(200).json({ success: true, message: `Blogs already seeded (${existing} blogs exist)` });
    }

    const blogs = [
      // Web Dev
      {
        title: "Building Your First React App in 2025: A Complete Guide",
        category: "Web Dev",
        tags: ["React", "JavaScript", "Frontend"],
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
        excerpt: "React continues to dominate frontend development. This step-by-step guide walks you through building a production-ready React app from scratch.",
        content: `## Why React in 2025?\n\nReact remains the most popular frontend library with over 10 million weekly downloads. Its component-based architecture makes it perfect for building scalable UIs.\n\n## Prerequisites\n\n- Basic JavaScript knowledge\n- Node.js installed\n- A code editor (VS Code recommended)\n\n## Setting Up\n\n\`\`\`bash\nnpx create-react-app my-first-app\ncd my-first-app\nnpm start\n\`\`\`\n\n## Your First Component\n\n\`\`\`jsx\nfunction Hello({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}\n\nexport default Hello;\n\`\`\`\n\n## State Management with Hooks\n\nHooks like \`useState\` and \`useEffect\` are the foundation of modern React:\n\n\`\`\`jsx\nimport { useState, useEffect } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  useEffect(() => {\n    document.title = \`Count: \${count}\`;\n  }, [count]);\n  \n  return (\n    <button onClick={() => setCount(c => c + 1)}>\n      Count: {count}\n    </button>\n  );\n}\n\`\`\`\n\n## Deploying to Production\n\nOnce your app is ready, deploy it with a single command:\n\n\`\`\`bash\nnpm run build\nnpx serve -s build\n\`\`\`\n\nCongratulations! You've built and deployed your first React app. The journey from here involves learning Redux for state management, React Router for navigation, and API integration with Axios.`,
        author: instructor._id,
      },
      {
        title: "Node.js vs Bun: Which Runtime Should You Choose in 2025?",
        category: "Web Dev",
        tags: ["Node.js", "Bun", "Backend", "JavaScript"],
        thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
        excerpt: "Bun has disrupted the JavaScript runtime space. We compare Node.js and Bun across performance, ecosystem, and developer experience.",
        content: `## The Runtime Wars\n\nFor years, Node.js was the undisputed king of JavaScript runtimes. Then came Deno, and more recently Bun — promising 3x faster performance.\n\n## Performance Benchmarks\n\n| Runtime | HTTP Requests/sec | Startup Time |\n|---------|------------------|---------------|\n| Node.js | ~50,000 | 90ms |\n| Bun     | ~160,000 | 8ms |\n\n## Ecosystem Maturity\n\nNode.js wins here. With 15 years of development and 2+ million npm packages, Node.js has an unbeatable ecosystem. Bun is compatible with most Node.js packages but some edge cases exist.\n\n## Developer Experience\n\nBun ships with a bundler, test runner, and package manager built-in. This means zero-config setup for most projects.\n\n## Our Recommendation\n\n- **New projects**: Try Bun for its speed gains\n- **Enterprise projects**: Stick with Node.js for stability\n- **Learning**: Node.js has more tutorials and community support\n\nThe competition is healthy for the ecosystem. Both runtimes are improving rapidly.`,
        author: admin._id,
      },
      {
        title: "CSS Grid vs Flexbox: When to Use Which",
        category: "Web Dev",
        tags: ["CSS", "Layout", "Frontend"],
        thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80",
        excerpt: "Two of CSS's most powerful layout tools — but which one should you reach for first? We break down the decision with real examples.",
        content: `## The Layout Dilemma\n\nEvery developer has been there — staring at a layout problem wondering: Grid or Flexbox?\n\n## Flexbox: One-Dimensional Layouts\n\nFlexbox excels at distributing items along a single axis:\n\n\`\`\`css\n.navbar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n}\n\`\`\`\n\nPerfect for: navigation bars, card rows, centering elements.\n\n## Grid: Two-Dimensional Layouts\n\nCSS Grid handles rows AND columns simultaneously:\n\n\`\`\`css\n.dashboard {\n  display: grid;\n  grid-template-columns: 250px 1fr;\n  grid-template-rows: 60px 1fr;\n  min-height: 100vh;\n}\n\`\`\`\n\nPerfect for: page layouts, image galleries, dashboards.\n\n## The Golden Rule\n\n> Use Flexbox for components, Grid for layouts.\n\nIn practice, you'll use both — Grid for the overall page structure, Flexbox for aligning items within each section.\n\n## Combining Both\n\n\`\`\`css\n.page { display: grid; grid-template-columns: 200px 1fr; }\n.header { display: flex; align-items: center; }\n\`\`\`\n\nMastering both tools will make you a significantly more effective frontend developer.`,
        author: instructor._id,
      },
      // Data Science
      {
        title: "Python for Data Science: The 2025 Beginner's Roadmap",
        category: "Data Science",
        tags: ["Python", "Pandas", "NumPy", "Data Science"],
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
        excerpt: "Data science is one of the highest-paying fields in tech. This roadmap shows exactly what to learn and in what order.",
        content: `## Why Python for Data Science?\n\nPython is the undisputed language of data science. 95% of data scientists use it as their primary language.\n\n## The Essential Stack\n\n### 1. Python Basics (Week 1-2)\n- Variables, data types, functions\n- Lists, dictionaries, comprehensions\n- File I/O, error handling\n\n### 2. NumPy (Week 3)\n\`\`\`python\nimport numpy as np\narr = np.array([1, 2, 3, 4, 5])\nprint(arr.mean())  # 3.0\nprint(arr.std())   # 1.41\n\`\`\`\n\n### 3. Pandas (Week 4-5)\n\`\`\`python\nimport pandas as pd\ndf = pd.read_csv('data.csv')\nprint(df.describe())\nprint(df.groupby('category').mean())\n\`\`\`\n\n### 4. Data Visualization (Week 6)\n\`\`\`python\nimport matplotlib.pyplot as plt\nimport seaborn as sns\n\nsns.histplot(df['salary'], bins=30)\nplt.title('Salary Distribution')\nplt.show()\n\`\`\`\n\n### 5. Machine Learning with Scikit-learn (Week 7-10)\n\`\`\`python\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.model_selection import train_test_split\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)\nmodel = RandomForestClassifier(n_estimators=100)\nmodel.fit(X_train, y_train)\nprint(f'Accuracy: {model.score(X_test, y_test):.2%}')\n\`\`\`\n\n## Where to Practice\n\n- **Kaggle**: Real datasets, competitions\n- **Google Colab**: Free GPU notebooks\n- **UCI ML Repository**: Classic datasets\n\nConsistency beats intensity — 1 hour daily beats 7 hours on weekends.`,
        author: admin._id,
      },
      {
        title: "Understanding Large Language Models: What Every Developer Needs to Know",
        category: "Data Science",
        tags: ["LLM", "AI", "GPT", "Machine Learning"],
        thumbnail: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
        excerpt: "LLMs are reshaping software development. Here's a practical explanation of how they work and how to use them in your projects.",
        content: `## What Are LLMs?\n\nLarge Language Models (LLMs) are neural networks trained on massive text datasets to understand and generate human language. GPT-4, Claude, Gemini — these are all LLMs.\n\n## How They Work (Simply)\n\nLLMs work by predicting the next token (word/subword) given a sequence of tokens. That's it. But doing this at scale with billions of parameters creates emergent abilities like reasoning and coding.\n\n## Key Concepts\n\n### Tokens\nLLMs don't see words, they see tokens. "Hello world" = 2 tokens. Most LLMs have a context window of 100K-1M tokens.\n\n### Temperature\nControls randomness in outputs:\n- Temperature 0: Deterministic, always the same answer\n- Temperature 1: Creative, more variation\n\n### Prompting\n\`\`\`\nSystem: You are a helpful coding assistant.\nUser: Write a Python function to reverse a string.\nAssistant: def reverse_string(s): return s[::-1]\n\`\`\`\n\n## Using LLMs in Your Projects\n\n\`\`\`python\nimport anthropic\n\nclient = anthropic.Anthropic()\nmessage = client.messages.create(\n    model="claude-opus-4-5",\n    max_tokens=1024,\n    messages=[{"role": "user", "content": "Explain recursion simply"}]\n)\nprint(message.content[0].text)\n\`\`\`\n\n## The Future\n\nLLMs are becoming multimodal (text + images + code), cheaper, faster, and more capable every month. Understanding them now is a significant career advantage.`,
        author: instructor._id,
      },
      // Career
      {
        title: "How to Get Your First Dev Job in 2025 (Without a CS Degree)",
        category: "Career",
        tags: ["Jobs", "Career", "Portfolio", "Interview"],
        thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
        excerpt: "Thousands of self-taught developers land great jobs every year. Here's the exact playbook that works in today's market.",
        content: `## The New Reality\n\nIn 2025, companies care about what you can build, not where you studied. But the job market is also more competitive than ever. Here's how to stand out.\n\n## Step 1: Build a Portfolio That Speaks\n\nYou need 3 projects minimum:\n\n1. **A CRUD app** — Shows you understand the basics (databases, APIs, auth)\n2. **A real-time feature** — WebSockets, live search, or notifications\n3. **A project you're proud of** — Something that solves a real problem\n\nEach project needs: live demo, clean README, and documented code.\n\n## Step 2: GitHub Green Squares\n\nRecruiter hack: They look at your contribution graph. Commit daily, even if it's small. A green grid signals consistency — the most important trait in a developer.\n\n## Step 3: LinkedIn Optimization\n\n- Profile photo (3x more views)\n- Headline: "Full Stack Developer | React | Node.js | Open to Work"\n- Featured section: Pin your best projects\n- Post about your learning journey — authenticity gets reach\n\n## Step 4: The Application Strategy\n\nDon't spray and pray. Pick 20 companies you actually want to work for. Research them. Customize each cover letter. Apply directly on their website, not just through LinkedIn.\n\n## Step 5: Interview Prep\n\n- **LeetCode**: 50 easy + 30 medium problems is enough for most companies\n- **System Design**: Learn the basics (load balancing, caching, databases)\n- **Behavioral**: Prepare 10 STAR stories\n\n## The Timeline\n\nRealistic timeline for a focused beginner: 6-12 months to first job. It's a marathon, not a sprint.`,
        author: admin._id,
      },
      {
        title: "Freelancing as a Developer: Income, Reality, and How to Start",
        category: "Career",
        tags: ["Freelancing", "Income", "Remote", "Career"],
        thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
        excerpt: "Freelancing offers freedom and high income — but it's not for everyone. Here's an honest look at what it takes.",
        content: `## The Appeal of Freelancing\n\nNo boss. Work from anywhere. Set your own rates. It's the dream — but the reality is more nuanced.\n\n## Income Reality\n\nFreelance developer rates in India (2025):\n\n| Experience | Hourly Rate |\n|------------|-------------|\n| Beginner   | ₹500-1500   |\n| Mid-level  | ₹1500-4000  |\n| Senior     | ₹4000-10000 |\n\n## How to Find Your First Client\n\n### Warm Outreach First\nTell everyone you know what you do. Your first client is almost always someone you know or someone who knows someone you know.\n\n### Platforms\n- **Toptal**: Difficult to get in, but premium clients and rates\n- **Upwork**: Competitive, but volume is there\n- **LinkedIn**: Best for B2B clients\n- **Cold email**: Underrated, high conversion when done right\n\n## The Business Side\n\n- **Contracts**: Always use them. Bonsai.co has great templates.\n- **Invoicing**: Razorpay/Stripe for payments\n- **Taxes**: Set aside 30% for taxes\n- **Rate increases**: Raise rates every 6 months\n\n## Red Flags to Avoid\n\n- "We'll pay you after we see results"\n- Extremely detailed requirements with very low budget\n- Clients who disappear mid-project\n\n## Verdict\n\nFreelancing is incredible once you build momentum. The first 3 months are hard. Get 3 clients, do exceptional work, ask for referrals. Repeat.`,
        author: instructor._id,
      },
      // Tutorials
      {
        title: "Build a Full-Stack Todo App with MERN in 60 Minutes",
        category: "Tutorials",
        tags: ["MERN", "MongoDB", "Express", "React", "Node"],
        thumbnail: "https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=800&q=80",
        excerpt: "Hands-on tutorial: build a complete todo app with authentication using the MERN stack. Perfect for beginners.",
        content: `## What We're Building\n\nA full-stack todo app with:\n- User authentication (JWT)\n- Create, read, update, delete todos\n- MongoDB for persistence\n- React frontend with hooks\n\n## Backend Setup\n\n\`\`\`bash\nmkdir todo-app && cd todo-app\nmkdir server && cd server\nnpm init -y\nnpm install express mongoose bcryptjs jsonwebtoken cors dotenv\n\`\`\`\n\n## Todo Model\n\n\`\`\`javascript\n// models/Todo.js\nconst todoSchema = new mongoose.Schema({\n  title: { type: String, required: true },\n  completed: { type: Boolean, default: false },\n  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },\n}, { timestamps: true });\n\nmodule.exports = mongoose.model('Todo', todoSchema);\n\`\`\`\n\n## Todo Controller\n\n\`\`\`javascript\nexports.getTodos = async (req, res) => {\n  const todos = await Todo.find({ user: req.user.id });\n  res.json({ success: true, data: todos });\n};\n\nexports.createTodo = async (req, res) => {\n  const todo = await Todo.create({ title: req.body.title, user: req.user.id });\n  res.status(201).json({ success: true, data: todo });\n};\n\`\`\`\n\n## React Frontend\n\n\`\`\`jsx\nfunction TodoApp() {\n  const [todos, setTodos] = useState([]);\n  const [input, setInput] = useState('');\n\n  const addTodo = async () => {\n    const res = await api.post('/todos', { title: input });\n    setTodos([...todos, res.data.data]);\n    setInput('');\n  };\n\n  return (\n    <div>\n      <input value={input} onChange={e => setInput(e.target.value)} />\n      <button onClick={addTodo}>Add</button>\n      {todos.map(todo => <TodoItem key={todo._id} todo={todo} />)}\n    </div>\n  );\n}\n\`\`\`\n\n## Deployment\n\n- Backend: Render.com (free tier)\n- Frontend: Vercel (free tier)\n- Database: MongoDB Atlas (free 512MB)\n\nTotal cost: ₹0. Total time: 60 minutes. Ship it!`,
        author: instructor._id,
      },
      {
        title: "Mastering Git: Commands Every Developer Must Know",
        category: "Tutorials",
        tags: ["Git", "Version Control", "GitHub", "DevOps"],
        thumbnail: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&q=80",
        excerpt: "Beyond git commit and git push — a practical guide to the Git commands that actually matter in professional development.",
        content: `## Why Git Mastery Matters\n\nPoor Git skills slow down entire teams. These commands will make you the most competent person in your repo.\n\n## The Commands You Use Daily\n\n\`\`\`bash\n# Stage only parts of a file\ngit add -p\n\n# Amend last commit message\ngit commit --amend -m "Better message"\n\n# See what changed\ngit diff --staged\n\n# Undo last commit but keep changes\ngit reset HEAD~1\n\`\`\`\n\n## Branch Management\n\n\`\`\`bash\n# Create and switch in one command\ngit checkout -b feature/new-feature\n\n# Delete remote branch\ngit push origin --delete old-branch\n\n# See all remote branches\ngit branch -r\n\n# Track a remote branch\ngit checkout --track origin/feature-branch\n\`\`\`\n\n## Stashing (Your Emergency Toolkit)\n\n\`\`\`bash\n# Save current work without committing\ngit stash push -m "WIP: navbar styles"\n\n# List all stashes\ngit stash list\n\n# Apply a specific stash\ngit stash apply stash@{1}\n\`\`\`\n\n## Rebase vs Merge\n\n- **Merge**: Keeps history, creates merge commits\n- **Rebase**: Cleaner history, rewrites commits\n\n\`\`\`bash\n# Interactive rebase — clean up commits before PR\ngit rebase -i HEAD~3\n\`\`\`\n\n## The .gitignore Template\n\n\`\`\`\nnode_modules/\n.env\n.env.local\ndist/\nbuild/\n*.log\n\`\`\`\n\nThese commands cover 99% of real-world scenarios. Practice them on a test repo until they're muscle memory.`,
        author: admin._id,
      },
      {
        title: "Docker for Developers: From Zero to Containerized App",
        category: "Tutorials",
        tags: ["Docker", "DevOps", "Containers", "Deployment"],
        thumbnail: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&q=80",
        excerpt: "Docker eliminates the 'works on my machine' problem forever. This tutorial gets you containerizing apps in under an hour.",
        content: `## Why Docker?\n\n"It works on my machine" — Docker's entire purpose is eliminating this phrase from your vocabulary.\n\n## Core Concepts\n\n- **Image**: Blueprint for a container (like a class)\n- **Container**: Running instance of an image (like an object)\n- **Dockerfile**: Instructions to build an image\n- **Docker Compose**: Run multiple containers together\n\n## Your First Dockerfile\n\n\`\`\`dockerfile\n# Node.js app example\nFROM node:20-alpine\n\nWORKDIR /app\n\nCOPY package*.json ./\nRUN npm ci --only=production\n\nCOPY . .\n\nEXPOSE 4000\nCMD ["node", "index.js"]\n\`\`\`\n\n## Build and Run\n\n\`\`\`bash\n# Build the image\ndocker build -t my-app:latest .\n\n# Run the container\ndocker run -p 4000:4000 --name my-app my-app:latest\n\n# Check running containers\ndocker ps\n\n# Stop the container\ndocker stop my-app\n\`\`\`\n\n## Docker Compose (Full Stack)\n\n\`\`\`yaml\n# docker-compose.yml\nversion: '3.8'\nservices:\n  backend:\n    build: ./server\n    ports: ['4000:4000']\n    environment:\n      - MONGODB_URL=mongodb://mongo:27017/myapp\n    depends_on: [mongo]\n  \n  mongo:\n    image: mongo:7\n    volumes:\n      - mongo_data:/data/db\n\nvolumes:\n  mongo_data:\n\`\`\`\n\n\`\`\`bash\n# Start everything\ndocker compose up -d\n\n# Stop everything\ndocker compose down\n\`\`\`\n\n## Deployment\n\nDockerized apps deploy everywhere: AWS ECS, Google Cloud Run, Railway, Render — any Docker-compatible platform. Build once, run anywhere.`,
        author: instructor._id,
      },
      // News
      {
        title: "EduNest Platform Update: What's New in 2025",
        category: "News",
        tags: ["Platform", "Update", "Features"],
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
        excerpt: "We've been building hard. Here's everything new on EduNest — from the Blog system to the improved certificate generator.",
        content: `## Big Updates Are Here\n\nWe've been listening to your feedback and building like crazy. Here's what dropped this quarter:\n\n## 🎉 New Features\n\n### Community Blog System\nAnyone can now publish blogs on EduNest! Share your learning journey, write tutorials, give career advice. The community thrives when everyone contributes.\n\n### Enhanced Certificate Generator\nCertificates now include a verification QR code and can be shared directly to LinkedIn. Your achievements deserve to be seen.\n\n### Wishlist for Courses\nSave courses you want to take later without adding them to your cart. Find them instantly in your Wishlist dashboard.\n\n### Better Search\nThe new search covers courses, instructors, and categories. Find anything in seconds.\n\n## 📈 Platform Numbers\n\n| Metric | This Quarter |\n|--------|-------------|\n| Active Students | 12,000+ |\n| Courses Published | 200+ |\n| Instructors | 85+ |\n| Countries | 28 |\n\n## 🔮 Coming Soon\n\n- **Live Sessions**: Instructors can host live classes directly on EduNest\n- **Learning Paths**: Curated course sequences for specific goals\n- **Mobile App**: iOS and Android coming Q3 2025\n- **Discussion Forums**: Per-course community forums\n\nThank you for being part of EduNest. Your feedback drives everything we build.`,
        author: admin._id,
      },
      {
        title: "The Rise of AI Coding Assistants: How to Stay Relevant",
        category: "News",
        tags: ["AI", "Copilot", "Future", "Career"],
        thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
        excerpt: "GitHub Copilot, Cursor, Claude — AI coding tools are here. We look at what they mean for developers and how to use them to your advantage.",
        content: `## AI Isn't Replacing Developers — Yet\n\nThe headlines are dramatic. "AI will replace programmers!" But the reality on the ground is more nuanced and actually exciting.\n\n## What AI Coding Tools Do Well\n\n- **Boilerplate code**: Config files, repetitive CRUD operations\n- **Tests**: Writing unit tests for existing functions\n- **Documentation**: Generating README, JSDoc comments\n- **Debugging**: Explaining error messages and suggesting fixes\n- **Stack Overflow substitution**: Quick syntax lookups\n\n## What They Do Poorly\n\n- Understanding business context and requirements\n- Architectural decisions\n- Debugging complex multi-system issues\n- Writing secure code (AI loves SQL injection)\n- Novel problem-solving\n\n## How to Use AI Tools Effectively\n\n\`\`\`\nPoor prompt: "write a login function"\n\nGood prompt: "Write a Node.js Express route handler for \nuser login. Use bcryptjs to compare passwords, \nreturn a JWT token valid for 7 days, and handle \nthe case where the user doesn't exist separately \nfrom wrong password for security reasons."\n\`\`\`\n\n## The New Required Skills\n\n1. **Prompt engineering**: Getting AI to write exactly what you need\n2. **Code review**: AI produces plausible-but-wrong code frequently\n3. **Architecture**: AI can't see the big picture\n4. **Domain knowledge**: Understanding the problem deeply\n\n## Our Recommendation\n\nUse AI tools. Learn to use them well. The developers who will thrive are those who treat AI as a powerful junior developer — useful, fast, but needs supervision.\n\nStay curious, keep learning, keep shipping.`,
        author: admin._id,
      },
      // Mobile Dev
      {
        title: "React Native vs Flutter in 2025: The Definitive Comparison",
        category: "Web Dev",
        tags: ["React Native", "Flutter", "Mobile", "Cross-platform"],
        thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
        excerpt: "Choosing between React Native and Flutter for your next mobile app? We compare them on performance, ecosystem, learning curve, and job market.",
        content: `## The Cross-Platform Dilemma\n\nNative development (Swift/Kotlin) gives the best performance but requires two codebases. React Native and Flutter each claim to be the best single-codebase solution.\n\n## React Native (Meta)\n\n**Pros:**\n- JavaScript — leverage existing web skills\n- Large ecosystem (npm)\n- Huge job market\n- Near-native performance with the New Architecture\n\n**Cons:**\n- Bridge overhead (improving with JSI)\n- Inconsistent behavior across platforms\n- Breaking changes between versions\n\n## Flutter (Google)\n\n**Pros:**\n- Dart compiles to native ARM code\n- Pixel-perfect UI across all platforms\n- Excellent performance\n- Beautiful Material Design widgets\n\n**Cons:**\n- Dart is not widely used elsewhere\n- Larger app bundle size\n- Smaller ecosystem vs npm\n\n## Job Market Reality\n\nReact Native jobs: ~3x more listings than Flutter in most markets. But Flutter is growing faster.\n\n## Our Verdict\n\n- **Web developer expanding to mobile** → React Native\n- **Performance-critical apps** → Flutter\n- **Long-term investment** → Flutter (trajectory looks strong)\n- **Quick hire** → React Native (more jobs)\n\nBoth are mature, production-ready, and used by major companies. You can't go wrong with either.`,
        author: instructor._id,
      },
      {
        title: "10 VS Code Extensions That Will 10x Your Productivity",
        category: "Tutorials",
        tags: ["VS Code", "Productivity", "Tools", "Dev Setup"],
        thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
        excerpt: "The right VS Code setup can cut your development time significantly. These are the 10 extensions every developer should install today.",
        content: `## Your Editor Is Your Workshop\n\nA carpenter with dull tools produces poor work slowly. These extensions will sharpen your development environment.\n\n## The Essential 10\n\n### 1. Prettier\nAuto-formats your code on save. Stop arguing about tabs vs spaces forever.\n\`\`\`json\n{ "editor.formatOnSave": true, "prettier.singleQuote": true }\n\`\`\`\n\n### 2. ESLint\nCatch bugs before they happen. Integrates with your project's ESLint config.\n\n### 3. GitLens\nSee who wrote every line of code and why. Blame has never been this elegant.\n\n### 4. GitHub Copilot\nAI pair programmer. Autocompletes entire functions from comments.\n\n### 5. Thunder Client\nPostman inside VS Code. Test your APIs without leaving your editor.\n\n### 6. Error Lens\nShows error messages inline next to the offending code.\n\n### 7. Auto Rename Tag\nRename opening HTML/JSX tag and the closing tag updates automatically.\n\n### 8. Path Intellisense\nAutocompletes file paths in import statements.\n\n### 9. Bracket Pair Colorizer\nColour-codes matching brackets. Essential for deeply nested code.\n\n### 10. Live Server\nLocal development server with hot reload. For static HTML/CSS/JS work.\n\n## Bonus: Themes\n\n- **One Dark Pro**: Most popular dark theme\n- **Tokyo Night**: Beautiful purple tones\n- **Catppuccin**: Pastel perfection\n\n## Settings to Configure\n\n\`\`\`json\n{\n  "editor.fontSize": 14,\n  "editor.fontFamily": "'JetBrains Mono', monospace",\n  "editor.tabSize": 2,\n  "editor.wordWrap": "on",\n  "terminal.integrated.defaultProfile.linux": "bash"\n}\n\`\`\`\n\nYour setup is personal. Experiment, customize, and find what works for you.`,
        author: admin._id,
      },
      {
        title: "Salary Guide for Indian Developers in 2025",
        category: "Career",
        tags: ["Salary", "India", "Jobs", "Compensation"],
        thumbnail: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=800&q=80",
        excerpt: "What are developers actually earning in India in 2025? We analysed 500+ salary data points across cities and experience levels.",
        content: `## The Data\n\nWe analysed LinkedIn, Glassdoor, AmbitionBox, and direct surveys from 500+ developers across India.\n\n## By Experience Level\n\n| Level | Bangalore | Mumbai | Delhi/NCR | Pune |\n|-------|-----------|--------|-----------|------|\n| Fresher (0-2y) | ₹4-8L | ₹3.5-7L | ₹3-7L | ₹3.5-7L |\n| Mid (2-5y) | ₹12-22L | ₹10-18L | ₹10-18L | ₹10-18L |\n| Senior (5-8y) | ₹22-40L | ₹18-35L | ₹18-32L | ₹18-30L |\n| Principal (8y+) | ₹40-80L+ | ₹35-70L+ | ₹30-60L+ | ₹30-60L+ |\n\n## By Tech Stack (Mid-level)\n\n| Stack | Range |\n|-------|-------|\n| React/Node.js | ₹14-22L |\n| Python/ML | ₹16-28L |\n| Data Science | ₹16-32L |\n| DevOps/Cloud | ₹18-30L |\n| Mobile (React Native/Flutter) | ₹14-24L |\n| Blockchain/Web3 | ₹20-40L |\n\n## Remote Work Premium\n\nRemote roles (especially for US/UK companies) pay 2-3x market rate in INR. The best remote opportunities come from LinkedIn and AngelList.\n\n## Negotiation Tips\n\n1. **Never give a number first** — make them anchor\n2. **Research before every negotiation** — data is power\n3. **Consider total compensation** — ESOPs, health insurance, learning budget\n4. **Switch jobs for maximum growth** — loyalty costs you 20-30% in the first 5 years\n\n## The Outliers\n\nTop performers at FAANG/MNC:\n- Google Bangalore: ₹50-1.5Cr (TC)\n- Microsoft: ₹40-1Cr (TC)\n- Startups with ESOPs: Variable but potentially 10x\n\nFocus on skills > grades > college. The market rewards competence.`,
        author: admin._id,
      },
    ];

    let created = 0;
    for (const blogData of blogs) {
      const exists = await Blog.findOne({ title: blogData.title });
      if (!exists) {
        await Blog.create(blogData);
        created++;
      }
    }

    return res.status(200).json({
      success: true,
      message: `Blog seeding complete. Created ${created} new blogs. Total: ${await Blog.countDocuments()} blogs.`,
    });
  } catch (error) {
    console.error("Blog seed error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Seed demo notifications ────────────────────────────────────────────────
exports.seedNotifications = async (req, res) => {
  try {
    const { createNotification } = require("./Notification")
    const User = require("../models/User")
    const Notification = require("../models/Notification")

    const student = await User.findOne({ email: "student@edunest.com" })
    const instructor = await User.findOne({ email: "instructor@edunest.com" })

    if (!student || !instructor) {
      return res.status(400).json({ success: false, message: "Run /api/v1/seed first" })
    }

    const count = await Notification.countDocuments({ recipient: student._id })
    if (count >= 3) {
      return res.status(200).json({ success: true, message: "Notifications already seeded" })
    }

    await createNotification({ recipient: student._id, type: "welcome", title: "Welcome to EduNest! 🎉", message: "Start exploring our courses and blog community today!", link: "/" })
    await createNotification({ recipient: student._id, type: "enrollment", title: "Enrolled: Complete Web Dev Bootcamp", message: "You're enrolled! Start your learning journey now.", link: "/dashboard/enrolled-courses" })
    await createNotification({ recipient: student._id, type: "announcement", title: "New: Week 3 Materials Available", message: "Your instructor just posted new course materials for Week 3.", link: "/dashboard/enrolled-courses" })
    await createNotification({ recipient: instructor._id, type: "welcome", title: "Welcome, Instructor! 🚀", message: "Create your first course and start earning today.", link: "/dashboard/instructor" })
    await createNotification({ recipient: instructor._id, type: "enrollment", title: "New Student Enrolled!", message: "A student just enrolled in your Complete Web Dev Bootcamp.", link: "/dashboard/instructor" })

    return res.status(200).json({ success: true, message: "Demo notifications seeded" })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}
