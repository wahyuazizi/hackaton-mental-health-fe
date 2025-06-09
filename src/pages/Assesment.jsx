import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Clock, TrendingUp, ArrowLeft, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

const GamblingAssessment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [assessmentQuestions, setAssessmentQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);

  // Base URL untuk API - sesuaikan dengan URL FastAPI Anda
  const API_BASE_URL = 'http://localhost:8000'; // Ganti dengan URL FastAPI Anda

  // Fetch assessment questions dari API
  const fetchAssessmentQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/assessment/questions`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAssessmentQuestions(data.questions || []);
    } catch (err) {
      setError(`Gagal memuat soal assessment: ${err.message}`);
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Submit assessment answers ke API
  const submitAssessment = async () => {
    try {
      setSubmitting(true);
      const response = await fetch(`${API_BASE_URL}/api/assessment/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: answers,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
      setShowResults(true);
    } catch (err) {
      setError(`Gagal mengirim assessment: ${err.message}`);
      console.error('Error submitting assessment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Load questions saat component mount
  useEffect(() => {
    fetchAssessmentQuestions();
  }, []);

  // Fallback risk calculation jika API tidak mengembalikan hasil
  const calculateRiskFallback = () => {
    const totalScore = Object.values(answers).reduce((sum, value) => sum + value, 0);
    const maxScore = assessmentQuestions.reduce((sum, category) => sum + category.questions.length * 3, 0);
    const percentage = (totalScore / maxScore) * 100;

    if (percentage <= 25) return { level: 'Rendah', color: 'emerald', description: 'Risiko rendah kecanduan judi' };
    if (percentage <= 50) return { level: 'Sedang', color: 'yellow', description: 'Risiko sedang - perlu perhatian' };
    if (percentage <= 75) return { level: 'Tinggi', color: 'orange', description: 'Risiko tinggi - perlu bantuan profesional' };
    return { level: 'Sangat Tinggi', color: 'red', description: 'Risiko sangat tinggi - segera cari bantuan' };
  };

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const nextStep = () => {
    if (currentStep < assessmentQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
      // Scroll ke atas setelah state update
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } else {
      submitAssessment();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Scroll ke atas setelah state update
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }

  };

  const resetAssessment = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
    setResults(null);
    setError(null);
  };

  const retryFetch = () => {
    fetchAssessmentQuestions();
  };



  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 flex items-center justify-center">
        <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-sm p-8">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
            <p className="text-slate-300 text-lg">Memuat assessment...</p>
          </div>
        </Card>
      </div>
    );
  }

  // Error state
  if (error && !assessmentQuestions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 flex items-center justify-center">
        <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-sm max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto" />
            <h2 className="text-xl font-semibold text-white">Gagal Memuat Assessment</h2>
            <p className="text-slate-400">{error}</p>
            <Button
              onClick={retryFetch}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentCategory = assessmentQuestions[currentStep];
  const isStepComplete = currentCategory?.questions.every(q => answers[q.id] !== undefined);
  const riskAssessment = results?.risk_assessment || (showResults ? calculateRiskFallback() : null);

  // Results page
  if (showResults && riskAssessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {riskAssessment.level === 'Rendah' && <CheckCircle className="w-16 h-16 text-emerald-400" />}
                {riskAssessment.level === 'Sedang' && <Clock className="w-16 h-16 text-yellow-400" />}
                {(riskAssessment.level === 'Tinggi' || riskAssessment.level === 'Sangat Tinggi') && <AlertTriangle className="w-16 h-16 text-red-400" />}
              </div>
              <CardTitle className="text-3xl text-white mb-2">Hasil Assessment</CardTitle>
              <CardDescription className="text-slate-400 text-lg">
                Tingkat Risiko Kecanduan Judi Online Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Risk Level Display */}
              <div className="text-center">
                <div className={`inline-flex items-center px-6 py-3 rounded-full bg-${riskAssessment.color}-500/10 border border-${riskAssessment.color}-500/20`}>
                  <span className={`text-2xl font-bold text-${riskAssessment.color}-400`}>
                    Risiko {riskAssessment.level}
                  </span>
                </div>
                <p className={`mt-3 text-${riskAssessment.color}-400`}>
                  {riskAssessment.description}
                </p>
                {results?.score && (
                  <p className="mt-2 text-slate-400">
                    Skor: {results.score.total_score} / {results.score.max_score}
                  </p>
                )}
              </div>

              {/* Recommendations */}
              <div className="bg-slate-800/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Rekomendasi untuk Anda</h3>
                <div className="space-y-3 text-slate-300">
                  {results?.recommendations ? (
                    results.recommendations.map((rec, index) => (
                      <p key={index}>{rec}</p>
                    ))
                  ) : (
                    // Fallback recommendations
                    <>
                      {riskAssessment.level === 'Rendah' && (
                        <>
                          <p>✅ Pertahankan kebiasaan judi yang terkontrol</p>
                          <p>✅ Tetap awasi pengeluaran dan waktu yang dihabiskan</p>
                          <p>✅ Gunakan fitur AI Counselor untuk tips pencegahan</p>
                        </>
                      )}
                      {riskAssessment.level === 'Sedang' && (
                        <>
                          <p>⚠️ Mulai batasi waktu dan uang untuk judi</p>
                          <p>⚠️ Gunakan fitur AI Counselor untuk strategi coping</p>
                          <p>⚠️ Pertimbangkan untuk berbicara dengan keluarga atau teman</p>
                          <p>⚠️ Monitor perilaku judi Anda secara teratur</p>
                        </>
                      )}
                      {(riskAssessment.level === 'Tinggi' || riskAssessment.level === 'Sangat Tinggi') && (
                        <>
                          <p>🚨 Segera cari bantuan dari profesional kesehatan mental</p>
                          <p>🚨 Gunakan AI Counselor untuk dukungan darurat</p>
                          <p>🚨 Pertimbangkan untuk bergabung dengan support group</p>
                          <p>🚨 Blokir akses ke situs judi online</p>
                          <p>🚨 Minta dukungan keluarga dan teman terdekat</p>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Emergency Contacts */}
              {(riskAssessment.level === 'Tinggi' || riskAssessment.level === 'Sangat Tinggi') && (
                <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-red-300 mb-4">Kontak Darurat</h3>
                  <div className="space-y-2 text-slate-300">
                    {results?.emergency_contacts ? (
                      results.emergency_contacts.map((contact, index) => (
                        <p key={index}>{contact}</p>
                      ))
                    ) : (
                      <>
                        <p>🏥 <strong>RSJ/Rumah Sakit:</strong> 119 (Ambulans)</p>
                        <p>📞 <strong>Hotline Kesehatan Mental:</strong> 021-500-454</p>
                        <p>💬 <strong>Sejiwa:</strong> 119 ext. 8</p>
                        <p>🌐 <strong>Into The Light:</strong> intothelightid.org</p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  onClick={() => window.location.href = '/chat'}
                >
                  Chat dengan AI Counselor
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                  onClick={resetAssessment}
                >
                  Ulangi Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Assessment form
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400">Progress</span>
            <span className="text-slate-400">{currentStep + 1} / {assessmentQuestions.length}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${assessmentQuestions.length ? ((currentStep + 1) / assessmentQuestions.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
            <p className="text-red-300 text-center">{error}</p>
          </div>
        )}

        <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              <span className="text-blue-400 font-medium">{currentCategory?.category}</span>
            </div>
            <CardTitle className="text-2xl text-white">Assessment Risiko Kecanduan Judi</CardTitle>
            <CardDescription className="text-slate-400">
              Jawab pertanyaan berikut dengan jujur untuk mendapatkan penilaian yang akurat
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {currentCategory?.questions.map((question, index) => (
              <div key={question.id} className="space-y-4">
                <h3 className="text-lg font-medium text-white leading-relaxed">
                  {index + 1}. {question.text}
                </h3>
                <div className="grid gap-3">
                  {question.options.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all duration-200 ${answers[question.id] === option.value
                        ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                        : 'border-slate-700 bg-slate-800/30 text-slate-300 hover:border-slate-600 hover:bg-slate-800/50'
                        }`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option.value}
                        checked={answers[question.id] === option.value}
                        onChange={(e) => handleAnswer(question.id, parseInt(e.target.value))}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 ${answers[question.id] === option.value
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-slate-500'
                        }`}>
                        {answers[question.id] === option.value && (
                          <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                        )}
                      </div>
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0 || submitting}
                className="border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Sebelumnya
              </Button>
              <Button
                onClick={nextStep}
                disabled={!isStepComplete || submitting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    {currentStep === assessmentQuestions.length - 1 ? 'Lihat Hasil' : 'Selanjutnya'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
          <p className="text-slate-400 text-sm text-center">
            ⚠️ <strong>Disclaimer:</strong> Assessment ini adalah alat skrining awal dan tidak menggantikan diagnosis profesional.
            Jika Anda membutuhkan bantuan segera, hubungi layanan kesehatan mental atau nomor darurat.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GamblingAssessment;