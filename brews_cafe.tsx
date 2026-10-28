import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, MapPin, Clock, Phone, ChevronRight, Menu as MenuIcon, X, Calendar, Users, Check, Trash2, Shield } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';

// --- FIREBASE INITIALIZATION ---
// Follows strictly the mandatory rules for Firebase integration
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'brews-cafe-app';

// --- DATA ---
const MENU_ITEMS = [
  {
    id: '1',
    name: 'Iced Caramel Latte',
    category: 'Coffee',
    price: '$6.00',
    label: 'POPULAR',
    image: 'Download premium png of PNG Iced caramel latte with milk by Gifty Gifty Gifty Gifty about iced coffee png, ice latte, iced coffee cup, iced coffee, and iced latte 15105963.jpg',
    desc: 'A perfectly balanced blend of rich espresso, creamy milk, and buttery caramel syrup over ice.',
    tags: []
  },
  {
    id: '2',
    name: 'Luna Mocha Latte',
    category: 'Coffee',
    price: '$6.50',
    label: 'BEST SELLER',
    image: '꣑ৎ L u n a ｡ ˙ ˖   mocha latte png_2.jpg',
    desc: 'Our signature espresso blended with rich dark chocolate, velvety steamed milk, and a dusting of cocoa.',
    tags: []
  },
  {
    id: '3',
    name: 'Coconut Matcha',
    category: 'Tea',
    price: '$7.00',
    label: 'POPULAR',
    image: 'Coconut Matcha_2.jpg',
    desc: 'Premium ceremonial grade matcha whipped with creamy, organic coconut milk. Served over ice.',
    tags: ['Vegan', 'Gluten-Free']
  },
  {
    id: '4',
    name: 'Raspberry Iced Drink',
    category: 'Tea',
    price: '$5.50',
    image: 'Download premium png of Refreshing raspberry iced drink by Jo about realistic, cocktail, food png, fruit png, and drink 15027615.jpg',
    desc: 'A refreshing, vibrant raspberry infusion with fresh mint and sparkling water.',
    tags: ['Vegan']
  },
  {
    id: '5',
    name: 'Chocolate Croissant',
    category: 'Pastries',
    price: '$4.50',
    label: 'BEST SELLER',
    image: '720646377905583185_2.jpg',
    desc: 'Flaky, buttery layers of French pastry wrapping a center of premium dark chocolate batons.',
    tags: ['Vegetarian']
  },
  {
    id: '6',
    name: 'Chocolate Donut',
    category: 'Pastries',
    price: '$3.50',
    image: 'Chocolate Donut.jpg',
    desc: 'A decadent classic topped with rich chocolate glaze and artisanal chocolate shavings.',
    tags: []
  },
  {
    id: '7',
    name: 'Coffee Macaron',
    category: 'Pastries',
    price: '$3.00',
    image: 'download (16).jpg',
    desc: 'Delicate almond meringue shells filled with a smooth, robust espresso ganache.',
    tags: ['Gluten-Free']
  }
];

// --- ANIMATION VARIANTS ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const pageTransition = {
  initial: { opacity: 0, filter: 'blur(10px)' },
  animate: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.6 } },
  exit: { opacity: 0, filter: 'blur(10px)', transition: { duration: 0.4 } }
};

// --- COMPONENTS ---

const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }) => {
  const baseStyle = "px-8 py-3 uppercase tracking-[0.2em] text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-[#D4AF37] text-[#2C1A12] hover:bg-[#B89947]",
    outline: "border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#2C1A12]",
    dark: "bg-[#2C1A12] text-[#F8F5F0] hover:bg-[#1A0F0A]"
  };
  
  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

// --- PAGES ---

