// src/App.jsx
import React, { useState, useRef, useEffect, Suspense } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

import frameImg from './frame.png'; 
import computerImg from './computer.png';

// ------------------------------------------------------------------
// 🖼️ 페르소나 1 (뷰티/패션) 이미지 및 영상 파일 불러오기
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

// ------------------------------------------------------------------
// 🏋️‍♂️ 페르소나 2 (헬스/운동) 이미지 및 영상 파일 불러오기
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

// 💡 각 페르소나별 이름, 멘트, 고유 채팅 데이터를 관리하는 객체
const personaData = {
  1: {
    thumb: p1Thumb, full: p1Full, profile: p1Profile,
    products: [p1Prod1, p1Prod2, p1Prod3, p1Prod4, p1Prod5, p1Prod6],
    video: '/video1.mp4', // 💡 public 폴더 안의 video1.mp4
    name: "Lim Yeonhee",
    quote: '"성공의 비결은 바로 꾸준함."',
    chatNames: ["마라탕킬러", "탕후루", "지갑전사", "왕홍지망생", "쇼핑중독", "푸바오", "히짱", "완주콩", "콩민짜이", "제원형", "콩이지", "xihuanni", "치킨맛있다", "홈프로텍터"],
    chatMessages: ["와 이뻐요~", "언니 너무 이뻐요", "제품 링크 주세요~", "대박 퀄리티 미쳤다", "오늘 방송 폼 미쳤다", "이거 사려고 대기중ㅠㅠ", "색상 몇 가지 있나요?", "배송은 언제 되나요?", "너무 예뻐서 현기증 나요", "꺅!", "날 가져요ㅠㅠ"],
    donationNames: ["리치걸", "대륙의큰손", "익명", "팬클럽회장", "성우짱"]
  },
  2: {
    thumb: p2Thumb, full: p2Full, profile: p2Profile,
    products: [p2Prod1, p2Prod2, p2Prod3, p2Prod4, p2Prod5, p2Prod6],
    video: '/video2.mp4', // 💡 public 폴더 안의 video2.mp4
    name: "Kang Chul",
    quote: '"땀은 지방이 흘리는 눈물이다."',
    chatNames: ["3대500", "헬린이", "단백질도둑", "득근득근", "바벨마스터", "다이어터", "프로틴원샷", "쇠질중독", "근손실주의", "어깨깡패", "하체하는날"],
    chatMessages: ["형님 몸 폼 미쳤다", "오늘 하체 루틴 공유좀요", "이 보충제 풀림 어때요?", "형님 보고 바로 헬스장 끊었습니다", "어깨 넓이 실화냐", "이거 먹으면 형님처럼 될 수 있나요?", "오운완!", "등 자극 미쳤다", "할인 코드 언제까지인가요?", "성분 좋은가요?"],
    donationNames: ["프로틴만수르", "짐종국", "헬스장관장", "닭가슴살주주", "근육요정"]
  }
};

