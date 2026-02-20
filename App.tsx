/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'motion/react';
import { 
  Stethoscope, 
  Pill, 
  Activity, 
  Thermometer, 
  Syringe, 
  HeartPulse, 
  Microscope, 
  MapPin, 
  Sun, 
  Moon, 
  X,
  ChevronRight,
  UserPlus,
  Info,
  Home as HomeIcon,
  Save,
  Calendar,
  User,
  Briefcase,
  MessageSquare,
  Send,
  Languages,
  Truck,
  Ticket as TicketIcon,
  ShoppingBag,
  Scan,
  UserCog,
  Box,
  ChevronDown,
  Search,
  ExternalLink,
  Loader2,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ArrowRight,
  Download,
  CreditCard,
  Phone,
  Flag,
  Video,
  Camera,
  Mic,
  MicOff,
  VideoOff,
  ShoppingBag as PharmacyIcon,
  CheckCircle2,
  AlertCircle,
  Navigation
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// Ethiopian Cities List
const ETHIOPIAN_CITIES = [
  "Addis Ababa", "Dire Dawa", "Mekelle", "Gondar", "Bahir Dar", 
  "Dessie", "Jimma", "Bishoftu", "Awasa", "Sodo", 
  "Arba Minch", "Hosaena", "Dilla", "Nekemte", "Debre Birhan", "Asella"
];

interface UserData {
  name: string;
  email?: string;
  location: string;
  age: number;
  birthDate: string;
  gender: 'Male' | 'Female';
  workingArea: string;
  profilePhoto?: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  photo: string;
  status: 'online' | 'offline';
}

const DOCTOR_DIRECTORY: Doctor[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `doc-${i}`,
  name: `Dr. ${['Abebe', 'Tesfaye', 'Mulugeta', 'Hanna', 'Selam', 'Dawit', 'Elias', 'Sara', 'Yonas', 'Kaleb'][i % 10]} ${['Kassa', 'Bekele', 'Tadesse', 'Girma', 'Haile'][i % 5]}`,
  specialty: ['Cardiologist', 'Dermatologist', 'Neurologist', 'Pediatrician', 'Surgeon'][i % 5],
  photo: `https://picsum.photos/seed/doc-${i}/100/100`,
  status: Math.random() > 0.3 ? 'online' : 'offline'
}));

interface Specialist {
  id: string;
  name: string;
  type: string;
  photo: string;
  personality: string;
}

const SPECIALISTS: Specialist[] = [
  { id: 'skin', name: 'Dr. Almaz', type: 'Skin Specialist', photo: 'https://picsum.photos/seed/skin/100/100', personality: 'Professional and detailed' },
  { id: 'heart', name: 'Dr. Kebede', type: 'Heart Specialist', photo: 'https://picsum.photos/seed/heart/100/100', personality: 'Calm and reassuring' },
  { id: 'kidney', name: 'Dr. Selam', type: 'Kidney Specialist', photo: 'https://picsum.photos/seed/kidney/100/100', personality: 'Efficient and direct' },
];

interface PharmacyProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  requiresPrescription: boolean;
}

const PHARMACY_PRODUCTS: PharmacyProduct[] = [
  { id: 'p1', name: 'Pain Relief (Paracetamol)', price: 150, image: 'https://picsum.photos/seed/pill1/200/200', requiresPrescription: false },
  { id: 'p2', name: 'Antibiotics (Amoxicillin)', price: 450, image: 'https://picsum.photos/seed/pill2/200/200', requiresPrescription: true },
  { id: 'p3', name: 'Cough Syrup', price: 280, image: 'https://picsum.photos/seed/syrup/200/200', requiresPrescription: false },
  { id: 'p4', name: 'Insulin Pen', price: 1200, image: 'https://picsum.photos/seed/insulin/200/200', requiresPrescription: true },
  { id: 'p5', name: 'Vitamin C', price: 90, image: 'https://picsum.photos/seed/vitc/200/200', requiresPrescription: false },
  { id: 'p6', name: 'Blood Pressure Meds', price: 600, image: 'https://picsum.photos/seed/bp/200/200', requiresPrescription: true },
];

interface Pharmacy {
  name: string;
  location: string;
}

const PHARMACIES: Record<string, Pharmacy[]> = {
  "Addis Ababa": [
    { name: "Kenema Pharmacy", location: "Piazza" },
    { name: "Lion Pharmacy", location: "Bole" },
    { name: "Red Cross Pharmacy", location: "Stadium" }
  ],
  "Dire Dawa": [
    { name: "Dire Pharmacy", location: "Center" }
  ]
};

interface Hospital {
  title: string;
  uri: string;
}

interface TicketData {
  name: string;
  hospital: string;
  phone: string;
  location: string;
  paymentMethod: string;
  date: string;
  ticketId: string;
}

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface FloatingElementProps {
  icon: React.ElementType;
  x: number;
  y: number;
  z: number;
  mouseX: any;
  mouseY: any;
  color: string;
}

const Typewriter = ({ text, delay = 50 }: { text: string; delay?: number }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, delay]);

  return <span>{currentText}</span>;
};

const EthiopianFlag = () => {
  return (
    <motion.div 
      className="fixed top-20 left-1/2 -translate-x-1/2 z-10 pointer-events-none overflow-hidden h-16 w-32 rounded-lg shadow-2xl"
      animate={{ 
        rotateY: [0, 15, -15, 0],
        y: [0, -5, 0]
      }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="flex flex-col h-full w-full">
        <div className="flex-1 bg-green-600" />
        <div className="flex-1 bg-yellow-400 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-blue-600 border border-yellow-400 flex items-center justify-center">
            <div className="w-4 h-4 text-yellow-400"><Flag size={12} /></div>
          </div>
        </div>
        <div className="flex-1 bg-red-600" />
      </div>
    </motion.div>
  );
};

const CellAnimation = () => {
  return (
    <div className="absolute inset-0 z-[-2] overflow-hidden opacity-20 pointer-events-none">
      <svg width="100%" height="100%">
        <defs>
          <radialGradient id="cellGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>
        </defs>
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.circle
            key={i}
            r={Math.random() * 20 + 10}
            fill="url(#cellGrad)"
            initial={{ 
              cx: `${Math.random() * 100}%`, 
              cy: `${Math.random() * 100}%` 
            }}
            animate={{ 
              cx: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              cy: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: Math.random() * 20 + 10, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
        ))}
      </svg>
    </div>
  );
};

