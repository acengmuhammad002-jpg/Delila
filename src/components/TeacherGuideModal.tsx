import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Clock, 
  HelpCircle, 
  Unlock, 
  RotateCcw, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  Lightbulb,
  Printer
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface TeacherGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockAllMissions: () => void;
  onResetProgress: () => void;
  allUnlocked: boolean;
}

export const TeacherGuideModal: React.FC<TeacherGuideModalProps> = ({
  isOpen,
  onClose,
  onUnlockAllMissions,
  onResetProgress,
  allUnlocked,
}) => {
  const [activeTab, setActiveTab] = useState<'panduan' | 'titik_jeda' | 'kunci' | 'lembar_kerja'>('panduan');
  const [copiedNotification, setCopiedNotification] = useState(false);

  if (!isOpen) return null;

  const copyRefleksiSheet = () => {
    sounds.playClick();
    const sheetText = `LEMBAR DISKUSI DAN REFLEKSI SISWA KELAS V
MATA PELAJARAN: IPAS (BAB HARMONI DALAM EKOSISTEM)
GAME: MISI PENJAGA EKOSISTEM

Nama Siswa / Kelompok: ___________________________
Kelas: V (Lima)     Tanggal: ____________________

1. KOMPONEN EKOSISTEM SAWAH
a. Sebutkan 3 komponen biotik yang kamu amati di sawah:
   1) ________________  2) ________________  3) ________________
b. Sebutkan 2 komponen abiotik dan jelaskan perannya bagi padi:
   1) ________________ Peran: __________________________________
   2) ________________ Peran: __________________________________

2. RANTAI DAN JARING-JARING MAKANAN
a. Tuliskan 1 contoh rantai makanan lengkap dari produsen hingga konsumen puncak:
   (Gunakan tanda panah -> yang benar)
   ________________ -> ________________ -> ________________ -> ________________ -> ________________
b. Apakah arti dari arah panah tersebut?
   Jawab: _________________________________________________________________

3. SIMULASI SEBAB-AKIBAT
a. Apa yang terjadi pada tanaman padi jika ular sawah habis diburu oleh manusia? Mengapa?
   Jawab: _________________________________________________________________
b. Apakah membasmi semua hewan pengganggu dengan racun kimia adalah tindakan bijak? Jelaskan alasanmu!
   Jawab: _________________________________________________________________

4. KESIMPULAN PENJAGA EKOSISTEM
Tuliskan 1 tindakan nyata yang dapat kita lakukan untuk menjaga kelestarian sawah:
Jawab: _________________________________________________________________
`;
    navigator.clipboard.writeText(sheetText).then(() => {
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border-2 border-amber-400/60 bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-950 shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-700/50 px-6 py-4 bg-emerald-950/80">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black shadow">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                Panduan Fasilitasi Guru (Mode Guru)
                <span className="text-xs bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/40">
                  IPAS Kelas V SD
                </span>
              </h2>
              <p className="text-xs text-emerald-300">
                Alat bantu fasilitasi diskusi kelas proyektor (30–40 Menit)
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 rounded-full bg-emerald-900/60 hover:bg-rose-600 text-slate-200 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-emerald-800/60 bg-emerald-950/50 px-6 pt-2 gap-2 overflow-x-auto">
          {[
            { id: 'panduan', label: 'Struktur & Waktu (39 Menit)', icon: Clock },
            { id: 'titik_jeda', label: 'Titik Jeda Diskusi (Pause Points)', icon: Lightbulb },
            { id: 'kunci', label: 'Kunci Konsep & Miskonsepsi', icon: CheckCircle2 },
            { id: 'lembar_kerja', label: 'Lembar Refleksi Siswa', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playClick();
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-amber-400 text-amber-300 bg-emerald-900/40 rounded-t-xl'
                    : 'border-transparent text-emerald-200/70 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm leading-relaxed text-slate-200">
          {activeTab === 'panduan' && (
            <div className="space-y-6">
              {/* Quick Teacher Controls */}
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                    <Unlock className="h-4 w-4 text-amber-400" /> Tombol Kendali Cepat Guru
                  </h4>
                  <p className="text-xs text-slate-300">
                    Gunakan untuk menyesuaikan ritme pembelajaran kelas atau demonstrasi langsung.
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => {
                      sounds.playSuccess();
                      onUnlockAllMissions();
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                      allUnlocked
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-400 text-emerald-950 hover:bg-amber-300'
                    }`}
                  >
                    <Unlock className="h-3.5 w-3.5" />
                    {allUnlocked ? 'Semua Misi Terbuka' : 'Buka Semua Misi'}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Atur ulang seluruh nilai dan progres ke kondisi awal?')) {
                        sounds.playClick();
                        onResetProgress();
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-800 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset Progres
                  </button>
                </div>
              </div>

              {/* Time Allocation Table */}
              <div>
                <h3 className="text-base font-bold text-emerald-300 mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-400" />
                  Rekomendasi Alokasi Waktu Pembelajaran (Total: 39 Menit)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-800">
                    <span className="text-amber-400 font-black text-xs block">5 Menit</span>
                    <h5 className="font-bold text-white text-xs mt-0.5">Apersepsi & Pre-Test</h5>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Guru membuka game di proyektor, menyapa Kak Rimba, dan menjalankan 5 soal pre-test kelas.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-800">
                    <span className="text-amber-400 font-black text-xs block">7 Menit</span>
                    <h5 className="font-bold text-white text-xs mt-0.5">Misi 1: Mengenal Alam</h5>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Eksplorasi sawah interaktif, klasifikasi biotik-abiotik dan peran produsen/konsumen.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-800">
                    <span className="text-amber-400 font-black text-xs block">10 Menit</span>
                    <h5 className="font-bold text-white text-xs mt-0.5">Misi 2: Rantai & Jaring</h5>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Menyusun rantai makanan dan menghubungkan jaring-jaring makanan sawah dengan panah benar.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-800">
                    <span className="text-amber-400 font-black text-xs block">12 Menit</span>
                    <h5 className="font-bold text-white text-xs mt-0.5">Misi 3: Simulasi Sebab-Akibat</h5>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Siswa membuat prediksi, guru menjalankan simulasi, mendiskusikan grafik, dan memilih solusi ekologis.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-800">
                    <span className="text-amber-400 font-black text-xs block">5 Menit</span>
                    <h5 className="font-bold text-white text-xs mt-0.5">Refleksi & Post-Test</h5>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Mengerjakan asesmen akhir, meninjau rapor penjaga ekosistem, dan menyimpulkan nilai moral ekologi.
                    </p>
                  </div>
                </div>
              </div>

              {/* 6 Learning Objectives */}
              <div className="p-4 rounded-2xl bg-emerald-900/30 border border-emerald-700/50">
                <h4 className="text-sm font-bold text-emerald-300 mb-2">
                  Capaian Pembelajaran (IPAS Fase C / Kelas V):
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300">
                  <li>Mengidentifikasi komponen biotik dan abiotik dalam ekosistem sawah.</li>
                  <li>Menjelaskan peran produsen dan konsumen dalam hubungan makan dan dimakan.</li>
                  <li>Membaca serta menyusun rantai makanan menggunakan arah panah yang benar (aliran energi).</li>
                  <li>Menjelaskan beberapa rantai makanan yang saling berhubungan membentuk jaring-jaring makanan.</li>
                  <li>Memprediksi dampak perubahan populasi terhadap organisme lain dalam ekosistem.</li>
                  <li>Memilih tindakan pelestarian ekosistem dan menguraikan alasannya secara ilmiah.</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'titik_jeda' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40">
                <h4 className="font-bold text-amber-300 flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4" /> Cara Melakukan Jeda Diskusi (Pause Points)
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Guru dianjurkan menahan klik sebelum tombol "Jalankan Simulasi" ditekan, lalu meminta perwakilan kelompok siswa untuk memberikan hipotesis dan alasannya.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-700/40">
                  <span className="text-xs font-bold text-emerald-400">Jeda 1: Sebelum Misi 1 (Apersepsi)</span>
                  <p className="text-xs text-slate-200 mt-1">
                    <strong>Tanya Siswa:</strong> "Anak-anak, siapa yang pernah melihat sawah? Makhluk hidup apa saja yang ada di sana, dan apakah mereka bisa hidup tanpa air dan sinar matahari?"
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-700/40">
                  <span className="text-xs font-bold text-emerald-400">Jeda 2: Pada Misi 2 (Arah Panah Rantai Makanan)</span>
                  <p className="text-xs text-slate-200 mt-1">
                    <strong>Tanya Siswa:</strong> "Perhatikan arah panahnya. Apakah panah menunjuk ke siapa yang mengejar, atau ke siapa yang menerima energi makanan?"
                    <br />
                    <em>Kunci: Panah selalu menuju ke pemakan (tujuan aliran energi).</em>
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-700/40">
                  <span className="text-xs font-bold text-amber-400">Jeda 3: Skenario A Misi 3 (Ular Sawah Turun)</span>
                  <p className="text-xs text-slate-200 mt-1">
                    <strong>Tanya Siswa:</strong> "Jika ular sawah kita bunuh semua karena takut, menurut kalian apa yang akan berpesta di sawah? Bagaimana nasib panen padi kakek petani?"
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-700/40">
                  <span className="text-xs font-bold text-amber-400">Jeda 4: Skenario B Misi 3 (Belalang Melonjak)</span>
                  <p className="text-xs text-slate-200 mt-1">
                    <strong>Tanya Siswa:</strong> "Mengapa katak sawah justru bertambah banyak ketika belalang meledak? Apakah katak musuh atau sahabat petani?"
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'kunci' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-700/50">
                <h4 className="font-bold text-emerald-300 text-sm mb-2">
                  Penjelasan Miskonsepsi Umum Siswa SD:
                </h4>
                <div className="space-y-2.5 text-slate-300">
                  <div className="p-2.5 rounded-lg bg-emerald-900/40">
                    <p className="font-bold text-rose-300">❌ Miskonsepsi 1: Arah Panah Rantai Makanan Terbalik</p>
                    <p className="mt-0.5">
                      Banyak siswa mengira panah berarti "hewan A memakan hewan B", sehingga mengarahkan panah dari Elang ke Ular.
                      <br />
                      <strong>Koreksi Sains:</strong> Panah rantai makanan melambangkan <em>perpindahan energi</em>, sehingga mengarah dari Padi ➔ Belalang ➔ Katak ➔ Ular ➔ Elang.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-900/40">
                    <p className="font-bold text-rose-300">❌ Miskonsepsi 2: Semua Ular Sawah Berbisa dan Harus Dibunuh</p>
                    <p className="mt-0.5">
                      Siswa sering menganggap semua ular berbahaya sehingga pantas dimusnahkan.
                      <br />
                      <strong>Koreksi Sains:</strong> Mayoritas ular sawah (seperti Ular Jali / Ptyas korros) tidak berbisa dan merupakan predator alami utama pengendali tikus sawah. Membasmi ular sawah justru menyebabkan gagal panen bagi petani.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-900/40">
                    <p className="font-bold text-rose-300">❌ Miskonsepsi 3: Racun Pestisida adalah Cara Terbaik dan Tercepat</p>
                    <p className="mt-0.5">
                      Siswa menganggap menyemprot racun kimia adalah cara paling modern dan efektif.
                      <br />
                      <strong>Koreksi Sains:</strong> Pestisida berlebih membunuh katak, meracuni elang, mencemari air dan tanah, serta membuat hama menjadi kebal (resistensi). Pengendalian hayati dengan predator alami jauh lebih lestari.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lembar_kerja' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-300">
                  Salin teks di bawah ini atau cetak langsung untuk dibagikan sebagai lembar tugas / refleksi siswa:
                </p>
                <button
                  onClick={copyRefleksiSheet}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs flex items-center gap-1.5 shadow transition-colors cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" />
                  {copiedNotification ? 'Teks Berhasil Disalin!' : 'Salin Teks Lembar Diskusi'}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-800 text-xs font-mono text-emerald-200/90 whitespace-pre-line leading-relaxed max-h-80 overflow-y-auto">
{`LEMBAR DISKUSI DAN REFLEKSI SISWA KELAS V
MATA PELAJARAN: IPAS (BAB HARMONI DALAM EKOSISTEM)
GAME: MISI PENJAGA EKOSISTEM

1. KOMPONEN EKOSISTEM SAWAH
a. Sebutkan 3 komponen biotik yang kamu amati di sawah:
   1) ________________  2) ________________  3) ________________
b. Sebutkan 2 komponen abiotik dan jelaskan perannya bagi padi:
   1) ________________ Peran: __________________________________
   2) ________________ Peran: __________________________________

2. RANTAI DAN JARING-JARING MAKANAN
a. Tuliskan 1 contoh rantai makanan lengkap dari produsen hingga konsumen puncak:
   Padi -> _________ -> _________ -> _________ -> _________
b. Apakah arti dari arah tanda panah tersebut?
   Jawab: ____________________________________________________

3. SIMULASI SEBAB-AKIBAT
a. Apa akibatnya bagi tanaman padi jika ular sawah habis diburu oleh manusia?
   Jawab: ____________________________________________________
b. Mengapa membasmi semua hama dengan racun pestisida berbahaya bagi keseimbangan sawah?
   Jawab: ____________________________________________________

4. KESIMPULAN PENJAGA EKOSISTEM
Tuliskan 1 tindakan nyata yang bijak untuk menjaga keseimbangan sawah:
Jawab: ____________________________________________________`}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-emerald-800/60 bg-emerald-950/80 px-6 py-3 flex items-center justify-between text-xs">
          <span className="text-emerald-400">
            Misi Penjaga Ekosistem • Media Pembelajaran Interaktif IPAS SD
          </span>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
          >
            Tutup Panduan Guru
          </button>
        </div>
      </div>
    </div>
  );
};
