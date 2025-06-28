import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Video, Star, Users } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const testimonials = [
  {
    name: "Emily Tran",
    quote:
      "CourseHub made it so easy to switch careers. The quality of the instructors is top-notch!",
    avatar: "https://i.pravatar.cc/100?img=5",
  },
  {
    name: "Ahmed Khan",
    quote:
      "As an instructor, I love how simple it is to publish and manage my content here.",
    avatar: "https://i.pravatar.cc/100?img=12",
  },
  {
    name: "Sara Liu",
    quote:
      "I’ve learned more in 3 months here than a year elsewhere. Love the community!",
    avatar: "https://i.pravatar.cc/100?img=8",
  },
];

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
        <h1 className="text-2xl font-bold text-indigo-300 drop-shadow">🎓 CourseHub</h1>
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
              Join CourseHub to explore, teach, and master in-demand skills — all in one elegant platform.
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
        <h2 className="text-3xl font-bold text-center text-indigo-300 mb-16">Why Choose CourseHub?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 max-w-6xl mx-auto">
          <Feature icon={<GraduationCap />} title="Learn Anything" desc="Thousands of courses from top instructors." />
          <Feature icon={<Video />} title="Video Lessons" desc="Stream high-quality video content anytime." />
          <Feature icon={<Users />} title="Join the Community" desc="Collaborate and grow with peers and teachers." />
          <Feature icon={<Star />} title="Earn Certificates" desc="Get recognized for your achievements." />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-indigo-950 bg-opacity-20 backdrop-blur-md relative z-10">
        <h2 className="text-3xl font-bold text-center text-indigo-300 mb-12">What our users say</h2>
        <Swiper spaceBetween={30} slidesPerView={1} loop autoplay className="max-w-3xl mx-auto">
          {testimonials.map((t, idx) => (
            <SwiperSlide key={idx}>
              <div className="bg-white/10 border border-white/10 p-6 rounded-xl shadow text-center text-white">
                <img src={t.avatar} className="w-16 h-16 mx-auto rounded-full mb-4" alt={t.name} />
                <p className="italic text-indigo-200 mb-3">"{t.quote}"</p>
                <h4 className="font-semibold text-indigo-300">{t.name}</h4>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-black/20 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-center text-indigo-300 mb-12">Popular Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 max-w-6xl mx-auto">
          {["Full Stack Web Dev", "UI/UX Design", "AI for Beginners"].map((title, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 border border-white/10 p-6 rounded-xl shadow"
            >
              <h3 className="text-xl font-bold text-indigo-300 mb-2">{title}</h3>
              <p className="text-sm text-gray-300 mb-4">Learn the skills that top companies demand today.</p>
              <Link to="/register" className="text-indigo-400 font-semibold hover:underline">
                Enroll now →
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-8 border-t border-white/10 backdrop-blur-sm z-10 relative">
        &copy; {new Date().getFullYear()} CourseHub. All rights reserved.
      </footer>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0. }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-xl text-center transition-transform"
    >
      <div className="text-indigo-400 mb-3">{icon}</div>
      <h3 className="font-semibold text-lg text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{desc}</p>
    </motion.div>
  );
}