const TicketView = ({ data, onDownload }: { data: TicketData; onDownload: () => void }) => {
  return (
    <motion.div 
      id="ticket-container"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden text-slate-900 font-sans border-8 border-blue-500"
    >
      <div className="bg-blue-600 p-8 text-white text-center relative">
        <div className="absolute top-4 left-4 opacity-20"><TicketIcon size={48} /></div>
        <h2 className="text-3xl font-black tracking-tighter">MEDICAL TICKET</h2>
        <p className="text-xs opacity-70 tracking-widest uppercase mt-1">Virtual Doctor 3D System</p>
      </div>
      
      <div className="p-8 space-y-6 relative">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] uppercase opacity-40 font-bold">Patient Name</p>
            <p className="text-xl font-black">{data.name}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase opacity-40 font-bold">Ticket ID</p>
            <p className="text-sm font-mono font-bold">{data.ticketId}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-[10px] uppercase opacity-40 font-bold">Hospital</p>
            <p className="text-sm font-bold">{data.hospital}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase opacity-40 font-bold">Location</p>
            <p className="text-sm font-bold">{data.location}</p>
          </div>
        </div>

        <div className="pt-6 border-t border-dashed border-slate-200 flex justify-between items-center">
          <div>
            <p className="text-[10px] uppercase opacity-40 font-bold">Date</p>
            <p className="text-sm font-bold">{data.date}</p>
          </div>
          <div className="bg-slate-100 p-2 rounded-lg">
            <p className="text-[10px] uppercase opacity-40 font-bold">Payment</p>
            <p className="text-xs font-bold text-emerald-600">{data.paymentMethod}</p>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <div className="w-full h-16 bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300">
            <div className="flex gap-1">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className={`w-1 h-8 bg-slate-900 ${i % 3 === 0 ? 'h-10' : 'h-6'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-6 flex justify-center">
        <button 
          onClick={onDownload}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all"
        >
          <Download size={20} /> Download PDF
        </button>
      </div>
    </motion.div>
  );
};

const VideoCallModal = ({ doctor, onClose }: { doctor: Doctor; onClose: () => void }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }
    setupCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-black flex items-center justify-center p-4"
    >
      <div className="w-full max-w-6xl aspect-video bg-slate-900 rounded-[40px] overflow-hidden relative border-4 border-white/10 shadow-2xl">
        {/* Main AI Doctor View */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              scale: [1, 1.02, 1],
              rotate: [0, 1, -1, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-8"
          >
            <div className="w-64 h-64 rounded-full border-8 border-blue-500/30 overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.5)]">
              <img src={doctor.photo} className="w-full h-full object-cover" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-black text-white tracking-tighter">{doctor.name}</h2>
              <p className="text-blue-400 font-bold uppercase tracking-[0.3em] text-sm">AI Video Consultation</p>
            </div>
            <div className="flex gap-2">
              <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-3 h-3 bg-blue-500 rounded-full" />
              <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-3 h-3 bg-blue-500 rounded-full" />
              <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-3 h-3 bg-blue-500 rounded-full" />
            </div>
          </motion.div>
        </div>

        {/* User Camera View */}
        <div className="absolute bottom-8 right-8 w-64 aspect-video bg-black rounded-3xl border-2 border-white/20 overflow-hidden shadow-2xl">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white uppercase">You</div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
          <button className="p-6 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-all shadow-xl"><Mic size={24} /></button>
          <button onClick={onClose} className="p-6 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all shadow-xl"><Phone size={24} className="rotate-[135deg]" /></button>
          <button className="p-6 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-all shadow-xl"><Camera size={24} /></button>
        </div>

        {/* Info Overlay */}
        <div className="absolute top-8 left-8 flex items-center gap-4 bg-black/30 backdrop-blur-xl p-4 rounded-3xl border border-white/10">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-white font-bold tracking-widest text-sm uppercase">Live Call</span>
        </div>
      </div>
    </motion.div>
  );
};

const DroneAnimation = () => {
  return (
    <motion.div
      initial={{ x: "-100%", y: "20%", rotate: 0 }}
      animate={{ 
        x: "110%", 
        y: ["20%", "15%", "25%", "20%"],
        rotate: [0, 5, -5, 0]
      }}
      transition={{ 
        x: { duration: 8, repeat: Infinity, ease: "linear" },
        y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      }}
      className="fixed z-[250] pointer-events-none"
    >
      <div className="relative">
        <Box size={80} className="text-blue-500" />
        <div className="absolute -top-4 -left-4 w-4 h-4 bg-red-500 rounded-full animate-ping" />
        <div className="absolute -top-4 -right-4 w-4 h-4 bg-red-500 rounded-full animate-ping" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-4 bg-slate-800 rounded-full opacity-20 blur-sm" />
        <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-blue-500 whitespace-nowrap tracking-widest">DRONE DELIVERY</p>
      </div>
    </motion.div>
  );
};

const FloatingElement = ({ icon: Icon, x, y, z, mouseX, mouseY, color }: FloatingElementProps) => {
  const moveX = useTransform(mouseX, [-500, 500], [-x * z * 0.5, x * z * 0.5]);
  const moveY = useTransform(mouseY, [-500, 500], [-y * z * 0.5, y * z * 0.5]);
  
  const opacity = useTransform(
    [mouseX, mouseY],
    ([mx, my]: any[]) => {
      const dx = mx - (x * z);
      const dy = my - (y * z);
      const distance = Math.sqrt(dx * dx + dy * dy);
      return Math.max(0.2, 1 - distance / 800);
    }
  );

  const scale = useTransform(
    [mouseX, mouseY],
    ([mx, my]: any[]) => {
      const dx = mx - (x * z);
      const dy = my - (y * z);
      const distance = Math.sqrt(dx * dx + dy * dy);
      return Math.max(0.8, 1.2 - distance / 1000);
    }
  );
  
  return (
    <motion.div
      style={{ x: moveX, y: moveY, opacity, scale }}
      className="absolute pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ 
        rotate: [0, 10, -10, 0],
        y: [0, -20, 0],
      }}
      transition={{ 
        rotate: { duration: 10, repeat: Infinity, ease: "linear" },
        y: { duration: 5 + Math.random() * 5, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <div 
        className="p-6 rounded-2xl backdrop-blur-md border border-white/20 shadow-2xl transition-shadow duration-500"
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          transform: `translateZ(${z * 100}px) rotateX(20deg) rotateY(20deg)`,
          boxShadow: `0 20px 50px ${color}22`
        }}
      >
        <Icon size={48 + z * 20} color={color} strokeWidth={1.5} />
      </div>
    </motion.div>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<'home' | 'mri' | 'ticket' | 'ambulance' | 'directory' | 'pharmacy'>('home');
  const [theme, setTheme] = useState<'light' | 'night'>('light');
  const [accentColor, setAccentColor] = useState('#3b82f6');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLocations, setShowLocations] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showHospitals, setShowHospitals] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [titleLightOn, setTitleLightOn] = useState(true);
  
  // Directory State
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [directoryMessages, setDirectoryMessages] = useState<Record<string, ChatMessage[]>>({});
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);

  // Pharmacy State
  const [pharmacyStep, setPharmacyStep] = useState<'greeting' | 'shopping' | 'prescription' | 'drone'>('greeting');
  const [selectedProducts, setSelectedProducts] = useState<PharmacyProduct[]>([]);
  const [prescriptionCode, setPrescriptionCode] = useState('');
  const [isDroneMoving, setIsDroneMoving] = useState(false);
  const [pharmacyChat, setPharmacyChat] = useState<ChatMessage[]>([]);

  // Ticket State
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [showTicketForm, setShowTicketForm] = useState(false);

  // Ambulance State
  const [ambulanceStep, setAmbulanceStep] = useState(0);
  const [isAmbulanceMoving, setIsAmbulanceMoving] = useState(false);

  // MRI State
  const [mriAnalysis, setMriAnalysis] = useState<string | null>(null);
  const [mriResultImage, setMriResultImage] = useState<string | null>(null);

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatType, setActiveChatType] = useState<'biruk' | 'dagim' | 'specialist' | 'mri' | 'ambulance'>('biruk');
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [chatLanguage, setChatLanguage] = useState('English');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [dagimMessages, setDagimMessages] = useState<ChatMessage[]>([]);
  const [mriMessages, setMriMessages] = useState<ChatMessage[]>([]);
  const [ambulanceMessages, setAmbulanceMessages] = useState<ChatMessage[]>([]);
  const [specialistMessages, setSpecialistMessages] = useState<Record<string, ChatMessage[]>>({});
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<UserData>({
    name: '',
    email: '',
    location: ETHIOPIAN_CITIES[0],
    age: 25,
    birthDate: '',
    gender: 'Male',
    workingArea: '',
    profilePhoto: ''
  });

  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoadingHospitals, setIsLoadingHospitals] = useState(false);

  const springConfig = { damping: 30, stiffness: 200 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    // Initial loading animation
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX - window.innerWidth / 2;
      const y = e.clientY - window.innerHeight / 2;
      setMousePos({ x, y });
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const bgElements = useMemo(() => {
    const icons = [Stethoscope, Pill, Activity, Thermometer, Syringe, HeartPulse, Microscope];
    const colors = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6'];
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      icon: icons[i % icons.length],
      x: (Math.random() - 0.5) * 2000,
      y: (Math.random() - 0.5) * 1200,
      z: Math.random() * 3 + 0.5,
      color: colors[i % colors.length]
    }));
  }, []);

  const handleSave = () => {
    setUserData(formData);
    setShowRegister(false);
    if (formData.email) {
      // Simulate notification
      alert(`Notification: Account created for ${formData.name}. Welcome to Virtual Doctor 3D!`);
    }
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim() && !uploadedImage) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: currentInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let currentHistory: ChatMessage[] = [];
    if (activeChatType === 'biruk') {
      currentHistory = chatMessages;
      setChatMessages(prev => [...prev, userMsg]);
    } else if (activeChatType === 'dagim') {
      currentHistory = dagimMessages;
      setDagimMessages(prev => [...prev, userMsg]);
    } else if (activeChatType === 'mri') {
      currentHistory = mriMessages;
      setMriMessages(prev => [...prev, userMsg]);
    } else if (activeChatType === 'ambulance') {
      currentHistory = ambulanceMessages;
      setAmbulanceMessages(prev => [...prev, userMsg]);
    } else if (activeMode === 'directory' && selectedDoctor) {
      currentHistory = directoryMessages[selectedDoctor.id] || [];
      setDirectoryMessages(prev => ({
        ...prev,
        [selectedDoctor.id]: [...(prev[selectedDoctor.id] || []), userMsg]
      }));
    } else if (selectedSpecialist) {
      currentHistory = specialistMessages[selectedSpecialist.id] || [];
      setSpecialistMessages(prev => ({
        ...prev,
        [selectedSpecialist.id]: [...(prev[selectedSpecialist.id] || []), userMsg]
      }));
    }

    setCurrentInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      let systemInstruction = "";
      let modelName = "gemini-3-flash-preview";

      if (activeMode === 'directory' && selectedDoctor) {
        systemInstruction = `You are ${selectedDoctor.name}, a serious and professional ${selectedDoctor.specialty}. 
        Give very short, human-like answers. Be concise.
        If the user asks for a prescription or a code for the pharmacy, provide a 6-digit numeric code (e.g., 123456).`;
      } else if (activeChatType === 'biruk') {
        systemInstruction = `You are DR Biruk, a professional and friendly doctor for the "Virtual Doctor 3D" website. 
        Respond in ${chatLanguage}. The user's name is ${userData?.name || 'Guest'}. 
        Keep responses concise and helpful, like a Telegram chat.`;
      } else if (activeChatType === 'dagim') {
        systemInstruction = `You are Dr. Dagim, a formal yet funny doctor assistant. 
        Use plenty of medical emojis (🩺, 💊, 🧪) and be slightly humorous/witty. 
        Ask formal medical questions (What are your symptoms? How long have you felt this way?). 
        If the user mentions skin problems, tell them you are referring them to a Skin Specialist. 
        Respond in ${chatLanguage}. Produced by ASTU ai labs.`;
      } else if (activeChatType === 'mri') {
        systemInstruction = `You are an MRI/Radiology specialist AI. 
        Ask the user to upload their MRI or X-ray photo. 
        Analyze the image for medical context and explain findings clearly. 
        If damage is found, suggest hospitals. Produced by ASTU ai labs.`;
      } else if (activeChatType === 'ambulance') {
        systemInstruction = `You are an Emergency Ambulance Dispatcher. 
        Ask for the emergency type and location. 
        Once confirmed, tell the user the ambulance is moving to their house.`;
      } else if (selectedSpecialist) {
        systemInstruction = `You are ${selectedSpecialist.name}, a ${selectedSpecialist.type}. 
        Your personality is ${selectedSpecialist.personality}. 
        Respond in ${chatLanguage}.`;
        if (uploadedImage) {
          modelName = "gemini-2.5-flash-image";
        }
      }

      const chat = ai.chats.create({
        model: modelName,
        config: { systemInstruction },
        history: currentHistory.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }))
      });

      let response;
      if (uploadedImage) {
        const parts = [
          { text: currentInput || "Analyze this image for medical context." },
          { inlineData: { data: uploadedImage.split(',')[1], mimeType: "image/jpeg" } }
        ];
        response = await ai.models.generateContent({
          model: "gemini-2.5-flash-image",
          contents: { parts },
          config: { systemInstruction }
        });
        setUploadedImage(null);
      } else {
        response = await chat.sendMessage({ message: currentInput });
      }

      const modelMsg: ChatMessage = {
        role: 'model',
        text: response.text || "I'm sorry, I couldn't process that.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      if (activeMode === 'directory' && selectedDoctor) {
        setDirectoryMessages(prev => ({
          ...prev,
          [selectedDoctor.id]: [...(prev[selectedDoctor.id] || []), modelMsg]
        }));
      } else if (activeChatType === 'biruk') setChatMessages(prev => [...prev, modelMsg]);
      else if (activeChatType === 'dagim') {
        setDagimMessages(prev => [...prev, modelMsg]);
        if (currentInput.toLowerCase().includes('skin')) {
          setTimeout(() => {
            setActiveChatType('specialist');
            setSelectedSpecialist(SPECIALISTS.find(s => s.id === 'skin') || null);
          }, 2000);
        }
      }
      else if (activeChatType === 'mri') {
        setMriMessages(prev => [...prev, modelMsg]);
        if (uploadedImage) {
          setMriAnalysis(modelMsg.text);
          // Simulate arrow generation on image
          setMriResultImage(uploadedImage); 
        }
      }
      else if (activeChatType === 'ambulance') {
        setAmbulanceMessages(prev => [...prev, modelMsg]);
        if (currentInput.toLowerCase().includes('confirm') || currentInput.toLowerCase().includes('yes')) {
          setIsAmbulanceMoving(true);
        }
      }
      else if (activeMode === 'pharmacy') {
        setPharmacyChat(prev => [...prev, modelMsg]);
        if (currentInput.length === 6 && !isNaN(Number(currentInput))) {
          setPrescriptionCode(currentInput);
          setPharmacyStep('drone');
          setIsDroneMoving(true);
          setTimeout(() => {
            setIsDroneMoving(false);
            alert("Order Delivered Successfully by Drone!");
          }, 8000);
        }
      }
      else if (selectedSpecialist) {
        setSpecialistMessages(prev => ({
          ...prev,
          [selectedSpecialist.id]: [...(prev[selectedSpecialist.id] || []), modelMsg]
        }));
      }

    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const fetchHospitals = async () => {
    if (!userData) return;
    setIsLoadingHospitals(true);
    setShowHospitals(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Search for hospitals and clinics in ${userData.location}, Ethiopia. Return a list of at least 5 facilities with their names and Google Maps links.`,
        config: {
          tools: [{ googleMaps: {} }]
        },
      });

      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks && chunks.length > 0) {
        const hospitalList = chunks
          .filter(chunk => chunk.maps)
          .map(chunk => ({
            title: chunk.maps?.title || 'Medical Facility',
            uri: chunk.maps?.uri || `https://www.google.com/maps/search/${encodeURIComponent(chunk.maps?.title || 'hospital')}+${encodeURIComponent(userData.location)}`
          }));
        setHospitals(hospitalList);
      } else {
        // Fallback if grounding fails
        setHospitals([]);
      }
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      setHospitals([]);
    } finally {
      setIsLoadingHospitals(false);
    }
  };

  const downloadTicketPDF = async () => {
    const element = document.getElementById('ticket-container');
    if (!element) return;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
    pdf.save(`ticket-${ticketData?.ticketId}.pdf`);
  };

  const isNight = theme === 'night';
  const isMinor = userData && userData.age < 18;
  
  const bgColor = isNight ? 'bg-slate-50' : 'bg-slate-950';
  const textColor = isNight ? 'text-black' : 'text-white';
  const glassBg = isNight ? 'bg-black/5' : 'bg-white/5';
  const glassBorder = isNight ? 'border-black/10' : 'border-white/10';

  // Minor styling: blue black color and very 3d
  const minorTitleStyle = isMinor ? {
    color: '#001f3f', // Blue black
    textShadow: '0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15)'
  } : {
    textShadow: isNight 
      ? '2px 2px 0px #fff, 4px 4px 0px #ddd, 6px 6px 20px rgba(0,0,0,0.1)' 
      : '2px 2px 0px #000, 4px 4px 0px #111, 6px 6px 20px rgba(255,255,255,0.1)',
  };

  const services = [
    { name: 'Rag', icon: Scan, desc: 'Advanced Radiology & X-Ray services' },
    { name: 'MRI', icon: Box, desc: 'High-precision Magnetic Resonance Imaging' },
    { name: 'Doctor Assistant', icon: UserCog, desc: 'Personalized AI medical assistance' },
    { name: 'Deliver Ambulance', icon: Truck, desc: 'Emergency response and transport' },
    { name: 'Buy Ticket', icon: TicketIcon, desc: 'Book appointments and travel' },
    { name: 'Order Pharmacy', icon: ShoppingBag, desc: 'Prescription and OTC products' },
    { name: 'Specialist Section', icon: Stethoscope, desc: 'Consult with top medical experts' },
  ];

  if (isLoading) {
    return (
      <div className={`h-screen w-full ${bgColor} flex flex-col items-center justify-center gap-8`}>
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 360],
            filter: ["hue-rotate(0deg)", "hue-rotate(360deg)"]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="p-8 rounded-full bg-blue-500/20 backdrop-blur-xl border border-blue-500/50"
        >
          <Stethoscope size={80} className="text-blue-500" />
        </motion.div>
        <div className="flex flex-col items-center gap-2">
          <h2 className={`text-2xl font-black tracking-widest ${textColor}`}>VIRTUAL DOCTOR</h2>
          <div className="w-48 h-1 bg-blue-500/20 rounded-full overflow-hidden">
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-full h-full bg-blue-500"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} transition-colors duration-700 overflow-x-hidden font-sans relative`}>
      
      {/* City Background Photo (Visible after registration) */}
      <AnimatePresence>
        {userData && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 0.5,
              x: mousePos.x / 20,
              y: mousePos.y / 20,
              scale: 1.1
            }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <img 
              src={`https://picsum.photos/seed/${userData.location}/1920/1080`}
              alt={userData.location}
              className="w-full h-full object-cover transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
            {/* Global Watermark Overlay */}
            <div className="absolute bottom-10 right-10 z-[200] opacity-40 select-none pointer-events-none text-right">
              <h4 className="text-5xl font-black tracking-tighter text-blue-500 drop-shadow-2xl">ASTU AI LABS</h4>
              <p className="text-[10px] font-bold uppercase tracking-[0.6em] text-white drop-shadow-md">Virtual Doctor 3D Platform</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Background Elements */}
      <div className="absolute inset-0 z-0 flex items-center justify-center perspective-1000">
        <EthiopianFlag />
        {bgElements.map((el) => (
          <FloatingElement 
            key={el.id} 
            {...el} 
            mouseX={mouseX} 
            mouseY={mouseY} 
          />
        ))}
      </div>

      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center backdrop-blur-xl border-b ${glassBorder}`}>
        <div className="flex items-center gap-8">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => {
              setIsLocationLoading(true);
              setTimeout(() => {
                setIsLocationLoading(false);
                setShowLocations(true);
              }, 1500);
            }}
          >
            <div className={`p-2 rounded-lg ${glassBg} group-hover:bg-blue-500/20 transition-colors`}>
              <MapPin size={20} style={{ color: accentColor }} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs opacity-50 uppercase tracking-widest">Location</span>
              <span className="text-sm font-bold">
                {userData ? `${userData.name} @ ${userData.location}` : 'Select City'}
              </span>
            </div>
          </motion.div>

          <div className="hidden lg:flex items-center gap-6">
            {[
              { name: 'Home', icon: HomeIcon, action: () => {} },
              { name: 'About', icon: Info, action: () => setShowAbout(true) },
              { name: 'Register', icon: UserPlus, action: () => setShowRegister(true) }
            ].map((item) => (
              <motion.button
                key={item.name}
                whileHover={{ y: -2 }}
                onClick={item.action}
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${glassBg} border ${glassBorder} hover:border-blue-500/50 transition-all text-sm font-medium`}
              >
                <item.icon size={16} />
                {item.name}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Color Picker "C" Button */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-xl shadow-lg flex items-center justify-center border-2 border-white/20"
              style={{ backgroundColor: accentColor }}
            >
              C
            </motion.button>
            <AnimatePresence>
              {showColorPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className={`absolute top-12 right-0 p-3 rounded-2xl border ${glassBorder} ${isNight ? 'bg-white' : 'bg-slate-900'} shadow-2xl grid grid-cols-5 gap-2 z-50`}
                >
                  {['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#6366f1', '#ffffff'].map(c => (
                    <button 
                      key={c}
                      onClick={() => {
                        setAccentColor(c);
                        if (c === '#ffffff') setTheme('light');
                        setShowColorPicker(false);
                      }}
                      className="w-8 h-8 rounded-full border border-white/20 shadow-sm hover:scale-110 transition-transform"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(theme === 'light' ? 'night' : 'light')}
            className={`p-3 rounded-2xl ${glassBg} border ${glassBorder} hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all`}
          >
            {isNight ? <Moon size={20} /> : <Sun size={20} />}
          </motion.button>

          {isLoggedIn ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsLoggedIn(false)}
              className="px-4 py-2 bg-red-500/20 text-red-500 border border-red-500/50 rounded-xl text-sm font-bold"
            >
              Logout
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowLogin(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg"
            >
              Login
            </motion.button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      {activeMode === 'home' && (
        <main className="relative z-10 h-screen flex flex-col items-center justify-center px-4">
          <CellAnimation />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <div className="relative mb-8">
              {/* Auto-scrolling background photos behind title */}
              <div className="absolute inset-0 -z-10 overflow-hidden opacity-20 blur-sm">
                <motion.div 
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="flex w-[200%] h-full gap-4"
                >
                  {Array.from({ length: 10 }).map((_, i) => (
                    <img 
                      key={i} 
                      src={`https://picsum.photos/seed/med-${i}/800/400`} 
                      className="h-full object-cover rounded-3xl"
                    />
                  ))}
                </motion.div>
              </div>

              <h1 
                onClick={() => setTitleLightOn(!titleLightOn)}
                className={`text-7xl md:text-9xl font-black tracking-tighter select-none transition-all duration-500 bg-clip-text text-transparent cursor-pointer`}
                style={{
                  ...minorTitleStyle,
                  backgroundImage: `linear-gradient(to bottom right, ${accentColor}, ${isNight ? '#000' : '#fff'})`,
                  transform: `perspective(1000px) rotateX(${-mousePos.y / 50}deg) rotateY(${mousePos.x / 50}deg)`,
                  filter: titleLightOn ? `drop-shadow(0 0 20px ${accentColor}88)` : 'none',
                  fontSize: userData?.location === 'Addis Ababa' ? '12vw' : undefined
                }}
              >
                {userData?.location === 'Addis Ababa' ? 'HUGE BUILDING' : 'VIRTUAL'}<br />DOCTORS
              </h1>
              {userData?.location === 'Addis Ababa' && (
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 opacity-10 pointer-events-none">
                  <Box size={300} />
                </div>
              )}
            </div>
            
            <p className="text-lg md:text-xl opacity-60 max-w-2xl mx-auto font-light tracking-wide h-8">
              {userData ? (
                <Typewriter text={`Welcome back, ${userData.name}. Your healthcare portal for ${userData.location} is ready.`} />
              ) : (
                <Typewriter text="Next-generation healthcare delivered through immersive technology." />
              )}
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-6">
              {!userData ? (
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: `0 0 30px ${accentColor}88` }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowRegister(true)}
                  className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl transition-all"
                  style={{ backgroundColor: accentColor }}
                >
                  Register Now
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(16,185,129,0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchHospitals}
                  className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-xl transition-all flex items-center gap-2"
                >
                  <Search size={20} />
                  View Section
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: isNight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)' }}
                className={`px-8 py-4 rounded-2xl border ${glassBorder} backdrop-blur-md font-bold text-lg transition-all`}
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30"
          >
            <ChevronDown size={32} />
          </motion.div>
        </main>
      )}

      {/* Directory Screen (Chat with People) */}
      {activeMode === 'directory' && (
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[200] bg-slate-900 flex flex-col md:flex-row overflow-hidden font-sans"
        >
          {/* Sidebar */}
          <div className="w-full md:w-80 border-r border-white/10 flex flex-col bg-slate-950">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-black tracking-tighter text-white">DOCTORS</h2>
              <button onClick={() => setActiveMode('home')} className="p-2 hover:bg-white/10 rounded-full text-white"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {DOCTOR_DIRECTORY.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDoctor(doc)}
                  className={`w-full p-4 flex items-center gap-4 hover:bg-white/5 transition-colors border-b border-white/5 ${selectedDoctor?.id === doc.id ? 'bg-blue-600/20 border-l-4 border-l-blue-500' : ''}`}
                >
                  <div className="relative">
                    <img src={doc.photo} className="w-12 h-12 rounded-full border-2 border-white/10" />
                    {doc.status === 'online' && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950" />}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-white">{doc.name}</p>
                    <p className="text-[10px] opacity-50 text-white uppercase tracking-widest">{doc.specialty}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-slate-900 relative">
            {selectedDoctor ? (
              <>
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-950/50 backdrop-blur-xl">
                  <div className="flex items-center gap-4">
                    <img src={selectedDoctor.photo} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="text-sm font-bold text-white">{selectedDoctor.name}</p>
                      <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">{selectedDoctor.status}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsVideoCallOpen(true)}
                      className="p-3 bg-blue-600/20 text-blue-500 rounded-2xl hover:bg-blue-600 hover:text-white transition-all"
                    >
                      <Video size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {(directoryMessages[selectedDoctor.id] || []).map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] p-4 rounded-3xl text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}>
                        <Markdown>{msg.text}</Markdown>
                        <p className="text-[10px] opacity-40 mt-2 text-right">{msg.timestamp}</p>
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-slate-800 p-4 rounded-3xl rounded-tl-none">
                        <Loader2 className="animate-spin text-blue-500" size={16} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 border-t border-white/10 bg-slate-950/50 backdrop-blur-xl">
                  <div className="flex flex-col gap-4">
                    {uploadedImage && (
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-blue-500">
                        <img src={uploadedImage} className="w-full h-full object-cover" />
                        <button onClick={() => setUploadedImage(null)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"><X size={12} /></button>
                      </div>
                    )}
                    <div className="flex gap-4">
                      <label className="p-4 bg-slate-800 text-white rounded-2xl hover:bg-slate-700 transition-all cursor-pointer">
                        <Camera size={20} />
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                      <input 
                        type="text"
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 bg-slate-800 border border-white/10 rounded-2xl px-6 py-3 text-white focus:outline-none focus:border-blue-500 transition-all"
                      />
                      <button 
                        onClick={handleSendMessage}
                        className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg"
                      >
                        <Send size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-20">
                <MessageSquare size={80} className="mb-6 text-white" />
                <h3 className="text-2xl font-black text-white">SELECT A DOCTOR</h3>
                <p className="text-white">Choose a specialist from the list to start a conversation.</p>
              </div>
            )}
            
            <AnimatePresence>
              {isVideoCallOpen && selectedDoctor && (
                <VideoCallModal doctor={selectedDoctor} onClose={() => setIsVideoCallOpen(false)} />
              )}
            </AnimatePresence>

            {/* Back Button for Mobile */}
            <button 
              onClick={() => setActiveMode('home')}
              className="absolute bottom-6 left-6 p-4 bg-slate-800 text-white rounded-full shadow-2xl hover:bg-slate-700 transition-all md:hidden"
            >
              <ArrowRight className="rotate-180" size={24} />
            </button>
          </div>
        </motion.main>
      )}

      {/* MRI Screen */}
      {activeMode === 'mri' && (
        <main className="relative z-10 min-h-screen pt-32 px-6 flex flex-col items-center">
          <button 
            onClick={() => setActiveMode('home')}
            className="absolute top-32 right-10 p-4 rounded-full bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white transition-all z-50"
          >
            <X size={24} />
          </button>
          <div className="max-w-4xl w-full space-y-12">
            <div className="text-center">
              <h2 className="text-6xl font-black mb-4">MRI & RAG SYSTEM</h2>
              <p className="opacity-50">Advanced Diagnostic Imaging Analysis</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={`p-8 rounded-[40px] border ${glassBorder} ${glassBg} backdrop-blur-2xl`}>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><Scan className="text-blue-500" /> Upload Scan</h3>
                <div className="aspect-square rounded-3xl border-4 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 relative overflow-hidden group">
                  {uploadedImage ? (
                    <img src={uploadedImage} className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Box size={64} className="opacity-20 group-hover:scale-110 transition-transform" />
                      <p className="text-sm opacity-50">Drop MRI or X-Ray here</p>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <button 
                  onClick={() => {
                    setActiveChatType('mri');
                    setIsChatOpen(true);
                  }}
                  className="w-full mt-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2"
                >
                  <Search size={20} /> Analyze with AI
                </button>
              </div>

              <div className={`p-8 rounded-[40px] border ${glassBorder} ${glassBg} backdrop-blur-2xl flex flex-col`}>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><Activity className="text-emerald-500" /> AI Findings</h3>
                <div className="flex-1 space-y-4">
                  {mriAnalysis ? (
                    <div className="p-6 rounded-3xl bg-black/20 border border-white/5">
                      <Markdown>{mriAnalysis}</Markdown>
                      {mriResultImage && (
                        <div className="mt-6 relative rounded-2xl overflow-hidden border-2 border-red-500/50">
                          <img src={mriResultImage} className="w-full" />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500 animate-pulse">
                            <ArrowRight size={48} className="rotate-45" />
                          </div>
                          <div className="absolute bottom-2 left-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded font-bold uppercase">Detected Issue</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-20 text-center">
                      <Loader2 size={48} className="mb-4" />
                      <p>Waiting for scan analysis...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button onClick={() => setActiveMode('home')} className="mx-auto block text-sm opacity-50 underline hover:opacity-100">Back to Home</button>
          </div>
        </main>
      )}

      {/* Ticket Screen */}
      {activeMode === 'ticket' && (
        <main className="relative z-10 min-h-screen pt-32 px-6 flex flex-col items-center">
          <button 
            onClick={() => setActiveMode('home')}
            className="absolute top-32 right-10 p-4 rounded-full bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white transition-all z-50"
          >
            <X size={24} />
          </button>
          <div className="max-w-4xl w-full flex flex-col items-center gap-12">
            <div className="text-center">
              <h2 className="text-6xl font-black mb-4">BUY TICKET</h2>
              <p className="opacity-50">Book your medical appointment instantly</p>
            </div>

            {ticketData ? (
              <TicketView data={ticketData} onDownload={downloadTicketPDF} />
            ) : (
              <div className={`w-full max-w-xl p-10 rounded-[40px] border ${glassBorder} ${glassBg} backdrop-blur-2xl shadow-2xl`}>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase opacity-50">Full Name</label>
                      <input 
                        type="text" 
                        placeholder="Enter name"
                        className={`w-full p-4 rounded-2xl border ${glassBorder} ${glassBg} focus:border-blue-500 outline-none`}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase opacity-50">Hospital</label>
                      <select className={`w-full p-4 rounded-2xl border ${glassBorder} ${glassBg} focus:border-blue-500 outline-none`}>
                        <option>Black Lion Hospital</option>
                        <option>St. Paul Hospital</option>
                        <option>Hayat Hospital</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase opacity-50">Phone Number</label>
                      <input 
                        type="tel" 
                        placeholder="+251 ..."
                        className={`w-full p-4 rounded-2xl border ${glassBorder} ${glassBg} focus:border-blue-500 outline-none`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase opacity-50">Payment Method</label>
                      <div className="flex gap-2">
                        {['Telebirr', 'CBE Birr', 'Card'].map(p => (
                          <button key={p} className={`flex-1 p-2 rounded-xl border ${glassBorder} text-xs font-bold hover:bg-blue-500 hover:text-white transition-all`}>{p}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setTicketData({
                      name: formData.name || 'Guest Patient',
                      hospital: 'Black Lion Hospital',
                      phone: '+251 911 000 000',
                      location: userData?.location || 'Addis Ababa',
                      paymentMethod: 'Telebirr',
                      date: new Date().toLocaleDateString(),
                      ticketId: `VD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
                    })}
                    className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-xl shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-3"
                  >
                    <Save size={24} /> Generate Ticket
                  </button>
                </div>
              </div>
            )}
            <button onClick={() => setActiveMode('home')} className="text-sm opacity-50 underline hover:opacity-100">Back to Home</button>
          </div>
        </main>
      )}

      {/* Ambulance Screen */}
      {activeMode === 'ambulance' && (
        <main className="relative z-10 min-h-screen pt-32 px-6 flex flex-col items-center overflow-hidden">
          <button 
            onClick={() => {
              setActiveMode('home');
              setIsAmbulanceMoving(false);
            }}
            className="absolute top-32 right-10 p-4 rounded-full bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white transition-all z-50"
          >
            <X size={24} />
          </button>
          <div className="max-w-7xl w-full space-y-12">
            <div className="text-center">
              <h2 className="text-6xl font-black mb-4 text-white">EMERGENCY AMBULANCE</h2>
              <p className="opacity-50 text-white">Rapid response at your doorstep</p>
            </div>

            <div className="relative h-[400px] w-full bg-black/20 rounded-[50px] border border-white/5 overflow-hidden">
              {/* Ambulance Animation */}
              <AnimatePresence>
                {isAmbulanceMoving ? (
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
                  >
                    <div className="relative">
                      <Truck size={120} className="text-red-500" />
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-2">
                        <motion.div animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.2 }} className="w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_20px_blue]" />
                        <motion.div animate={{ opacity: [0, 1] }} transition={{ repeat: Infinity, duration: 0.2 }} className="w-4 h-4 bg-red-500 rounded-full shadow-[0_0_20px_red]" />
                      </div>
                    </div>
                    <p className="mt-4 font-black text-red-500 tracking-widest animate-pulse">AMBULANCE ON THE WAY!</p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-5 gap-8 p-12">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.1, y: -10 }}
                        className={`p-6 rounded-3xl border ${glassBorder} ${glassBg} flex flex-col items-center gap-4`}
                      >
                        <Truck size={48} className="text-red-500" />
                        <span className="text-[10px] font-bold opacity-50 text-white">UNIT #{100 + i}</span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex justify-center">
              <button 
                onClick={() => {
                  setIsAmbulanceMoving(true);
                  setActiveChatType('ambulance');
                  setIsChatOpen(true);
                }}
                className="px-12 py-6 bg-red-600 text-white rounded-[32px] font-black text-2xl shadow-2xl shadow-red-500/40 flex items-center gap-4 animate-bounce"
              >
                <Phone size={32} /> REQUEST EMERGENCY
              </button>
            </div>
            <button onClick={() => setActiveMode('home')} className="mx-auto block text-sm opacity-50 underline hover:opacity-100 text-white">Back to Home</button>
          </div>
        </main>
      )}

      {/* Pharmacy Screen */}
      {activeMode === 'pharmacy' && (
        <main className="relative z-10 min-h-screen pt-32 px-6 flex flex-col items-center overflow-hidden font-sans">
          <button 
            onClick={() => setActiveMode('home')}
            className="absolute top-32 right-10 p-4 rounded-full bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white transition-all z-50"
          >
            <X size={24} />
          </button>

          {isDroneMoving && <DroneAnimation />}

          <div className="max-w-7xl w-full space-y-12">
            <div className="text-center">
              <h2 className="text-6xl font-black mb-4 text-white tracking-tighter">VIRTUAL PHARMACY</h2>
              <p className="opacity-50 text-white uppercase tracking-[0.5em] text-sm font-bold">Local Pharmacies in {userData?.location || 'Addis Ababa'}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Shop Area */}
              <div className="lg:col-span-2 space-y-8">
                <div className={`p-8 rounded-[40px] border ${glassBorder} ${glassBg} backdrop-blur-2xl`}>
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black text-white">Product Catalog</h3>
                    <div className="flex gap-4">
                      {PHARMACIES[userData?.location || "Addis Ababa"]?.map(ph => (
                        <div key={ph.name} className="px-4 py-2 bg-blue-500/10 rounded-xl border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                          {ph.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {PHARMACY_PRODUCTS.map(product => (
                      <motion.div
                        key={product.id}
                        whileHover={{ y: -5 }}
                        className={`p-4 rounded-3xl border ${glassBorder} ${glassBg} group cursor-pointer`}
                        onClick={() => {
                          if (!selectedProducts.find(p => p.id === product.id)) {
                            setSelectedProducts([...selectedProducts, product]);
                          }
                        }}
                      >
                        <div className="aspect-square rounded-2xl overflow-hidden mb-4 relative">
                          <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          {product.requiresPrescription && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg">
                              <AlertCircle size={14} />
                            </div>
                          )}
                        </div>
                        <h4 className="font-bold text-white text-sm mb-1">{product.name}</h4>
                        <div className="flex justify-between items-center">
                          <p className="text-blue-400 font-black">{product.price} ETB</p>
                          <button className="p-2 bg-blue-600 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                            <PharmacyIcon size={14} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Checkout & Character */}
              <div className="space-y-8">
                {/* Animated Girl Character */}
                <div className={`p-8 rounded-[40px] border ${glassBorder} ${glassBg} backdrop-blur-2xl relative overflow-hidden`}>
                  <div className="flex flex-col items-center text-center space-y-4">
                    <motion.div
                      animate={{ 
                        y: [0, -5, 0],
                        rotate: [0, 2, -2, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-32 h-32 rounded-full border-4 border-pink-500/30 overflow-hidden shadow-[0_0_30px_rgba(236,72,153,0.3)]"
                    >
                      <img src="https://picsum.photos/seed/girl/200/200" className="w-full h-full object-cover" />
                    </motion.div>
                    <div>
                      <h4 className="text-xl font-black text-white">Sara</h4>
                      <p className="text-[10px] text-pink-400 font-bold uppercase tracking-widest">Pharmacy Assistant</p>
                    </div>
                    <div className="bg-black/20 p-4 rounded-2xl border border-white/5 text-sm text-slate-200 italic">
                      {selectedProducts.length === 0 ? (
                        <Typewriter text={`Hi ${userData?.name || 'Guest'}! I'm Sara. Do you want any products today?`} />
                      ) : selectedProducts.some(p => p.requiresPrescription) && !prescriptionCode ? (
                        <Typewriter text="Oh, some of these need a doctor's receipt. Do you have a prescription code?" />
                      ) : (
                        <Typewriter text="Great choices! Shall we proceed to delivery?" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Cart & Prescription */}
                <div className={`p-8 rounded-[40px] border ${glassBorder} ${glassBg} backdrop-blur-2xl space-y-6`}>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <PharmacyIcon className="text-blue-500" /> Your Cart
                  </h3>
                  
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                    {selectedProducts.map(p => (
                      <div key={p.id} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-xs text-white font-medium">{p.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-blue-400">{p.price} ETB</span>
                          <button onClick={() => setSelectedProducts(selectedProducts.filter(item => item.id !== p.id))} className="text-red-500"><X size={14} /></button>
                        </div>
                      </div>
                    ))}
                    {selectedProducts.length === 0 && <p className="text-xs opacity-30 text-center py-4 text-white">Your cart is empty</p>}
                  </div>

                  {selectedProducts.some(p => p.requiresPrescription) && (
                    <div className="space-y-3 pt-4 border-t border-white/10">
                      <p className="text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center gap-2">
                        <AlertCircle size={12} /> Prescription Required
                      </p>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          placeholder="Enter 6-digit code"
                          value={currentInput}
                          onChange={(e) => setCurrentInput(e.target.value)}
                          className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                        <button 
                          onClick={handleSendMessage}
                          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                        >
                          Verify
                        </button>
                      </div>
                      <button 
                        onClick={() => {
                          setActiveMode('directory');
                          setSelectedDoctor(DOCTOR_DIRECTORY[0]);
                        }}
                        className="w-full text-[10px] text-blue-400 underline text-center"
                      >
                        Don't have a code? Request a doctor
                      </button>
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-bold text-white">Total</span>
                      <span className="text-xl font-black text-blue-500">{selectedProducts.reduce((sum, p) => sum + p.price, 0)} ETB</span>
                    </div>
                    <button 
                      disabled={selectedProducts.length === 0 || (selectedProducts.some(p => p.requiresPrescription) && !prescriptionCode)}
                      onClick={() => {
                        setPharmacyStep('drone');
                        setIsDroneMoving(true);
                        setTimeout(() => {
                          setIsDroneMoving(false);
                          alert("Order Delivered Successfully by Drone!");
                        }, 8000);
                      }}
                      className="w-full py-4 bg-emerald-600 disabled:bg-slate-700 text-white rounded-2xl font-black shadow-xl flex items-center justify-center gap-2 transition-all"
                    >
                      <Navigation size={20} /> Order & Drone Delivery
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Services Section */}
      {activeMode === 'home' && (
        <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black mb-4 tracking-tight">OUR SERVICES</h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ 
                  y: -10, 
                  backgroundColor: isNight ? 'rgba(59,130,246,0.05)' : 'rgba(255,255,255,0.05)',
                  borderColor: 'rgba(59,130,246,0.5)'
                }}
                onClick={() => {
                  if (service.name === 'Doctor Assistant') {
                    setActiveChatType('dagim');
                    setIsChatOpen(true);
                  } else if (service.name === 'Specialist Section') {
                    setActiveChatType('specialist');
                    setIsChatOpen(true);
                  } else if (service.name === 'Rag' || service.name === 'MRI') {
                    setActiveMode('mri');
                  } else if (service.name === 'Order Pharmacy') {
                    setActiveMode('pharmacy');
                  } else if (service.name === 'Buy Ticket') {
                    setActiveMode('ticket');
                  } else if (service.name === 'Deliver Ambulance') {
                    setActiveMode('ambulance');
                  }
                }}
                className={`p-8 rounded-3xl border ${glassBorder} backdrop-blur-xl transition-all group cursor-pointer`}
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <service.icon size={32} style={{ color: accentColor }} />
                </div>
                <h3 className="text-2xl font-bold mb-2">{service.name}</h3>
                <p className="opacity-50 text-sm leading-relaxed">{service.desc}</p>
                
                <div className="mt-6 flex items-center gap-2 text-blue-500 font-bold text-sm">
                  Access Now <ChevronRight size={16} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Chatbot Toggle Button (Cat Icon) */}
      <div className="fixed bottom-8 right-8 z-[150] flex flex-col gap-4 items-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveMode('directory')}
          className="px-6 py-3 bg-white text-blue-600 rounded-full font-bold shadow-2xl flex items-center gap-2 border border-blue-100"
        >
          <MessageSquare size={20} /> Chat with People
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setIsChatOpen(!isChatOpen);
            if (!isChatOpen && chatMessages.length === 0) {
              setChatMessages([{
                role: 'model',
                text: 'Hi! How are you? I am DR Biruk. How can I assist you today?',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }]);
            }
          }}
          className="w-16 h-16 rounded-full bg-blue-600 text-white shadow-2xl flex items-center justify-center hover:shadow-blue-500/40 transition-shadow"
          style={{ backgroundColor: accentColor }}
        >
          {isChatOpen ? <X size={28} /> : <MessageSquare size={28} />}
          {!isChatOpen && (
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"
            />
          )}
        </motion.button>
      </div>

      {/* Footer */}
      <footer className={`relative z-10 py-20 px-6 border-t ${glassBorder} backdrop-blur-3xl`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <h3 className="text-2xl font-black tracking-tighter">VIRTUAL DOCTOR 3D</h3>
            <p className="text-sm opacity-50">© 2026 ASTU AI LABS. All rights reserved.</p>
          </div>
          
          <div className="flex gap-6">
            {[
              { icon: Facebook, color: '#1877F2' },
              { icon: Twitter, color: '#1DA1F2' },
              { icon: Instagram, color: '#E4405F' },
              { icon: Youtube, color: '#FF0000' }
            ].map((social, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ y: -5, scale: 1.1 }}
                className={`p-4 rounded-2xl border ${glassBorder} ${glassBg} transition-all`}
                style={{ color: social.color }}
              >
                <social.icon size={24} />
              </motion.a>
            ))}
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-xs font-bold opacity-30 uppercase tracking-[0.2em]">Developed By</p>
            <p className="text-lg font-black tracking-tighter text-blue-500">ASTU AI LABS</p>
          </div>
        </div>
      </footer>

      {/* Chatbot Window (Telegram Style) */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className={`fixed bottom-28 right-8 z-[160] w-[380px] h-[600px] rounded-[32px] border ${glassBorder} ${isNight ? 'bg-white' : 'bg-slate-900'} shadow-2xl flex flex-col overflow-hidden`}
          >
            {/* Chat Header */}
            <div className="p-4 bg-blue-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src={
                      activeChatType === 'biruk' ? "https://picsum.photos/seed/biruk/100/100" :
                      activeChatType === 'dagim' ? "https://picsum.photos/seed/dagim/100/100" :
                      selectedSpecialist?.photo || "https://picsum.photos/seed/specialist/100/100"
                    } 
                    alt="Doctor" 
                    className="w-12 h-12 rounded-full border-2 border-white/20 object-cover"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold">
                    {activeChatType === 'biruk' ? 'DR Biruk' : 
                     activeChatType === 'dagim' ? 'Dr. Dagim' : 
                     selectedSpecialist?.name || 'Specialist'}
                  </h3>
                  <p className="text-[10px] opacity-80 uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Online Assistant
                  </p>
                  <p className="text-[8px] opacity-50 font-bold tracking-tighter">Produced by ASTU ai labs</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    const langs = ['English', 'Amharic', 'Oromo', 'Tigrinya'];
                    const next = langs[(langs.indexOf(chatLanguage) + 1) % langs.length];
                    setChatLanguage(next);
                  }}
                  className="p-2 rounded-full hover:bg-white/10 flex items-center gap-1 text-[10px] font-bold"
                >
                  <Languages size={14} /> {chatLanguage}
                </button>
                <button onClick={() => setIsChatOpen(false)} className="p-2 rounded-full hover:bg-white/10"><X size={20} /></button>
              </div>
            </div>

            {/* Specialist Selection (if in specialist mode and none selected) */}
            {activeChatType === 'specialist' && !selectedSpecialist && (
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                <h4 className="font-bold text-center mb-4">Choose a Specialist</h4>
                {SPECIALISTS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSpecialist(s)}
                    className={`w-full p-4 rounded-2xl border ${glassBorder} ${glassBg} hover:border-blue-500 flex items-center gap-4 transition-all`}
                  >
                    <img src={s.photo} className="w-12 h-12 rounded-full" />
                    <div className="text-left">
                      <p className="font-bold">{s.name}</p>
                      <p className="text-xs opacity-50">{s.type}</p>
                    </div>
                  </button>
                ))}
                <button onClick={() => setActiveChatType('biruk')} className="w-full p-2 text-xs opacity-50 underline">Back to General Chat</button>
              </div>
            )}

            {/* Chat Messages */}
            {(activeChatType !== 'specialist' || selectedSpecialist) && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-100/50 dark:bg-black/20">
                {(activeChatType === 'biruk' ? chatMessages : 
                  activeChatType === 'dagim' ? dagimMessages : 
                  activeChatType === 'mri' ? mriMessages :
                  activeChatType === 'ambulance' ? ambulanceMessages :
                  selectedSpecialist ? specialistMessages[selectedSpecialist.id] : []).map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}
                  >
                    {msg.role === 'model' && (
                      <img 
                        src={activeChatType === 'biruk' ? 'https://picsum.photos/seed/biruk/50/50' : 
                             activeChatType === 'dagim' ? 'https://picsum.photos/seed/dagim/50/50' :
                             selectedSpecialist ? selectedSpecialist.photo : 'https://picsum.photos/seed/ai/50/50'} 
                        className="w-8 h-8 rounded-full border border-white/20"
                      />
                    )}
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm relative ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : (isNight ? 'bg-white text-black' : 'bg-slate-800 text-white') + ' rounded-tl-none'
                    }`}>
                      <Markdown>{msg.text}</Markdown>
                      <span className={`text-[9px] block mt-1 opacity-50 text-right`}>
                        {msg.timestamp}
                      </span>
                    </div>
                    {msg.role === 'user' && userData?.profilePhoto && (
                      <img src={userData.profilePhoto} className="w-8 h-8 rounded-full border border-white/20" />
                    )}
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className={`p-3 rounded-2xl ${isNight ? 'bg-white' : 'bg-slate-800'} rounded-tl-none flex gap-1`}>
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Chat Input */}
            {(activeChatType !== 'specialist' || selectedSpecialist) && (
              <div className={`p-4 border-t ${glassBorder} flex flex-col gap-2`}>
                {uploadedImage && (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-blue-500">
                    <img src={uploadedImage} className="w-full h-full object-cover" />
                    <button onClick={() => setUploadedImage(null)} className="absolute top-0 right-0 bg-red-500 text-white p-0.5"><X size={10} /></button>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <label className="p-2 rounded-xl bg-black/5 border border-white/10 cursor-pointer hover:bg-black/10 transition-colors">
                    <Scan size={20} className="text-blue-500" />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  <input 
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className={`flex-1 p-3 rounded-2xl border ${glassBorder} ${glassBg} focus:outline-none focus:border-blue-500 text-sm`}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSendMessage}
                    className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg"
                  >
                    <Send size={20} />
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Registration Modal */}
      <AnimatePresence>
        {showRegister && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-2xl bg-black/60"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`w-full max-w-xl rounded-3xl border ${glassBorder} ${isNight ? 'bg-white' : 'bg-slate-900'} shadow-2xl overflow-hidden`}
            >
              <div className={`p-6 border-b ${glassBorder} flex justify-between items-center`}>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <UserPlus className="text-blue-500" />
                  Patient Registration
                </h2>
                <button onClick={() => setShowRegister(false)} className="p-2 rounded-full hover:bg-black/5"><X /></button>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex justify-center mb-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full border-4 border-blue-500/30 overflow-hidden bg-slate-100 flex items-center justify-center">
                      {formData.profilePhoto ? (
                        <img src={formData.profilePhoto} className="w-full h-full object-cover" />
                      ) : (
                        <User size={48} className="opacity-20" />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform">
                      <Scan size={14} />
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setFormData({...formData, profilePhoto: reader.result as string});
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase opacity-50 flex items-center gap-2"><User size={14} /> Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className={`w-full p-3 rounded-xl border ${glassBorder} ${glassBg} focus:outline-none focus:border-blue-500 transition-all`}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase opacity-50 flex items-center gap-2">Email Address</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={`w-full p-3 rounded-xl border ${glassBorder} ${glassBg} focus:outline-none focus:border-blue-500 transition-all`}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase opacity-50 flex items-center gap-2"><MapPin size={14} /> Location</label>
                    <select 
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className={`w-full p-3 rounded-xl border ${glassBorder} ${glassBg} focus:outline-none focus:border-blue-500 transition-all`}
                    >
                      {ETHIOPIAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase opacity-50 flex items-center gap-2">Age</label>
                    <input 
                      type="number" 
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                      className={`w-full p-3 rounded-xl border ${glassBorder} ${glassBg} focus:outline-none focus:border-blue-500 transition-all`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase opacity-50 flex items-center gap-2"><Calendar size={14} /> Birth Date</label>
                    <input 
                      type="date" 
                      value={formData.birthDate}
                      onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                      className={`w-full p-3 rounded-xl border ${glassBorder} ${glassBg} focus:outline-none focus:border-blue-500 transition-all`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase opacity-50 flex items-center gap-2">Gender</label>
                    <div className="flex gap-4">
                      {['Male', 'Female'].map(g => (
                        <button
                          key={g}
                          onClick={() => setFormData({...formData, gender: g as any})}
                          className={`flex-1 p-3 rounded-xl border ${glassBorder} ${formData.gender === g ? 'bg-blue-600 text-white' : glassBg} transition-all`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase opacity-50 flex items-center gap-2"><Briefcase size={14} /> Working Area</label>
                    <input 
                      type="text" 
                      value={formData.workingArea}
                      onChange={(e) => setFormData({...formData, workingArea: e.target.value})}
                      className={`w-full p-3 rounded-xl border ${glassBorder} ${glassBg} focus:outline-none focus:border-blue-500 transition-all`}
                      placeholder="e.g. Healthcare, Tech"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  Save Registration
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hospital View Modal */}
      <AnimatePresence>
        {showHospitals && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-2xl bg-black/70"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`w-full max-w-3xl max-h-[80vh] rounded-3xl border ${glassBorder} ${isNight ? 'bg-white' : 'bg-slate-900'} shadow-2xl flex flex-col overflow-hidden`}
            >
              <div className={`p-6 border-b ${glassBorder} flex justify-between items-center`}>
                <div className="flex flex-col">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Activity className="text-emerald-500" />
                    Medical Facilities in {userData?.location}
                  </h2>
                  <p className="text-sm opacity-50">Powered by Google Maps Grounding</p>
                </div>
                <button onClick={() => setShowHospitals(false)} className="p-2 rounded-full hover:bg-black/5"><X /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {isLoadingHospitals ? (
                  <div className="h-64 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="animate-spin text-blue-500" size={48} />
                    <p className="font-medium animate-pulse">Searching for nearby hospitals...</p>
                  </div>
                ) : hospitals.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hospitals.map((h, i) => (
                      <motion.a
                        key={i}
                        href={h.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -4, backgroundColor: 'rgba(16,185,129,0.1)' }}
                        className={`p-5 rounded-2xl border ${glassBorder} ${glassBg} flex flex-col justify-between gap-4 group transition-all`}
                      >
                        <div className="space-y-1">
                          <h3 className="font-bold text-lg group-hover:text-emerald-500 transition-colors">{h.title}</h3>
                          <div className="flex items-center gap-2 text-xs opacity-50">
                            <MapPin size={12} />
                            Verified Medical Center
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold text-blue-500">
                          View on Maps <ExternalLink size={14} />
                        </div>
                      </motion.a>
                    ))}
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-center p-8">
                    <Search size={48} className="opacity-20 mb-4" />
                    <p className="text-xl font-bold opacity-50">No hospitals found in this area.</p>
                    <p className="opacity-30">Try selecting a different city from the location menu.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location Modal (Ethiopian Cities) */}
      <AnimatePresence>
        {showLocations && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-2xl bg-black/40"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-3xl border ${glassBorder} ${isNight ? 'bg-white' : 'bg-slate-900'} shadow-2xl flex flex-col`}
            >
              <div className={`p-6 border-b ${glassBorder} flex justify-between items-center`}>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <MapPin className="text-blue-500" />
                  Ethiopian Cities
                </h2>
                <button 
                  onClick={() => setShowLocations(false)}
                  className={`p-2 rounded-full hover:${glassBg} transition-colors`}
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ETHIOPIAN_CITIES.map((city) => (
                  <motion.div
                    key={city}
                    whileHover={{ x: 5, backgroundColor: 'rgba(59,130,246,0.1)' }}
                    onClick={() => {
                      if (userData) setUserData({...userData, location: city});
                      else setFormData({...formData, location: city});
                      setShowLocations(false);
                    }}
                    className={`p-4 rounded-xl border ${glassBorder} cursor-pointer flex justify-between items-center group`}
                  >
                    <span className="font-medium">{city}</span>
                    <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interaction Hint */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 opacity-40 text-xs uppercase tracking-[0.3em] pointer-events-none">
        Move cursor to interact with the environment
      </div>

      {/* Location Loading Overlay */}
      <AnimatePresence>
        {isLocationLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-3xl flex flex-col items-center justify-center gap-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="p-6 rounded-full bg-blue-500/20 border border-blue-500/50"
            >
              <MapPin size={64} className="text-blue-500" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white tracking-widest animate-pulse">TRAVELING TO LOCATION...</h3>
          </motion.div>
        )}
      </AnimatePresence>

      {/* About Modal */}
      <AnimatePresence>
        {showAbout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 backdrop-blur-2xl bg-black/60"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`w-full max-w-2xl rounded-3xl border ${glassBorder} ${isNight ? 'bg-white' : 'bg-slate-900'} shadow-2xl p-8`}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black">ABOUT VIRTUAL DOCTOR</h2>
                <button onClick={() => setShowAbout(false)}><X /></button>
              </div>
              <div className="space-y-6 opacity-80 leading-relaxed">
                <p>Virtual Doctor 3D is a cutting-edge medical portal developed by <strong>ASTU ai labs</strong>. We leverage artificial intelligence and immersive 3D technology to bring healthcare closer to you.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-2xl border ${glassBorder} ${glassBg}`}>
                    <h4 className="font-bold mb-2">Our Address</h4>
                    <p className="text-sm">Adama Science and Technology University<br />Adama, Ethiopia</p>
                  </div>
                  <div className={`p-4 rounded-2xl border ${glassBorder} ${glassBg}`}>
                    <h4 className="font-bold mb-2">Contact</h4>
                    <p className="text-sm">Email: info@astu-ailabs.edu.et<br />Phone: +251 911 000 000</p>
                  </div>
                </div>
                <p className="text-xs italic">"Empowering health through innovation."</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[130] flex items-center justify-center p-4 backdrop-blur-2xl bg-black/60"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`w-full max-w-md rounded-3xl border ${glassBorder} ${isNight ? 'bg-white' : 'bg-slate-900'} shadow-2xl p-8`}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black">LOGIN</h2>
                <button onClick={() => setShowLogin(false)}><X /></button>
              </div>
              <div className="space-y-4">
                <button 
                  onClick={() => { setIsLoggedIn(true); setShowLogin(false); }}
                  className="w-full p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center gap-3 transition-all font-bold"
                >
                  <img src="https://www.google.com/favicon.ico" className="w-5 h-5" />
                  Continue with Google
                </button>
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-2 opacity-50">Or</span></div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold opacity-50">Phone Number</label>
                  <input type="tel" placeholder="+251 ..." className={`w-full p-3 rounded-xl border ${glassBorder} ${glassBg}`} />
                </div>
                <button 
                  onClick={() => { setIsLoggedIn(true); setShowLogin(false); }}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl"
                >
                  Login with Phone
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-1000 {
          perspective: 1000px;
        }
      `}} />
    </div>
  );
}
