
import React, { useState, useEffect } from 'react';
import { AppStep, UserProfile, Service, Handyman, Booking } from './types';
import { SERVICES, MOCK_HANDYMEN } from './constants';
import { diagnoseHomeProblem } from './services/geminiService';

// --- Mock Admin Data ---
const MOCK_BOOKINGS: Booking[] = [
  { id: 'B1', serviceName: 'Plumbing', customerName: 'Moustapha Elhelisy', handymanName: 'Alex Johnson', date: 'July 3, 2024', status: 'Accepted', price: 150 },
  { id: 'B2', serviceName: 'Electrical', customerName: 'Sarah Ahmed', handymanName: 'Marcus Bell', date: 'July 4, 2024', status: 'Pending', price: 80 },
  { id: 'B3', serviceName: 'Painting', customerName: 'John Doe', handymanName: 'Sarah Chen', date: 'July 5, 2024', status: 'Completed', price: 300 },
];

// --- Sub-components ---

const DashboardHeader: React.FC<{ user?: UserProfile; onAdminToggle: () => void }> = ({ user, onAdminToggle }) => (
  <div className="bg-[#6366f1] pt-12 pb-6 px-4 rounded-b-[40px] shadow-lg">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="relative cursor-pointer" onClick={onAdminToggle}>
          <img 
            src={user?.avatar || "https://picsum.photos/seed/moustapha/100"} 
            alt="User" 
            className="w-12 h-12 rounded-full border-2 border-white/50"
          />
          <div className="absolute -bottom-1 -right-1 bg-yellow-400 w-4 h-4 rounded-full border-2 border-[#6366f1] flex items-center justify-center">
            <i className="fa-solid fa-crown text-[8px] text-indigo-900"></i>
          </div>
        </div>
        <div className="text-white">
          <h2 className="text-lg font-bold leading-none">{user?.firstName || 'Moustapha'} {user?.lastName || 'Elhelisy'}</h2>
          <div className="flex flex-col gap-0.5 mt-1.5">
            <p className="text-[10px] opacity-90 flex items-center gap-1">
              <i className="fa-solid fa-location-dot"></i>
              {user?.address || 'Antar street, Tanta Qusm...'}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onAdminToggle} className="bg-white/20 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold border border-white/10 hover:bg-white/30 transition-colors">
          ADMIN PANEL
        </button>
        <div className="relative">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white">
            <i className="fa-solid fa-bell"></i>
          </div>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-[#6366f1]">5</span>
        </div>
      </div>
    </div>
    
    <div className="relative mb-2">
      <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
      <input 
        type="text" 
        placeholder="Search here..." 
        className="w-full bg-white py-3 pl-12 pr-4 rounded-xl text-sm outline-none shadow-inner text-gray-900"
      />
    </div>
  </div>
);

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.LOGIN);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [user, setUser] = useState<UserProfile | undefined>(undefined);
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // --- Functions ---
  const handleLogin = () => { if (phone.length >= 10) setStep(AppStep.OTP); };
  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };
  const handleVerifyOtp = () => { if (otp.every(val => val !== '')) setStep(AppStep.SIGNUP); };
  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    if (firstName && lastName) {
      setUser({ firstName, lastName, phone, address: 'Antar street, Tanta Qusm', role: 'admin' });
      setStep(AppStep.HOME);
    }
  };
  const handleAIAssist = async (problem: string) => {
    if (!problem.trim()) return;
    setIsDiagnosing(true);
    const result = await diagnoseHomeProblem(problem);
    setDiagnosisResult(result);
    setIsDiagnosing(false);
  };

  // --- Step Rendering ---

  const renderLogin = () => (
    <div className="min-h-screen flex flex-col bg-white p-8 items-center justify-center">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-indigo-600 tracking-tighter">dianji</h1>
        <p className="text-gray-400 font-semibold">Home Services Control Center</p>
      </div>
      <div className="w-full max-w-sm space-y-6">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-600 border-r pr-3 font-bold"><span>+20</span></div>
          <input type="tel" placeholder="MOBILE NUMBER" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-20 pr-12 py-4 bg-indigo-50/50 rounded-xl border border-transparent focus:border-indigo-300 focus:bg-white text-lg font-bold outline-none text-gray-900" />
        </div>
        <button onClick={handleLogin} disabled={phone.length < 10} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg disabled:opacity-50">LOGIN</button>
      </div>
    </div>
  );

  const renderOtp = () => (
    <div className="min-h-screen flex flex-col bg-white p-8 items-center justify-center">
      <h2 className="text-3xl font-black text-indigo-600 mb-2">Verification</h2>
      <p className="text-gray-500 mb-8 text-center">Sent to <span className="font-bold text-gray-900">+20 {phone}</span></p>
      <div className="flex gap-2 mb-10">
        {otp.map((digit, idx) => (
          <input key={idx} id={`otp-${idx}`} type="text" maxLength={1} value={digit} onChange={(e) => handleOtpChange(idx, e.target.value)} className="w-12 h-14 bg-indigo-50 border-2 border-transparent focus:border-indigo-400 focus:bg-white rounded-xl text-center text-2xl font-bold text-indigo-900 outline-none" />
        ))}
      </div>
      <button onClick={handleVerifyOtp} className="w-full max-w-sm py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg">CONFIRM</button>
    </div>
  );

  const renderSignup = () => (
    <div className="min-h-screen flex flex-col bg-white p-8 items-center pt-20">
      <div className="w-28 h-28 bg-[#7c7fd8] rounded-full flex items-center justify-center text-white text-5xl mb-6"><i className="fa-solid fa-user"></i></div>
      <h2 className="text-2xl font-black text-gray-900 mb-1">Hello User !</h2>
      <p className="text-gray-500 mb-12">Signup For Better Experience</p>
      <form onSubmit={handleSignup} className="w-full max-w-sm flex flex-col gap-4">
        <input name="firstName" placeholder="First Name" required className="w-full px-5 py-4 bg-[#f8f9fb] rounded-xl outline-none font-medium text-gray-900" />
        <input name="lastName" placeholder="Last Name" required className="w-full px-5 py-4 bg-[#f8f9fb] rounded-xl outline-none font-medium text-gray-900" />
        <button type="submit" className="w-full py-4 bg-[#6e71d4] text-white rounded-2xl font-bold mt-6 shadow-lg uppercase">SIGNUP</button>
      </form>
    </div>
  );

  const renderHome = () => (
    <div className="min-h-screen bg-[#fcfcfc] pb-24">
      <DashboardHeader user={user} onAdminToggle={() => setStep(AppStep.ADMIN_DASHBOARD)} />
      <main className="px-4 space-y-8 mt-6">
        <div onClick={() => setStep(AppStep.AI_DIAGNOSIS)} className="bg-indigo-600 p-6 rounded-3xl text-white flex items-center justify-between cursor-pointer shadow-xl relative overflow-hidden">
          <div className="z-10">
            <h3 className="text-xl font-bold">Smart AI Repair Assistant</h3>
            <p className="text-indigo-100 text-sm mt-1">Diagnose home issues in seconds</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl z-10"><i className="fa-solid fa-wand-magic-sparkles"></i></div>
          <i className="fa-solid fa-robot absolute -right-4 -bottom-4 text-7xl text-indigo-400/20 rotate-12"></i>
        </div>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Popular Categories</h3>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
            {SERVICES.map(cat => (
              <div key={cat.id} onClick={() => { setSelectedService(cat); setStep(AppStep.SERVICE_DETAILS); }} className="flex flex-col items-center gap-2 min-w-[70px] cursor-pointer group">
                <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                   <i className={`fa-solid ${cat.icon}`}></i>
                </div>
                <span className="text-[10px] font-semibold text-gray-600">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Categories Sections from previous design */}
        {[{ title: 'Finish Your Home', items: ['Electricity', 'plumper'] }, { title: 'Cleaning Your Home', items: ['Deep Cleaning', 'Stairs Clean'] }].map(group => (
          <section key={group.title}>
            <h3 className="font-bold text-gray-800 mb-4">{group.title}</h3>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {group.items.map(item => (
                <div key={item} className="space-y-2 min-w-[160px]">
                   <div className="h-32 rounded-2xl overflow-hidden shadow-sm border border-gray-50">
                      <img src={`https://picsum.photos/seed/${item}/300/200`} className="w-full h-full object-cover" alt={item} />
                   </div>
                   <span className="text-xs font-bold text-gray-700 block text-center">{item}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md p-4 flex flex-col items-center shadow-lg z-50">
        <button className="w-full max-w-sm py-3 bg-[#6e71d4] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
           <i className="fa-solid fa-plus"></i> New Request
        </button>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Admin Sidebar/Topnav */}
      <nav className="bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center text-xl shadow-lg">
            <i className="fa-solid fa-gear"></i>
          </div>
          <div>
            <h1 className="text-lg font-black leading-none">DIANJI ADMIN</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Management Panel</p>
          </div>
        </div>
        <button onClick={() => setStep(AppStep.HOME)} className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2">
          <i className="fa-solid fa-arrow-right-from-bracket"></i> User Mode
        </button>
      </nav>

      <main className="p-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Bookings', value: '1,284', icon: 'fa-calendar-check', color: 'text-indigo-500', bg: 'bg-indigo-50' },
            { label: 'Net Revenue', value: '$42,500', icon: 'fa-dollar-sign', color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { label: 'Active Pros', value: '48', icon: 'fa-user-check', color: 'text-orange-500', bg: 'bg-orange-50' },
            { label: 'AI Diagnosis', value: '3,102', icon: 'fa-robot', color: 'text-purple-500', bg: 'bg-purple-50' },
          ].map(stat => (
            <div key={stat.label} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
              <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center text-lg`}><i className={`fa-solid ${stat.icon}`}></i></div>
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase">{stat.label}</p>
                <p className="text-xl font-black text-slate-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bookings Management */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Recent Bookings</h3>
            <div className="flex gap-2">
              <button className="text-xs bg-slate-100 px-3 py-1 rounded-lg font-bold text-slate-600">Export CSV</button>
              <button className="text-xs bg-indigo-50 px-3 py-1 rounded-lg font-bold text-indigo-600">Refresh</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Booking ID</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {MOCK_BOOKINGS.map(booking => (
                  <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-indigo-600">#{booking.id}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 px-2 py-1 rounded-md text-[10px] font-bold">{booking.serviceName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{booking.customerName}</span>
                        <span className="text-[10px] text-slate-400">{booking.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">${booking.price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        booking.status === 'Accepted' ? 'bg-emerald-100 text-emerald-600' : 
                        booking.status === 'Pending' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-center"><i className="fa-solid fa-pen"></i></button>
                        <button className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center"><i className="fa-solid fa-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-slate-50 text-center">
            <button className="text-indigo-600 text-xs font-bold hover:underline">View All Bookings</button>
          </div>
        </div>

        {/* Handyman Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <i className="fa-solid fa-star text-yellow-400"></i> Top Performing Handymen
            </h3>
            <div className="space-y-4">
              {MOCK_HANDYMEN.map(pro => (
                <div key={pro.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                  <div className="flex items-center gap-4">
                    <img src={pro.avatar} className="w-10 h-10 rounded-xl object-cover" alt={pro.name} />
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">{pro.name}</h4>
                      <p className="text-[10px] text-slate-400">{pro.specialties.join(', ')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-indigo-600">{pro.rating} ★</div>
                    <div className="text-[10px] text-slate-400">{pro.reviews} jobs</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
             <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-3xl mb-4">
               <i className="fa-solid fa-plus"></i>
             </div>
             <h3 className="font-bold text-slate-800 text-lg mb-2">Grow Your Network</h3>
             <p className="text-slate-400 text-sm mb-6 max-w-xs">Onboard new specialists to expand service coverage in new areas.</p>
             <button className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100">Invite Handyman</button>
          </div>
        </div>
      </main>
    </div>
  );

  const renderAIDiagnosis = () => {
    const [input, setInput] = useState('');
    return (
      <div className="min-h-screen bg-indigo-50 flex flex-col">
        <div className="p-4 flex items-center gap-3 bg-white shadow-sm">
           <button onClick={() => { setStep(AppStep.HOME); setDiagnosisResult(null); }} className="p-2"><i className="fa-solid fa-arrow-left"></i></button>
           <h2 className="font-bold">Smart AI Diagnose</h2>
        </div>
        <div className="flex-1 p-6 max-w-2xl mx-auto w-full">
          <div className="bg-white rounded-3xl p-6 shadow-xl space-y-6">
            <textarea placeholder="Describe your problem..." value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-32 p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-400 outline-none resize-none font-medium text-gray-900" />
            <button onClick={() => handleAIAssist(input)} disabled={isDiagnosing || !input.trim()} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
              {isDiagnosing ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>} Analyze Problem
            </button>
            {diagnosisResult && (
              <div className="mt-8 space-y-4">
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <h4 className="font-bold text-indigo-900 mb-1 flex items-center gap-2"><i className="fa-solid fa-stethoscope"></i> Diagnosis</h4>
                  <p className="text-indigo-800 text-sm">{diagnosisResult.diagnosis}</p>
                </div>
                <button onClick={() => setStep(AppStep.HOME)} className="w-full py-3 bg-indigo-900 text-white rounded-xl font-bold">Back to Dashboard</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderServiceDetails = () => (
    <div className="min-h-screen bg-white flex flex-col">
       <div className="p-4 flex items-center gap-3 bg-white border-b">
           <button onClick={() => setStep(AppStep.HOME)} className="p-2 text-gray-900"><i className="fa-solid fa-arrow-left"></i></button>
           <h2 className="font-bold text-gray-900">{selectedService?.name}</h2>
        </div>
      {selectedService && (
        <div className="flex-1 overflow-y-auto pb-24">
          <div className={`${selectedService.color} p-12 flex flex-col items-center justify-center text-center`}>
            <div className="w-24 h-24 bg-white/30 backdrop-blur-md rounded-3xl flex items-center justify-center text-4xl mb-4 shadow-xl"><i className={`fa-solid ${selectedService.icon}`}></i></div>
            <h2 className="text-3xl font-black mb-2">{selectedService.name}</h2>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-6 text-gray-900">Choose a Specialist</h3>
            <div className="space-y-4">
              {MOCK_HANDYMEN.map(pro => (
                <div key={pro.id} className="p-4 border rounded-3xl hover:border-indigo-400 transition-colors group">
                  <div className="flex items-start gap-4 mb-4">
                    <img src={pro.avatar} alt={pro.name} className="w-14 h-14 rounded-2xl object-cover" />
                    <div className="flex-1 text-gray-900">
                      <div className="flex justify-between"><h4 className="font-bold text-lg">{pro.name}</h4><span className="text-indigo-600 font-bold">$35/hr</span></div>
                      <div className="flex items-center gap-1 text-yellow-500 text-sm"><i className="fa-solid fa-star"></i> {pro.rating}</div>
                    </div>
                  </div>
                  <button onClick={() => setStep(AppStep.BOOKING_CONFIRMED)} className="w-full py-3 bg-indigo-600 text-white rounded-2xl font-bold">Book Now</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderBookingConfirmed = () => (
    <div className="min-h-screen bg-indigo-600 flex flex-col items-center justify-center p-8 text-center text-white">
      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-indigo-600 text-5xl mb-8 animate-bounce"><i className="fa-solid fa-check"></i></div>
      <h2 className="text-4xl font-black mb-4">Request Sent!</h2>
      <button onClick={() => setStep(AppStep.HOME)} className="w-full max-w-sm py-4 bg-white text-indigo-600 rounded-2xl font-black text-lg">BACK TO HOME</button>
    </div>
  );

  switch (step) {
    case AppStep.LOGIN: return renderLogin();
    case AppStep.OTP: return renderOtp();
    case AppStep.SIGNUP: return renderSignup();
    case AppStep.HOME: return renderHome();
    case AppStep.AI_DIAGNOSIS: return renderAIDiagnosis();
    case AppStep.SERVICE_DETAILS: return renderServiceDetails();
    case AppStep.BOOKING_CONFIRMED: return renderBookingConfirmed();
    case AppStep.ADMIN_DASHBOARD: return renderAdminDashboard();
    default: return renderLogin();
  }
};

export default App;
