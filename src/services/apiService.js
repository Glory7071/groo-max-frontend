import { initialSalons } from './mockData';

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper 1: Get stored bookings or initialize mock ones
const getStoredBookings = () => {
  const local = localStorage.getItem('groomax_bookings');
  if (local) return JSON.parse(local);
  
  const initial = [
    {
      id: 'BK-849201',
      customerId: 'usr_customer',
      customerName: 'Gaurav Yadav',
      salonId: 'salon-1',
      salonName: 'Glitz & Glamour Studio',
      area: 'Gomti Nagar',
      serviceName: 'Haircut & Hair Styling',
      price: 350,
      slot: '11:30 AM',
      date: '2026-10-10',
      status: 'Confirmed',
      phone: '6306857876'
    },
    {
      id: 'BK-731049',
      customerId: 'usr_customer',
      customerName: 'Gaurav Yadav',
      salonId: 'salon-2',
      salonName: 'Royal Heritage Cutters',
      area: 'Hazratganj',
      serviceName: 'Royal Beard Trim & Spa',
      price: 250,
      slot: '03:30 PM',
      date: '2026-09-28',
      status: 'Completed',
      phone: '6306857876'
    }
  ];
  localStorage.setItem('groomax_bookings', JSON.stringify(initial));
  return initial;
};

// Helper 2: Get stored reviews or initialize mock ones
const getStoredReviews = () => {
  const local = localStorage.getItem('groomax_reviews');
  if (local) return JSON.parse(local);
  
  const initial = [
    { id: 'r1', salonId: 'salon-1', user: 'Amit Kumar', rating: 5, comment: 'Bohot achhi service Patrakar Puram me. Staff polite tha.', date: '2026-10-02' },
    { id: 'r2', salonId: 'salon-1', user: 'Priya Verma', rating: 5, comment: 'Cleanliness 10/10, hair spa experience was great.', date: '2026-09-25' },
    { id: 'r10', salonId: 'salon-2', user: 'Vikas Sharma', rating: 5, comment: 'Best royal beard trim experience in Hazratganj!', date: '2026-10-05' }
  ];
  localStorage.setItem('groomax_reviews', JSON.stringify(initial));
  return initial;
};

// 1. AUTHENTICATION SERVICES
export const apiAuth = {
  login: async (email, password, role) => {
    await delay(400);
    return {
      success: true,
      user: {
        id: 'usr_' + (role || 'customer'),
        name: email.split('@')[0],
        email: email,
        role: role || 'customer'
      }
    };
  },

  register: async (name, email, password, role) => {
    await delay(400);
    return {
      success: true,
      user: {
        id: 'usr_' + (role || 'customer'),
        name,
        email,
        role: role || 'customer'
      }
    };
  }
};

// 2. SALON DISCOVERY SERVICES
export const apiSalons = {
  getAllSalons: async () => {
    await delay(300);
    return [...initialSalons];
  },

  getSalonById: async (salonId) => {
    await delay(300);
    const salon = initialSalons.find((s) => s.id === salonId);
    if (!salon) throw new Error('Salon not found');
    return salon;
  }
};

// 3. BOOKINGS SERVICES
export const apiBookings = {
  // Real-time local store me naye booking insert karna
  createBooking: async (bookingData) => {
    await delay(500);
    const existing = getStoredBookings();
    const newBooking = {
      id: 'BK-' + Math.floor(100000 + Math.random() * 900000),
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      ...bookingData
    };
    const updated = [newBooking, ...existing];
    localStorage.setItem('groomax_bookings', JSON.stringify(updated));
    return { success: true, booking: newBooking };
  },

  // Customer ke liye specific bookings
  getUserBookings: async () => {
    await delay(300);
    return getStoredBookings();
  },

  // Salon Owner ke liye specific bookings
  getSalonBookings: async (salonId) => {
    await delay(300);
    const all = getStoredBookings();
    return all.filter(b => !salonId || b.salonId === salonId);
  }
};

// 4. REVIEWS & FEEDBACK SERVICES
export const apiReviews = {
  getSalonReviews: async (salonId) => {
    await delay(200);
    const allReviews = getStoredReviews();
    return allReviews.filter((r) => r.salonId === salonId);
  },

  addReview: async (reviewData) => {
    await delay(400);
    const existing = getStoredReviews();
    const newRev = {
      id: 'rev_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      ...reviewData
    };
    const updated = [newRev, ...existing];
    localStorage.setItem('groomax_reviews', JSON.stringify(updated));
    return { success: true, review: newRev };
  }
};