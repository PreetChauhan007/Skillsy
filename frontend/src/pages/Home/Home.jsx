import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowRight, Users, MessageCircle, Star, Shield } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Users,
      title: 'Connect with Others',
      description: 'Find people who have the skills you want to learn and are looking for skills you can offer.',
    },
    {
      icon: MessageCircle,
      title: 'Easy Skill Swapping',
      description: 'Send swap requests, negotiate terms, and learn new skills through collaborative exchange.',
    },
    {
      icon: Star,
      title: 'Build Your Reputation',
      description: 'Receive ratings and feedback to build trust and credibility within the community.',
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Admin-moderated platform with safety features to ensure quality interactions.',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-neutral-950 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-5xl tracking-tight font-extrabold text-white sm:text-6xl md:text-7xl">
                  <span className="block xl:inline">Exchange skills,</span>{' '}
                  <span className="block text-emerald-400 xl:inline">grow together</span>
                </h1>
                <p className="mt-3 text-lg text-neutral-400 sm:mt-5 sm:text-xl sm:max-w-xl sm:mx-auto md:mt-5 md:text-2xl lg:mx-0">
                  Connect with people who have the skills you want to learn and share your expertise with others. 
                  Build a community of learners and teachers through skill swapping.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
                  {user ? (
                    <Link
                      to="/dashboard"
                      className="px-8 py-3 rounded-lg font-bold bg-emerald-500 text-black hover:bg-emerald-400 transition text-lg shadow-lg"
                    >
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  ) : (
                    <>
                      <div className="rounded-md shadow">
                        <Link
                          to="/register"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 md:py-4 md:text-lg md:px-10 transition-colors"
                        >
                          Get started
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </div>
                      <div className="mt-3 sm:mt-0 sm:ml-3">
                        <Link
                          to="/login"
                          className="w-full flex items-center justify-center px-8 py-3 border border-gray-700 text-base font-medium rounded-md text-gray-300 bg-transparent hover:bg-gray-800 md:py-4 md:text-lg md:px-10 transition-colors"
                        >
                          Sign in
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="People collaborating"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-neutral-950 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-emerald-400 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
              Everything you need to swap skills
            </p>
            <p className="mt-4 max-w-2xl text-xl text-neutral-300 lg:mx-auto">
              Our platform provides all the tools you need to connect, collaborate, and grow your skills.
            </p>
          </div>

          <div className="mt-12">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-12 md:gap-y-12">
              {features.map((feature) => (
                <div key={feature.title} className="relative bg-neutral-900 rounded-2xl p-8 border border-neutral-800 shadow-lg hover:shadow-emerald-900/30 transition-shadow">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-600 shadow-lg -top-6 left-4">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <p className="ml-20 text-lg leading-6 font-bold text-white">{feature.title}</p>
                  </dt>
                  <dd className="mt-2 ml-20 text-base text-neutral-300">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-neutral-950 border-t border-neutral-800">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to start swapping skills?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-neutral-300">
            Join our community today and start learning new skills while sharing your expertise.
          </p>
          <Link
            to="/register"
            className="mt-8 w-full inline-flex items-center justify-center px-8 py-3 border border-emerald-500 text-base font-bold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 hover:text-white sm:w-auto transition-colors shadow-lg"
          >
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;