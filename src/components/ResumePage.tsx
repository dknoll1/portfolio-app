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
            Passionate web developer with 5+ years of experience creating responsive and user-friendly web applications. 
            Specializing in React, TypeScript, and modern front-end technologies. Strong problem-solving skills with a 
            focus on performance optimization and clean code.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold border-b-2 border-gray-200 mb-4 pb-2">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Programming Languages:</h3>
              <p className="text-gray-700">JavaScript, TypeScript, HTML5, CSS3, Python</p>
            </div>
            <div>
              <h3 className="font-semibold">Frameworks & Libraries:</h3>
              <p className="text-gray-700">React, Next.js, Node.js, Express, TailwindCSS</p>
            </div>
            <div>
              <h3 className="font-semibold">Tools & Platforms:</h3>
              <p className="text-gray-700">Git, GitHub, VS Code, Figma, AWS, Firebase</p>
            </div>
            <div>
              <h3 className="font-semibold">Soft Skills:</h3>
              <p className="text-gray-700">Team Collaboration, Agile Methodology, Problem Solving</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold border-b-2 border-gray-200 mb-4 pb-2">Experience</h2>
          
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg">Senior Frontend Developer</h3>
              <span className="text-gray-500 text-sm">Jan 2021 - Present</span>
            </div>
            <p className="italic mb-2">TechCorp Inc., San Francisco, CA</p>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Led the development of a major website redesign, improving site performance by 40%</li>
              <li>Implemented reusable component library using React and Storybook</li>
              <li>Mentored junior developers and conducted code reviews</li>
              <li>Collaborated with UI/UX designers to create responsive layouts</li>
            </ul>
          </div>

          <div>
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg">Web Developer</h3>
              <span className="text-gray-500 text-sm">Mar 2018 - Dec 2020</span>
            </div>
            <p className="italic mb-2">Digital Solutions LLC, San Jose, CA</p>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Developed and maintained client websites using React and Node.js</li>
              <li>Created RESTful APIs for web applications</li>
              <li>Implemented responsive designs for mobile and desktop platforms</li>
              <li>Optimized database queries resulting in 30% faster page loads</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold border-b-2 border-gray-200 mb-4 pb-2">Education</h2>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">Associate of Data Analytics & Software Development</h3>
              <p className="italic">Green River College, Auburn</p>
            </div>
            <span className="text-gray-500 text-sm">2014 - 2018</span>
          </div>
        </section>

      </div>
    </div>
  );
};

export default ResumePage; 