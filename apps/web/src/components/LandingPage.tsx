"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FaBookOpen,
  FaPenNib,
  FaUsers,
  FaArrowRight,
  FaLightbulb,
  FaCode,
  FaLock,
  FaGlobeAmericas,
  FaMobile,
  FaHeart,
  FaFeatherAlt,
  FaStar,
  FaQuoteLeft,
  FaRocket,
  FaGift,
  FaInfinity,
  FaChartLine,
  FaBolt,
  FaMagic,
  FaCrown,
  FaAward,
  FaCheck,
} from "react-icons/fa";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -80 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8 } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 80 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8 } },
};

const slideInScale = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
};

const bounceIn = {
  hidden: { opacity: 0, scale: 0.3 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      type: "spring" as const,
      damping: 10,
      stiffness: 100,
    },
  },
};

const staggerChildren = {
  hidden: {},
  show: { transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
};

const staggerFast = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 100 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const floatIn = {
  hidden: { opacity: 0, y: 30, rotateX: 10 },
  show: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0,
    transition: { 
      duration: 0.8, 
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    } 
  },
};

// Animated counter component
const AnimatedCounter = ({ end, duration = 2, suffix = "" }: {
  end: number;
  duration?: number;
  suffix?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (isInView) {
      let startTime: number;
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * end));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className="font-bold text-4xl">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

// Parallax component for dynamic backgrounds
const ParallaxElement = ({ children, speed = 0.5, className = "" }: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -1000 * speed]);

  return (
    <motion.div style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

// Scroll-triggered animation component
const ScrollReveal = ({ children, variants = fadeUp, className = "" }: { 
  children: React.ReactNode; 
  variants?: any; 
  className?: string; 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div className="relative overflow-x-hidden">
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Floating Background Elements */}
      <motion.div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ y: backgroundY }}
      >
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"
          animate={{
            y: [0, 30, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div
          className="absolute bottom-40 left-1/3 w-40 h-40 bg-pink-500/10 rounded-full blur-xl"
          animate={{
            y: [0, -40, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </motion.div>

      <main className="relative z-10 space-y-20">
      {/* ================= Hero Section ================= */}
      <motion.section
        initial="hidden"
        animate="show"
        variants={fadeUp}
        className="relative overflow-hidden rounded-2xl p-8 md:p-16 bg-gradient-to-br from-primary/10 via-background to-muted/10"
      >
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-muted/20"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{ backgroundSize: "200% 200%" }}
        />

        <motion.div
          className="relative z-10 max-w-5xl mx-auto text-center space-y-8"
          variants={staggerChildren}
        >
          <motion.div
            variants={bounceIn}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-medium shadow-lg"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FaBookOpen className="h-4 w-4" />
            </motion.div>
            <span>Welcome to InfoBite</span>
          </motion.div>

          <motion.h1
            variants={slideUp}
            className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent leading-tight"
          >
            Share Your
            <br />
            <motion.span
              className="text-primary"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Stories & Ideas
            </motion.span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Join thousands of writers and readers in a community where knowledge
            meets creativity. Write, discover, and connect with like-minded
            people.
          </motion.p>

          <motion.div
            variants={staggerFast}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
          >
            <motion.div variants={scaleIn}>
              <Link href="/signup">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-4 group"
                  >
                    <FaPenNib className="h-5 w-5 mr-2" />
                    Get Started Free
                    <motion.div
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <FaArrowRight className="h-4 w-4" />
                    </motion.div>
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
            <motion.div variants={scaleIn}>
              <Link href="/signin">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="hover:bg-muted/50 text-lg px-8 py-4 transition-colors"
                  >
                    <FaUsers className="h-5 w-5 mr-2" />
                    Sign In
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced Floating Animated Shapes */}
        <motion.div
          className="absolute top-8 right-8 w-24 h-24 bg-primary/20 rounded-full"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-8 left-8 w-20 h-20 bg-muted/40 rounded-full"
          animate={{
            y: [0, 15, 0],
            rotate: [360, 180, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/3 left-16 w-16 h-16 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full"
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <motion.p
            className="text-sm mb-2 font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Scroll to explore
          </motion.p>
          <motion.div
            className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center"
            animate={{ 
              y: [0, 5, 0],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <motion.div
              className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2"
              animate={{ 
                y: [0, 6, 0],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ================= Features Section ================= */}
      <ScrollReveal variants={staggerChildren}>
        <section className="space-y-12 relative overflow-hidden">          
          <div className="relative z-10 text-center space-y-4">
            <motion.h2
              variants={slideInScale}
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              Why Choose InfoBite?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Everything you need to create, share, and discover amazing content
            </motion.p>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {[
            {
              icon: (
                <FaPenNib className="h-8 w-8" />
              ),
              title: "Easy Writing",
              desc: "Beautiful editor with rich formatting options. Write and publish effortlessly.",
              gradient: "from-blue-500 to-cyan-500",
              bg: "from-blue-500/10 to-cyan-500/10"
            },
            {
              icon: (
                <FaUsers className="h-8 w-8" />
              ),
              title: "Community Driven",
              desc: "Connect with like-minded writers and readers. Build meaningful relationships.",
              gradient: "from-green-500 to-emerald-500",
              bg: "from-green-500/10 to-emerald-500/10"
            },
            {
              icon: (
                <FaLightbulb className="h-8 w-8" />
              ),
              title: "Discover Ideas",
              desc: "Explore diverse topics. Find inspiration daily.",
              gradient: "from-yellow-500 to-orange-500",
              bg: "from-yellow-500/10 to-orange-500/10"
            },
          ].map((f, i) => (
            <motion.div
              key={i}
            //   variants={bounceIn}
              whileHover={{ y: -10 }}
              className={`p-8 rounded-2xl bg-gradient-to-br ${f.bg} backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 group relative overflow-hidden`}
            >
              {/* Glass effect overlay */}
              <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-2xl" />
              
              <CardContent className="space-y-6 text-center relative z-10">
                <motion.div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto bg-gradient-to-br ${f.gradient} text-white relative shadow-lg`}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                  >
                    {f.icon}
                  </motion.div>

                  {/* Animated ring around icon */}
                  <motion.div
                    className={`absolute inset-0 border-2 border-gradient-to-r ${f.gradient} rounded-2xl opacity-50`}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                </motion.div>

                <motion.h3
                  className="text-2xl font-bold text-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.2 + 0.3 }}
                >
                  {f.title}
                </motion.h3>

                <motion.p
                  className="text-muted-foreground leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.2 + 0.5 }}
                >
                  {f.desc}
                </motion.p>
              </CardContent>
            </motion.div>
          ))}
        </div>
        </section>
      </ScrollReveal>

      {/* ================= Benefits Section ================= */}
      <ScrollReveal variants={staggerChildren}>
        <section className="relative overflow-hidden rounded-3xl p-8 md:p-16 space-y-12">
          {/* Multi-layer background */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-fuchsia-500/10 dark:from-violet-500/20 dark:via-purple-500/10 dark:to-fuchsia-500/20" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
          
          {/* Floating orbs */}
          <motion.div
            className="absolute top-10 right-20 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl"
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-10 left-20 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-xl"
            animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        
        <div className="relative z-10 text-center space-y-4">
          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent"
          >
            Built for Modern Writers
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Professional tools and features to help you create your best work
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {[
            {
              icon: <FaCode className="h-7 w-7" />,
              title: "Code Blocks",
              desc: "Syntax highlighting for developers",
              color: "from-purple-500 to-violet-500",
              bg: "from-purple-500/10 to-violet-500/10"
            },
            {
              icon: <FaMobile className="h-7 w-7" />,
              title: "Mobile Ready", 
              desc: "Write and read anywhere",
              color: "from-pink-500 to-rose-500",
              bg: "from-pink-500/10 to-rose-500/10"
            },
            {
              icon: <FaLock className="h-7 w-7" />,
              title: "Privacy First",
              desc: "Your data stays secure",
              color: "from-indigo-500 to-blue-500",
              bg: "from-indigo-500/10 to-blue-500/10"
            },
            {
              icon: <FaGlobeAmericas className="h-7 w-7" />,
              title: "Global Reach",
              desc: "Share with the world",
              color: "from-teal-500 to-emerald-500",
              bg: "from-teal-500/10 to-emerald-500/10"
            },
          ].map((b, i) => (
            <motion.div
              key={i}
            //   variants={fadeUp}
              whileHover={{ y: -5 }}
              className={`text-center space-y-4 p-8 rounded-2xl bg-gradient-to-br ${b.bg} backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden`}
            >
              {/* Glass effect */}
              <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-2xl" />
              
              <div className="relative z-10">
                <motion.div 
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto bg-gradient-to-br ${b.color} text-white shadow-lg mb-4`}
                  whileHover={{ rotate: [0, 360] }}
                  transition={{ duration: 0.6 }}
                >
                  {b.icon}
                </motion.div>
                
                <h3 className="font-bold text-lg text-foreground">{b.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
        </section>
      </ScrollReveal>

      {/* ================= Animated Statistics ================= */}
      <ScrollReveal variants={staggerChildren}>
        <section className="relative py-16 overflow-hidden">
          {/* Parallax background */}
          <ParallaxElement speed={0.2} className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10" />
          </ParallaxElement>
          
          {/* Floating elements */}
          <motion.div
            className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl"
            animate={{
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-16 h-16 bg-purple-400/20 rounded-full blur-xl"
            animate={{
              y: [0, 20, 0],
              x: [0, -10, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          />
          
          <div className="relative z-10 max-w-6xl mx-auto px-4">
            <motion.div
              variants={fadeUp}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Join Our Growing Community
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Thousands of writers and readers are already part of our vibrant community
              </p>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: 50000, suffix: "+", label: "Active Writers" },
                { number: 2500, suffix: "+", label: "Articles Published" },
                { number: 100000, suffix: "+", label: "Monthly Readers" },
                { number: 150, suffix: "+", label: "Countries Reached" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  variants={slideInScale}
                  className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ================= Features Showcase ================= */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={staggerChildren}
        className="space-y-12"
      >
        <div className="text-center space-y-4">
          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-5xl font-bold"
          >
            Powerful Features for Every Writer
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Everything you need to create amazing content
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeInLeft} className="space-y-8">
            {[
              {
                icon: <FaBolt className="h-6 w-6 text-yellow-500" />,
                title: "Lightning Fast Editor",
                desc: "Write with our blazing-fast, distraction-free editor built for speed and focus.",
              },
              {
                icon: <FaMagic className="h-6 w-6 text-purple-500" />,
                title: "Smart Formatting",
                desc: "Auto-formatting and smart suggestions help you create beautiful content effortlessly.",
              },
              {
                icon: <FaChartLine className="h-6 w-6 text-green-500" />,
                title: "Analytics & Insights",
                desc: "Track your article performance and understand your audience better.",
              },
              {
                icon: <FaInfinity className="h-6 w-6 text-blue-500" />,
                title: "Unlimited Publishing",
                desc: "No limits on articles, words, or readers. Share as much as you want, forever.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ x: 10 }}
                className="flex gap-4 p-4 rounded-xl hover:bg-muted/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeInRight} className="relative">
            <motion.div
              className="bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl p-8 relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />

              <div className="relative z-10 text-center space-y-6">
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="text-6xl"
                >
                  ✨
                </motion.div>

                <h3 className="text-2xl font-bold">Start Writing Today</h3>
                <p className="text-muted-foreground">
                  Join thousands of writers who have already discovered the joy
                  of writing on InfoBite
                </p>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/signup">
                    <Button className="bg-primary hover:bg-primary/90">
                      <FaRocket className="h-4 w-4 mr-2" />
                      Get Started Now
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* ================= Final CTA ================= */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={staggerChildren}
        className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 md:p-16 text-center space-y-8 relative overflow-hidden"
      >
        {/* Animated background elements */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          style={{ backgroundSize: "400% 400%" }}
        />

        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <motion.h2
              variants={slideUp}
              className="text-4xl md:text-5xl font-bold"
            >
              Start Your Writing Journey
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              Whether you're a seasoned writer or just starting out, InfoBite
              provides everything you need to create, publish, and grow your
              audience.
            </motion.p>
          </div>

          <motion.div
            variants={staggerFast}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <motion.div variants={scaleIn}>
              <Link href="/signup">
                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="group"
                >
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 text-lg px-8 py-4 relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                    <FaPenNib className="h-5 w-5 mr-2 relative z-10" />
                    <span className="relative z-10">Create Free Account</span>
                    <motion.div
                      className="ml-2 relative z-10"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <FaArrowRight className="h-4 w-4" />
                    </motion.div>
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div variants={scaleIn}>
              <Link href="/signin">
                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="hover:bg-background/80 text-lg px-8 py-4"
                  >
                    <FaUsers className="h-5 w-5 mr-2" />
                    Already have an account?
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div variants={fadeUp} className="pt-4">
            <motion.p
              className="text-sm text-muted-foreground"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              No credit card required • Free forever • Start writing in seconds
            </motion.p>
          </motion.div>
        </div>

        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-8 right-8 w-12 h-12 bg-primary/20 rounded-full"
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <motion.div
          className="absolute bottom-8 left-8 w-8 h-8 bg-purple-500/20 rounded-full"
          animate={{
            y: [0, 15, 0],
            scale: [1, 0.8, 1],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </motion.section>

      
    </main>
    </div>
  );
};
