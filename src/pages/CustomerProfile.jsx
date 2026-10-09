import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { apiBookings } from '../services/apiService';

export default function CustomerProfile() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Stored User Profile Data
  const [userProfile, setUserProfile] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('groomax_user'));
    return saved || {
      name: 'Gaurav Yadav',
      email: 'gaurav@example.com',
      phone: '6306857876',
      address: 'Gomti Nagar, Lucknow, UP',
      role: 'customer'
    };
  });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await apiBookings.getUserBookings();
        setBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem('groomax_user', JSON.stringify(userProfile));
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-12">
      <Navbar />

      <div className="max-w-5xl mx-auto p-4 md:p-8">
        
        {/* Header Bar with Action Shortcuts */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-amber-400">Customer Account Profile</h1>
            <p className="text-xs text-slate-400">Manage personal details, saved location, and appointment history.</p>
          </div>
          <button
            onClick={() => navigate('/customer/reviews')}
            className="text-xs bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 px-4 py-2 rounded-xl transition flex items-center gap-1.5"
          >
            <i className="fa-solid fa-star"></i> My Reviews Page
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Section 12: Personal Details & Account Settings */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl h-fit">
            <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-bold rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg shadow-amber-500/20">
              {userProfile.name.charAt(0).toUpperCase()}
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-3">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={userProfile.phone}
                    onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Saved Address (Lucknow)</label>
                  <input
                    type="text"
                    value={userProfile.address}
                    onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-amber-500 text-slate-950 font-bold py-2 rounded-xl text-xs hover:bg-amber-400"
                >
                  Save Profile Settings
                </button>
              </form>
            ) : (
              <div>
                <h3 className="font-bold text-lg text-slate-100">{userProfile.name}</h3>
                <p className="text-xs text-slate-400 mb-1"><i className="fa-solid fa-envelope text-amber-400 mr-1"></i> {userProfile.email}</p>
                <p className="text-xs text-slate-400 mb-1"><i className="fa-solid fa-phone text-amber-400 mr-1"></i> {userProfile.phone || '6306857876'}</p>
                <p className="text-xs text-slate-400 mb-4"><i className="fa-solid fa-location-dot text-amber-400 mr-1"></i> {userProfile.address || 'Lucknow, UP'}</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 text-xs bg-slate-950 border border-slate-800 hover:border-slate-700 py-2 rounded-xl text-slate-300 font-semibold"
                  >
                    Edit Settings
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Appointment History List with Write Review Shortcut */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-clock-rotate-left text-amber-400"></i> My Appointment History
              </span>
            </h3>

            {loading ? (
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center text-slate-400 text-xs">
                <i className="fa-solid fa-spinner animate-spin text-xl text-amber-400 mb-2"></i>
                <p>Loading your appointments...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center text-slate-400 text-xs">
                No bookings found yet. Explore salons and book your first slot!
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-100 text-sm">{b.salonName}</span>
                        <span className="text-[10px] bg-slate-950 text-slate-400 border border-slate-800 px-2 py-0.5 rounded font-medium">
                          {b.area}
                        </span>
                      </div>
                      <p className="text-xs text-amber-400 font-semibold">{b.serviceName} • ₹{b.price}</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        <i className="fa-solid fa-calendar mr-1"></i> {b.date} at {b.slot}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 justify-between sm:justify-end">
                      <span className={`text-xs px-3 py-1 rounded-full font-bold border ${
                        b.status === 'Confirmed' 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}>
                        {b.status}
                      </span>
                      
                      <button
                        onClick={() => navigate('/customer/reviews')}
                        className="text-[11px] bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-amber-400 px-2.5 py-1 rounded-lg"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}