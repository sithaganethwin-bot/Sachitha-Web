import React from 'react';
import { useData } from '../../context/DataContext';
import {
  GraduationCap,
  Award,
  BookOpen,
  Users,
  CheckCircle2,
  TrendingUp,
  Briefcase,
  Building,
  Target,
  Quote
} from 'lucide-react';
import { InstagramIcon, FacebookIcon } from '../common/SocialIcons';
import { BorderGlow } from '../common/BorderGlow';

interface AboutViewProps {
  onOpenEnroll: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onOpenEnroll }) => {
  const { teacherInfo } = useData();

  const milestones = [
    {
      year: "2017",
      title: "B.Sc. Business Administration (Special)",
      desc: "Graduated with honors from University of Sri Jayewardenepura (USJ), specializing in Strategic Management and Enterprise Economics."
    },
    {
      year: "2019",
      title: "Launching 'Beyond the Theory'",
      desc: "Revolutionized A/L Commerce education by introducing real-life corporate case studies (Dialog, Hayleys, Brandix) to the BS classroom."
    },
    {
      year: "2021",
      title: "M.Sc. Human Resource Management",
      desc: "Advanced postgraduate research at the University of Colombo (UOC), deepening management science and modern HR practices."
    },
    {
      year: "2023 - Present",
      title: "Islandwide Synchronized Network",
      desc: "Mentoring 3,500+ A/L Commerce students across Sasip (Nugegoda), Rotary (Nugegoda), Texas (Battaramulla), and 25 districts via Zoom Live HD."
    }
  ];

  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80",
      title: "Sasip Institute - Main Hall",
      subtitle: "Weekly Interactive Theory Session with 600+ Students"
    },
    {
      url: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80",
      title: "Commerce Rankers Felicitation",
      subtitle: "Honoring Top District & Island Rankers into Faculty of Management"
    },
    {
      url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80",
      title: "Speed Paper Marking & Model Answers",
      subtitle: "Personalized marking breakdown and essay structure clinics"
    }
  ];

  return (
    <div className="py-12 bg-transparent transition-colors min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Header Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-cyan-400">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Meet Your Mentor • Sachitha Sankalpa</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white font-['Space_Grotesk'] leading-tight">
              Transforming Business Studies from Rote Memory to Real Strategic Leadership
            </h1>

            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {teacherInfo.bio}
            </p>

            {/* Quick credentials grid */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <BorderGlow borderRadius={16} glowRadius={25} edgeSensitivity={20}>
                <div className="p-4 rounded-2xl shadow-sm">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Undergraduate</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                    Univ. of Sri Jayewardenepura
                  </div>
                  <div className="text-xs text-blue-600 dark:text-cyan-400 font-medium">B.Sc. Business Admin (Special)</div>
                </div>
              </BorderGlow>

              <BorderGlow borderRadius={16} glowRadius={25} edgeSensitivity={20}>
                <div className="p-4 rounded-2xl shadow-sm">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Postgraduate</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                    University of Colombo
                  </div>
                  <div className="text-xs text-blue-600 dark:text-cyan-400 font-medium">Reading for M.Sc. in HRM</div>
                </div>
              </BorderGlow>
            </div>

            {/* Social Links Pill */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/business_studies_with_sachitha/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20 text-xs font-bold hover:bg-pink-500/20 transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>@business_studies_with_sachitha</span>
              </a>
              <a
                href="https://www.facebook.com/sachithasankalpaSL/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-bold hover:bg-blue-500/20 transition-colors"
              >
                <FacebookIcon className="w-4 h-4" />
                <span>Sachitha Sankalpa SL</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <BorderGlow borderRadius={24} glowRadius={40} edgeSensitivity={25} className="shadow-2xl">
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-tr from-blue-900 to-indigo-950 p-2 border border-blue-800/60">
                <img
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80"
                  alt={teacherInfo.name}
                  className="w-full h-96 object-cover object-top rounded-2xl"
                />
                <div className="p-6 text-white text-center">
                  <h3 className="text-xl font-bold font-['Space_Grotesk']">{teacherInfo.name} (සචිත සංකල්ප)</h3>
                  <p className="text-xs text-cyan-300 font-medium mt-1">{teacherInfo.title}</p>
                  <p className="text-[11px] text-slate-300 mt-2">Sasip Nugegoda • Rotary Hall • Texas Battaramulla</p>
                </div>
              </div>
            </BorderGlow>
          </div>
        </div>

        {/* Teaching Philosophy & Framework */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white font-['Space_Grotesk']">
              The 'Beyond The Theory' Framework
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              How our students consistently secure 'A' grades and top University of Sri Jayewardenepura & Colombo Commerce admissions
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <BorderGlow borderRadius={20} glowRadius={25} edgeSensitivity={20} className="h-full shadow-sm">
              <div className="p-6 h-full flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 flex items-center justify-center font-bold text-sm mb-4">
                  01
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                  Visual Mind Mapping
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Synthesize multi-page textbook theories into crisp single-page visual flowcharts for effortless recall during exam time.
                </p>
              </div>
            </BorderGlow>

            <BorderGlow borderRadius={20} glowRadius={25} edgeSensitivity={20} className="h-full shadow-sm">
              <div className="p-6 h-full flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-sm mb-4">
                  02
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                  Real Corporate Cases
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Bridge theory with Sri Lankan market giants like Dialog, Hayleys, Brandix, and live Colombo Stock Exchange (CSE) trading.
                </p>
              </div>
            </BorderGlow>

            <BorderGlow borderRadius={20} glowRadius={25} edgeSensitivity={20} className="h-full shadow-sm">
              <div className="p-6 h-full flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm mb-4">
                  03
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                  Speed Paper Drills
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Rigorous 3-hour timed exam simulations that build rapid handwriting speed, precision, and bullet-proof time management.
                </p>
              </div>
            </BorderGlow>

            <BorderGlow borderRadius={20} glowRadius={25} edgeSensitivity={20} className="h-full shadow-sm">
              <div className="p-6 h-full flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm mb-4">
                  04
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                  Marking Scheme Mastery
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Dissect official government marking schemes to master the exact evaluation criteria, keyword weights, and essay structures.
                </p>
              </div>
            </BorderGlow>
          </div>
        </div>

        {/* Lecture Halls & Physical Centers */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white font-['Space_Grotesk']">
              Physical Class Centers & Facilities
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Top-tier auditoriums in Nugegoda & Battaramulla equipped with high-fidelity acoustics and multimedia projection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {galleryImages.map((img, idx) => (
              <div
                key={idx}
                className="group relative rounded-3xl overflow-hidden aspect-4/3 shadow-md border border-slate-200 dark:border-slate-800"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h4 className="font-bold text-base">{img.title}</h4>
                  <p className="text-xs text-slate-300 mt-0.5">{img.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline of Milestones */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white font-['Space_Grotesk']">
              Milestones of Pedagogical Excellence
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {milestones.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white dark:bg-[#0c101a] border border-blue-100 dark:border-blue-950 shadow-sm relative"
              >
                <span className="text-2xl font-black text-blue-600 dark:text-cyan-400 font-['Space_Grotesk'] block mb-2">
                  {item.year}
                </span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Message to Parents & Students Banner */}
        <BorderGlow borderRadius={24} glowRadius={38} edgeSensitivity={22} glowIntensity={1.2} className="shadow-xl">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 text-white flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <Quote className="w-8 h-8 text-cyan-300" />
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="text-xl font-bold font-['Space_Grotesk']">A Message from Sachitha Sankalpa</h3>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                "Business Studies is not merely an exam subject to memorize — it is the blueprint of how the modern world creates wealth, operates enterprises, and drives economic prosperity. In our classes, every concept is experienced through real-world commercial logic, empowering our students to not only score 'A' grades but to lead tomorrow's corporate sphere."
              </p>
              <div className="text-xs font-bold text-cyan-300 pt-1">
                — Sachitha Sankalpa (B.Sc. USJ | M.Sc. UOC Reading)
              </div>
            </div>
            <button
              onClick={onOpenEnroll}
              className="btn-glow px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-colors shrink-0 shadow-lg cursor-pointer"
            >
              Enroll for 2025/2026/2027 Batches
            </button>
          </div>
        </BorderGlow>
      </div>
    </div>
  );
};
