import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Clock, TrendingUp, ArrowLeft, ArrowRight } from 'lucide-react';

const GamblingAssessment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  // Assessment questions berdasarkan DSM-5 dan PGSI (Problem Gambling Severity Index)
  const assessmentQuestions = [
    {
      category: "Perilaku Judi",
      questions: [
        {
          id: 'q1',
          text: "Seberapa sering Anda berjudi online dalam 12 bulan terakhir?",
          type: "radio",
          options: [
            { value: 0, label: "Tidak pernah" },
            { value: 1, label: "Kadang-kadang (1-2 kali per bulan)" },
            { value: 2, label: "Sering (1-2 kali per minggu)" },
            { value: 3, label: "Sangat sering (hampir setiap hari)" }
          ]
        },
        {
          id: 'q2',
          text: "Apakah Anda pernah bertaruh lebih banyak uang dari yang Anda rencanakan?",
          type: "radio",
          options: [
            { value: 0, label: "Tidak pernah" },
            { value: 1, label: "Kadang-kadang" },
            { value: 2, label: "Sering" },
            { value: 3, label: "Hampir selalu" }
          ]
        },
        {
          id: 'q3',
          text: "Apakah Anda pernah merasa perlu bertaruh dengan jumlah uang yang semakin besar untuk merasakan sensasi yang sama?",
          type: "radio",
          options: [
            { value: 0, label: "Tidak pernah" },
            { value: 1, label: "Kadang-kadang" },
            { value: 2, label: "Sering" },
            { value: 3, label: "Hampir selalu" }
          ]
        }
      ]
    },
    {
      category: "Kontrol Diri",
      questions: [
        {
          id: 'q4',
          text: "Seberapa sering Anda mencoba mengurangi atau berhenti berjudi tetapi tidak berhasil?",
          type: "radio",
          options: [
            { value: 0, label: "Tidak pernah mencoba" },
            { value: 1, label: "Pernah mencoba 1-2 kali" },
            { value: 2, label: "Sering mencoba tapi sulit" },
            { value: 3, label: "Selalu gagal meskipun berusaha keras" }
          ]
        },
        {
          id: 'q5',
          text: "Apakah Anda merasa gelisah atau mudah marah ketika mencoba mengurangi atau berhenti berjudi?",
          type: "radio",
          options: [
            { value: 0, label: "Tidak pernah" },
            { value: 1, label: "Kadang-kadang" },
            { value: 2, label: "Sering" },
            { value: 3, label: "Hampir selalu" }
          ]
        },
        {
          id: 'q6',
          text: "Apakah Anda berjudi sebagai cara untuk melarikan diri dari masalah atau untuk mengatasi perasaan sedih, cemas, atau bersalah?",
          type: "radio",
          options: [
            { value: 0, label: "Tidak pernah" },
            { value: 1, label: "Kadang-kadang" },
            { value: 2, label: "Sering" },
            { value: 3, label: "Hampir selalu" }
          ]
        }
      ]
    },
    {
      category: "Dampak Sosial & Keuangan",
      questions: [
        {
          id: 'q7',
          text: "Apakah Anda pernah kembali berjudi untuk mencoba memenangkan kembali uang yang telah hilang?",
          type: "radio",
          options: [
            { value: 0, label: "Tidak pernah" },
            { value: 1, label: "Kadang-kadang" },
            { value: 2, label: "Sering" },
            { value: 3, label: "Hampir selalu" }
          ]
        },
        {
          id: 'q8',
          text: "Apakah Anda pernah berbohong kepada keluarga atau orang lain tentang aktivitas judi Anda?",
          type: "radio",
          options: [
            { value: 0, label: "Tidak pernah" },
            { value: 1, label: "Kadang-kadang" },
            { value: 2, label: "Sering" },
            { value: 3, label: "Hampir selalu" }
          ]
        },
        {
          id: 'q9',
          text: "Apakah kebiasaan judi Anda pernah menyebabkan masalah keuangan yang serius?",
          type: "radio",
          options: [
            { value: 0, label: "Tidak pernah" },
            { value: 1, label: "Masalah kecil" },
            { value: 2, label: "Masalah sedang" },
            { value: 3, label: "Masalah serius" }
          ]
        },
        {
          id: 'q10',
          text: "Apakah kebiasaan judi Anda pernah menyebabkan masalah dalam hubungan, pekerjaan, atau pendidikan?",
          type: "radio",
          options: [
            { value: 0, label: "Tidak pernah" },
            { value: 1, label: "Masalah kecil" },
            { value: 2, label: "Masalah sedang" },
            { value: 3, label: "Masalah serius" }
          ]
        }
      ]
    }
  ];

  const calculateRisk = () => {
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
    } else {
      setShowResults(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetAssessment = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
  };

  const currentCategory = assessmentQuestions[currentStep];
  const isStepComplete = currentCategory?.questions.every(q => answers[q.id] !== undefined);
  const riskAssessment = showResults ? calculateRisk() : null;

  if (showResults) {
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
              </div>

              {/* Recommendations */}
              <div className="bg-slate-800/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Rekomendasi untuk Anda</h3>
                {riskAssessment.level === 'Rendah' && (
                  <div className="space-y-3 text-slate-300">
                    <p>✅ Pertahankan kebiasaan judi yang terkontrol</p>
                    <p>✅ Tetap awasi pengeluaran dan waktu yang dihabiskan</p>
                    <p>✅ Gunakan fitur AI Counselor untuk tips pencegahan</p>
                  </div>
                )}
                {riskAssessment.level === 'Sedang' && (
                  <div className="space-y-3 text-slate-300">
                    <p>⚠️ Mulai batasi waktu dan uang untuk judi</p>
                    <p>⚠️ Gunakan fitur AI Counselor untuk strategi coping</p>
                    <p>⚠️ Pertimbangkan untuk berbicara dengan keluarga atau teman</p>
                    <p>⚠️ Monitor perilaku judi Anda secara teratur</p>
                  </div>
                )}
                {(riskAssessment.level === 'Tinggi' || riskAssessment.level === 'Sangat Tinggi') && (
                  <div className="space-y-3 text-slate-300">
                    <p>🚨 Segera cari bantuan dari profesional kesehatan mental</p>
                    <p>🚨 Gunakan AI Counselor untuk dukungan darurat</p>
                    <p>🚨 Pertimbangkan untuk bergabung dengan support group</p>
                    <p>🚨 Blokir akses ke situs judi online</p>
                    <p>🚨 Minta dukungan keluarga dan teman terdekat</p>
                  </div>
                )}
              </div>

              {/* Emergency Contacts */}
              {(riskAssessment.level === 'Tinggi' || riskAssessment.level === 'Sangat Tinggi') && (
                <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-red-300 mb-4">Kontak Darurat</h3>
                  <div className="space-y-2 text-slate-300">
                    <p>🏥 <strong>RSJ/Rumah Sakit:</strong> 119 (Ambulans)</p>
                    <p>📞 <strong>Hotline Kesehatan Mental:</strong> 021-500-454</p>
                    <p>💬 <strong>Sejiwa:</strong> 119 ext. 8</p>
                    <p>🌐 <strong>Into The Light:</strong> intothelightid.org</p>
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
              style={{ width: `${((currentStep + 1) / assessmentQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              <span className="text-blue-400 font-medium">{currentCategory.category}</span>
            </div>
            <CardTitle className="text-2xl text-white">Assessment Risiko Kecanduan Judi</CardTitle>
            <CardDescription className="text-slate-400">
              Jawab pertanyaan berikut dengan jujur untuk mendapatkan penilaian yang akurat
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {currentCategory.questions.map((question, index) => (
              <div key={question.id} className="space-y-4">
                <h3 className="text-lg font-medium text-white leading-relaxed">
                  {index + 1}. {question.text}
                </h3>
                <div className="grid gap-3">
                  {question.options.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                        answers[question.id] === option.value
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
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                        answers[question.id] === option.value
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
                disabled={currentStep === 0}
                className="border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Sebelumnya
              </Button>
              <Button
                onClick={nextStep}
                disabled={!isStepComplete}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50"
              >
                {currentStep === assessmentQuestions.length - 1 ? 'Lihat Hasil' : 'Selanjutnya'}
                <ArrowRight className="w-4 h-4 ml-2" />
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