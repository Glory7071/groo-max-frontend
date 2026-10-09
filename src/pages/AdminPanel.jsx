import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

export default function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | salons | users | bookings | reviews

  // Point 22: Salon Management State
  const [salonsList, setSalonsList] = useState([
    { id: '1', name: 'Glitz & Glamour Studio', owner: 'Rahul Verma', area: 'Gomti Nagar', status: 'Approved' },
    { id: '2', name: 'Royal Heritage Cutters', owner: 'Amit Singh', area: 'Hazratganj', status: 'Approved' },
    { id: '3', name: 'Urban Style Barber', owner: 'Vikas Sharma', area: 'Alambagh', status: 'Pending' },
    { id: '4', name: 'Crown Spa & Wellness', owner: 'Priya Gupta', area: 'Indira Nagar', status: 'Pending' }
  ]);

  // Point 23: Users Management State
  const [usersList, setUsersList] = useState([
    { id: 'u1', name: 'Rohit Verma', email: 'rohit@example.com', role: 'Customer', status: 'Active' },
    { id: 'u2', name: 'Neha Singh', email: 'neha@example.com', role: 'Customer', status: 'Active' },
    { id: 'u3', name: 'Rahul Verma', ownerEmail: 'glitz@salon.com', role: 'Salon Owner', status: 'Active' }
  ]);

  // Point 23: Bookings List State
  const [bookingsList] = useState([
    { id: 'BK-101', customer: 'Rohit Verma', salon: 'Glitz & Glamour Studio', total: 350, status: 'Confirmed' },
    { id: 'BK-102', customer: 'Neha Singh', salon: 'Royal Heritage Cutters', total: 400, status: 'Completed' }
  ]);

  // Point 24: Reviews Moderation State
  const [reviewsList, setReviewsList] = useState([
    { id: 'r1', user: 'Rohit Verma', salon: 'Glitz & Glamour Studio', rating: 5, comment: 'Amazing service and ambience!', status: 'Visible' },
    { id: 'r2', user: 'Neha Singh', salon: 'Royal Heritage Cutters', rating: 4, comment: 'Good haircut, polite staff.', status: 'Visible' }
  ]);

  const updateSalonStatus = (id, newStatus) => {
    setSalonsList(salonsList.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const toggleUserStatus = (id) => {
    setUsersList(usersList.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
  };

  const removeReview = (id) => {
    setReviewsList(reviewsList.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="bg-slate-900 border-b border-slate-800 p-4 md:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400 font-bold text-xl shadow">
                <i className="fa-solid fa-user-shield"></i>
              </div>
              <div>
                <h1 className="text-xl font-black text-amber-400 tracking-tight">GROO MAX</h1>
                <p className="text-xs text-slate-400">Super Admin Control Hub</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="text-xs bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-amber-400 px-4 py-2.5 rounded-xl transition cursor-pointer font-semibold"
            >
              ← Main Menu
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-4 md:p-8">
          
          {/* Navigation Tabs (Points 21-24) */}
          <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex flex-wrap gap-2 mb-8">
            {[
              { id: 'dashboard', label: 'Dashboard Overview', icon: 'fa-chart-pie' },
              { id: 'salons', label: 'Salon Approvals', icon: 'fa-store' },
              { id: 'users', label: 'User Accounts', icon: 'fa-users' },
              { id: 'bookings', label: 'Platform Bookings', icon: 'fa-calendar-check' },
              { id: 'reviews', label: 'Reviews & Moderation', icon: 'fa-comments' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[140px] py-2.5 px-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === tab.id ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <i className={`fa-solid ${tab.icon}`}></i> {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: DASHBOARD OVERVIEW (Point 21) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
                  <p className="text-xs text-slate-400 mb-1">Registered Customers</p>
                  <p className="text-3xl font-black text-amber-400">1,240</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
                  <p className="text-xs text-slate-400 mb-1">Registered Salons</p>
                  <p className="text-3xl font-black text-emerald-400">{salonsList.length}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
                  <p className="text-xs text-slate-400 mb-1">Pending Approvals</p>
                  <p className="text-3xl font-black text-rose-400">{salonsList.filter(s => s.status === 'Pending').length}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
                  <p className="text-xs text-slate-400 mb-1">Total Commission Earned</p>
                  <p className="text-3xl font-black text-indigo-400">₹14,850</p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                <h3 className="text-sm font-bold text-slate-100 mb-3">System Security & Status</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Role-based authentication is fully active. All vendor requests require Super Admin verification before appearing in the Lucknow customer discovery grid.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: SALON APPROVALS & MANAGEMENT (Point 22) */}
          {activeTab === 'salons' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-store text-amber-400"></i> Salon Verification & Status Management
              </h2>
              <div className="space-y-3">
                {salonsList.map((salon) => (
                  <div key={salon.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-slate-200">{salon.name}</p>
                        <span className="text-[10px] bg-slate-900 text-slate-400 px-2.5 py-0.5 rounded border border-slate-800">Owner: {salon.owner}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Lucknow Area: {salon.area}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-3 py-1.5 rounded-xl font-bold ${
                        salon.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {salon.status}
                      </span>
                      
                      {salon.status === 'Pending' ? (
                        <button 
                          onClick={() => updateSalonStatus(salon.id, 'Approved')}
                          className="px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold hover:bg-emerald-500/30 cursor-pointer"
                        >
                          Approve
                        </button>
                      ) : (
                        <button 
                          onClick={() => updateSalonStatus(salon.id, 'Pending')}
                          className="px-4 py-2 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold hover:bg-rose-500/30 cursor-pointer"
                        >
                          Suspend / Pending
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: USER MANAGEMENT (Point 23) */}
          {activeTab === 'users' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-users text-amber-400"></i> Registered Users & Partners
              </h2>
              <div className="space-y-3">
                {usersList.map((user) => (
                  <div key={user.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-slate-200">{user.name}</p>
                        <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-bold">{user.role}</span>
                      </div>
                      <p className="text-xs text-slate-500">{user.email || user.ownerEmail}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2.5 py-1 rounded font-bold ${user.status === 'Active' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                        {user.status}
                      </span>
                      <button 
                        onClick={() => toggleUserStatus(user.id)}
                        className="text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300 hover:border-amber-500/40 cursor-pointer"
                      >
                        Toggle Status
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PLATFORM BOOKINGS (Point 23) */}
          {activeTab === 'bookings' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-calendar-check text-amber-400"></i> Platform-Wide Bookings Record
              </h2>
              <div className="space-y-3">
                {bookingsList.map((b) => (
                  <div key={b.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-amber-400">{b.id}</span>
                        <span className="font-bold text-sm text-slate-200">{b.customer}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Salon: {b.salon} • Amount: ₹{b.total}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl">
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: REVIEWS MODERATION (Point 24) */}
          {activeTab === 'reviews' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-comments text-amber-400"></i> Customer Reviews & Moderation
              </h2>
              <div className="space-y-3">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-200">{rev.user}</span>
                        <span className="text-amber-400 text-xs">★ {rev.rating}</span>
                        <span className="text-[10px] text-slate-500">({rev.salon})</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">"{rev.comment}"</p>
                    </div>

                    <button 
                      onClick={() => removeReview(rev.id)}
                      className="px-3 py-1.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold hover:bg-rose-500/30 cursor-pointer"
                    >
                      Remove Review
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}