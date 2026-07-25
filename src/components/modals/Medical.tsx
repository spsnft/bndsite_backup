"use client"
import * as React from "react"
import { X, ShieldCheck, Gift, FileText, Send, Check } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import { triggerHaptic } from "@/lib/utils"

export const Medical = ({ 
  onClose, 
  style 
}: { 
  onClose: () => void, 
  style?: any 
}) => {
  const [isClosing, setIsClosing] = React.useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = React.useState<string[]>([]);
  const [fullName, setFullName] = React.useState('');
  const [contact, setContact] = React.useState('');
  
  const { lang } = useCart();
  const accentColor = style?.color || '#10B981';

  const handleClose = React.useCallback(() => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  }, [onClose]);

  const toggleSymptom = (id: string) => {
    triggerHaptic('light');
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const symptomsList = [
    { id: 'sleep', ru: 'Бессонница / Сон', en: 'Insomnia / Sleep' },
    { id: 'anxiety', ru: 'Тревожность / Стресс', en: 'Anxiety / Stress' },
    { id: 'pain', ru: 'Боль / Напряжение', en: 'Chronic Pain' },
    { id: 'appetite', ru: 'Потеря аппетита', en: 'Appetite Loss' },
  ];

  const handleSend = () => {
    triggerHaptic('success');
    
    let message = `📋 *ЗАЯВКА НА МЕДИЦИНСКИЙ СЕРТИФИКАТ (PT.33)*\n\n`;
    if (fullName) message += `*Имя:* ${fullName}\n`;
    if (contact) message += `*Контакт:* ${contact}\n`;
    
    if (selectedSymptoms.length > 0) {
      const symTexts = selectedSymptoms.map(id => symptomsList.find(s => s.id === id)?.[lang === 'ru' ? 'ru' : 'en']);
      message += `*Симптомы:* ${symTexts.join(', ')}\n`;
    }
    
    message += `\n_Заявка отправлена с сайта. Требуется бесплатное оформление PT.33._`;

    const whatsappUrl = `https://wa.me/66612345678?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    handleClose();
  };

  return (
    <div className={`fixed inset-0 z-[130] flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      <div className={`relative w-full max-w-lg bg-brand-primary border border-white/10 sm:rounded-[2.5rem] rounded-t-[2.5rem] p-6 pt-8 shadow-2xl flex flex-col max-h-[90vh] transition-transform duration-300 ${isClosing ? 'translate-y-full sm:translate-y-12' : 'translate-y-0'}`}>
        
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full sm:hidden" />

        <button onClick={handleClose} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 active:scale-90 rounded-full border border-white/10 transition-all text-brand-light z-20">
          <X size={18} />
        </button>

        {/* HEADER */}
        <div className="relative z-10 flex flex-col items-center mb-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-secondary/10 border border-brand-secondary/30 flex items-center justify-center text-brand-secondary mb-3">
            <ShieldCheck size={24} />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-brand-light">
            {lang === 'ru' ? 'Медицинский рецепт PT.33' : 'Medical Pass PT.33'}
          </h2>
          <p className="text-xs text-brand-light/60 mt-1 max-w-xs">
            {lang === 'ru' 
              ? 'Официальное врачебное назначение для полной легальности и спокойствия' 
              : 'Official medical prescription for complete legal safety in Thailand'}
          </p>
        </div>

        <div className="overflow-y-auto space-y-5 pr-1 no-scrollbar flex-1">
          
          {/* ADVANTAGES GRID */}
          <div className="grid grid-cols-1 gap-2.5">
            <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-3">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl shrink-0 mt-0.5">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-brand-light tracking-wide">
                  {lang === 'ru' ? '100% Защита и легальность' : '100% Legal Protection'}
                </h4>
                <p className="text-[11px] text-brand-light/60 leading-snug mt-0.5">
                  {lang === 'ru' 
                    ? 'Официальный рецепт от лицензированного врача Минздрава Таиланда.' 
                    : 'Official prescription issued by a licensed Thai medical practitioner.'}
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-brand-secondary/10 border border-brand-secondary/30 rounded-2xl flex items-start gap-3">
              <div className="p-2 bg-brand-secondary/20 text-brand-secondary rounded-xl shrink-0 mt-0.5">
                <Gift size={18} />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-brand-secondary tracking-wide">
                  {lang === 'ru' ? 'Бесплатно для наших клиентов' : '100% Free For Our Clients'}
                </h4>
                <p className="text-[11px] text-brand-light/70 leading-snug mt-0.5">
                  {lang === 'ru' 
                    ? 'Мы полностью оплачиваем консультацию врача и выпуск рецепта за вас.' 
                    : 'We completely cover doctor consultation and prescription issuance fees.'}
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-3">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl shrink-0 mt-0.5">
                <FileText size={18} />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-brand-light tracking-wide">
                  {lang === 'ru' ? 'Цифровой + Физический документ' : 'Digital & Physical Pass'}
                </h4>
                <p className="text-[11px] text-brand-light/60 leading-snug mt-0.5">
                  {lang === 'ru' 
                    ? 'Электронный PDF в телефон сразу, оригинал с печатью врача — курьером.' 
                    : 'Instant digital PDF on your phone, physical paper with doctor stamp via mail.'}
                </p>
              </div>
            </div>
          </div>

          {/* SYMPTOMS SELECTION */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-brand-light/50 block mb-2">
              {lang === 'ru' ? 'Укажите поводы для обращения (опционально)' : 'Select symptoms (optional)'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {symptomsList.map(symptom => {
                const active = selectedSymptoms.includes(symptom.id);
                return (
                  <button
                    key={symptom.id}
                    onClick={() => toggleSymptom(symptom.id)}
                    className={`py-2.5 px-3 rounded-xl border text-[11px] font-bold transition-all flex items-center justify-between text-left ${
                      active 
                        ? 'border-brand-secondary bg-brand-secondary/20 text-brand-secondary' 
                        : 'border-white/10 bg-white/5 text-brand-light/70 hover:text-brand-light'
                    }`}
                  >
                    <span>{lang === 'ru' ? symptom.ru : symptom.en}</span>
                    {active && <Check size={14} className="shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* INPUTS */}
          <div className="space-y-2">
            <input 
              type="text" 
              placeholder={lang === 'ru' ? 'Ваше имя' : 'Your Name'} 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-xs text-brand-light placeholder:text-white/30 focus:outline-none focus:border-brand-secondary transition-colors"
            />
            <input 
              type="text" 
              placeholder={lang === 'ru' ? 'Ваш Telegram / WhatsApp' : 'Your Telegram / WhatsApp'} 
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-xs text-brand-light placeholder:text-white/30 focus:outline-none focus:border-brand-secondary transition-colors"
            />
          </div>

        </div>

        {/* FOOTER CTA */}
        <div className="pt-4 border-t border-white/10 mt-4">
          <button 
            onClick={handleSend}
            className="w-full h-14 bg-brand-secondary text-brand-primary font-black uppercase tracking-widest text-[12px] rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-brand-secondary/90 shadow-xl"
          >
            <Send size={16} />
            {lang === 'ru' ? 'Оформить бесплатно в WhatsApp' : 'Get Free Pass via WhatsApp'}
          </button>
        </div>

      </div>
    </div>
  );
};
