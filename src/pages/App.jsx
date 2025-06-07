import React from 'react';
import { MessageCircle, Shield, Heart, Brain, ArrowRight, Moon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Home = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "AI Counselor",
      description: "Berbicara dengan AI counselor yang menggunakan pendekatan CBT untuk memberikan dukungan 24/7",
      color: "text-blue-400"
    },
    {
      icon: Shield,
      title: "Crisis Detection",
      description: "Sistem deteksi dini untuk situasi krisis dengan respon cepat dan bantuan darurat",
      color: "text-emerald-400"
    },
    {
      icon: Brain,
      title: "Smart Assessment",
      description: "Penilaian risiko kecanduan judi dan kesehatan mental dengan AI yang akurat",
      color: "text-purple-400"
    },
    {
      icon: Heart,
      title: "Personalized Care",
      description: "Strategi coping yang dipersonalisasi berdasarkan kondisi dan kebutuhan Anda",
      color: "text-pink-400"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-white">MindCare</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
              <a href="#about" className="text-slate-300 hover:text-white transition-colors">About</a>
              <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2 bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-700/50">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-slate-300">Powered by Azure AI</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Your Journey to{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                Mental Wellness
              </span>
            </h1>
            
            <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              Dapatkan dukungan kesehatan mental 24/7 dengan AI counselor yang memahami, 
              deteksi dini risiko kecanduan judi, dan strategi coping yang dipersonalisasi.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg">
                Mulai Chat dengan AI Counselor
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white px-8 py-6 text-lg">
                Ambil Assessment
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Fitur yang Membantu Anda
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Kombinasi teknologi AI terdepan dengan pendekatan terapi yang terbukti efektif
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-slate-900/50 border-slate-800/50 backdrop-blur-sm hover:bg-slate-900/70 transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-lg bg-slate-800/50 flex items-center justify-center mb-4 group-hover:bg-slate-800/70 transition-colors`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-400 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-emerald-600/10" />
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-12">
            <Moon className="w-16 h-16 text-slate-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Mulai Perjalanan Kesehatan Mental Anda
            </h2>
            <p className="text-slate-400 mb-8 text-lg">
              Langkah pertama adalah yang tersulit. Kami di sini untuk mendampingi Anda 
              setiap saat, tanpa judgment, dengan dukungan yang Anda butuhkan.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-8 py-6 text-lg">
              Mulai Sekarang - Gratis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-white">MindCare</span>
            </div>
            <div className="text-slate-400 text-sm">
              © 2025 MindCare. Dibuat dengan ❤️ untuk kesehatan mental yang lebih baik.
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800/50">
            <p className="text-slate-500 text-sm text-center">
              ⚠️ Disclaimer: AI Counselor adalah alat bantuan dan tidak menggantikan konsultasi profesional. 
              Dalam situasi darurat, segera hubungi layanan kesehatan mental atau nomor darurat.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;