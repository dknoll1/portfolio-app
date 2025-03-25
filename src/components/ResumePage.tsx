import React from 'react';

const ResumePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white shadow-md rounded p-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Daniel du Pré</h1>
          <p className="text-blue-600 mb-2">Web Developer & UI/UX Designer</p>
          <div className="text-sm text-black-500">
            <p>Phoenix, AZ</p>
            <p>ddupre87@yahoo.com | (623) 738-5280</p>
            <p><a href="https://github.com/dknoll1">github.com/dknoll1</a> | <a href="https://www.linkedin.com/in/dannydupre">linkedin.com/in/dannydupre</a> | <a href="https://dannydupre.net">dannydupre.net</a></p>
          </div>
        </header>

        <section className="mb-8">
          <h2 className="text-xl font-bold border-b-2 border-gray-200 mb-4 pb-2">Summary</h2>
          <p className="text-gray-700">
          I’ve been passionate about web development since building my first HTML webpage at age 13—a passion that’s grown through diverse web projects in my current role at Data Annotation. After high school, I studied music and launched a career in IT, where I honed my love for the technical side of computing. Along the way, I discovered an equal enthusiasm for programming. With 24 years of web development experience and 14 years in systems programming, I’m equipped to tackle any computing challenge that comes my way.
          </p>
          <br></br>
          <p className="text-gray-700">
          As an AI Model Evaluator, I specialize in meticulously assessing AI-generated programming solutions, ensuring their accuracy and reliability. With over a year in this role, I bring expertise in quality assurance and development feedback, driving continuous improvement in AI models. Our team works with a broad tech stack, spanning nearly all high-level programming languages, to enhance AI code generation across multiple frameworks. This role has sharpened my software development skills while deepening my insight into AI interactions, placing me at the forefront of technological innovation and quality assurance.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold border-b-2 border-gray-200 mb-4 pb-2">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Programming Languages:</h3>
              <p className="text-gray-700">JavaScript, TypeScript, PHP, HTML5, C/C++, Python, Java, Bash</p>
            </div>
            <div>
              <h3 className="font-semibold">Frameworks & Libraries:</h3>
              <p className="text-gray-700">React, Next.js, Node.js, Express, TailwindCSS, Bootstrap, jQuery, AJAX, JSON, XML, RESTful APIs, SQL, MongoDB, MySQL, PostgreSQL, Firebase, AWS, Git, GitHub, Azure</p>
            </div>
            <div>
              <h3 className="font-semibold">Tools & Platforms:</h3>
              <p className="text-gray-700">Git, GitHub, VS Code, Cloudflare, AWS, Firebase, Azure, Linux, Windows, macOS, iOS, Android</p>
            </div>
            <div>
              <h3 className="font-semibold">Soft Skills:</h3>
              <p className="text-gray-700">Team Collaboration, Agile Methodology, Problem Solving, Creativity, Typing 120 WPM</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold border-b-2 border-gray-200 mb-4 pb-2">Experience</h2>
          
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg">AI Model Evaluator</h3>
              <span className="text-gray-500 text-sm">Jan 2024 - Present</span>
            </div>
            <p className="italic mb-2">DataAnnotation, New York, NY</p>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Evaluate AI-generated responses for accuracy in programming queries, ensuring correct and efficient code.</li>
              <li>Review and validate code functionality produced by AI, focusing on syntax accuracy, logic and executability.</li>
              <li>Provide detailed feedback to improve AI's understanding and generation of programming code.</li>
            </ul>
          </div>
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg">Freelance Web Developer</h3>
              <span className="text-gray-500 text-sm">Jan 2013 - Dec 2023</span>
            </div>
            <p className="italic mb-2">Self-Employed, Remote</p>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Maintained custom websites and web apps for diverse clients using modern tech stacks.</li>
              <li>Built responsive sites with React, PHP/MySQL, and TailwindCSS for optimal cross-device experiences.</li>
              <li>Created scalable backend solutions using Node.js, Express, and various databases (MongoDB, PostgreSQL).</li>
              <li>Managed project lifecycles from requirements gathering to deployment and maintenance.</li>
              <li>Integrated third-party APIs and services to enhance website functionality and user engagement.</li>
            </ul>
          </div>
          <div>
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg">Senior IT Support Specialist</h3>
              <span className="text-gray-500 text-sm">Mar 2009 - Dec 2012</span>
            </div>
            <p className="italic mb-2">Dell Services Federal Government, Oklahoma City, OK</p>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Managed a wide spectrum of advanced IT issues and requests for Dell Services Federal Government.</li>
              <li>Exchange, Windows, Active Directory, Office, Blackberry OS, and more.</li>
              <li>Led staff training, software configurations, and documentation for hardware/software issues.</li>
              <li>Used remote tools to manage Exchange/Outlook accounts and group policies.</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold border-b-2 border-gray-200 mb-4 pb-2">Education</h2>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">Bachelors of Computer Science</h3>
              <p className="italic">Arizona State University, Tempe</p>
            </div>
            <span className="text-gray-500 text-sm">2021 - 2025</span>
            <div>
              <h3 className="font-semibold text-lg">Associate of Data Analytics & Software Development</h3>
              <p className="italic">Green River College, Auburn</p>
            </div>
            <span className="text-gray-500 text-sm">2019 - 2021</span>
          </div>
        </section>

      </div>
    </div>
  );
};

export default ResumePage; 