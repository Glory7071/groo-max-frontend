import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function OwnerPanel() {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | profile | bookings | services | slots | earnings | home-service

  // Point 15: Owner Salon Profile State
  const [salonDetails, setSalonDetails] = useState({
    name: 'Glitz & Glamour Studio',
    category: 'Unisex',
    area: 'Gomti Nagar',
    address: 'Near Patrakar Puram, Gomti Nagar, Lucknow',
    phone: '9876543210',
    openingHours: '09:00 AM - 09:00 PM',
    workingDays: 'Monday - Saturday',
    approvalStatus: 'Approved', // Pending | Approved | Rejected (Point 14 Spec)
    isOpen: true
  });

  // Point 16: Owner Services State
  const [services, setServices] = useState([
    { id: 's1', name: 'Haircut & Hair Styling', price: 350, duration: '30 mins', active: true },
    { id: 's2', name: 'Beard Grooming & Shape', price: 150, duration: '20 mins', active: true },
    { id: 's3', name: 'Facial Glow Care', price: 799, duration: '45 mins', active: true },
  ]);

  // Point 18: Owner Bookings State
  const [bookings, setBookings] = useState([
    { id: 'BK-101', customerName: 'Rahul Verma', service: 'Haircut & Hair Styling', slot: '11:30 AM', date: '2026-10-10', status: 'Pending', phone: '9876543210', total: 350, visitType: 'Salon Visit' },
    { id: 'BK-102', customerName: 'Priya Sharma', service: 'Facial Glow Care', slot: '02:00 PM', date: '2026-10-10', status: 'Confirmed', phone: '9123456789', total: 799, visitType: 'Home Service' },
    { id: 'BK-103', customerName: 'Amit Singh', service: 'Beard Grooming & Shape', slot: '05:00 PM', date: '2026-10-09', status: 'Completed', phone: '9456123789', total: 150, visitType: 'Salon Visit' }
  ]);

  // Point 17: Availability Slots State
  const [slots, setSlots] = useState([
    { time: '10:00 AM', active: true },
    { time: '11:30 AM', active: true },
    { time: '02:00 PM', active: true },
    { time: '04:30 PM', active: false },
    { time: '06:00 PM', active: true },
  ]);

  // Point 19: Home Service Settings State
  const [homeService, setHomeService] = useState({
    enabled: true,
    charge: 150,
    areas: ['Gomti Nagar', 'Hazratganj', 'Alambagh']
  });

  // Filter States
  const [bookingFilter, setBookingFilter] = useState('All');
  const [newService, setNewService] = useState({ name: '', price: '', duration: '' });
  const [editProfileMode, setEditProfileMode] = useState(false);

  // Actions
  const handleAddService = (e) => {
    e.preventDefault();
    if (!newService.name || !newService.price) return;
    setServices([...services, { id: `s${Date.now()}`, ...newService, price: Number(newService.price), active: true }]);
    setNewService({ name: '', price: '', duration: '' });
  };

  const toggleServiceActive = (id) => {
    setServices(services.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const deleteService = (id) => {
    if (window.confirm('Delete this service permanently?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const updateBookingStatus = (id, newStatus) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  const toggleSlot = (index) => {
    const updated = [...slots];
    updated[index].active = !updated[index].active;
    setSlots(updated);
  };

  const filteredBookings = bookings.filter(b => bookingFilter === 'All' ? true : b.status === bookingFilter);

  // Point 20: Earnings Calculations
  const completedBookings = bookings.filter(b => b.status === 'Completed' || b.status === 'Confirmed');
  const grossEarnings = completedBookings.reduce((sum, b) => sum + b.total, 0);
  const platformCommission = Math.round(grossEarnings * 0.10); // 10% Platform Deduction
  const netSettlement = grossEarnings - platformCommission;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="max-w-7xl mx-auto p-4 md:p-8">
          
          {/* Section 14: Salon Banner & Approval Status Badge */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl font-black text-amber-400">{salonDetails.name}</h1>
                
                {/* Approval Status Badge (Point 14) */}
                <span className={`text-[10px] px-3 py-1 rounded-full font-bold border ${
                  salonDetails.approvalStatus === 'Approved' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                  salonDetails.approvalStatus === 'Pending' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                  'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}>
                  <i className="fa-solid fa-shield-halved mr-1"></i> ADMIN STATUS: {salonDetails.approvalStatus.toUpperCase()}
                </span>

                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${
                  salonDetails.isOpen ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}>
                  {salonDetails.isOpen ? 'SHOP ONLINE' : 'SHOP CLOSED'}
                </span>
              </div>
              <p className="text-xs text-slate-400"><i className="fa-solid fa-location-dot text-amber-400 mr-1"></i> {salonDetails.address}</p>
            </div>

            <button 
              onClick={() => setSalonDetails({ ...salonDetails, isOpen: !salonDetails.isOpen })}
              className="text-xs bg-slate-950 border border-slate-800 hover:border-amber-500/40 px-4 py-2.5 rounded-xl text-slate-200 transition font-semibold cursor-pointer"
            >
              Toggle Shop Online/Offline
            </button>
          </div>

          {/* Section 14 to 20 Navigation Tabs */}
          <div className="bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800 flex flex-wrap gap-2 mb-8">
            {[
              { id: 'dashboard', label: 'Overview', icon: 'fa-chart-pie' },
              { id: 'bookings', label: 'Bookings Management', icon: 'fa-calendar-check' },
              { id: 'services', label: 'Services & Menu', icon: 'fa-list-check' },
              { id: 'slots', label: 'Slot Availability', icon: 'fa-clock' },
              { id: 'profile', label: 'Salon Profile', icon: 'fa-store' },
              { id: 'earnings', label: 'Earnings & Payouts', icon: 'fa-wallet' },
              { id: 'home-service', label: 'Home Visit Settings', icon: 'fa-house-user' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[130px] py-2.5 px-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === tab.id ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <i className={`fa-solid ${tab.icon}`}></i> {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW DASHBOARD (Point 14) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
                  <p className="text-xs text-slate-400 mb-1">Today's Bookings</p>
                  <p className="text-2xl font-black text-amber-400">{bookings.length}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
                  <p className="text-xs text-slate-400 mb-1">Pending Requests</p>
                  <p className="text-2xl font-black text-amber-400">{bookings.filter(b => b.status === 'Pending').length}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
                  <p className="text-xs text-slate-400 mb-1">Active Services</p>
                  <p className="text-2xl font-black text-indigo-400">{services.filter(s => s.active).length}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
                  <p className="text-xs text-slate-400 mb-1">Net Earnings</p>
                  <p className="text-2xl font-black text-emerald-400">₹{netSettlement}</p>
                </div>
              </div>

              {/* Quick Actions (Point 14 Spec) */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                <h3 className="font-bold text-slate-100 text-sm mb-4">Quick Owner Shortcuts</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button onClick={() => setActiveTab('bookings')} className="p-3 bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-2xl text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 cursor-pointer">
                    <i className="fa-solid fa-calendar text-amber-400"></i> Manage Bookings
                  </button>
                  <button onClick={() => setActiveTab('services')} className="p-3 bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-2xl text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 cursor-pointer">
                    <i className="fa-solid fa-plus text-amber-400"></i> Add New Service
                  </button>
                  <button onClick={() => setActiveTab('profile')} className="p-3 bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-2xl text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 cursor-pointer">
                    <i className="fa-solid fa-pen text-amber-400"></i> Edit Salon Info
                  </button>
                  <button onClick={() => setActiveTab('home-service')} className="p-3 bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-2xl text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 cursor-pointer">
                    <i className="fa-solid fa-house-user text-amber-400"></i> Home Service Charges
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BOOKINGS MANAGEMENT (Point 18) */}
          {activeTab === 'bookings' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <i className="fa-solid fa-calendar-check text-amber-400"></i> Appointment Bookings
                </h3>

                {/* Filters (Point 18 Spec) */}
                <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  {['All', 'Pending', 'Confirmed', 'Completed', 'Rejected'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setBookingFilter(status)}
                      className={`px-3 py-1.5 font-bold rounded-lg transition cursor-pointer ${
                        bookingFilter === status ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredBookings.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">No bookings in "{bookingFilter}" category.</p>
                ) : (
                  filteredBookings.map((b) => (
                    <div key={b.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-100 text-sm">{b.customerName}</span>
                          <span className="text-xs bg-slate-900 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-md font-mono">
                            {b.slot} ({b.date})
                          </span>
                          <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                            {b.visitType}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{b.service} • ₹{b.total} • Phone: {b.phone}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {b.status === 'Pending' && (
                          <>
                            <button onClick={() => updateBookingStatus(b.id, 'Confirmed')} className="px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold hover:bg-emerald-500/30 cursor-pointer">Accept</button>
                            <button onClick={() => updateBookingStatus(b.id, 'Rejected')} className="px-4 py-2 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold hover:bg-rose-500/30 cursor-pointer">Reject</button>
                          </>
                        )}
                        {b.status === 'Confirmed' && (
                          <button onClick={() => updateBookingStatus(b.id, 'Completed')} className="px-4 py-2 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl text-xs font-bold hover:bg-indigo-500/30 cursor-pointer">
                            Mark Service Completed
                          </button>
                        )}
                        {(b.status === 'Completed' || b.status === 'Rejected') && (
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-xl ${b.status === 'Completed' ? 'text-indigo-400 bg-indigo-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                            {b.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SERVICES & PRICING MENU (Point 16) */}
          {activeTab === 'services' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <h3 className="text-md font-bold text-amber-400 mb-4">Add New Service</h3>
                <form onSubmit={handleAddService} className="space-y-3">
                  <input type="text" placeholder="Service Name" value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500" />
                  <input type="number" placeholder="Price (₹)" value={newService.price} onChange={(e) => setNewService({ ...newService, price: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500" />
                  <input type="text" placeholder="Duration (e.g. 30 mins)" value={newService.duration} onChange={(e) => setNewService({ ...newService, duration: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500" />
                  <button type="submit" className="w-full bg-amber-500 text-slate-950 font-bold py-2.5 rounded-xl hover:bg-amber-400 text-xs cursor-pointer">Add Service</button>
                </form>
              </div>

              <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <h3 className="text-md font-bold text-slate-100 mb-4">Active Services Menu ({services.length})</h3>
                <div className="space-y-2">
                  {services.map((s) => (
                    <div key={s.id} className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-200">{s.name}</p>
                          <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${s.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                            {s.active ? 'ACTIVE' : 'DISABLED'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500">{s.duration}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-amber-400">₹{s.price}</span>
                        
                        {/* Point 16 Actions */}
                        <button onClick={() => toggleServiceActive(s.id)} className="text-xs text-slate-400 hover:text-amber-400 cursor-pointer">
                          <i className={`fa-solid ${s.active ? 'fa-toggle-on text-amber-400' : 'fa-toggle-off'}`}></i>
                        </button>
                        <button onClick={() => deleteService(s.id)} className="text-xs text-rose-400 hover:text-rose-300 cursor-pointer">
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AVAILABILITY & SLOTS (Point 17) */}
          {activeTab === 'slots' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl">
              <h3 className="text-md font-bold text-slate-100 mb-2">Daily Time Slots Control</h3>
              <p className="text-xs text-slate-400 mb-6">Click slots to toggle available vs booked/closed slots.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {slots.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleSlot(idx)}
                    className={`p-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      s.active ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-600 line-through'
                    }`}
                  >
                    {s.time} {s.active ? '(Active)' : '(Closed)'}
                  </button>
                ))}
              </div>

              <div className="border-t border-slate-800 pt-4 text-xs text-slate-400 space-y-2">
                <p><strong>Operating Days:</strong> {salonDetails.workingDays}</p>
                <p><strong>Operating Hours:</strong> {salonDetails.openingHours}</p>
              </div>
            </div>
          )}

          {/* TAB 5: SALON PROFILE EDIT (Point 15) */}
          {activeTab === 'profile' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl">
              <h3 className="text-lg font-bold text-amber-400 mb-4">Edit Salon Details & Profile</h3>
              <form onSubmit={(e) => { e.preventDefault(); alert('Salon details updated successfully!'); setEditProfileMode(false); }} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Salon Name</label>
                  <input type="text" value={salonDetails.name} onChange={(e) => setSalonDetails({ ...salonDetails, name: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Lucknow Area / Zone</label>
                  <input type="text" value={salonDetails.area} onChange={(e) => setSalonDetails({ ...salonDetails, area: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Full Shop Address</label>
                  <input type="text" value={salonDetails.address} onChange={(e) => setSalonDetails({ ...salonDetails, address: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Opening Hours</label>
                    <input type="text" value={salonDetails.openingHours} onChange={(e) => setSalonDetails({ ...salonDetails, openingHours: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Working Days</label>
                    <input type="text" value={salonDetails.workingDays} onChange={(e) => setSalonDetails({ ...salonDetails, workingDays: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-amber-500 text-slate-950 font-bold py-3 rounded-xl hover:bg-amber-400 text-xs cursor-pointer">
                  Save Salon Profile Changes
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: EARNINGS & SETTLEMENTS (Point 20) */}
          {activeTab === 'earnings' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                  <p className="text-xs text-slate-400 mb-1">Gross Booking Revenue</p>
                  <p className="text-3xl font-black text-amber-400">₹{grossEarnings}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                  <p className="text-xs text-slate-400 mb-1">Platform Fee Deduction (10%)</p>
                  <p className="text-3xl font-black text-rose-400">-₹{platformCommission}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                  <p className="text-xs text-slate-400 mb-1">Net Payable Settlement</p>
                  <p className="text-3xl font-black text-emerald-400">₹{netSettlement}</p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                <h4 className="font-bold text-slate-100 text-sm mb-3">Settlement Rules & Information</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Weekly payouts are transferred directly to your registered bank account every Monday. Settlements are subject to backend verification of completed appointments.
                </p>
              </div>
            </div>
          )}

          {/* TAB 7: HOME SERVICE SETTINGS (Point 19) */}
          {activeTab === 'home-service' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg space-y-6">
              <div>
                <h3 className="text-md font-bold text-slate-100 mb-1">Doorstep Home Visit Settings</h3>
                <p className="text-xs text-slate-400">Configure charges and active areas for Lucknow home visits.</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-xs font-bold text-slate-200">Allow Home Service Visits</span>
                <button 
                  onClick={() => setHomeService({ ...homeService, enabled: !homeService.enabled })}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer ${
                    homeService.enabled ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {homeService.enabled ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Travel / Convenience Charge (₹)</label>
                <input 
                  type="number" 
                  value={homeService.charge} 
                  onChange={(e) => setHomeService({ ...homeService, charge: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500" 
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-2">Service Eligible Lucknow Areas</label>
                <div className="flex flex-wrap gap-2">
                  {homeService.areas.map(a => (
                    <span key={a} className="text-xs bg-slate-950 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-xl">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}