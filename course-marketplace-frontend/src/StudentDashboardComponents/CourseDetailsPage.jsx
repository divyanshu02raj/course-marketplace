// src/StudentDashboardComponents/CourseDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Clock, BarChart, Video, CheckCircle, Lock, Bookmark, Target, Star, Users, Sun, Moon,MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useTheme from '../hooks/useTheme';
import { motion, useSpring, useTransform, useScroll } from 'framer-motion';

// --- HELPER COMPONENTS ---

// Accordion Item Component for the curriculum
const AccordionItem = ({ lesson, index }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <div className="text-gray-400">
            {lesson.isPreview ? <CheckCircle size={20} className="text-indigo-500"/> : <Lock size={20} />}
          </div>
          <p className="font-medium text-gray-800 dark:text-gray-200">{index + 1}. {lesson.title}</p>
        </div>
        <div className="flex items-center gap-4">
          {lesson.isPreview && <button className="text-sm font-semibold text-indigo-600 hover:underline">Preview</button>}
          <span className="text-sm text-gray-500 dark:text-gray-400">{lesson.duration || 0} mins</span>
        </div>
      </div>
    </div>
  );
};

// Animated Number Component
const AnimatedStat = ({ value }) => {
    const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
    useEffect(() => {
        spring.set(value);
    }, [spring, value]);
    const display = useTransform(spring, (current) => Math.round(current).toLocaleString());
    return <motion.span>{display}</motion.span>;
};

// Star Rating Component
const StarRating = ({ rating, size = 16 }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <Star key={i} size={size} className={i < Math.round(rating) ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600"} />
            ))}
        </div>
    );
};

// Rating Breakdown Component
const RatingBreakdown = ({ reviews }) => {
    const ratingCounts = [0, 0, 0, 0, 0];
    reviews.forEach(r => {
        if (r.rating >= 1 && r.rating <= 5) {
            ratingCounts[r.rating - 1]++;
        }
    });
    const total = reviews.length;
    if (total === 0) return null;

    return (
        <div className="space-y-2">
            {ratingCounts.reverse().map((count, i) => {
                const rating = 5 - i;
                const percentage = (count / total) * 100;
                return (
                    <div key={rating} className="flex items-center gap-3 text-sm">
                        {/* ✅ FIX: Added fixed width and shrink-0 to prevent wrapping */}
                        <span className="w-14 flex-shrink-0 text-gray-600 dark:text-gray-400">{rating} star</span>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <motion.div 
                                className="bg-yellow-400 h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%`}}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                            />
                        </div>
                        <span className="w-10 text-right text-gray-600 dark:text-gray-400">{Math.round(percentage)}%</span>
                    </div>
                )
            })}
        </div>
    );
};