// ------------------------------------------------------------------
// 🖱️ 커스텀 커서 컴포넌트
// ------------------------------------------------------------------
function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 500 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 border-[1.5px] border-slate-900 rounded-full pointer-events-none z-[9999] backdrop-blur-[2px] bg-slate-900/10"
      style={{ x: cursorXSpring, y: cursorYSpring }}
    />
  );
}

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
    const statsInterval = setInterval(() => {
      setLikes(prev => prev + Math.floor(Math.random() * 15) + 5);
      setViewers(prev => prev + Math.floor(Math.random() * 5) - 1);
    }, 1000);

    const chatInterval = setInterval(() => {
      const newUser = chatNames[Math.floor(Math.random() * chatNames.length)];
      const newText = chatMessages[Math.floor(Math.random() * chatMessages.length)];
      setChats(prev => [...prev, { id: Date.now(), user: newUser, text: newText }].slice(-6)); 
    }, 1500);

    const heartInterval = setInterval(() => {
      const randomX = Math.floor(Math.random() * 40) - 20; 
      setHearts(prev => [...prev, { id: Date.now(), x: randomX }]);
      setTimeout(() => {
        setHearts(prev => prev.slice(1));
      }, 2000);
    }, 800);

    const donationInterval = setInterval(() => {
      const user = donationNames[Math.floor(Math.random() * donationNames.length)];
      const amount = (Math.floor(Math.random() * 10) + 1) * 10;
      setDonation(`${user}님이 ${amount}$를 후원하였습니다! 🎉`);
      setTimeout(() => setDonation(null), 3000); 
    }, 5000);

    return () => {
      clearInterval(statsInterval); clearInterval(chatInterval);
      clearInterval(heartInterval); clearInterval(donationInterval);
    };
  }, [chatNames, chatMessages, donationNames]); 

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
      className="w-[360px] md:w-[400px] h-[80vh] max-h-[750px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
    >
      <div className="bg-slate-100 h-10 w-full flex items-center justify-between px-4 border-b border-slate-200 shrink-0 z-20">
        <div className="flex gap-2 items-center">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        
        <div className="text-xs font-mono text-slate-400 bg-white px-3 py-1 rounded-md max-w-[200px] text-center truncate mx-4 flex-1">
          live.wanghong.com/room/{productIndex + 1}
        </div>

        <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-200" title="라이브 종료">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="relative w-full h-[50%] shrink-0 bg-slate-900 overflow-hidden flex flex-col items-center justify-center">
        {currentData.video ? (
          <video src={currentData.video} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 z-0">
            <span className="text-white text-3xl font-black tracking-widest font-serif mb-4">LIVE ON AIR</span>
            <span className="text-white text-sm font-mono">[AI Video Placeholder]</span>
          </div>
        )}

        <AnimatePresence>
          {donation && (
            <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 20, opacity: 1 }} exit={{ y: -50, opacity: 0 }} className="absolute top-0 w-11/12 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-2 px-4 rounded-full shadow-lg text-center text-sm z-20 flex items-center justify-center gap-2">
              💎 {donation}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded animate-pulse z-10 shadow-md">LIVE</div>

        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs font-mono px-3 py-1.5 rounded-full flex items-center gap-2 z-10">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          {viewers.toLocaleString()}
        </div>

        <div className="absolute bottom-4 left-4 z-10 flex flex-col items-center">
          <div className="relative w-10 h-32 mb-2 pointer-events-none">
            <AnimatePresence>
              {hearts.map((heart) => (
                <motion.div key={heart.id} initial={{ opacity: 1, y: 0, x: 0, scale: 0.5 }} animate={{ opacity: 0, y: -100, x: heart.x, scale: 1.5 }} transition={{ duration: 1.5, ease: "easeOut" }} className="absolute bottom-0 text-red-500 drop-shadow-md">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="bg-black/50 backdrop-blur-md text-white text-xs font-mono px-3 py-1.5 rounded-full flex items-center gap-1">
            <svg className="w-3 h-3 text-red-400 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            {likes.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-[#F8F7F2] p-4 flex flex-col justify-end overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-[#F8F7F2] to-transparent z-10"></div>
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {chats.map((chat) => (
              <motion.div key={chat.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-sm bg-white p-2 rounded-xl shadow-sm border border-slate-100 flex items-start gap-2">
                <span className="font-bold text-slate-700 whitespace-nowrap">{chat.user}</span>
                <span className="text-slate-600 truncate">{chat.text}</span>
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

  const [randomAngles] = useState(() => 
    Array.from({ length: 6 }, () => Math.floor(Math.random() * 51) - 25)
  );

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handlePersonaClick = (id) => {
    setSelectedPersona(id);
    setSelectedProduct(null); 
    setTimeout(() => { detailSectionRef.current?.scrollIntoView({ behavior: 'smooth' }); }, 100);
  };

  const getRotateAnim = (index) => ({
    rotate: [randomAngles[index], 25, -25, randomAngles[index]],
    transition: { duration: 1.5, times: [0, 0.25, 0.75, 1], ease: "easeInOut", repeat: Infinity }
  });

  const gridContainerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delayChildren: 0.8, staggerChildren: 0.15 } } };
  const gridItemVariants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } };

  const currentData = personaData[selectedPersona] || { products: [] };

  // 💡 수정 1: 제품 이미지의 "최대 크기"를 줄여서, 큰 모니터에서도 부담스럽지 않게 핏을 고정했습니다.
  const prodBaseClass = "aspect-square flex items-center justify-center text-xs font-mono text-slate-500 hover:scale-110 transition-transform z-20";
  const prodSizeClass = "w-[130px] md:w-[150px] lg:w-[180px]";

  // 💡 수정 2: 위치 좌표를 화면이 커지더라도 안정적으로 인물 옆에 붙어있도록 다듬었습니다.
  const leftClasses = ["left-[2%] md:left-[5%]", "left-[-2%] md:left-[1%]", "left-[2%] md:left-[5%]"];
  const rightClasses = ["right-[2%] md:right-[5%]", "right-[-2%] md:right-[1%]", "right-[2%] md:right-[5%]"];
  
  const leftTopPositions = ['calc(10% - 15px)', 'calc(40% + 15px)', 'calc(70% - 15px)'];
  const rightTopPositions = ['calc(10% + 15px)', 'calc(40% - 15px)', 'calc(70% + 15px)'];

  return (
    <motion.div className="w-full bg-[#EBE8E0] min-h-screen font-sans text-slate-900" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
      <div className="relative min-h-screen flex flex-col items-center justify-center py-32 px-10">
        <motion.div className="absolute top-10 left-10 md:left-20 cursor-pointer group z-50" onClick={onBack} initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}>
          <h2 className="text-5xl md:text-6xl font-serif font-black text-slate-900 group-hover:opacity-70 transition-opacity">Profile.</h2>
          <p className="text-sm font-mono text-slate-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">← BACK TO HOME</p>
        </motion.div>

        <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-10" variants={gridContainerVariants} initial="hidden" animate="visible">
          {[1, 2, 3, 4, 5, 6].map((id) => {
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
        <div ref={detailSectionRef} className="h-screen bg-white w-full flex flex-col md:flex-row p-10 xl:px-20 border-t border-slate-200 overflow-hidden box-border">
          
          <div className="flex-1 relative flex items-center justify-center h-full">
            <div className={`h-[85vh] w-auto relative z-10 flex items-center justify-center ${currentData.full ? 'bg-transparent' : 'bg-slate-100 rounded-2xl shadow-lg overflow-hidden w-[400px]'}`}>
              {currentData.full ? ( 
                <img src={currentData.full} alt="Full Body" className="h-full w-auto object-contain" /> 
              ) : ( 
                <span className="font-serif text-slate-400">[FULL BODY IMAGE]</span> 
              )}
            </div>

            {[0, 1, 2].map((index) => {
              const hasProd = currentData.products && currentData.products[index];
              return (
                <motion.button 
                  key={`left-${index}`} 
                  animate={getRotateAnim(index)} 
                  style={{ top: leftTopPositions[index] }}
                  onClick={() => setSelectedProduct(index)}
                  className={`absolute ${leftClasses[index]} ${prodSizeClass} ${prodBaseClass} ${hasProd ? 'bg-transparent cursor-pointer' : 'bg-[#F8F7F2] rounded-2xl shadow-md border border-slate-200 overflow-hidden cursor-pointer'}`}
                >
                  {hasProd ? <img src={currentData.products[index]} alt="Product" className="w-full h-full object-contain" /> : `Product ${index + 1}`}
                </motion.button>
              );
            })}

            {[0, 1, 2].map((index) => {
              const hasProd = currentData.products && currentData.products[index + 3];
              return (
                <motion.button 
                  key={`right-${index}`} 
                  animate={getRotateAnim(index + 3)} 
                  style={{ top: rightTopPositions[index] }}
                  onClick={() => setSelectedProduct(index + 3)}
                  className={`absolute ${rightClasses[index]} ${prodSizeClass} ${prodBaseClass} ${hasProd ? 'bg-transparent cursor-pointer' : 'bg-[#F8F7F2] rounded-2xl shadow-md border border-slate-200 overflow-hidden cursor-pointer'}`}
                >
                  {hasProd ? <img src={currentData.products[index + 3]} alt="Product" className="w-full h-full object-contain" /> : `Product ${index + 4}`}
                </motion.button>
              );
            })}
          </div>

          <div className="flex-1 flex flex-col items-center justify-center h-full">
            <AnimatePresence mode="wait">
              {selectedProduct !== null ? (
                <motion.div key={`video-${selectedProduct}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}>
                  <LiveStreamPlayer productIndex={selectedProduct} currentData={currentData} onClose={() => setSelectedProduct(null)} />
                </motion.div>
              ) : (
                <motion.div key="profile" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.4 }} className="flex flex-col items-center">
                  <div className={`w-[250px] h-[250px] xl:w-[350px] xl:h-[350px] flex items-center justify-center mb-10 ${currentData.profile ? 'bg-transparent' : 'bg-slate-100 rounded-3xl shadow-lg overflow-hidden'}`}>
                    {currentData.profile ? ( <img src={currentData.profile} alt="Profile" className="w-full h-full object-contain drop-shadow-2xl" /> ) : ( <span className="font-serif text-slate-400">[PROFILE IMAGE]</span> )}
                  </div>
                  <h3 className="text-4xl xl:text-5xl font-serif text-slate-900 mb-4"> {currentData.name || `Persona ${selectedPersona}`} </h3>
                  <p className="text-lg xl:text-xl text-slate-500 text-center max-w-md leading-relaxed">
                    {currentData.quote || "영향력을 생산력으로."}
                  </p>
                  <p className="mt-8 text-sm xl:text-base text-slate-800 font-bold animate-pulse">
                    👈 좌측의 제품을 클릭하여 라이브 방송을 확인하세요!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ------------------------------------------------------------------
// 📱 3D 폰 컴포넌트
// ------------------------------------------------------------------
function AnimatedPhone({ isClicked, onAnimationDone, flashRef }) {
  const { scene } = useGLTF('/phone.glb');
  const groupRef = useRef();
  const step = useRef(0); 

  useEffect(() => { if (isClicked) step.current = 1; }, [isClicked]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const obj = groupRef.current;

    if (step.current === 0) {
      const targetX = (state.pointer.x * Math.PI) / 4; const targetY = (state.pointer.y * Math.PI) / 6;
      obj.rotation.y = THREE.MathUtils.lerp(obj.rotation.y, targetX, 0.05); obj.rotation.x = THREE.MathUtils.lerp(obj.rotation.x, -targetY, 0.05); obj.rotation.z = THREE.MathUtils.lerp(obj.rotation.z, 0, 0.05); obj.scale.setScalar(THREE.MathUtils.lerp(obj.scale.x, 1.5, 0.05));
    } 
    else if (step.current === 1) {
      const targetRotZ = -Math.PI / 2;
      obj.rotation.x = THREE.MathUtils.lerp(obj.rotation.x, 0, 0.08); obj.rotation.y = THREE.MathUtils.lerp(obj.rotation.y, 0, 0.08); obj.rotation.z = THREE.MathUtils.lerp(obj.rotation.z, targetRotZ, 0.08);
      if (Math.abs(obj.rotation.z - targetRotZ) < 0.05) step.current = 2;
    }
    else if (step.current === 2) {
      const targetRotY = Math.PI; 
      obj.rotation.y = THREE.MathUtils.lerp(obj.rotation.y, targetRotY, 0.08);
      if (Math.abs(obj.rotation.y - targetRotY) < 0.05) step.current = 3;
    }
    else if (step.current === 3) {
      const targetScale = 30;
      obj.scale.setScalar(THREE.MathUtils.lerp(obj.scale.x, targetScale, 0.015));
      if (obj.scale.x > 10 && flashRef.current) {
        const progress = (obj.scale.x - 10) / (targetScale * 0.4 - 10);
        flashRef.current.style.opacity = Math.min(progress, 1);
      }
      if (obj.scale.x > targetScale * 0.4) onAnimationDone();
    }
  });

  return (
    <group ref={groupRef}>
      <group rotation={[0, Math.PI / 2, 0]}><primitive object={scene} /></group>
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

  const textVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] } })
  };

  if (page === 'persona') {
    return (
      <>
        <CustomCursor />
        <PersonaPage onBack={() => setPage('home')} />
      </>
    );
  }

  return (
    <div className={`bg-[#F8F7F2] w-full relative text-slate-900 font-sans ${stage < 2 ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <CustomCursor />
      
      <AnimatePresence>
        {stage < 2 && (
          <motion.div className="w-full h-full absolute inset-0 z-10" exit={{ opacity: 0 }} transition={{ duration: 0 }}>
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }} onClick={() => stage === 0 && setStage(1)}>
              <ambientLight intensity={0.8} color="#fffaf0" />
              <directionalLight position={[5, 10, 5]} intensity={1.5} color="#ffffff" castShadow />
              <Environment preset="apartment" />
              <Suspense fallback={null}>
                <AnimatedPhone isClicked={stage === 1} onAnimationDone={() => setStage(2)} flashRef={flashRef} />
              </Suspense>
              <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={15} blur={2.5} far={4} color="#000000" />
            </Canvas>

            {stage === 0 && (
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