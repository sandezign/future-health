import { useState } from 'react';
import { AnalyzedPatient } from '../../../entities/patient/model/types';
import { Card } from '../../../shared/ui/card';
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  CheckCheck,
  Play,
  Calendar,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  patient: AnalyzedPatient;
}

export function WhatsAppSimulator({ patient }: Props) {
  const [language, setLanguage] = useState<'id' | 'en'>('id');
  const [messages, setMessages] = useState<
    Array<{ sender: 'bot' | 'user'; text?: string; isAudio?: boolean; time: string }>
  >([
    {
      sender: 'bot',
      text:
        language === 'id'
          ? `Halo Pak ${patient.name.split(' ')[0]}, ini suster Maya dari Tim Pendamping Ginjal Puskesmas. Dari hasil tes lab rutin Bapak baru-baru ini, dokter melihat bahwa "saringan" ginjal Bapak mulai bekerja terlalu keras, meskipun Bapak saat ini merasa sehat dan bugar.`
          : `Hello Mr. ${patient.name.split(' ')[0]}, this is Nurse Maya from your Primary Care Kidney Health Team. Reviewing your recent routine labs, our physician noticed that your kidney filtration units are working under high strain, even though you currently feel completely healthy.`,
      time: '09:14',
    },
    {
      sender: 'bot',
      isAudio: true,
      time: '09:15',
    },
    {
      sender: 'bot',
      text:
        language === 'id'
          ? `Ginjal tidak memiliki saraf perasa saat mulai luka. Kami ingin membantu Bapak mengamankan fungsi ginjal agar tidak sampai ke tahap cuci darah di masa depan. Dokter telah menyiapkan 1 resep obat pelindung ginjal khusus. Apakah Bapak ada waktu 10 menit besok pagi?`
          : `Kidneys have no pain receptors during early damage. We want to protect your kidneys now to permanently prevent dialysis down the road. The doctor has pre-approved an organ-protective therapy for you. Are you free for a 10-minute checkup tomorrow?`,
      time: '09:15',
    },
  ]);

  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleQuickBook = () => {
    const userMsg =
      language === 'id'
        ? 'Bisa suster, tolong jadwalkan besok jam 09.30.'
        : 'Yes nurse, please book me for tomorrow at 9:30 AM.';

    const botReply =
      language === 'id'
        ? `Baik Pak ${patient.name.split(' ')[0]}, jadwal konsultasi Bapak sudah dikonfirmasi untuk besok pukul 09:30 di Poli Umum Puskesmas. Resep obat pelindung ginjal (SGLT2i) dan tes pemantauan sudah siap. Terima kasih sudah peduli pada kesehatan ginjal Bapak!`
        : `Confirmed Mr. ${patient.name.split(' ')[0]}. Your 10-minute consult is booked for tomorrow at 9:30 AM at the clinic. Your organ-protective order set is pre-loaded. Thank you for protecting your health!`;

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userMsg, time: '09:16' },
      { sender: 'bot', text: botReply, time: '09:16' },
    ]);
    setBookingConfirmed(true);
  };

  const handleAskWhy = () => {
    const userMsg =
      language === 'id'
        ? 'Kenapa saya harus berobat kalau badan saya sehat-sehat saja?'
        : 'Why do I need medication if I feel totally healthy?';

    const botReply =
      language === 'id'
        ? `Pertanyaan yang sangat bagus, Pak! Ibarat filter air di rumah, saat filternya mulai tersumbat atau bocor halus, airnya masih tetap mengalir jernih. Tapi jika dibiarkan tanpa pelindung, filternya akan rusak permanen. Obat yang diresepkan dokter bekerja seperti pelindung tekanan agar saringan ginjal Bapak awet puluhan tahun lagi.`
        : `Great question! Think of your kidneys like a water filter. When the filter first begins to leak microscopically, water still appears clear. But left unprotected, it eventually breaks completely. The protective medicine relieves pressure on the filters so they last for decades.`;

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userMsg, time: '09:17' },
      { sender: 'bot', text: botReply, time: '09:17' },
    ]);
  };

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setInputValue('');

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText, time: '09:18' },
      {
        sender: 'bot',
        text:
          language === 'id'
            ? `Pesan Bapak sudah diteruskan ke Dokter di Puskesmas. Sampai jumpa di klinik untuk konsultasi kesehatan ginjal Bapak!`
            : `Your note has been relayed to your primary care physician. We look forward to seeing you at the clinic!`,
        time: '09:18',
      },
    ]);
  };

  return (
    <Card className="max-w-md mx-auto shadow-xl border-slate-300 overflow-hidden rounded-2xl bg-slate-900 text-white">
      {/* Smartphone Top Notch & Header */}
      <div className="bg-[#075e54] px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-emerald-100 text-[#075e54] flex items-center justify-center font-bold text-sm">
              PKM
            </div>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 border-2 border-[#075e54]" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white">Puskesmas Cardiorenal Care</span>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
            </div>
            <p className="text-[11px] text-emerald-100 flex items-center gap-1">
              <span>Online</span> • <span>AI Care Navigator</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-white/80">
          <Video className="h-4 w-4" />
          <Phone className="h-4 w-4" />
          <MoreVertical className="h-4 w-4" />
        </div>
      </div>

      {/* Language Switcher Bar */}
      <div className="bg-[#128c7e] px-4 py-1.5 flex items-center justify-between text-xs text-emerald-50">
        <span className="text-[11px] font-medium flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5" />
          Patient: {patient.name} ({patient.patient_id})
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setLanguage('id')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              language === 'id' ? 'bg-white text-[#075e54]' : 'text-white/80'
            }`}
          >
            Bahasa ID
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              language === 'en' ? 'bg-white text-[#075e54]' : 'text-white/80'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* WhatsApp Message Area */}
      <div
        className="p-4 space-y-3 h-96 overflow-y-auto text-xs bg-[#efeae2] text-slate-900"
        style={{
          backgroundImage:
            'radial-gradient(#cbd5e1 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      >
        <div className="text-center my-2">
          <span className="bg-white/80 text-slate-500 text-[10px] px-2.5 py-1 rounded-full shadow-xs">
            End-to-End Encrypted Health Consultation
          </span>
        </div>

        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              m.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`p-3 rounded-2xl max-w-[85%] shadow-sm relative ${
                m.sender === 'user'
                  ? 'bg-[#dcf8c6] text-slate-900 rounded-tr-none'
                  : 'bg-white text-slate-900 rounded-tl-none'
              }`}
            >
              {m.isAudio ? (
                <div className="flex items-center gap-3 pr-2">
                  <div className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Play className="h-4 w-4 fill-white ml-0.5" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 w-28 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full w-1/2 bg-emerald-600" />
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {language === 'id'
                        ? 'Penjelasan Dokter: Analogi Saringan Ginjal (0:48)'
                        : 'Doctor Voice Note: The Kitchen Filter Analogy (0:48)'}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="leading-relaxed text-xs">{m.text}</p>
              )}

              <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-400">
                <span>{m.time}</span>
                {m.sender === 'user' && (
                  <CheckCheck className="h-3 w-3 text-blue-500" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Quick-Reply Suggestion Pills */}
      {!bookingConfirmed && (
        <div className="p-2.5 bg-slate-800 border-t border-slate-700 flex flex-wrap gap-2 text-xs">
          <button
            onClick={handleQuickBook}
            className="px-3 py-1.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-400 transition-colors cursor-pointer"
          >
            <Calendar className="h-3.5 w-3.5" />
            {language === 'id' ? 'Jadwalkan Konsultasi 10 Menit' : 'Book 10-Min Consult'}
          </button>
          <button
            onClick={handleAskWhy}
            className="px-3 py-1.5 rounded-full bg-slate-700 text-white text-xs hover:bg-slate-600 transition-colors cursor-pointer"
          >
            {language === 'id' ? 'Kenapa Berobat Kalau Merasa Sehat?' : 'Why Treat If Asymptomatic?'}
          </button>
        </div>
      )}

      {/* Input Message Box */}
      <form
        onSubmit={handleSendCustom}
        className="p-2.5 bg-[#f0f2f5] flex items-center gap-2 border-t border-slate-200"
      >
        <input
          type="text"
          placeholder={
            language === 'id' ? 'Ketik balasan untuk dokter...' : 'Type reply to nurse...'
          }
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 bg-white border border-slate-300 rounded-full px-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <button
          type="submit"
          className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-colors"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </Card>
  );
}
