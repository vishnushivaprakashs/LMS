import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, TrendingUp, ArrowRight, Sparkles, Target, Zap, Globe, CheckCircle } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: BookOpen,
      title: '1000+ Courses',
      description: 'Access a vast library of courses across multiple disciplines',
      color: 'text-primary-700'
    },
    {
      icon: Users,
      title: 'Expert Instructors',
      description: 'Learn from industry professionals and certified educators',
      color: 'text-accent-400'
    },
    {
      icon: Award,
      title: 'Recognized Certificates',
      description: 'Earn certificates that boost your career prospects',
      color: 'text-primary-700'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed analytics',
      color: 'text-accent-400'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Active Students' },
    { number: '1000+', label: 'Expert Instructors' },
    { number: '5000+', label: 'Courses Available' },
    { number: '95%', label: 'Success Rate' }
  ];

  const benefits = [
    'Learn at your own pace',
    'Access on any device',
    'Lifetime course access',
    'Interactive learning',
    'Community support',
    'Career guidance'
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-96 h-96 bg-accent-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-5 w-5 text-accent-400" />
              <span className="text-sm font-semibold">Welcome to EduNexus</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Keep Learning.<br />
              <span className="text-gradient-accent">Keep Growing.</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 text-primary-100 max-w-3xl mx-auto">
              Transform your future with world-class courses from expert instructors. 
              Start your learning journey today.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link
                to="/signup"
                className="btn-primary inline-flex items-center justify-center space-x-2 group bg-white text-primary-700 hover:bg-gray-50"
              >
                <span>Get Started Free</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="btn-secondary inline-flex items-center justify-center space-x-2 border-2 border-white hover:bg-white/10"
              >
                <span>Sign In</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="text-4xl md:text-5xl font-bold text-accent-400 mb-2">{stat.number}</div>
                  <div className="text-sm md:text-base text-primary-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-textPrimary mb-4">
            Why Choose <span className="text-gradient">EduNexus</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to succeed in your learning journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="card text-center group animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 group-hover:bg-primary-100 transition-colors">
                <feature.icon className={`h-8 w-8 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-textPrimary">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-secondary-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Learn Anytime, Anywhere
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Our platform is designed to fit your lifestyle. Access courses on your schedule and learn at your own pace.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-accent-400 flex-shrink-0" />
                    <span className="text-gray-200">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative animate-fade-in">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary-700 to-accent-400 p-1">
                <div className="w-full h-full rounded-2xl bg-secondary-800 flex items-center justify-center">
                  <div className="text-center p-8">
                    <Globe className="h-24 w-24 text-accent-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold mb-3">Global Learning Community</h3>
                    <p className="text-gray-300">Connect with learners from around the world</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="card bg-gradient-to-br from-primary-700 to-secondary-900 text-white p-12 animate-scale-in">
            <Zap className="h-16 w-16 text-accent-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join over 50,000 students and instructors already transforming their careers with EduNexus
            </p>
            <Link
              to="/signup"
              className="btn-accent inline-flex items-center justify-center space-x-2 group text-lg"
            >
              <span>Create Free Account</span>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-sm text-primary-200 mt-4">
              No credit card required • Free forever
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
