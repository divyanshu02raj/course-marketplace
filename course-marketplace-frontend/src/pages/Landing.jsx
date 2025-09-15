// course-marketplace-frontend\src\pages\Landing.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Video, Star, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">
      {/* Background Orbs */}
      <motion.div
        animate={{ y: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
        className="absolute w-96 h-96 bg-purple-700 opacity-30 rounded-full -top-32 -left-32 blur-3xl z-0"
      />
      <motion.div
        animate={{ y: [0, -30, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
        className="absolute w-[500px] h-[500px] bg-indigo-500 opacity-25 rounded-full -bottom-40 -right-40 blur-3xl z-0"
      />

      {/* Header */}
      <header className="absolute top-0 left-0 w-full px-8 py-6 flex justify-between items-center z-20">
        <img src="full noBgColor.png" alt="SharedSlate Logo" className="w-32 h-auto" />
        <Link to="/login" className="text-indigo-400 hover:underline font-medium transition hover:text-indigo-300">
          Login
        </Link>
      </header>

      {/* Hero */}
      <main className="pt-40 pb-32 px-6 md:px-20 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6 drop-shadow">
              Empower Your <span className="text-indigo-400">Learning</span> Journey
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-md">
              Join SharedSlate to explore, teach, and master in-demand skills — all in one elegant platform.
            </p>
            <div className="flex gap-4">
              <Link
                to="/register?role=student"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition"
              >
                Join as Student
              </Link>
              <Link
                to="/register?role=instructor"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition"
              >
                Join as Instructor
              </Link>
            </div>
          </motion.div>

          <motion.img
            src="Landing.png"
            alt="Hero"
            className="w-full max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          />
        </div>
      </main>

      {/* Features */}
      <section className="py-24 px-6 md:px-20 relative z-10">
        <h2 className="text-3xl font-bold text-center text-indigo-300 mb-16">Why Choose SharedSlate?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 max-w-6xl mx-auto">
          <Feature icon={<GraduationCap size={32} />} title="Learn Anything" desc="Thousands of courses from top instructors." />
          <Feature icon={<Video size={32} />} title="Video Lessons" desc="Stream high-quality video content anytime." />
          <Feature icon={<Users size={32} />} title="Join the Community" desc="Collaborate and grow with peers and teachers." />
          <Feature icon={<Star size={32} />} title="Earn Certificates" desc="Get recognized for your achievements." />
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-8 border-t border-white/10 backdrop-blur-sm z-10 relative">
        &copy; {new Date().getFullYear()} SharedSlate. All rights reserved.
      </footer>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-xl text-center transition-transform"
    >
      <div className="text-indigo-400 mb-4 inline-block">{icon}</div>
      <h3 className="font-semibold text-lg text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{desc}</p>
    </motion.div>
  );
}
