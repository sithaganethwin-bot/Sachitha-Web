import React from 'react';
import { PageId } from '../../types';
import { useData } from '../../context/DataContext';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Send,
  ShieldCheck,
  Award,
  Clock,
  ArrowRight
} from 'lucide-react';
import { InstagramIcon, FacebookIcon } from '../common/SocialIcons';
import footerClassBg from '../../assets/footer_class_clean.jpg';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { teacherInfo } = useData();

  return (
    <footer className="border-t bg-slate-900 text-slate-300 dark:bg-[#05070a] dark:border-blue-950/70 transition-colors">
      {/* Top Banner CTA */}
      <div className="border-b border-slate-800 dark:border-blue-950/50 bg-gradient-to-r from-blue-900/60 via-slate-900 to-indigo-950/60 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-cyan-300 border border-blue-400/30 mb-3">
              <Award className="w-3.5 h-3.5" /> 2025 / 2026 / 2027 Batch Admissions Open
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
              Master A/L Business Studies & Secure Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">University Rank</span>
            </h3>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Learn strategic management, corporate case studies, and speed paper techniques with {teacherInfo.name}.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${teacherInfo.contact.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Sir,%20I%20would%20like%20to%20inquire%20about%20Business%20Studies%20Batches`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-all duration-200 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <span>Connect on WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Columns with Classroom Celebration Photographic Background */}
      <div className="relative overflow-hidden border-t border-slate-800/80 dark:border-blue-950/60">
        {/* Background photo & calibrated dark contrast scrims */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
          <img
            src={footerClassBg}
            alt="Sachitha Sir with 2026 A/L Business Studies batch"
            className="w-full h-full object-cover object-[center_68%] filter brightness-[0.78] contrast-[1.08] saturate-[0.92] transition-transform duration-1000 scale-[1.02]"
            loading="lazy"
          />
          {/* Primary dark gradient overlay keeping typography crisp and legible */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#080d1a]/88 via-[#060913]/78 to-[#03050a]/92" />
          {/* Radial spotlight focusing on the students celebrating in the center */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 95% 85% at 50% 52%, rgba(6, 10, 22, 0.28) 0%, rgba(4, 6, 14, 0.78) 75%, rgba(2, 4, 8, 0.94) 100%)'
            }}
          />
          {/* Soft brand indigo/cyan hue tint */}
          <div className="absolute inset-0 bg-indigo-950/20 mix-blend-color" />
        </div>

        {/* Main Footer Columns Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Col 1: Brand & Bio */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl text-white font-['Space_Grotesk'] tracking-tight">
                    SACHITHA<span className="text-cyan-400"> SANKALPA</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full border border-white/10 bg-white/5 text-slate-300">
                    A/L BS
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                Sri Lanka's premier class for G.C.E. A/L Business Studies (English & Sinhala Mediums), led by Sachitha Sankalpa (B.Sc. Business Admin Sp. USJ, Reading for M.Sc. HRM UOC).
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a
                  href={teacherInfo.contact.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 hover:bg-pink-600 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
                  title="Instagram @business_studies_with_sachitha"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href={teacherInfo.contact.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
                  title="Facebook @sachithasankalpaSL"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
                <a
                  href={teacherInfo.contact.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 hover:bg-blue-500 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
                  title="Telegram Group"
                >
                  <Send className="w-4 h-4" />
                </a>
                <a
                  href={teacherInfo.contact.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
                  title="YouTube Channel"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h4 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-blue-400" />
                Navigation
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <button
                    onClick={() => onNavigate('home')}
                    className="text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    Home & Mind Maps
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('schedule')}
                    className="text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    Class Schedule & Centers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('materials')}
                    className="text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    Unit-by-Unit Study Materials
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('about')}
                    className="text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    About Sachitha Sankalpa
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('admin')}
                    className="text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer text-xs flex items-center gap-1 mt-1 opacity-70 hover:opacity-100"
                  >
                    <span>Teacher / Admin Portal</span>
                    <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">CMS</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Physical & Online Halls */}
            <div>
              <h4 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                Lecture Centers
              </h4>
              <div className="space-y-3 text-xs">
                {teacherInfo.contact.halls.map((hall, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/60 backdrop-blur-md border border-slate-700/60 hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all shadow-md shadow-black/20">
                    <div className="font-semibold text-slate-100">{hall.name} - {hall.city}</div>
                    <div className="text-slate-400 mt-0.5 text-[11px]">{hall.address}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Col 4: Contact & Support */}
            <div>
              <h4 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-400" />
                Student Helpline
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                  <a href={`tel:${teacherInfo.contact.hotline.replace(/\s+/g, '')}`} className="text-slate-200 hover:text-white transition-colors">
                    {teacherInfo.contact.hotline}
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <a href={`mailto:${teacherInfo.contact.email}`} className="text-slate-200 hover:text-white transition-colors">
                    {teacherInfo.contact.email}
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-slate-300">Mon - Sun: 7:30 AM - 9:00 PM</span>
                </li>
                <li className="flex items-center gap-2.5 pt-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-xs text-slate-400">
                    Official NIE & Department of Examinations A/L Business Studies Syllabus aligned.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom copyright line */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 dark:border-blue-950/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>© 2026 BS with Sachitha. All rights reserved.</p>
            <p className="text-slate-400 text-center sm:text-right">
              Powered by <span className="font-medium text-slate-200">Maginationz by Nethwin Perera</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
