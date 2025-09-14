import React from "react";

function About() {
  return (
    <div className="w-screen min-h-screen bg-white dark:bg-[#1e1e1e] text-gray-800 dark:text-gray-100">
      {/* Header */}
      <h1 className="text-4xl font-bold text-center mb-12 pt-10 border-b-2 pb-4 border-gray-300 dark:border-gray-600">
        About TALQS
      </h1>

      {/* Grid container for sections */}
      <div className="grid md:grid-cols-2 gap-8 px-4 md:px-10 xl:px-20 py-10">
        {/* What is TALQS */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">🔍 What is TALQS?</h2>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            TALQS (Tool for Automated Legal Q&A and Summarization) is an
            intelligent legal assistant that transforms Indian court judgments
            into easy-to-understand summaries and question-answer pairs. It
            helps you save time, understand legal content faster, and engage
            with complex cases more effectively.
          </p>

          <h2 className="text-2xl font-semibold">🎯 Our Mission</h2>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            Our mission is to democratize legal understanding by using AI to
            bridge the gap between raw legal text and simplified insights. We
            aim to empower students, lawyers, and researchers with fast and
            accurate tools to explore legal documents.
          </p>

          <h2 className="text-2xl font-semibold">💡 Why It Matters</h2>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            Legal documents are often long, complex, and filled with jargon.
            TALQS reduces this complexity by providing quick summaries and Q&A
            that highlight key information. This makes legal research faster,
            more accessible, and less overwhelming — especially for beginners
            and non-lawyers.
          </p>
        </div>

        {/* Video and Users */}
        <div className="space-y-10">
          <div className="rounded-lg shadow-lg overflow-hidden w-full h-64 md:h-80">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/W_Z9O5GjZvA"
              title="TALQS Promo Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="bg-[#f5f2ed] dark:bg-[#2c2c2c] p-6 rounded-lg shadow-inner">
            <h2 className="text-2xl font-semibold mb-4">
              👥 Who Should Use TALQS?
            </h2>
            <ul className="list-disc list-inside text-lg space-y-2 text-gray-700 dark:text-gray-300">
              <li>📘 Law Students preparing for exams or research</li>
              <li>⚖️ Legal Professionals reviewing judgments quickly</li>
              <li>🧠 Researchers analyzing legal language and logic</li>
              <li>📄 Anyone interested in understanding legal decisions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
