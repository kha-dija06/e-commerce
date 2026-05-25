// import { Mail, Phone, MessageSquare, Send, HelpCircle, ChevronRight } from 'lucide-react';
// import { useTranslation } from 'react-i18next';

// const SupportPage = () => {
//   const { t } = useTranslation();

//   const faqs = [
//     { question: t('support.faq_q1'), answer: t('support.faq_a1') },
//     { question: t('support.faq_q2'), answer: t('support.faq_a2') },
//     { question: t('support.faq_q3'), answer: t('support.faq_a3') },
//   ];

//   return (
//     <div className="max-w-4xl mx-auto space-y-12">
//       <div className="text-center space-y-4">
//         <h1 className="text-4xl font-bold text-gray-900">{t('support.title')}</h1>
//         <p className="text-gray-500 text-lg">{t('support.subtitle')}</p>
//       </div>

//       {/* Quick Contact */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center space-y-3">
//           <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto">
//             <Phone size={24} />
//           </div>
//           <h3 className="font-bold text-gray-900">{t('support.phone')}</h3>
//           <p className="text-sm text-gray-500">+212 5 22 00 00 00</p>
//         </div>
//         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center space-y-3">
//           <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto">
//             <Mail size={24} />
//           </div>
//           <h3 className="font-bold text-gray-900">{t('support.email')}</h3>
//           <p className="text-sm text-gray-500">support@moroccoart.com</p>
//         </div>
//         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center space-y-3">
//           <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mx-auto">
//             <MessageSquare size={24} />
//           </div>
//           <h3 className="font-bold text-gray-900">{t('support.chat')}</h3>
//           <p className="text-sm text-gray-500">{t('support.chat_availability')}</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//         {/* Contact Form */}
//         <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
//           <h2 className="text-2xl font-bold text-gray-900">{t('support.send_message')}</h2>
//           <form className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <label className="text-sm font-bold text-gray-700">{t('support.name_label')}</label>
//                 <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all" placeholder={t('support.name_placeholder')} />
//               </div>
//               <div className="space-y-2">
//                 <label className="text-sm font-bold text-gray-700">{t('support.email_label')}</label>
//                 <input type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all" placeholder={t('support.email_placeholder')} />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-gray-700">{t('support.subject_label')}</label>
//               <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all" placeholder={t('support.subject_placeholder')} />
//             </div>
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-gray-700">{t('support.message_label')}</label>
//               <textarea rows="4" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all" placeholder={t('support.message_placeholder')}></textarea>
//             </div>
//             <button className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2">
//               <Send size={20} />
//               {t('support.send_button')}
//             </button>
//           </form>
//         </div>

