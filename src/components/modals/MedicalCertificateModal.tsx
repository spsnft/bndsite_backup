"use client"
import * as React from "react"
import { X, Send } from "lucide-react"

interface MedicalModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
}

export const MedicalCertificateModal = ({ isOpen, onClose, lang }: MedicalModalProps) => {
  const [name, setName] = React.useState('');
  const [symptom, setSymptom] = React.useState('Insomnia / Sleep Issues');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Hello! I would like to request a Medical Certificate.%0A%0A*Name:* ${name}%0A*Primary Symptom:* ${symptom}%0A%0A(I am ready to provide a photo of my ID/Passport to complete the registration).`;
    const phoneNumber = '66955183783';
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-brand-primary border border-brand-secondary/30 rounded-[2.5rem] p-6 text-brand-light shadow-2xl overflow-hidden z-10 flex flex-col">
        <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 0%, #A88444, transparent 70%)` }} />
        <div className="flex items-center justify-between mb-6 shrink-0 relative z-10">
          <h3 className="text-[14px] font-black uppercase tracking-[0.15em] text-brand-secondary">{lang === 'ru' ? 'Мед. Справка' : 'Medical Certificate'}</h3>
          <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 active:scale-90 rounded-full border border-white/10 transition-all text-brand-light/60 hover:text-brand-light">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
          <p className="text-[11px] uppercase tracking-wider text-brand-light/70 mb-2 font-bold">
            {lang === 'ru' 
              ? 'Обязательно по законам Таиланда. Заполните форму, и мы завершим оформление в WhatsApp.' 
              : 'Required by Thai law. Fill out this form, and we will complete your registration via WhatsApp.'}
          </p>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-brand-light/50 mb-2 font-bold">
              {lang === 'ru' ? 'Имя (как в паспорте)' : 'Full Name (as in Passport)'}
            </label>
            <input 
              type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe"
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-brand-light focus:outline-none focus:border-brand-secondary transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-brand-light/50 mb-2 font-bold">
              {lang === 'ru' ? 'Симптомы' : 'Primary Symptom'}
            </label>
            <select 
              value={symptom} onChange={(e) => setSymptom(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-brand-light focus:outline-none focus:border-brand-secondary appearance-none"
            >
              <option value="Insomnia / Sleep Issues">Insomnia / Sleep Issues</option>
              <option value="Anxiety / Stress">Anxiety / Stress</option>
              <option value="Chronic Pain / Back Pain">Chronic Pain / Back Pain</option>
              <option value="Appetite Loss">Appetite Loss</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button type="submit" className="w-full mt-2 bg-brand-secondary/20 text-brand-secondary border border-brand-secondary/50 font-black tracking-widest uppercase text-[12px] py-4 rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2">
            <Send size={14} /> {lang === 'ru' ? 'Перейти в WhatsApp' : 'Continue in WhatsApp'}
          </button>
        </form>
      </div>
    </div>
  );
};
