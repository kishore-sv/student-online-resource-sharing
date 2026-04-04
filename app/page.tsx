import Footer from '@/components/footer'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen, Users, Zap, GraduationCap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-muted">
                  <Zap className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Share & Learn Together</span>
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-6xl font-bold leading-tight text-balance">
                  Share Knowledge,{' '}
                  <span className="bg-linear-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                    Learn Together
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed">
                  Connect with students worldwide. Share study notes, research papers, solved problems, and collaborative learning resources in one unified platform.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 text-base">
                    Start Sharing
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="border-border hover:bg-secondary/10 h-12 px-8 text-base"
                >
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
                <div>
                  <div className="text-3xl font-bold text-primary">60+</div>
                  <p className="text-sm text-muted-foreground">Active Students</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary-foreground">1000+</div>
                  <p className="text-sm text-muted-foreground">Resources Shared</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">20+</div>
                  <p className="text-sm text-muted-foreground">Subjects</p>
                </div>
              </div>
            </div>

            {/* Right - Illustration */}
            <div className="relative h-96 sm:h-[500px] lg:h-[600px] hidden lg:block">
              <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-secondary/10 rounded-3xl blur-3xl" />
              <Image
                src="/hero-illustration.jpg"
                alt="Students collaborating and sharing knowledge"
                fill
                className="object-cover rounded-3xl shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32 bg-linear-to-b from-transparent to-accent/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">
              Why Choose StudyHub?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to collaborate, learn, and excel in your studies
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Rich Resources</h3>
              <p className="text-muted-foreground">
                Access notes, PDFs, videos, quizzes, and more from thousands of students worldwide
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl border border-border hover:border-secondary/50 hover:bg-secondary/5 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 border border-secondary/20 group-hover:bg-secondary/20 transition-colors">
                <Users className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community First</h3>
              <p className="text-muted-foreground">
                Join study groups, get feedback, and collaborate with peers who share your goals
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Progress Tracking</h3>
              <p className="text-muted-foreground">
                Monitor your learning journey with insights, achievements, and personalized recommendations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-linear-to-br from-primary to-blue-600 p-12 sm:p-16 text-center text-primary-foreground shadow-2xl">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-balance">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto mb-8 leading-relaxed">
              Join thousands of students who are already sharing knowledge and growing together
            </p>
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 h-12 px-8 text-base font-medium"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}