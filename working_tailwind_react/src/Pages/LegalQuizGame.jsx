import React, { useState } from 'react';

const shuffleArray = (arr) =>
  arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

const originalQuestions = [
  {
    question: "What is the punishment for contempt of court?",
    options: ["Fine only", "Up to 6 months jail", "Warning", "No punishment"],
    answer: "Up to 6 months jail",
  },
  {
    question: "What is the minimum age for becoming a judge in India?",
    options: ["21", "35", "25", "30"],
    answer: "35",
  },
  {
    question: "Which article guarantees the Right to Equality?",
    options: ["Article 15", "Article 21", "Article 14", "Article 19"],
    answer: "Article 14",
  },
  {
    question: "What is the full form of PIL?",
    options: [
      "Private Interest Law",
      "Public Information Letter",
      "Public Interest Litigation",
      "Personal Investigation Law",
    ],
    answer: "Public Interest Litigation",
  },
  {
    question: "Who appoints Supreme Court Judges in India?",
    options: ["Prime Minister", "President", "Chief Justice", "Parliament"],
    answer: "President",
  },
];

export default function App() {
  const [tilt, setTilt] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showScoreAnim, setShowScoreAnim] = useState(null);
  const [score, setScore] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  const [started, setStarted] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showAnswersPopup, setShowAnswersPopup] = useState(false);

  const startQuiz = () => {
    const shuffled = originalQuestions.map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }));
    setShuffledQuestions(shuffled);
    setStarted(true);
    setScore(0);
    setUserAnswers([]);
    setQuestionIndex(0);
    setShowFinal(false);
  };

  const handleAnswer = (selected) => {
    const current = shuffledQuestions[questionIndex];
    if (selected === current.answer) {
      setTilt('rotate-12');
      setShowScoreAnim('plus');
      setScore((prev) => prev + 100);
    } else {
      setTilt('-rotate-12');
      setShowScoreAnim('minus');
      setScore((prev) => prev - 100);
    }
    setUserAnswers((prev) => [...prev, { ...current, selected }]);

    setTimeout(() => {
      setTilt('');
      setShowScoreAnim(null);
      if (questionIndex === shuffledQuestions.length - 1) {
        setShowFinal(true);
      } else {
        setQuestionIndex((prev) => prev + 1);
      }
    }, 1000);
  };

  const getScoreImage = () => {
    if (score >= 500) return "/images/winner500.jpg";
    if (score === 400) return "/images/for400.jpg";
    if (score >= 200 && score < 400) return "/images/for300200.jpg";
    if (score === 100) return "/images/for100.jpg";
    if (score <= 0) return "/images/for0.jpg";
    return null;
  };

  const getScoreMessage = () => {
    if (score >= 500) return "That's my favourite child!";
    if (score === 400) return "Okay okay... Not that great";
    if (score >= 200 && score < 400) return "Ayyyy You think it's enough!!!!!!";
    if (score === 100) return "You definitely need more scoldings!!!!!";
    if (score <= 0) return "You come home Nowww!!!";
    return null;
  };

  const handleLogoutConfirm = () => {
    setLoadingLogout(true);
    setTimeout(() => {
      setLoadingLogout(false);
      setShowLogoutMessage(true);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#e0e2e4] via-[#c6bcb6] to-[#96897f] text-[#625750] font-sans overflow-hidden">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center p-6 text-sm bg-[#4B2E2E] text-white z-10 relative">
        <div className="font-bold text-lg">TALQS</div>
        <ul className="flex gap-6">
          <li className="hover:underline cursor-pointer">Learn</li>
          <li className="hover:underline cursor-pointer">Top Features</li>
          <li className="hover:underline cursor-pointer">Latest</li>
          <li className="hover:underline cursor-pointer">About</li>
        </ul>
        <button
          onClick={() => {
            setShowLogoutConfirm(true);
            setShowLogoutMessage(false);
          }}
          className="bg-white text-[#4B2E2E] font-semibold px-4 py-2 rounded-full hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </nav>

      {/* LOGOUT CONFIRMATION POPUP */}
      {showLogoutConfirm && (
        <div className="absolute top-20 right-10 bg-white/90 shadow-lg rounded-xl p-6 z-50 w-72">
          {!showLogoutMessage ? (
            loadingLogout ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4B2E2E] mb-4"></div>
                <p className="text-[#4B2E2E] font-bold">THANKS FOR VISITING TALQS</p>
              </div>
            ) : (
              <>
                <p className="text-center mb-4 font-semibold">Are you sure you want to logout?</p>
                <div className="flex justify-around">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="text-sm text-gray-600 hover:underline"
                  >
                    No thanks
                  </button>
                  <button
                    onClick={handleLogoutConfirm}
                    className="text-sm text-red-600 font-semibold hover:underline"
                  >
                    Yes, I want to
                  </button>
                </div>
              </>
            )
          ) : (
            <p className="text-center font-bold text-[#4B2E2E] animate-pulse">THANKS FOR VISITING TALQS</p>
          )}
        </div>
      )}

      {/* ANSWERS POPUP */}
      {showAnswersPopup && (
        <div className="absolute inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-xl w-full h-[500px] overflow-y-auto relative">
            <button
              onClick={() => setShowAnswersPopup(false)}
              className="absolute top-2 left-2 text-sm text-gray-600 hover:underline"
            >
              ⬅ Back
            </button>
            <h2 className="text-center font-bold mb-4">Your Answers</h2>
            <ul className="space-y-4">
              {userAnswers.map((q, i) => (
                <li key={i} className="border-b pb-2">
                  <p className="font-semibold">Q{i + 1}: {q.question}</p>
                  <p className="text-sm">Your answer: <span className="font-medium text-[#4B2E2E]">{q.selected}</span></p>
                  {q.selected !== q.answer && (
                    <p className="text-sm text-red-600">Correct answer: {q.answer}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* GAME CONTENT */}
      <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] space-y-8 z-10 relative px-4">
        {!started ? (
          <div className="bg-white rounded-xl shadow-xl px-10 py-10 text-center">
            <h1 className="text-3xl font-bold mb-4">
              Ready to Test Your Legal Knowledge?
            </h1>
            <button
              onClick={startQuiz}
              className="mt-4 bg-[#4B2E2E] text-white px-6 py-3 rounded-full hover:bg-[#2c1b1b] transition"
            >
              Start Quiz
            </button>
          </div>
        ) : !showFinal ? (
          <>
            <div className="bg-white shadow-xl rounded-xl px-8 py-6 max-w-xl w-full text-center">
              <h2 className="text-lg font-semibold mb-4">Question</h2>
              <p className="text-md">{shuffledQuestions[questionIndex].question}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {shuffledQuestions[questionIndex].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  className="bg-[#625750] text-white px-6 py-3 rounded-full border-4 border-white hover:bg-[#4B2E2E] transition"
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white shadow-xl rounded-xl px-10 py-10 max-w-xl w-full text-center">
            <h1 className="text-4xl font-bold mb-4">🎉 Quiz Complete!</h1>
            {getScoreImage() && (
              <div className="mb-4">
                <p className="text-lg font-semibold mb-2 text-[#4B2E2E]">{getScoreMessage()}</p>
                <img
                  src={getScoreImage()}
                  alt="Score Result"
                  className="mx-auto w-64 h-64 object-contain rounded-xl"
                />
              </div>
            )}
            {score <= 0 ? (
              <p className="text-2xl font-semibold mb-6 text-red-600">
                Oops! You scored {score} 😢
              </p>
            ) : (
              <p className="text-2xl font-semibold mb-6">
                Your Total Score: <span className="text-[#4B2E2E]">{score}</span>
              </p>
            )}
            <div className="flex justify-center gap-4">
              <button
                onClick={startQuiz}
                className="bg-[#4B2E2E] text-white px-6 py-3 rounded-full hover:bg-[#2c1b1b] transition"
              >
                Restart Quiz
              </button>
              <button
                onClick={() => setShowAnswersPopup(true)}
                className="bg-gray-200 text-[#4B2E2E] px-6 py-3 rounded-full hover:bg-gray-300 transition"
              >
                View Answers
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}