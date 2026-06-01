// src/App.jsx
import React, { useState, useRef, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

import frameImg from './frame.png'; 
import computerImg from './computer.png';
import dataBtnImg from './file.png';

// ------------------------------------------------------------------
// 🖼️ 페르소나 1 (뷰티/패션)
// ------------------------------------------------------------------
import p1Thumb from './Persona1/thumb.png';        
import p1Full from './Persona1/fullbody.png';    
import p1Profile from './Persona1/profile.png';  
import p1Prod1 from './Persona1/product1.png';   
import p1Prod2 from './Persona1/product2.png';   
import p1Prod3 from './Persona1/product3.png';   
import p1Prod4 from './Persona1/product4.png';   
import p1Prod5 from './Persona1/product5.png';   
import p1Prod6 from './Persona1/product6.png';   
import p1Video from './Persona1/video.mp4';      

// ------------------------------------------------------------------
// 🏋️‍♂️ 페르소나 2 (헬스/운동)
// ------------------------------------------------------------------
import p2Thumb from './Persona2/thumb.png';        
import p2Full from './Persona2/fullbody.png';    
import p2Profile from './Persona2/profile.png';  
import p2Prod1 from './Persona2/product1.png';   
import p2Prod2 from './Persona2/product2.png';   
import p2Prod3 from './Persona2/product3.png';   
import p2Prod4 from './Persona2/product4.png';   
import p2Prod5 from './Persona2/product5.png';   
import p2Prod6 from './Persona2/product6.png';   
import p2Video from './Persona2/video.mp4';      

const personaData = {
  1: {
    thumb: p1Thumb, full: p1Full, profile: p1Profile,
    products: [p1Prod1, p1Prod2, p1Prod3, p1Prod4, p1Prod5, p1Prod6],
    video: p1Video, 
    name: "Lin Yan Xi",
    quote: '"성공의 비결은 바로 꾸준함."',
    chatNames: ["마라탕킬러", "탕후루", "지갑전사", "왕홍지망생", "쇼핑중독", "푸바오", "히짱", "완주콩", "콩민짜이", "제원형", "콩이지", "xihuanni", "치킨맛있다", "홈프로텍터", "후리지아", "레육제삼"],
    chatMessages: ["와 이뻐요~", "언니 너무 이뻐요", "ㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠ", "광 개쩐다..", "미친 미모 미!미!", "카리나 뺨을 좌삼삼 우삼삼 후려갈기네요", "천사 날개 떨어뜨리셨어요ㅜㅜ", "제품 링크 주세요~", "대박 퀄리티 미쳤다", "오늘 방송 폼 미쳤다", "이거 사려고 대기중ㅠㅠ", "색상 몇 가지 있나요?", "배송은 언제 되나요?", "너무 예뻐서 현기증 나요", "꺅!", "날 가져요ㅠㅠ"],
    donationNames: ["리치걸", "대륙의큰손", "익명", "팬클럽회장", "성우짱"]
  },
  2: {
    thumb: p2Thumb, full: p2Full, profile: p2Profile,
    products: [p2Prod1, p2Prod2, p2Prod3, p2Prod4, p2Prod5, p2Prod6],
    video: p2Video, 
    name: "Lu Ze Yu",
    quote: '"취미 공유에서 아이템 런칭까지."',
    chatNames: ["3대500", "헬린이", "단백질도둑", "득근득근", "바벨마스터", "다이어터", "프로틴원샷", "쇠질중독", "근손실주의", "어깨깡패", "하체하는날", "삣쁠리", "심으뜸아닌두번째", "김구운계란", "BJ치즈떡", "양말왕"],
    chatMessages: ["형님 몸 폼 미쳤다", "오늘 하체 루틴 공유좀요", "이 보충제 풀림 어때요?", "형님 보고 바로 헬스장 끊었습니다", "어깨 넓이 실화냐", "이거 먹으면 형님처럼 될 수 있나요?", "오운완!", "등 자극 미쳤다", "할인 코드 언제까지인가요?", "단백질 성분 좋은가요?", "오빵 저랑 사커요", "형 사랑해", "형 나 죽어", "대 택 우"],
    donationNames: ["프로틴만수르", "짐종국", "헬스장관장", "닭가슴살주주", "근육요정"]
  }
};

const sponsorshipProducts = {
  beauty: [
    { id: 1, icon: "💄", brand: "CHANEL", name: "루쥬 알뤼르 벨벳", price: "₩ 500,000", match: "98%", type: "원고료+제품" },
    { id: 2, icon: "🧴", brand: "Aesop", name: "바디 클렌저 세트", price: "₩ 300,000", match: "95%", type: "제품 협찬" },
    { id: 3, icon: "✨", brand: "ESTEE LAUDER", name: "갈색병 세럼 50ml", price: "₩ 450,000", match: "91%", type: "원고료+제품" },
    { id: 4, icon: "💅", brand: "OPI", name: "프리미엄 네일 살롱권", price: "₩ 150,000", match: "88%", type: "서비스 체험" },
  ],
  health: [
    { id: 1, icon: "🏋️‍♂️", brand: "Lululemon", name: "요가 매트 & 폼롤러", price: "₩ 200,000", match: "99%", type: "제품 협찬" },
    { id: 2, icon: "💊", brand: "MyProtein", name: "아이솔레이트 5kg", price: "₩ 400,000", match: "94%", type: "장기 앰버서더" },
    { id: 3, icon: "👟", brand: "Nike", name: "페가수스 런닝화", price: "₩ 350,000", match: "92%", type: "원고료+제품" },
    { id: 4, icon: "⌚", brand: "Garmin", name: "포러너 265", price: "₩ 600,000", match: "89%", type: "원고료+제품" },
  ],
  tech: [
    { id: 1, icon: "💻", brand: "Logitech", name: "MX Master 3S", price: "₩ 250,000", match: "97%", type: "제품 협찬" },
    { id: 2, icon: "🎧", brand: "Sony", name: "WH-1000XM5", price: "₩ 500,000", match: "95%", type: "원고료+제품" },
    { id: 3, icon: "⌨️", brand: "Keychron", name: "기계식 커스텀 키보드", price: "₩ 300,000", match: "90%", type: "제품 협찬" },
    { id: 4, icon: "📱", brand: "Belkin", name: "크리에이터 데스크 셋업", price: "₩ 450,000", match: "87%", type: "원고료+제품" },
  ],
  lifestyle: [
    { id: 1, icon: "☕", brand: "Nespresso", name: "버츄오 팝 캡슐 머신", price: "₩ 300,000", match: "98%", type: "제품 협찬" },
    { id: 2, icon: "🏕️", brand: "SnowPeak", name: "경량 캠핑 체어 세트", price: "₩ 400,000", match: "93%", type: "원고료+제품" },
    { id: 3, icon: "🕯️", brand: "Diptyque", name: "시그니처 향초 세트", price: "₩ 250,000", match: "91%", type: "제품 협찬" },
    { id: 4, icon: "📸", brand: "Insta360", name: "액션캠 GO 3", price: "₩ 550,000", match: "86%", type: "장기 대여+원고료" },
  ],
  game: [
    { id: 1, icon: "🎮", brand: "PlayStation", name: "듀얼센스 엣지 컨트롤러", price: "₩ 300,000", match: "99%", type: "제품 협찬" },
    { id: 2, icon: "💺", brand: "SecretLab", name: "타이탄 에보 게이밍 의자", price: "₩ 700,000", match: "95%", type: "원고료+제품" },
    { id: 3, icon: "🎧", brand: "Razer", name: "블랙샤크 V2 Pro", price: "₩ 250,000", match: "92%", type: "제품 협찬" },
    { id: 4, icon: "에너지", brand: "RedBull", name: "에너지 드링크 1년 구독", price: "₩ 400,000", match: "88%", type: "장기 앰버서더" },
  ]
};

// ------------------------------------------------------------------
// 🎥 실시간 라이브 스트리밍 플레이어 컴포넌트
// ------------------------------------------------------------------
function LiveStreamPlayer({ productIndex, currentData, onClose }) {
  const [likes, setLikes] = useState(12450);
  const [viewers, setViewers] = useState(842);
  const [chats, setChats] = useState([{ id: 0, user: '시스템', text: '라이브 방송이 시작되었습니다.' }]);
  const [hearts, setHearts] = useState([]);
  const [donation, setDonation] = useState(null);

  const chatNames = currentData.chatNames || ["유저"];
  const chatMessages = currentData.chatMessages || ["안녕하세요"];
  const donationNames = currentData.donationNames || ["후원자"];

  useEffect(() => {
    const statsInterval = setInterval(() => setLikes(prev => prev + Math.floor(Math.random() * 15) + 5), 1000);
    const chatInterval = setInterval(() => {
      const newUser = chatNames[Math.floor(Math.random() * chatNames.length)];
      const newText = chatMessages[Math.floor(Math.random() * chatMessages.length)];
      setChats(prev => [...prev, { id: Date.now(), user: newUser, text: newText }].slice(-6)); 
    }, 1500);
    const heartInterval = setInterval(() => {
      setHearts(prev => [...prev, { id: Date.now(), x: Math.floor(Math.random() * 40) - 20 }]);
      setTimeout(() => setHearts(prev => prev.slice(1)), 2000);
    }, 800);
    const donationInterval = setInterval(() => {
      const user = donationNames[Math.floor(Math.random() * donationNames.length)];
      setDonation(`${user}님이 ${(Math.floor(Math.random() * 10) + 1) * 10}$를 후원하였습니다! 🎉`);
      setTimeout(() => setDonation(null), 3000); 
    }, 5000);

    return () => { clearInterval(statsInterval); clearInterval(chatInterval); clearInterval(heartInterval); clearInterval(donationInterval); };
  }, [chatNames, chatMessages, donationNames]); 

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-[360px] md:w-[400px] h-[80vh] max-h-[750px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
      <div className="bg-slate-100 h-10 w-full flex items-center justify-between px-4 border-b border-slate-200 shrink-0 z-20">
        <div className="flex gap-2 items-center">
          <div className="w-3 h-3 rounded-full bg-red-400"></div><div className="w-3 h-3 rounded-full bg-yellow-400"></div><div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="text-xs font-mono text-slate-400 bg-white px-3 py-1 rounded-md max-w-[200px] text-center truncate mx-4 flex-1">live.wanghong.com/room/{productIndex + 1}</div>
        <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="relative w-full h-[50%] shrink-0 bg-slate-900 overflow-hidden flex flex-col items-center justify-center">
        {currentData.video ? <video src={currentData.video} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0" /> : <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 z-0"><span className="text-white text-3xl font-black tracking-widest font-serif mb-4">LIVE ON AIR</span></div>}
        <AnimatePresence>
          {donation && <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 20, opacity: 1 }} exit={{ y: -50, opacity: 0 }} className="absolute top-0 w-11/12 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-2 px-4 rounded-full shadow-lg text-center text-sm z-20">💎 {donation}</motion.div>}
        </AnimatePresence>
        <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded animate-pulse z-10 shadow-md">LIVE</div>
        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs font-mono px-3 py-1.5 rounded-full flex items-center gap-2 z-10">👁 {viewers.toLocaleString()}</div>
        <div className="absolute bottom-4 left-4 z-10 flex flex-col items-center">
          <div className="relative w-10 h-32 mb-2 pointer-events-none">
            <AnimatePresence>
              {hearts.map((heart) => <motion.div key={heart.id} initial={{ opacity: 1, y: 0, scale: 0.5 }} animate={{ opacity: 0, y: -100, x: heart.x, scale: 1.5 }} transition={{ duration: 1.5 }} className="absolute bottom-0 text-red-500">❤️</motion.div>)}
            </AnimatePresence>
          </div>
          <div className="bg-black/50 backdrop-blur-md text-white text-xs font-mono px-3 py-1.5 rounded-full">❤️ {likes.toLocaleString()}</div>
        </div>
      </div>

      <div className="flex-1 bg-[#F8F7F2] p-4 flex flex-col justify-end overflow-hidden relative">
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {chats.map((chat) => (
              <motion.div key={chat.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-sm bg-white p-2 rounded-xl shadow-sm border border-slate-100 flex items-start gap-2">
                <span className="font-bold text-slate-700 whitespace-nowrap">{chat.user}</span><span className="text-slate-600 truncate">{chat.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ------------------------------------------------------------------
// 🎭 [페르소나 체험 페이지]
// ------------------------------------------------------------------
function PersonaPage({ onBack }) {
  const [selectedPersona, setSelectedPersona] = useState(null);
  const detailSectionRef = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef(null);
  
  const [formStep, setFormStep] = useState('input'); 
  const [formData, setFormData] = useState({ name: '', gender: '', category: '' });
  const [generatedImage, setGeneratedImage] = useState(null); 

  const [randomAngles] = useState(() => Array.from({ length: 6 }, () => Math.floor(Math.random() * 51) - 25));

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handlePersonaClick = (id) => {
    setSelectedPersona(id);
    setSelectedProduct(null); 
    setUploadedImage(null); 
    setGeneratedImage(null); 
    setFormStep('input');
    setFormData({ name: '', gender: '', category: '' });
    setTimeout(() => { detailSectionRef.current?.scrollIntoView({ behavior: 'smooth' }); }, 100);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setUploadedImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  // 발표 시연용 코드 (API 에러 차단)
  const handleGenerateProfile = () => {
    if (!formData.name || !formData.gender || !formData.category || !uploadedImage) {
      alert("모든 정보와 프로필 사진을 입력해 주세요!");
      return;
    }
    
    setFormStep('loading');

    setTimeout(() => {
      setGeneratedImage(uploadedImage);
      setFormStep('result');
    }, 2500);
  };

  const getRotateAnim = (index) => ({ rotate: [randomAngles[index], 25, -25, randomAngles[index]], transition: { duration: 1.5, times: [0, 0.25, 0.75, 1], ease: "easeInOut", repeat: Infinity } });
  const gridContainerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delayChildren: 0.8, staggerChildren: 0.15 } } };
  const gridItemVariants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } };
  const currentData = personaData[selectedPersona] || { products: [] };
  const prodBaseClass = "aspect-square flex items-center justify-center text-xs font-mono text-slate-500 hover:scale-110 transition-transform z-20";
  const prodSizeClass = "w-[130px] md:w-[150px] lg:w-[180px]";
  const leftClasses = ["left-[2%] md:left-[5%]", "left-[-2%] md:left-[1%]", "left-[2%] md:left-[5%]"];
  const rightClasses = ["right-[2%] md:right-[5%]", "right-[-2%] md:right-[1%]", "right-[2%] md:right-[5%]"];
  const leftTopPositions = ['calc(10% - 15px)', 'calc(40% + 15px)', 'calc(70% - 15px)'];
  const rightTopPositions = ['calc(10% + 15px)', 'calc(40% - 15px)', 'calc(70% + 15px)'];
  const categoryNames = { beauty: "뷰티 / 패션", health: "헬스 / 운동", tech: "테크 / IT 기기", lifestyle: "라이프스타일", game: "게임" };

  return (
    <motion.div className="w-full bg-[#F8F7F2] min-h-screen font-sans text-slate-900" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
      <div className="relative min-h-screen flex flex-col items-center justify-center py-32 px-10">
        <motion.div className="absolute top-10 left-10 md:left-20 cursor-pointer group z-50" onClick={onBack} initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}>
          <h2 className="text-5xl md:text-6xl font-serif font-black text-slate-900 group-hover:opacity-70 transition-opacity">Profile.</h2>
          <p className="text-sm font-mono text-slate-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">← BACK TO HOME</p>
        </motion.div>

        <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-10" variants={gridContainerVariants} initial="hidden" animate="visible">
          {[1, 2, 3, 4, 5, 6].map((id) => {
            if (id === 6) {
              return (
                <motion.button 
                  key={id} variants={gridItemVariants} onClick={() => handlePersonaClick(id)}
                  animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-[360px] h-[360px] relative flex items-center justify-center rounded-lg bg-white shadow-xl overflow-hidden cursor-pointer border-2 border-slate-100"
                >
                  <span className="font-serif text-3xl font-black text-slate-900 tracking-wider">The Next is You</span>
                </motion.button>
              );
            }
            const hasThumb = personaData[id] && personaData[id].thumb;
            return (
              <motion.button 
                key={id} variants={gridItemVariants} onClick={() => handlePersonaClick(id)}
                className={`w-[360px] h-[360px] relative flex items-center justify-center rounded-lg transition-all duration-300 ${hasThumb ? 'bg-transparent hover:scale-105' : 'bg-slate-200 shadow-md hover:shadow-xl overflow-hidden'}`}
              >
                {hasThumb ? ( <img src={personaData[id].thumb} alt={`Persona ${id}`} className="w-full h-full object-contain" /> ) : ( <div className="absolute inset-0 flex items-center justify-center font-serif text-2xl text-slate-400">Persona {id}</div> )}
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {selectedPersona && (
        selectedPersona === 6 ? (
          <div ref={detailSectionRef} className="min-h-screen bg-white w-full flex flex-col md:flex-row p-10 xl:px-20 border-t border-slate-200 overflow-hidden box-border">
            <AnimatePresence mode="wait">
              
              {formStep === 'input' && (
                <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -50 }} className="w-full flex flex-col md:flex-row h-full">
                  <div className="flex-1 flex flex-col justify-center h-full px-4 md:px-10 lg:px-20">
                    <div className="w-full max-w-lg mx-auto">
                      <h3 className="text-4xl md:text-5xl font-serif text-slate-900 mb-2">당신의 이야기를</h3>
                      <h3 className="text-4xl md:text-5xl font-serif text-slate-900 mb-10">들려주세요.</h3>
                      <div className="flex flex-col gap-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">이름 (닉네임)</label>
                          <input type="text" placeholder="이름을 적어주세요" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-[#F8F7F2] transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">성별</label>
                          <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-[#F8F7F2] transition-all appearance-none cursor-pointer">
                            <option value="" disabled>선택해주세요</option>
                            <option value="male">남성</option>
                            <option value="female">여성</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">관심 카테고리</label>
                          <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-[#F8F7F2] transition-all appearance-none cursor-pointer">
                            <option value="" disabled>주로 어떤 분야를 다루시나요?</option>
                            <option value="beauty">뷰티 / 패션</option>
                            <option value="health">헬스 / 운동</option>
                            <option value="tech">테크 / IT 기기</option>
                            <option value="lifestyle">라이프스타일 / 브이로그</option>
                            <option value="game">게임 / 엔터테인먼트</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center h-full mt-10 md:mt-0">
                    <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                    <div onClick={() => fileInputRef.current?.click()} className="w-[280px] h-[280px] xl:w-[400px] xl:h-[400px] flex flex-col items-center justify-center mb-6 bg-[#F8F7F2] rounded-[40px] shadow-sm hover:shadow-xl hover:bg-[#EBE8E0] transition-all cursor-pointer overflow-hidden border-2 border-dashed border-slate-300">
                      {uploadedImage ? <img src={uploadedImage} alt="My Profile" className="w-full h-full object-cover" /> : <><span className="text-6xl md:text-8xl mb-4">📸</span><span className="text-slate-400 font-bold text-sm">클릭하여 사진 등록</span></>}
                    </div>
                    <button onClick={handleGenerateProfile} className="mt-8 px-12 py-5 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-slate-700 hover:scale-105 hover:-translate-y-1 transition-all shadow-xl">
                      AI 프로필 생성하기
                    </button>
                  </div>
                </motion.div>
              )}

              {formStep === 'loading' && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex flex-col items-center justify-center">
                  <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-8"></div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 animate-pulse">페르소나 데이터를 생성 중입니다...</h3>
                  <p className="text-slate-500 mb-1">입력하신 정보('{categoryNames[formData.category]}')를 바탕으로</p>
                  <p className="text-slate-500">영향력과 매칭 상품을 계산하고 있습니다.</p>
                </motion.div>
              )}

              {formStep === 'result' && (
                <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full flex flex-col md:flex-row h-full">
                  <div className="flex-1 flex flex-col justify-center h-full px-4 md:px-10 lg:px-20 border-r border-slate-100">
                    <h3 className="text-3xl font-serif font-bold text-slate-900 mb-2">협찬 대기 중인 상품</h3>
                    <p className="text-slate-500 mb-10">"{formData.name}" 님의 프로필과 완벽하게 매칭되는 제안서들입니다.</p>
                    <div className="grid grid-cols-2 gap-4">
                      {sponsorshipProducts[formData.category]?.map((prod) => (
                        <motion.div 
                          whileHover={{ y: -5 }} 
                          key={prod.id} 
                          className="relative bg-white p-5 rounded-2xl flex flex-col items-start cursor-pointer shadow-sm hover:shadow-xl border border-slate-100 group overflow-hidden transition-all"
                        >
                          {/* 1. 매칭률 뱃지 */}
                          <div className="absolute top-4 right-4 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10">
                            매칭 {prod.match}
                          </div>
                          
                          {/* 2. 아이콘 박스 */}
                          <div className="w-12 h-12 bg-[#F8F7F2] rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform z-10">
                            {prod.icon}
                          </div>
                          
                          {/* 3. 브랜드 및 상품명 */}
                          <span className="text-[10px] text-slate-400 font-bold mb-1 tracking-wider z-10">{prod.brand}</span>
                          <span className="font-bold text-slate-800 text-sm mb-4 line-clamp-1 z-10">{prod.name}</span>
                          
                          {/* 4. 조건 태그 및 가격 */}
                          <div className="w-full flex items-center justify-between mt-auto z-10">
                            <span className="text-[10px] bg-slate-50 text-slate-500 px-2 py-1 rounded-md font-medium">{prod.type}</span>
                            <span className="text-sm font-black text-slate-900">{prod.price}</span>
                          </div>

                          {/* 5. 호버 시 나타나는 제안서 열람 오버레이 */}
                          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                            <span className="text-white font-bold text-xs border border-white/30 px-4 py-2 rounded-full flex items-center gap-2">
                              제안서 확인하기 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>    
                  <div className="flex-1 flex flex-col items-center justify-center h-full mt-10 md:mt-0 p-10">
                    <div className="w-full max-w-[420px] bg-[#FDF9F9] rounded-[28px] shadow-xl overflow-hidden flex flex-col border border-slate-100">
                      <div className="w-full h-[400px] xl:h-[450px] relative">
                        <img 
                          src={generatedImage} 
                          alt="Generated Profile" 
                          className="w-full h-full object-cover z-0" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FDF9F9] z-10" />
                      </div>
                      <div className="p-6 pt-5">
                        <h2 className="text-3xl font-bold text-slate-800 mb-1 font-serif flex items-center gap-2">
                          {formData.name} 🎀
                        </h2>
                        <p className="text-slate-400 text-sm mb-4 font-mono">
                          @{formData.name.toLowerCase().replace(/\s+/g, '_')}
                        </p>
                        <p className="text-sm text-slate-600 leading-relaxed mb-5">
                          나의 가치를 세상에 공유한다 <br/>
                          | {categoryNames[formData.category]} 크리에이터<br/>
                          더 나은 나를 위해 노력하고, 그 비결을 여러분과 나누고 싶어요✨
                        </p>
                        <div className="flex flex-wrap gap-4 text-xs text-slate-500 mb-6 font-medium">
                          <span className="flex items-center gap-1">📍 서울</span>
                          <span className="flex items-center gap-1">👤 20대</span>
                          <span className="flex items-center gap-1">💼 {categoryNames[formData.category]} 전문 크리에이터</span>
                        </div>
                        <div className="bg-[#EFEBEB] rounded-[16px] py-3 px-2 flex justify-between items-center text-xs text-slate-600">
                          <div className="flex gap-4">
                            <span>팔로잉 128</span>
                            <span>팔로워 <span className="font-bold">30만+</span></span>
                            <span>좋아요 및 저장 <span className="font-bold">280만+</span></span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="bg-[#FF2442] text-white text-[10px] font-bold px-1 py-0.5 rounded-full tracking-wider">小红书</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setFormStep('input')} className="mt-8 text-sm text-slate-500 underline hover:text-slate-900 transition-colors">
                      정보 다시 입력하기
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div ref={detailSectionRef} className="h-screen bg-white w-full flex flex-col md:flex-row p-10 xl:px-20 border-t border-slate-200 overflow-hidden box-border">
            <div className="flex-1 relative flex items-center justify-center h-full">
              <div className={`h-[85vh] w-auto relative z-10 flex items-center justify-center ${currentData.full ? 'bg-transparent' : 'bg-slate-100 rounded-2xl shadow-lg overflow-hidden w-[400px]'}`}>
                {currentData.full ? ( <img src={currentData.full} alt="Full Body" className="h-full w-auto object-contain" /> ) : ( <span className="font-serif text-slate-400">[FULL BODY IMAGE]</span> )}
              </div>
              {[0, 1, 2].map((index) => {
                const hasProd = currentData.products && currentData.products[index];
                return ( <motion.button key={`left-${index}`} animate={getRotateAnim(index)} style={{ top: leftTopPositions[index] }} onClick={() => setSelectedProduct(index)} className={`absolute ${leftClasses[index]} ${prodSizeClass} ${prodBaseClass} ${hasProd ? 'bg-transparent cursor-pointer' : 'bg-[#F8F7F2] rounded-2xl shadow-md border border-slate-200 overflow-hidden cursor-pointer'}`}> {hasProd ? <img src={currentData.products[index]} alt="Product" className="w-full h-full object-contain" /> : `Product ${index + 1}`} </motion.button> );
              })}
              {[0, 1, 2].map((index) => {
                const hasProd = currentData.products && currentData.products[index + 3];
                return ( <motion.button key={`right-${index}`} animate={getRotateAnim(index + 3)} style={{ top: rightTopPositions[index] }} onClick={() => setSelectedProduct(index + 3)} className={`absolute ${rightClasses[index]} ${prodSizeClass} ${prodBaseClass} ${hasProd ? 'bg-transparent cursor-pointer' : 'bg-[#F8F7F2] rounded-2xl shadow-md border border-slate-200 overflow-hidden cursor-pointer'}`}> {hasProd ? <img src={currentData.products[index + 3]} alt="Product" className="w-full h-full object-contain" /> : `Product ${index + 4}`} </motion.button> );
              })}
            </div>
            <div className="flex-1 flex flex-col items-center justify-center h-full">
              <AnimatePresence mode="wait">
                {selectedProduct !== null ? ( <motion.div key={`video-${selectedProduct}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}> <LiveStreamPlayer productIndex={selectedProduct} currentData={currentData} onClose={() => setSelectedProduct(null)} /> </motion.div> ) : ( <motion.div key="profile" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.4 }} className="flex flex-col items-center"> <div className={`w-[250px] h-[250px] xl:w-[350px] xl:h-[350px] flex items-center justify-center mb-10 ${currentData.profile ? 'bg-transparent' : 'bg-slate-100 rounded-3xl shadow-lg overflow-hidden'}`}> {currentData.profile ? ( <img src={currentData.profile} alt="Profile" className="w-full h-full object-contain drop-shadow-2xl" /> ) : ( <span className="font-serif text-slate-400">[PROFILE IMAGE]</span> )} </div> <h3 className="text-4xl xl:text-5xl font-serif text-slate-900 mb-4"> {currentData.name || `Persona ${selectedPersona}`} </h3> <p className="text-lg xl:text-xl text-slate-500 text-center max-w-md leading-relaxed">{currentData.quote || "영향력을 생산력으로."}</p> <p className="mt-8 text-sm xl:text-base text-slate-800 font-bold animate-pulse">👈 좌측의 제품을 클릭하여 라이브 방송을 확인하세요!</p> </motion.div> )}
              </AnimatePresence>
            </div>
          </div>
        )
      )}
    </motion.div>
  );
}

// ------------------------------------------------------------------
// 📊 [데이터 분석 (Analytics) 페이지]
// ------------------------------------------------------------------
function DataPage({ onBack }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const menuItems = [
    { 
      id: 1, 
      alt: "라이브커머스 시장", 
      img: dataBtnImg,
      link: "https://sites.google.com/khu.ac.kr/wanghong-agency/analytics/%EB%9D%BC%EC%9D%B4%EB%B8%8C%EC%BB%A4%EB%A8%B8%EC%8A%A4-%EC%8B%9C%EC%9E%A5" 
    },
    { 
      id: 2, 
      alt: "샤오홍슈 플랫폼", 
      img: dataBtnImg,
      link: "https://sites.google.com/khu.ac.kr/wanghong-agency/analytics/%EB%9D%BC%EC%9D%B4%EB%B8%8C%EC%BB%A4%EB%A8%B8%EC%8A%A4-%ED%94%8C%EB%9E%AB%ED%8F%BC/%EC%83%A4%EC%98%A4%ED%99%8D%EC%8A%88" 
    },
    { 
      id: 3, 
      alt: "도우인 플랫폼", 
      img: dataBtnImg,
      link: "https://sites.google.com/khu.ac.kr/wanghong-agency/analytics/%EB%9D%BC%EC%9D%B4%EB%B8%8C%EC%BB%A4%EB%A8%B8%EC%8A%A4-%ED%94%8C%EB%9E%AB%ED%8F%BC/%EB%8F%84%EC%9A%B0%EC%9D%B8" 
    },
    { 
      id: 4, 
      alt: "샤오홍슈 도우인 비교", 
      img: dataBtnImg,
      link: "https://sites.google.com/khu.ac.kr/wanghong-agency/analytics/%EB%9D%BC%EC%9D%B4%EB%B8%8C%EC%BB%A4%EB%A8%B8%EC%8A%A4-%ED%94%8C%EB%9E%AB%ED%8F%BC/%EC%83%A4%EC%98%A4%ED%99%8D%EC%8A%88-%EB%8F%84%EC%9A%B0%EC%9D%B8-%EB%B9%84%EA%B5%90" 
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delayChildren: 0.4, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  const handleNavigate = (url) => {
    window.open(url, '_top');
  };

  return (
    <motion.div 
      className="w-full bg-[#F8F7F2] min-h-screen font-sans text-slate-900 flex flex-col items-center justify-start relative overflow-x-hidden" 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
    >
      {/* 상단 타이틀 */}
      <motion.div 
        className="absolute top-10 left-10 md:left-20 cursor-pointer group z-50" 
        onClick={onBack} 
        initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      >
        <h2 className="text-5xl md:text-6xl font-serif font-black text-slate-900 group-hover:opacity-70 transition-opacity">
          Analytics.
        </h2>
        <p className="text-sm font-mono text-slate-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          ← BACK TO HOME
        </p>
      </motion.div>

      <div className="w-full max-w-[1600px] flex flex-col items-start pt-48 pb-20 px-10 md:px-20 overflow-visible">
        
        <div className="text-left mb-16 w-full">
          <motion.h3 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
            className="text-3xl md:text-4xl font-serif text-slate-800 mb-4 tracking-tight font-dream"
          >
            영향력을 데이터로 증명하세요
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
            className="text-slate-500 text-base md:text-lg font-light leading-relaxed max-w-2xl font-dream"
          >
            본인만의 고유한 수치와 성장 지표를 통해 브랜드에게 확신을 줍니다.<br className="hidden md:block" />
            원하시는 분석 대시보드를 선택하여 상세 지표를 확인하세요.
          </motion.p>
        </div>

        {/* 버튼 영역 */}
        <motion.div 
          className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8"
          variants={containerVariants} initial="hidden" animate="visible"
        >
          {menuItems.map((item) => (
            <motion.button
              key={item.id}
              variants={itemVariants}
              whileHover={{ y: -12, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNavigate(item.link)} 
              className="relative w-full aspect-square group cursor-pointer transition-all duration-300 bg-transparent outline-none"
            >
              <img 
                src={item.img} 
                alt={item.alt} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
            </motion.button>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

// ------------------------------------------------------------------
// 📱 3D 폰 컴포넌트
// ------------------------------------------------------------------
function AnimatedPhone({ isClicked, onAnimationDone, flashRef, onReady }) {
  const { scene } = useGLTF('/phone.glb');
  const groupRef = useRef();
  const step = useRef(0); 
  const zoomSpeed = useRef(0.0001);
  const isReadyFired = useRef(false);

  useEffect(() => { if (isClicked) step.current = 1; }, [isClicked]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const obj = groupRef.current;

    if (step.current === 0) {
      const targetX = (state.pointer.x * Math.PI) / 4; const targetY = (state.pointer.y * Math.PI) / 6;
      obj.rotation.y = THREE.MathUtils.lerp(obj.rotation.y, targetX, 0.05); 
      obj.rotation.x = THREE.MathUtils.lerp(obj.rotation.x, -targetY, 0.05); 
      obj.rotation.z = THREE.MathUtils.lerp(obj.rotation.z, 0, 0.05); 
      obj.scale.setScalar(THREE.MathUtils.lerp(obj.scale.x, 0.2, 0.05)); 

      if (obj.scale.x <= 0.21 && !isReadyFired.current) {
        isReadyFired.current = true;
        if (onReady) onReady();
      }
    } 
    else if (step.current === 1) {
      const targetRotZ = -Math.PI / 2;
      obj.rotation.x = THREE.MathUtils.lerp(obj.rotation.x, 0, 0.05); 
      obj.rotation.y = THREE.MathUtils.lerp(obj.rotation.y, 0, 0.05); 
      obj.rotation.z = THREE.MathUtils.lerp(obj.rotation.z, targetRotZ, 0.05);
      if (Math.abs(obj.rotation.z - targetRotZ) < 0.05) step.current = 2;
    }
    else if (step.current === 2) {
      const targetRotY = Math.PI; 
      obj.rotation.y = THREE.MathUtils.lerp(obj.rotation.y, targetRotY, 0.05);
      if (Math.abs(obj.rotation.y - targetRotY) < 0.05) step.current = 3;
    }
    else if (step.current === 3) {
      const targetScale = 15;
      zoomSpeed.current = Math.min(zoomSpeed.current + 0.00005, 0.01);
      obj.scale.setScalar(THREE.MathUtils.lerp(obj.scale.x, targetScale, zoomSpeed.current));

      if (flashRef.current) {
        const progress = (obj.scale.x - 0.2) / (10 - 0.2);
        flashRef.current.style.opacity = Math.max(0, Math.min(progress, 1));
      }
      if (obj.scale.x > 10) onAnimationDone();
    }
  });

  return (
    <group ref={groupRef} scale={0.5}>
      <group rotation={[0, 0, 0]} position={[-1.75, 0, 0]}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

// ------------------------------------------------------------------
// 🚀 메인 App 컴포넌트
// ------------------------------------------------------------------
function App() {
  const [page, setPage] = useState('home');
  const [stage, setStage] = useState(0);
  const flashRef = useRef(null);
  const [isPhoneReady, setIsPhoneReady] = useState(false);

  const textVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] } })
  };

  if (page === 'persona') {
    return <PersonaPage onBack={() => setPage('home')} />;
  }
  if (page === 'data') {
    return <DataPage onBack={() => setPage('home')} />;
  }

  return (
    <div className={`bg-[#F8F7F2] w-full relative text-slate-900 font-sans ${stage < 2 ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      
      <AnimatePresence>
        {stage < 2 && (
          <motion.div className="w-full h-full absolute inset-0 z-10" exit={{ opacity: 0 }} transition={{ duration: 0 }}>
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }} onClick={() => stage === 0 && isPhoneReady && setStage(1)}>
              <ambientLight intensity={3.0} color="#fffaf0" />
              <directionalLight position={[5, 10, 5]} intensity={3.5} color="#ffffff" castShadow />
              <Suspense fallback={null}>
                <AnimatedPhone isClicked={stage === 1} 
                onAnimationDone={() => setStage(2)} 
                flashRef={flashRef} 
                onReady={() => setIsPhoneReady(true)}
                />
              </Suspense>
              <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={15} blur={2.5} far={4} color="#000000" />
            </Canvas>

            {stage === 0 && isPhoneReady && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-900 font-serif text-sm tracking-widest animate-pulse pointer-events-none">
                [CLICK TO INITIATE]
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {stage === 1 && (
        <div ref={flashRef} className="fixed inset-0 bg-white z-40 pointer-events-none opacity-0" />
      )}
      <AnimatePresence>
        {stage === 2 && (
          <motion.div className="fixed inset-0 bg-white z-40 pointer-events-none" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 1.5, ease: "easeOut" }} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {stage === 2 && (
          <motion.div className="w-full flex flex-col z-30 relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="h-screen w-full flex flex-col items-start justify-center pl-10 md:pl-32 relative">
              <h1 className="text-7xl md:text-9xl font-serif text-slate-900 leading-tight">
                <motion.span custom={0} variants={textVariants} initial="hidden" animate="visible" className="block">Dream Big,</motion.span>
                <motion.span custom={1} variants={textVariants} initial="hidden" animate="visible" className="block">Earn Big.</motion.span>
              </h1>
              <motion.p custom={2} variants={textVariants} initial="hidden" animate="visible" className="mt-12 text-xl md:text-2xl font-serif italic text-slate-500">
                Influence to Productivity
              </motion.p>
              <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-400 flex flex-col items-center" initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 10, 0] }} transition={{ delay: 2, duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                <span className="text-xs tracking-widest mb-2 font-mono">SCROLL</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              </motion.div>
            </div>

            <div className="min-h-screen w-full flex flex-col items-center justify-center p-10 bg-[#F8F7F2]">
              <div className="flex flex-col md:flex-row gap-24 md:gap-40 w-full justify-center items-center">
                
                <motion.button 
                  onClick={() => setPage('persona')}
                  className="cursor-pointer w-full max-w-[700px] origin-center"
                  animate={{ rotate: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} 
                  whileHover={{ rotate: [0, 15, -15, 0], transition: { duration: 1.2, times: [0, 0.25, 0.75, 1], ease: ["easeOut", "easeInOut", "easeIn"], repeat: Infinity } }}
                >
                  <div className="w-full aspect-square bg-transparent rounded-2xl overflow-hidden relative">
                    <img src={frameImg} alt="Persona Experience" className="w-full h-full object-cover" />
                  </div>
                </motion.button>

                <motion.button 
                  onClick={() => setPage('data')}
                  className="cursor-pointer w-full max-w-[680px] origin-center"
                  animate={{ rotate: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} 
                  whileHover={{ rotate: [0, 15, -15, 0], transition: { duration: 1.2, times: [0, 0.25, 0.75, 1], ease: ["easeOut", "easeInOut", "easeIn"], repeat: Infinity } }}
                >
                  <div className="w-full aspect-square bg-transparent rounded-2xl overflow-hidden relative">
                    <img src={computerImg} alt="Data Analytics" className="w-full h-full object-cover" />
                  </div>
                </motion.button>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;