export default function CourseDetailsPage() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 1.2]);

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        const [courseRes, lessonsRes, enrolledRes, reviewsRes] = await Promise.all([
          axios.get(`/courses/${courseId}`),
          axios.get(`/lessons/${courseId}`),
          user ? axios.get('/courses/enrolled') : Promise.resolve({ data: [] }),
          axios.get(`/reviews/${courseId}`)
        ]);

        setCourse(courseRes.data);
        setLessons(lessonsRes.data);
        setReviews(reviewsRes.data);

        const enrolledIds = enrolledRes.data.map(c => c._id);
        if (enrolledIds.includes(courseId)) {
          setIsEnrolled(true);
        }

      } catch (error) {
        toast.error('Failed to load course content.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [courseId, user]);

  
  const handleStartConversation = async () => {
    if (!user) return navigate('/login');
    const toastId = toast.loading("Starting conversation...");
    try {
        const res = await axios.post('/messages/conversation', {
            recipientId: course.instructor._id
        });
        toast.dismiss(toastId);
        // Navigate to dashboard and pass the conversation ID to open it automatically
        navigate('/dashboard', { state: { openChatId: res.data._id } });
    } catch (error) {
        toast.error("Could not start conversation.", { id: toastId });
    }
  };

  const handleEnroll = async () => {
    if (!user) {
        toast.error("Please log in to enroll.");
        return navigate('/login');
    }

    const toastId = toast.loading("Initializing payment...");
    try {
        const orderResponse = await axios.post('/payments/create-order', { courseId });
        const order = orderResponse.data;
        toast.dismiss(toastId);

        const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "SharedSlate",
            description: `Enrollment for ${course.title}`,
            image: course.thumbnail,
            order_id: order.id,
            handler: async function (response) {
                const verifyToastId = toast.loading("Verifying payment...");
                try {
                    await axios.post(`/payments/verify/${courseId}`, {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    });
                    toast.success("Enrollment successful!", { id: verifyToastId });
                    setIsEnrolled(true);
                } catch (verifyError) {
                    toast.error("Payment verification failed.", { id: verifyToastId });
                }
            },
            prefill: { name: user.name, email: user.email, contact: user.phone || '' },
            theme: { color: "#4F46E5" }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    } catch (error) {
        toast.error(error.response?.data?.message || "Could not start payment process.", { id: toastId });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-500">Loading course...</div>;
  }

  if (!course) {
    return <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-red-500">Course not found or failed to load.</div>;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                <div className="flex items-center">
                    <img
                        src={theme === "dark" ? "/full noBgColor.png" : "/full noBgBlack.png"}
                        alt="SharedSlate Logo"
                        className="h-10 object-contain"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
                    </button>
                    {user ? (
                        <div className="flex items-center gap-3">
                            <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-200">
                                Welcome, {user.name}
                            </span>
                            <img src={user.profileImage || `https://placehold.co/40x40/a5b4fc/1e1b4b?text=${user.name.charAt(0)}`} alt="Profile" className="w-8 h-8 rounded-full object-cover"/>
                        </div>
                    ) : (
                        <Link to="/login" className="text-sm font-semibold text-indigo-600 hover:underline">Login</Link>
                    )}
                </div>
            </div>
        </header>

        {/* Parallax Header */}
        <div className="h-[40vh] relative overflow-hidden">
            <motion.img 
                src={course.thumbnail} 
                alt={course.title}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ scale }}
            />
            <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="container mx-auto px-4 -mt-32 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                        <Link to="/dashboard/courses" className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-6 font-semibold">
                            <ArrowLeft size={16} />
                            Back to Courses
                        </Link>
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-3">{course.title}</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">{course.shortDesc}</p>
                        <div className="flex items-center gap-4 mb-6">
                            <StarRating rating={course.averageRating} size={20} />
                            <span className="text-gray-500 dark:text-gray-400">({course.numReviews} ratings)</span>
                            <button onClick={handleStartConversation} className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:underline">
                    <MessageSquare size={16} /> Message Instructor
                </button>
                        </div>
                    </div>

                    <div className="mt-8 space-y-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">What you'll learn</h2>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-gray-700 dark:text-gray-300">
                                {course.whatYouWillLearn?.map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle size={18} className="text-green-500 mt-1 flex-shrink-0"/> <span>{item}</span>
                                </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white px-8">Course Curriculum</h2>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                                {lessons.map((lesson, index) => <AccordionItem key={lesson._id} lesson={lesson} index={index} />)}
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Requirements</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                                {course.requirements?.map((req, i) => <li key={i}>{req}</li>)}
                            </ul>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Student Feedback</h2>
                            <div className="flex items-center gap-8 mb-6">
                                <div className="text-center">
                                    <p className="text-5xl font-bold text-yellow-400">{course.averageRating.toFixed(1)}</p>
                                    <StarRating rating={course.averageRating} size={20} />
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Average Rating</p>
                                </div>
                                <div className="flex-grow">
                                    <RatingBreakdown reviews={reviews} />
                                </div>
                            </div>
                            <div className="space-y-6">
                                {reviews.length > 0 ? reviews.slice(0, 3).map(review => (
                                    <div key={review._id} className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                        <div className="flex items-center mb-2">
                                            <img src={review.user.profileImage || `https://i.pravatar.cc/40?u=${review.user.name}`} alt={review.user.name} className="w-10 h-10 rounded-full mr-4"/>
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-white">{review.user.name}</p>
                                                <StarRating rating={review.rating} />
                                            </div>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 italic">"{review.comment}"</p>
                                    </div>
                                )) : <p className="text-gray-500 dark:text-gray-400">No reviews yet for this course.</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sticky Sidebar Card */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
                            <div className="p-6">
                                <p className="text-4xl font-bold text-gray-800 dark:text-white mb-4">₹{course.price}</p>
                                {isEnrolled ? (
                                    <Link to={`/learn/${course._id}`} className="w-full block text-center py-3 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
                                    Go to Course
                                    </Link>
                                ) : (
                                    <button onClick={handleEnroll} className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">
                                    Enroll Now
                                    </button>
                                )}
                                <button className="w-full mt-3 py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2">
                                    <Bookmark size={16} /> Add to Wishlist
                                </button>
                                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-3 mt-6">
                                    <li className="flex items-center gap-3"><Video size={16} /> <span><AnimatedStat value={lessons.length} /> Lessons</span></li>
                                    <li className="flex items-center gap-3"><Clock size={16} /> <span><AnimatedStat value={lessons.reduce((acc, l) => acc + (l.duration || 0), 0)} /> Mins of Video</span></li>
                                    <li className="flex items-center gap-3"><Target size={16} /> <span>For {course.targetAudience || 'All Levels'}</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
