import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { initialSalons } from '../services/mockData';

export default function BookingFlowPage() {
  const { salonId } = useParams();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get('serviceId');
  const navigate = useNavigate();

  const salon = initialSalons.find(s => s.id === salonId) || initialSalons[0];
  const selectedService = salon.services.find(s => s.id === serviceId) || salon.services[0];

  // Wizard Steps State
  const [step, setStep] = useState(1);
  const [bookingDate, setBookingDate] = useState('2026-10-10');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [serviceType, setServiceType] = useState('salon'); // salon | home
  const [address, setAddress] = useState('');

  const totalAmount = serviceType === 'home' 
    ? selectedService.price + salon.homeServiceCharge 
    : selectedService.price;

  // Step 3: Redirect to Section 9 Payment Checkout Route
  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      alert('Kripya time slot select kijiye!');
      return;
    }
    if (serviceType === 'home' && !address.trim()) {
      alert('Doorstep home service ke liye address bharna zaroori hai!');
      return;
    }

    const bookingId = 'BK-' + Math.floor(100000 + Math.random() * 900000);
    
    // Redirecting to Dedicated Payment Gateway Page (/customer/payment/:bookingId)
    navigate(`/customer/payment/${bookingId}?salon=${encodeURIComponent(salon.name)}&service=${encodeURIComponent(selectedService.name)}&price=${selectedService.price}&visitType=${serviceType}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-12">
      <Navbar />

      <div className="max-w-3xl mx-auto p-4 md:p-8">
        
        {/* Progress Wizard Bar */}
        <div className="flex items-center justify-between mb-8 text-xs font-bold bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className={step >= 1 ? 'text-amber-400' : 'text-slate-600'}>1. Date & Slot</span>
          <i className="fa-solid fa-chevron-right text-slate-700"></i>
          <span className={step >= 2 ? 'text-amber-400' : 'text-slate-600'}>2. Service Type</span>
          <i className="fa-solid fa-chevron-right text-slate-700"></i>
          <span className={step >= 3 ? 'text-amber-400' : 'text-slate-600'}>3. Summary & Pay</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
          
          {/* STEP 1: DATE & SLOT */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-slate-100 mb-1">Select Appointment Date & Time</h2>
              <p className="text-xs text-slate-400 mb-6">{salon.name} • {selectedService.name} (₹{selectedService.price})</p>

              <label className="block text-xs font-semibold text-slate-300 mb-2">Select Date:</label>
              <input 
                type="date" 
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-3 text-xs mb-6 w-full focus:outline-none focus:border-amber-500"
              />

              <label className="block text-xs font-semibold text-slate-300 mb-2">Available Time Slots:</label>
              <div className="grid grid-cols-3 gap-3 mb-8">
                {salon.slots.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-3 text-xs font-bold rounded-xl border transition cursor-pointer ${
                      selectedSlot === slot 
                        ? 'bg-amber-500 text-slate-950 border-amber-500' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => {
                  if (!selectedSlot) alert('Kripya time slot select karein!');
                  else setStep(2);
                }}
                className="w-full bg-amber-500 text-slate-950 font-bold py-3.5 rounded-2xl text-xs hover:bg-amber-400 transition cursor-pointer"
              >
                Next: Select Visit Type →
              </button>
            </div>
          )}

          {/* STEP 2: SALON VISIT vs HOME SERVICE */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-slate-100 mb-2">Where do you want the service?</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div 
                  onClick={() => setServiceType('salon')}
                  className={`p-5 rounded-2xl border cursor-pointer text-center transition ${
                    serviceType === 'salon' ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <i className="fa-solid fa-store text-2xl mb-2"></i>
                  <p className="font-bold text-xs">Salon Visit</p>
                  <p className="text-[10px] text-slate-500 mt-1">Visit shop at scheduled time</p>
                </div>

                {salon.homeServiceAvailable && (
                  <div 
                    onClick={() => setServiceType('home')}
                    className={`p-5 rounded-2xl border cursor-pointer text-center transition ${
                      serviceType === 'home' ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <i className="fa-solid fa-house-user text-2xl mb-2"></i>
                    <p className="font-bold text-xs">Home Service</p>
                    <p className="text-[10px] text-slate-500 mt-1">+₹{salon.homeServiceCharge} Visit Charge</p>
                  </div>
                )}
              </div>

              {serviceType === 'home' && (
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Enter Lucknow Address:</label>
                  <textarea 
                    rows={3}
                    placeholder="House No., Street, Area in Lucknow..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="w-1/3 bg-slate-950 border border-slate-800 text-slate-300 py-3 rounded-2xl text-xs cursor-pointer">← Back</button>
                <button onClick={() => setStep(3)} className="w-2/3 bg-amber-500 text-slate-950 font-bold py-3 rounded-2xl text-xs cursor-pointer">Next: Review & Pay →</button>
              </div>
            </div>
          )}

          {/* STEP 3: SUMMARY & PAY */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-slate-100 mb-4">Booking Price Breakdown</h2>
              
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl mb-6 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400"><span>Salon:</span> <strong className="text-slate-200">{salon.name}</strong></div>
                <div className="flex justify-between text-slate-400"><span>Service:</span> <strong className="text-slate-200">{selectedService.name}</strong></div>
                <div className="flex justify-between text-slate-400"><span>Date & Slot:</span> <strong className="text-amber-400">{bookingDate} at {selectedSlot}</strong></div>
                <div className="flex justify-between text-slate-400"><span>Visit Type:</span> <strong className="text-slate-200">{serviceType === 'home' ? 'Doorstep Home Visit' : 'In-Store Visit'}</strong></div>
                <hr className="border-slate-800 my-2" />
                <div className="flex justify-between text-slate-300"><span>Base Price:</span> <span>₹{selectedService.price}</span></div>
                {serviceType === 'home' && <div className="flex justify-between text-slate-300"><span>Home Visit Charge:</span> <span>₹{salon.homeServiceCharge}</span></div>}
                <div className="flex justify-between font-bold text-amber-400 text-sm pt-2"><span>Total Amount:</span> <span>₹{totalAmount}</span></div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="w-1/3 bg-slate-950 border border-slate-800 text-slate-300 py-3.5 rounded-2xl text-xs cursor-pointer">← Back</button>
                <button onClick={handleFinalSubmit} className="w-2/3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-2xl text-xs shadow-lg shadow-emerald-500/10 cursor-pointer">
                  Confirm Booking & Pay ₹{totalAmount}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}