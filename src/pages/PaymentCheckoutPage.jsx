import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { apiBookings } from '../services/apiService';

export default function PaymentCheckoutPage() {
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const salonName = searchParams.get('salon') || 'Glitz & Glamour Studio';
  const serviceName = searchParams.get('service') || 'Haircut & Styling';
  const price = Number(searchParams.get('price')) || 350;
  const visitType = searchParams.get('visitType') || 'salon';
  const homeCharge = visitType === 'home' ? 150 : 0;
  const total = price + homeCharge;

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setPaymentError('');

    // Simulating Payment Gateway API Webhook & Backend Verification
    setTimeout(async () => {
      try {
        // Backend Handoff Note: Replace with real Razorpay/Cashfree Webhook trigger
        const res = await apiBookings.createBooking({
          id: bookingId,
          salonName,
          serviceName,
          price: total,
          paymentStatus: 'Paid',
          paymentMethod,
          status: 'Confirmed'
        });

        if (res.success) {
          navigate(`/customer/booking-success/${bookingId}?salon=${encodeURIComponent(salonName)}&amount=${total}&status=Confirmed`);
        }
      } catch (err) {
        setPaymentError('Payment Failed! Bank declined transaction or timeout occurred. Please Retry.');
        setIsProcessing(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-12">
      <Navbar />

      <div className="max-w-2xl mx-auto p-4 md:p-8">
        <button onClick={() => navigate(-1)} className="text-xs text-slate-400 hover:text-amber-400 mb-6 flex items-center gap-1 cursor-pointer">
          <i className="fa-solid fa-arrow-left"></i> Modify Booking Details
        </button>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
          <h1 className="text-xl font-black text-amber-400 mb-1">Booking Price Breakdown & Gateway</h1>
          <p className="text-xs text-slate-400 mb-6">Booking Reference: <span className="font-mono text-slate-200">{bookingId}</span></p>

          {/* Section 9 Itemized Summary */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl mb-6 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400"><span>Salon:</span> <strong className="text-slate-200">{salonName}</strong></div>
            <div className="flex justify-between text-slate-400"><span>Service:</span> <strong className="text-slate-200">{serviceName}</strong></div>
            <div className="flex justify-between text-slate-400"><span>Service Visit Type:</span> <strong className="text-amber-400">{visitType === 'home' ? 'Doorstep Home Visit' : 'In-Store Salon Visit'}</strong></div>
            <hr className="border-slate-800 my-2" />
            <div className="flex justify-between text-slate-300"><span>Service Base Fee:</span> <span>₹{price}</span></div>
            {visitType === 'home' && <div className="flex justify-between text-slate-300"><span>Home Travel Fee:</span> <span>₹{homeCharge}</span></div>}
            <div className="flex justify-between font-black text-emerald-400 text-base pt-2"><span>Total Payable Amount:</span> <span>₹{total}</span></div>
          </div>

          {/* Payment Method Selector (Razorpay/UPI Simulator) */}
          <label className="block text-xs font-bold text-slate-200 mb-3">Select Payment Method Gateway:</label>
          <div className="space-y-2 mb-6">
            {[
              { id: 'upi', label: 'UPI / GPay / PhonePe / Paytm', icon: 'fa-qrcode' },
              { id: 'card', label: 'Debit / Credit Card (Visa, Mastercard, RuPay)', icon: 'fa-credit-card' },
              { id: 'netbanking', label: 'Net Banking (All Major Indian Banks)', icon: 'fa-building-columns' },
              { id: 'pay_at_salon', label: 'Pay Cash At Salon After Service', icon: 'fa-money-bill-wave' }
            ].map((m) => (
              <div 
                key={m.id}
                onClick={() => setPaymentMethod(m.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between text-xs ${
                  paymentMethod === m.id ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="flex items-center gap-3 font-semibold">
                  <i className={`fa-solid ${m.icon} text-amber-400`}></i> {m.label}
                </span>
                <input type="radio" checked={paymentMethod === m.id} readOnly className="accent-amber-500" />
              </div>
            ))}
          </div>

          {paymentError && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs flex items-center gap-2">
              <i className="fa-solid fa-circle-exclamation"></i> {paymentError}
            </div>
          )}

          {/* Payment Gateway Submit */}
          <button
            onClick={handlePaymentSubmit}
            disabled={isProcessing}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 rounded-2xl text-xs transition shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <i className="fa-solid fa-spinner animate-spin text-sm"></i>
                <span>Verifying Gateway Webhook Response...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-lock"></i>
                <span>Pay ₹{total} via Secured Gateway</span>
              </>
            )}
          </button>

          <p className="text-[10px] text-slate-500 text-center mt-4">
            <i className="fa-solid fa-shield-halved mr-1"></i> 256-bit SSL Secured Payment. Auto-refund enabled on failed transactions.
          </p>
        </div>
      </div>
    </div>
  );
}