//         {/* FAQ */}
//         <div className="space-y-6">
//           <h2 className="text-2xl font-bold text-gray-900">{t('support.faq_title')}</h2>
//           <div className="space-y-4">
//             {faqs.map((faq, index) => (
//               <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-emerald-200 transition-all group cursor-pointer">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-4">
//                     <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
//                       <HelpCircle size={20} />
//                     </div>
//                     <h3 className="font-bold text-gray-900">{faq.question}</h3>
//                   </div>
//                   <ChevronRight size={20} className="text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-all" />
//                 </div>
//                 <p className="mt-4 text-gray-500 text-sm leading-relaxed hidden group-hover:block transition-all">
//                   {faq.answer}
//                 </p>
//               </div>
//             ))}
//           </div>
//           <div className="bg-emerald-600 p-8 rounded-3xl text-white space-y-4 shadow-xl shadow-emerald-600/20">
//             <h3 className="text-xl font-bold">{t('support.immediate_help')}</h3>
//             <p className="text-emerald-100 text-sm">{t('support.immediate_help_text')}</p>
//             <button className="bg-white text-emerald-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-50 transition">
//               {t('support.view_help_center')}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SupportPage;
import { Mail, Phone, MessageSquare, Send, HelpCircle, ChevronRight, Loader2, CheckCircle2, Clock, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const SupportPage = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();

  const [form, setForm]         = useState({ sujet: '', message: '' });
  const [sending, setSending]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState('');
  const [tickets, setTickets]   = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [openFaq, setOpenFaq]   = useState(null);
  const [openTicket, setOpenTicket] = useState(null);

  const faqs = [
    { question: t('support.faq_q1'), answer: t('support.faq_a1') },
    { question: t('support.faq_q2'), answer: t('support.faq_a2') },
    { question: t('support.faq_q3'), answer: t('support.faq_a3') },
  ];

  // Fetch tickets si user connecté
  useEffect(() => {
    if (!isAuthenticated) return;
    setLoadingTickets(true);
    api.get('/support/tickets')
      .then(r => setTickets(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoadingTickets(false));
  }, [isAuthenticated]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.sujet.trim() || !form.message.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setSending(true);
    try {
      const res = await api.post('/support/tickets', form);
      setTickets(prev => [res.data.data, ...prev]);
      setForm({ sujet: '', message: '' });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi');
    } finally {
      setSending(false);
    }
  };

  const getStatutStyle = (statut) => {
    switch (statut) {
      case 'ouvert':    return 'bg-blue-100 text-blue-700';
      case 'en_cours':  return 'bg-amber-100 text-amber-700';
      case 'resolu':    return 'bg-emerald-100 text-emerald-700';
      case 'ferme':     return 'bg-gray-100 text-gray-600';
      default:          return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case 'ouvert':   return <Clock size={12} />;
      case 'en_cours': return <Clock size={12} />;
      case 'resolu':   return <CheckCircle2 size={12} />;
      case 'ferme':    return <XCircle size={12} />;
      default:         return null;
    }
  };

  const getStatutLabel = (statut) => {
    switch (statut) {
      case 'ouvert':   return 'Ouvert';
      case 'en_cours': return 'En cours';
      case 'resolu':   return 'Résolu';
      case 'ferme':    return 'Fermé';
      default:         return statut;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">

      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">{t('support.title')}</h1>
        <p className="text-gray-500 text-lg">{t('support.subtitle')}</p>
      </div>

      {/* Quick Contact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto">
            <Phone size={24} />
          </div>
          <h3 className="font-bold text-gray-900">{t('support.phone')}</h3>
          <p className="text-sm text-gray-500">+212 5 22 00 00 00</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center space-y-3">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto">
            <Mail size={24} />
          </div>
          <h3 className="font-bold text-gray-900">{t('support.email')}</h3>
          <p className="text-sm text-gray-500">support@moroccoart.com</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center space-y-3">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mx-auto">
            <MessageSquare size={24} />
          </div>
          <h3 className="font-bold text-gray-900">{t('support.chat')}</h3>
          <p className="text-sm text-gray-500">{t('support.chat_availability')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('support.send_message')}</h2>

          {/* Success message */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center gap-3 text-sm font-medium"
              >
                <CheckCircle2 size={20} />
                Votre message a été envoyé avec succès !
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom + Email — readonly si connecté */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">{t('support.name_label')}</label>
                <input
                  type="text"
                  value={user?.name || ''}
                  readOnly={!!user}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  placeholder={t('support.name_placeholder')}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">{t('support.email_label')}</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly={!!user}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  placeholder={t('support.email_placeholder')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">{t('support.subject_label')}</label>
              <input
                type="text"
                name="sujet"
                value={form.sujet}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder={t('support.subject_placeholder')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">{t('support.message_label')}</label>
              <textarea
                rows="4"
                name="message"
                value={form.message}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
                placeholder={t('support.message_placeholder')}
              />
            </div>

            <button
              type="submit"
              disabled={sending || !isAuthenticated}
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:bg-emerald-400"
            >
              {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              {sending ? 'Envoi...' : t('support.send_button')}
            </button>

            {!isAuthenticated && (
              <p className="text-center text-xs text-gray-400">
                Connectez-vous pour envoyer un message
              </p>
            )}
          </form>
        </div>

        {/* FAQ */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('support.faq_title')}</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-emerald-200 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                      <HelpCircle size={20} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm">{faq.question}</h3>
                  </div>
                  {openFaq === index
                    ? <ChevronUp size={18} className="text-emerald-600 shrink-0" />
                    : <ChevronRight size={18} className="text-gray-400 shrink-0" />
                  }
                </div>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 text-gray-500 text-sm leading-relaxed overflow-hidden"
                    >
                      {faq.answer}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          
            {/* <p className="text-emerald-100 text-sm">{t('support.immediate_help_text')}</p> */} 
            {/* <button className="bg-white text-emerald-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-50 transition">
              {t('support.view_help_center')}
            </button> */}
          {/* Mes tickets — visible si connecté */}
      {isAuthenticated && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Mes tickets</h2>

          {loadingTickets ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-emerald-600" size={30} />
            </div>
          ) : tickets.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <MessageSquare size={40} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Aucun ticket pour le moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => setOpenTicket(openTicket === ticket.id ? null : ticket.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-gray-50 rounded-xl">
                        <MessageSquare size={20} className="text-gray-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-gray-900 text-sm">{ticket.sujet}</p>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatutStyle(ticket.statut)}`}>
                            {getStatutIcon(ticket.statut)}
                            {getStatutLabel(ticket.statut)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{formatDate(ticket.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {ticket.reponses?.length > 0 && (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {ticket.reponses.length} réponse{ticket.reponses.length > 1 ? 's' : ''}
                        </span>
                      )}
                      {openTicket === ticket.id
                        ? <ChevronUp size={18} className="text-gray-400" />
                        : <ChevronDown size={18} className="text-gray-400" />
                      }
                    </div>
                  </div>

                  <AnimatePresence>
                    {openTicket === ticket.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 space-y-3 border-t border-gray-50 pt-4">
                          {/* Message original */}
                          <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs font-bold text-gray-400 mb-1">Votre message</p>
                            <p className="text-sm text-gray-700">{ticket.message}</p>
                          </div>

                          {/* Réponses admin */}
                          {ticket.reponses?.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs font-bold text-gray-400">Réponses</p>
                              {ticket.reponses.map((rep) => (
                                <div key={rep.id} className="bg-emerald-50 rounded-xl p-4 border-l-4 border-emerald-400">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className="text-xs font-bold text-emerald-700">{rep.auteur || 'Support'}</p>
                                    <p className="text-[10px] text-gray-400">{formatDate(rep.date)}</p>
                                  </div>
                                  <p className="text-sm text-gray-700">{rep.message}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {ticket.reponses?.length === 0 && (
                            <p className="text-xs text-gray-400 text-center py-2">
                              En attente de réponse...
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
        </div>
        
      </div>

    
    </div>
  );
};

export default SupportPage;
