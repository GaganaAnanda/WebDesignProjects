const jobTitles = [
  "Full Stack Developer",
  "Digital Marketing Specialist",
  "UX/UI Designer",
  "Data Scientist",
  "Customer Support Representative",
  "Project Manager",
  "Frontend Developer",
  "Backend Developer",
  "DevOps Engineer",
  "QA Tester",
  "Business Analyst",
  "Systems Administrator",
];

const jobDescriptions = [
  "Join our dynamic team to work on cutting-edge technologies. Develop and maintain sophisticated web applications for our diverse client base.",
  "Elevate our digital marketing strategies to promote our innovative products. Proficiency in SEO, SEM, and social media marketing is highly valued.",
  "Shape engaging user experiences and create visually captivating designs. Work alongside cross-functional teams to turn ideas into reality.",
  "Leverage advanced analytics and machine learning to uncover insights from vast data sets. Proficiency with Python and R is a must.",
  "Deliver unparalleled customer service and support. Exceptional communication skills and a knack for solving problems are key.",
  "Guide and coordinate project teams to ensure successful project delivery. Strong organizational and leadership skills are required.",
  "Build responsive and interactive web interfaces using modern frontend frameworks.",
  "Design and maintain robust server-side applications and databases.",
  "Manage cloud infrastructure, CI/CD pipelines, and deployment automation.",
  "Ensure software quality through comprehensive testing and automation strategies.",
  "Gather requirements and analyze business needs to drive technical solutions.",
  "Manage and maintain enterprise server systems and network infrastructure.",
];

const requiredSkillsList = [
  "JavaScript, React, Node.js, MongoDB",
  "SEO, SEM, Social Media Marketing, Analytics",
  "Figma, Adobe XD, UI/UX Design, Prototyping",
  "Python, R, Machine Learning, SQL",
  "Communication, Problem-solving, CRM Tools",
  "Leadership, Agile, Project Planning, Communication",
  "HTML, CSS, JavaScript, Vue.js",
  "Java, Spring Boot, Docker, Kubernetes",
  "Linux, AWS, CI/CD, Ansible",
  "Manual Testing, Automation, Selenium, JIRA",
  "SQL, Requirements Gathering, Excel, Communication",
  "Windows Server, Active Directory, Networking",
];

const salaryRanges = [
  "$40,000 - $60,000",
  "$50,000 - $75,000",
  "$60,000 - $90,000",
  "$70,000 - $110,000",
  "$75,000 - $115,000",
  "$80,000 - $120,000",
  "$90,000 - $140,000",
  "$100,000 - $150,000",
];

const timeUpdates = [
  "Last updated 2 days ago",
  "Last updated 1 day ago",
  "Last updated 4 hours ago",
  "Last updated 3 days ago",
  "Last updated 6 hours ago",
  "Last updated 1 week ago",
  "Last updated 12 hours ago",
  "Last updated 5 days ago",
];

function generateJobPosts(count = 12) {
  const jobs = [];
  for (let i = 1; i <= count; i++) {
    const titleIndex = Math.floor(Math.random() * jobTitles.length);
    const descIndex = Math.floor(Math.random() * jobDescriptions.length);
    const skillIndex = Math.floor(Math.random() * requiredSkillsList.length);
    const salaryIndex = Math.floor(Math.random() * salaryRanges.length);
    const timeIndex = Math.floor(Math.random() * timeUpdates.length);
    
    const title = jobTitles[titleIndex];
    jobs.push({
      id: i,
      title: title,
      description: jobDescriptions[descIndex],
      requiredSkills: requiredSkillsList[skillIndex],
      salary: salaryRanges[salaryIndex],
      lastUpdated: timeUpdates[timeIndex],
      applyLink: `https://example.com/apply/${title.toLowerCase().replace(/\s+/g, "-")}`,
    });
  }
  return jobs;
}

const jobPosts = generateJobPosts(12);

export default jobPosts;