const HomePage = ({ setPage }) => (
  <motion.div {...pageTransition} className="w-full">
    {/* Hero Section */}
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2C1A12]/80 via-[#2C1A12]/60 to-[#2C1A12] z-10" />
        <img 
          src="Coffee Shop.jpg" 
          alt="Brew's Cafe Interior" 
          className="w-full h-full object-cover object-center scale-105"
        />
      </div>
      
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center mt-16">
        <motion.p 
          initial={{ opacity: 0, letterSpacing: '0em' }}
          animate={{ opacity: 1, letterSpacing: '0.4em' }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="text-[#D4AF37] uppercase text-xs font-bold tracking-[0.4em] mb-8"
        >
          An Award-Winning Experience
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-6xl md:text-8xl lg:text-9xl font-serif text-[#F8F5F0] mb-10 leading-[1.1] tracking-tight drop-shadow-2xl"
        >
          Elevating The <br />
          <span className="italic text-[#D4AF37] font-light">Art of Coffee</span>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <Button onClick={() => setPage('reserve')} variant="primary">
            Reserve a Table
          </Button>
        </motion.div>
      </div>
    </section>

    {/* Philosophy / Story Section */}
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#F8F5F0] text-[#2C1A12]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="space-y-8"
        >
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-serif">
            A Symphony of <br/> Flavor & Ambiance
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg leading-relaxed text-[#5C4A42]">
            At Brew's Cafe, we believe coffee is more than a beverage; it's a meticulously crafted experience. 
            Sourced from sustainable, high-altitude farms, our beans are roasted to perfection and brewed 
            with precision. Coupled with our serene, luxurious environment, every sip is a moment to savor.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Button onClick={() => setPage('menu')} variant="dark">Explore Our Menu</Button>
          </motion.div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative aspect-[4/5] w-full"
        >
          <img src="Gluten Free Cafe Menu Layout Poster Sleek Stylish High Contrast Urban Branding Design_2.jpg" alt="Cafe Menu Poster" className="w-full h-full object-cover rounded-sm shadow-2xl" />
          <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-[#D4AF37] -z-10 rounded-sm"></div>
        </motion.div>
      </div>
    </section>

    {/* Featured Carousel/Grid */}
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#2C1A12] text-[#F8F5F0]">
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fadeInUp}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-serif mb-4">Signature Selections</h2>
        <p className="text-[#D4AF37] uppercase tracking-widest text-sm">Curated for the connoisseur</p>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {MENU_ITEMS.filter(item => item.label).slice(0, 3).map((item, idx) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            viewport={{ once: true }}
            className="group cursor-pointer relative"
          >
            {item.label && (
              <div className="absolute top-4 right-4 z-20 bg-[#D4AF37] text-[#2C1A12] text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-sm shadow-md">
                {item.label}
              </div>
            )}
            <div className="overflow-hidden mb-6 aspect-[3/4] relative rounded-sm">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-2xl font-serif">{item.name}</h3>
              <span className="text-[#D4AF37] font-semibold">{item.price}</span>
            </div>
            <p className="text-sm text-gray-400 font-sans">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Testimonials */}
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#1A0F0A] relative overflow-hidden">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
         <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <img src="Restaurant Review Feedback Instagram Post Design _ Customer Testimonial Graphics.jpg" alt="Customer Reviews" className="w-full max-w-md mx-auto shadow-2xl rounded-sm opacity-90 hover:opacity-100 transition-opacity" />
        </motion.div>
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
          className="text-[#F8F5F0] space-y-8"
        >
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-serif">What Our Guests Say</motion.h2>
          <motion.div variants={fadeInUp} className="space-y-6">
            <blockquote className="border-l-2 border-[#D4AF37] pl-6 py-2">
              <p className="text-xl italic mb-4">"Absolutely the most luxurious coffee experience I've had. The Coconut Matcha is a revelation. The ambiance is unmatched."</p>
              <footer className="text-[#D4AF37] tracking-wider uppercase text-sm">— Elena V.</footer>
            </blockquote>
            <blockquote className="border-l-2 border-[#D4AF37] pl-6 py-2">
              <p className="text-xl italic mb-4">"A hidden gem. The attention to detail, from the Luna Mocha Latte to the elegant seating, makes this a 5-star destination."</p>
              <footer className="text-[#D4AF37] tracking-wider uppercase text-sm">— Marcus T.</footer>
            </blockquote>
          </motion.div>
        </motion.div>
      </div>
    </section>
  </motion.div>
);

const MenuPage = () => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Coffee', 'Tea', 'Pastries'];

  const filteredItems = filter === 'All' ? MENU_ITEMS : MENU_ITEMS.filter(item => item.category === filter);

  return (
    <motion.div {...pageTransition} className="pt-32 pb-24 px-6 md:px-12 lg:px-24 bg-[#F8F5F0] min-h-screen text-[#2C1A12]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif mb-6 text-[#2C1A12]">Our Menu</h1>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full border transition-all duration-300 ${
                  filter === cat 
                    ? 'bg-[#2C1A12] text-[#F8F5F0] border-[#2C1A12]' 
                    : 'bg-transparent text-[#2C1A12] border-[#2C1A12] hover:bg-[#2C1A12]/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <AnimatePresence>
            {filteredItems.map(item => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                key={item.id}
                className="group flex flex-col bg-white p-6 shadow-sm hover:shadow-xl transition-shadow duration-300 rounded-sm relative"
              >
                {item.label && (
                  <div className="absolute top-8 right-8 z-20 bg-[#D4AF37] text-[#2C1A12] text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-sm shadow-md">
                    {item.label}
                  </div>
                )}
                <div className="w-full h-64 mb-6 overflow-hidden rounded-sm bg-gray-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply transform group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-serif text-[#2C1A12]">{item.name}</h3>
                    <span className="text-[#D4AF37] font-semibold text-lg">{item.price}</span>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{item.desc}</p>
                  <div className="mt-auto flex flex-wrap gap-2">
                    {item.tags.map(tag => (
                      <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-1 bg-[#F0EBE1] text-[#5C4A42] rounded-sm border border-[#E3D9C8]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

const ReservationPage = ({ user }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', date: '', time: '', guests: '2', notes: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg("Authentication required. Please wait.");
      return;
    }
    
    setStatus('loading');
    try {
      // RULE 1: Strict path for public data (allowing admin to view all)
      const reservationsRef = collection(db, 'artifacts', appId, 'public', 'data', 'reservations');
      await addDoc(reservationsRef, {
        ...formData,
        userId: user.uid,
        status: 'Pending',
        createdAt: new Date().toISOString()
      });
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', date: '', time: '', guests: '2', notes: '' });
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
      setStatus('error');
    }
  };

  return (
    <motion.div {...pageTransition} className="pt-32 pb-24 px-6 md:px-12 lg:px-24 bg-[#1A0F0A] min-h-screen text-[#F8F5F0]">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16">
        <div className="space-y-8">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.h1 variants={fadeInUp} className="text-5xl font-serif mb-4 text-[#D4AF37]">Reserve Your Table</motion.h1>
            <motion.p variants={fadeInUp} className="text-gray-300 leading-relaxed mb-8">
              Join us for an unforgettable experience. For parties larger than 6 or special events, please contact us directly.
            </motion.p>
            <motion.div variants={fadeInUp} className="space-y-4">
              <div className="flex items-center gap-4 text-gray-300">
                <Clock className="text-[#D4AF37]" size={20} />
                <span>Mon - Sun, 8:00 AM - 10:00 PM</span>
              </div>
              <div className="flex items-center gap-4 text-gray-300">
                <MapPin className="text-[#D4AF37]" size={20} />
                <span>123 Luxury Lane, Culinary District</span>
              </div>
              <div className="flex items-center gap-4 text-gray-300">
                <Phone className="text-[#D4AF37]" size={20} />
                <span>+1 (555) 123-4567</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[#2C1A12] p-8 lg:p-12 shadow-2xl relative"
        >
          {status === 'success' ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#2C1A12] p-8 text-center z-10">
              <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mb-6">
                <Check className="text-[#D4AF37]" size={32} />
              </div>
              <h3 className="text-3xl font-serif text-[#D4AF37] mb-4">Reservation Confirmed</h3>
              <p className="text-gray-300 mb-8">We look forward to hosting you. A confirmation has been recorded.</p>
              <Button onClick={() => setStatus('idle')} variant="outline">Book Another Table</Button>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-6">
            {status === 'error' && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-sm text-sm">
                {errorMsg}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 md:col-span-1 space-y-2">
                <label className="text-xs uppercase tracking-widest text-[#D4AF37]">Full Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-transparent border-b border-gray-600 pb-2 focus:border-[#D4AF37] outline-none transition-colors" placeholder="John Doe" />
              </div>
              <div className="col-span-2 md:col-span-1 space-y-2">
                <label className="text-xs uppercase tracking-widest text-[#D4AF37]">Email</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-transparent border-b border-gray-600 pb-2 focus:border-[#D4AF37] outline-none transition-colors" placeholder="john@example.com" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 md:col-span-1 space-y-2">
                <label className="text-xs uppercase tracking-widest text-[#D4AF37]">Date</label>
                <div className="relative">
                  <input required type="date" name="date" value={formData.date} onChange={handleChange} min={new Date().toISOString().split('T')[0]} className="w-full bg-transparent border-b border-gray-600 pb-2 focus:border-[#D4AF37] outline-none transition-colors appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0" />
                  <Calendar size={16} className="absolute right-0 top-1 text-gray-500 pointer-events-none" />
                </div>
              </div>
              <div className="col-span-2 md:col-span-1 space-y-2">
                <label className="text-xs uppercase tracking-widest text-[#D4AF37]">Time</label>
                <select required name="time" value={formData.time} onChange={handleChange} className="w-full bg-transparent border-b border-gray-600 pb-2 focus:border-[#D4AF37] outline-none transition-colors appearance-none">
                  <option value="" className="bg-[#2C1A12] text-gray-500">Select Time</option>
                  {['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'].map(t => (
                    <option key={t} value={t} className="bg-[#2C1A12] text-white">{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-[#D4AF37]">Number of Guests</label>
              <div className="relative">
                <select name="guests" value={formData.guests} onChange={handleChange} className="w-full bg-transparent border-b border-gray-600 pb-2 focus:border-[#D4AF37] outline-none transition-colors appearance-none">
                  {[1,2,3,4,5,6].map(num => (
                    <option key={num} value={num} className="bg-[#2C1A12] text-white">{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
                <Users size={16} className="absolute right-0 top-1 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-[#D4AF37]">Special Requests (Optional)</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" className="w-full bg-transparent border-b border-gray-600 pb-2 focus:border-[#D4AF37] outline-none transition-colors resize-none" placeholder="Dietary requirements, celebrations..." />
            </div>

            <Button type="submit" variant="primary" className="w-full mt-8" disabled={status === 'loading' || !user}>
              {status === 'loading' ? 'Processing...' : 'Confirm Reservation'}
            </Button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

const AdminDashboard = ({ user }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    // RULE 1: Strict path for public data. (Using public so admin can read all reservations without complex rules in this environment)
    const reservationsRef = collection(db, 'artifacts', appId, 'public', 'data', 'reservations');
    
    const unsubscribe = onSnapshot(reservationsRef, (snapshot) => {
      // RULE 2: No complex queries. Fetch all, sort in memory.
      const resData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort by creation date descending
      resData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setReservations(resData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching reservations:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const updateStatus = async (id, newStatus) => {
    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'reservations', id);
      await updateDoc(docRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const deleteReservation = async (id) => {
    if (window.confirm("Are you sure you want to delete this reservation?")) {
       try {
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'reservations', id);
        await deleteDoc(docRef);
      } catch (error) {
        console.error("Error deleting", error);
      }
    }
  };

  if (!user) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#F8F5F0] flex items-center justify-center text-[#2C1A12]">
        <div className="text-center space-y-4">
           <Shield className="w-16 h-16 mx-auto text-[#D4AF37]" />
           <h2 className="text-2xl font-serif">Admin Access Restricted</h2>
           <p>Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div {...pageTransition} className="pt-32 pb-24 px-6 md:px-12 lg:px-24 bg-[#F8F5F0] min-h-screen text-[#2C1A12]">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-serif text-[#2C1A12] mb-2">Admin Dashboard</h1>
            <p className="text-gray-500">Manage incoming reservations</p>
          </div>
          <div className="text-sm bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
            Admin ID: <span className="font-mono text-[#D4AF37]">{user.uid.slice(0, 8)}...</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
          </div>
        ) : (
          <div className="bg-white rounded-sm shadow-xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#2C1A12] text-[#F8F5F0] uppercase tracking-wider text-xs">
                    <th className="p-4 font-semibold">Date & Time</th>
                    <th className="p-4 font-semibold">Guest Details</th>
                    <th className="p-4 font-semibold">Party Size</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reservations.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-500 italic">No reservations found.</td>
                    </tr>
                  ) : (
                    reservations.map((res) => (
                      <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="font-semibold text-[#2C1A12]">{new Date(res.date).toLocaleDateString()}</div>
                          <div className="text-sm text-gray-500">{res.time}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-[#2C1A12]">{res.name}</div>
                          <div className="text-sm text-gray-500">{res.email}</div>
                          {res.notes && <div className="text-xs text-[#D4AF37] mt-1 bg-[#D4AF37]/10 inline-block px-2 py-1 rounded">Note: {res.notes}</div>}
                        </td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center justify-center bg-gray-100 w-8 h-8 rounded-full text-sm font-semibold">{res.guests}</span>
                        </td>
                        <td className="p-4">
                          <select 
                            value={res.status || 'Pending'}
                            onChange={(e) => updateStatus(res.id, e.target.value)}
                            className={`text-sm border-0 font-semibold bg-transparent cursor-pointer outline-none ${
                              res.status === 'Confirmed' ? 'text-green-600' :
                              res.status === 'Cancelled' ? 'text-red-600' : 'text-orange-500'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-4 text-right">
                           <button onClick={() => deleteReservation(res.id)} className="text-red-400 hover:text-red-600 p-2 transition-colors">
                             <Trash2 size={18} />
                           </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};


// --- MAIN APP COMPONENT ---

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  // RULE 3: Firebase Auth Initialization
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Firebase Auth Error:", error);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Handle Scroll for Navbar styling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  }, [activePage]);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'reserve', label: 'Reservations' },
    { id: 'admin', label: 'Admin' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#2C1A12] font-sans selection:bg-[#D4AF37] selection:text-[#2C1A12]">
      
      {/* Dynamic Font Injection for Premium Typography */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap');
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Montserrat', sans-serif; }
      `}} />

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled || activePage !== 'home' ? 'bg-[#1A0F0A]/95 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <div 
            className={`font-serif text-2xl cursor-pointer transition-colors duration-300 ${scrolled || activePage !== 'home' ? 'text-[#D4AF37]' : 'text-white'}`}
            onClick={() => setActivePage('home')}
          >
            Brew's <span className="italic">Cafe</span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => setActivePage(link.id)}
                className={`uppercase tracking-widest text-xs font-semibold transition-colors duration-300 ${
                  activePage === link.id 
                    ? 'text-[#D4AF37]' 
                    : `${scrolled || activePage !== 'home' ? 'text-gray-300 hover:text-white' : 'text-white/80 hover:text-white'}`
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <MenuIcon size={28} className={scrolled || activePage !== 'home' ? 'text-[#D4AF37]' : 'text-white'} />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#1A0F0A] flex flex-col items-center justify-center space-y-8"
          >
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => setActivePage(link.id)}
                className={`uppercase tracking-widest text-2xl font-serif transition-colors ${activePage === link.id ? 'text-[#D4AF37]' : 'text-white'}`}
              >
                {link.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main>
        <AnimatePresence mode="wait">
          {activePage === 'home' && <HomePage key="home" setPage={setActivePage} />}
          {activePage === 'menu' && <MenuPage key="menu" />}
          {activePage === 'reserve' && <ReservationPage key="reserve" user={user} />}
          {activePage === 'admin' && <AdminDashboard key="admin" user={user} />}
        </AnimatePresence>
      </main>

      {/* Premium Footer */}
      <footer className="bg-[#0A0503] text-gray-400 py-16 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
          <div className="space-y-4">
            <div className="font-serif text-2xl text-[#D4AF37] mb-6">Brew's <span className="italic">Cafe</span></div>
            <p className="leading-relaxed">Crafting exceptional coffee experiences in an atmosphere of refined luxury.</p>
          </div>
          <div>
            <h4 className="text-white uppercase tracking-widest mb-6">Visit Us</h4>
            <ul className="space-y-3">
              <li className="flex gap-3"><MapPin size={18} className="text-[#D4AF37] shrink-0" /> 123 Luxury Lane, Culinary District, NY 10001</li>
              <li className="flex gap-3"><Phone size={18} className="text-[#D4AF37] shrink-0" /> +1 (555) 123-4567</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white uppercase tracking-widest mb-6">Hours</h4>
            <ul className="space-y-3">
              <li className="flex justify-between"><span>Mon - Fri</span> <span className="text-white">7:00 AM - 8:00 PM</span></li>
              <li className="flex justify-between"><span>Sat - Sun</span> <span className="text-white">8:00 AM - 10:00 PM</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white uppercase tracking-widest mb-6">Newsletter</h4>
            <p className="mb-4">Subscribe for seasonal menu updates and exclusive event invitations.</p>
            <div className="flex border-b border-gray-600 focus-within:border-[#D4AF37] transition-colors">
              <input type="email" placeholder="Email Address" className="bg-transparent w-full py-2 outline-none text-white" />
              <button className="p-2 text-[#D4AF37] hover:text-white transition-colors"><ChevronRight size={20} /></button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs tracking-wider">
          <p>&copy; {new Date().getFullYear()} Brew's Cafe. All Rights Reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="cursor-pointer hover:text-white transition-colors">Privacy Policy</span>
            <span className="cursor-pointer hover:text-white transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>

    </div>
  );
}