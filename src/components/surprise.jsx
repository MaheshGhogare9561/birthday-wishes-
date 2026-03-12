import { useState, useEffect, useRef, useCallback } from "react";

/* ─── tiny helpers ─── */
const COLORS = ["#ff577f","#ffd166","#06d6a0","#118ab2","#9b5de5","#f15bb5","#ff85a1","#ffc300"];

function randomBetween(a,b){ return a + Math.random()*(b-a); }

/* ─── Floating hearts background ─── */
function FloatingHearts(){
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
      {Array.from({length:18}).map((_,i)=>{
        const size = randomBetween(12,28);
        const left = randomBetween(0,100);
        const dur = randomBetween(8,18);
        const delay = randomBetween(0,10);
        const opacity = randomBetween(0.08,0.25);
        return (
          <div key={i} style={{
            position:"absolute", bottom:"-40px", left:`${left}%`,
            fontSize:`${size}px`, opacity,
            animation:`floatUp ${dur}s ${delay}s linear infinite`,
          }}>💗</div>
        );
      })}
    </div>
  );
}

/* ─── Confetti piece ─── */
function ConfettiPiece({color, style}){
  return <div style={{
    position:"fixed", top:"-12px", pointerEvents:"none", zIndex:100,
    width: style.size+"px", height: style.size+"px",
    background: color, borderRadius: Math.random()>0.5 ? "50%" : "2px",
    left: style.left+"%",
    animation: `confettiFall ${style.dur}s ${style.delay}s linear forwards`,
    transform: `rotate(${style.rot}deg)`,
  }}/>;
}

/* ─── Typewriter hook ─── */
function useTypewriter(lines, speed=30, lineDelay=500){
  const [display, setDisplay] = useState("");
  const [done, setDone] = useState(false);

  useEffect(()=>{
    let i=0, j=0, timer;
    const completed = [];
    function tick(){
      if(i >= lines.length){ setDone(true); return; }
      const line = lines[i];
      if(j <= line.length){
        setDisplay(completed.join("\n") + (completed.length?"\n":"") + line.slice(0,j));
        j++;
        timer = setTimeout(tick, speed);
      } else {
        completed.push(line);
        i++; j=0;
        timer = setTimeout(tick, lineDelay);
      }
    }
    tick();
    return ()=> clearTimeout(timer);
  },[]);

  return { display, done };
}

/* ═══════════════════════════════════════════
   PAGE 1 — Welcome / Name Input
   ═══════════════════════════════════════════ */
function WelcomePage({ onNext }){
  const [name, setName] = useState("");
  const [animIn, setAnimIn] = useState(false);

  useEffect(()=>{ setTimeout(()=>setAnimIn(true), 100); },[]);

  const go = ()=> onNext(name.trim() || "Friend");

  return (
    <div style={{
      minHeight:"100svh", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", padding:"24px",
      position:"relative", zIndex:1,
    }}>
      <div style={{
        background:"rgba(255,255,255,0.85)", backdropFilter:"blur(20px)",
        borderRadius:"28px", padding:"36px 30px", maxWidth:"420px", width:"100%",
        boxShadow:"0 24px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.6) inset",
        textAlign:"center",
        transform: animIn ? "translateY(0) scale(1)" : "translateY(30px) scale(0.95)",
        opacity: animIn ? 1 : 0,
        transition:"all 0.6s cubic-bezier(.22,1,.36,1)",
      }}>
        {/* spinning emoji */}
        <div style={{
          width:"72px", height:"72px", margin:"0 auto 16px", borderRadius:"50%",
          background:"conic-gradient(from 0turn, #ffd1e8, #e0c3fc, #c2f9ff, #ffd1e8)",
          display:"grid", placeItems:"center",
          animation:"spin 3s linear infinite",
          boxShadow:"0 8px 30px rgba(255,122,182,0.3)",
        }}>
          <span style={{fontSize:"32px"}}>🎉</span>
        </div>

        <h2 style={{
          margin:"0 0 4px", fontSize:"1.6rem",
          background:"linear-gradient(135deg, #7c3aed, #f472b6)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          fontWeight:800,
        }}>Yay! A Surprise!</h2>
        <p style={{color:"#666", margin:"4px 0 24px", fontSize:"0.95rem", lineHeight:1.5}}>
          Another birthday surprise awaits you ✨
        </p>

        <label style={{display:"block", fontSize:"0.9rem", color:"#555", marginBottom:"8px", fontWeight:600}}>
          What's your beautiful name?
        </label>
        <input
          value={name}
          onChange={e=>setName(e.target.value)}
          onKeyDown={e=>e.key==="Enter" && go()}
          placeholder="e.g. Nidhi"
          autoFocus
          style={{
            width:"100%", padding:"14px 16px", borderRadius:"14px",
            border:"2px solid #f0e0f0", outline:"none", fontSize:"1rem",
            background:"#fdf6fa", transition:"border 0.2s",
            fontFamily:"inherit",
          }}
          onFocus={e=>e.target.style.borderColor="#d946ef"}
          onBlur={e=>e.target.style.borderColor="#f0e0f0"}
        />
        <button onClick={go} style={{
          marginTop:"18px", width:"100%", padding:"14px",
          background:"linear-gradient(135deg, #7c3aed, #a855f7)",
          color:"#fff", border:"none", borderRadius:"14px",
          fontSize:"1rem", fontWeight:700, cursor:"pointer",
          boxShadow:"0 8px 30px rgba(124,58,237,0.35)",
          transition:"transform 0.15s, box-shadow 0.15s",
        }}
          onMouseDown={e=>e.currentTarget.style.transform="scale(0.97)"}
          onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
        >
          Let's Go! 🚀
        </button>
      </div>

      <p style={{
        position:"fixed", bottom:"16px", left:"50%", transform:"translateX(-50%)",
        fontSize:"0.8rem", color:"rgba(255,255,255,0.7)", whiteSpace:"nowrap",
      }}>Made with ❤️ for someone special</p>
    </div>
  );
}


/* ═══════════════════════════════════════════
   PAGE 2 — Birthday Message + Typewriter
   ═══════════════════════════════════════════ */
function MessagePage({ name, onNext }){
  const lines = [
    `${name}... today is all about you. 🌸`,
    "Another year of you being absolutely amazing —",
    "your smile, your strength, your beautiful heart.",
    `May this year bring you everything you deserve\nand more, because you are so worth it. 💖`,
    "Wishing you a day as special as you are. 🎂✨",
  ];
  const { display, done } = useTypewriter(lines, 28, 450);
  const [confetti, setConfetti] = useState([]);
  const [animIn, setAnimIn] = useState(false);

  useEffect(()=>{ setTimeout(()=>setAnimIn(true), 100); },[]);

  const handleSurprise = ()=>{
    const pieces = Array.from({length:100}).map((_,i)=>({
      id: i,
      color: COLORS[Math.floor(Math.random()*COLORS.length)],
      left: randomBetween(0,100),
      size: randomBetween(6,14),
      dur: randomBetween(2,4),
      delay: randomBetween(0,0.5),
      rot: randomBetween(0,360),
    }));
    setConfetti(pieces);
    setTimeout(()=> onNext(), 1600);
  };

  return (
    <div style={{
      minHeight:"100svh", display:"flex", flexDirection:"column",
      alignItems:"center", padding:"28px 16px 40px",
      position:"relative", zIndex:1,
    }}>
      {confetti.map(c=> <ConfettiPiece key={c.id} color={c.color} style={c}/>)}

      {/* Avatar + Title */}
      <div style={{
        textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", gap:"12px",
        transform: animIn ? "translateY(0)" : "translateY(20px)",
        opacity: animIn ? 1 : 0,
        transition:"all 0.7s cubic-bezier(.22,1,.36,1)",
      }}>
        <div style={{
          width:"150px", height:"150px", borderRadius:"50%",
          background:"linear-gradient(135deg, #ffd1e8, #e0c3fc, #c2f9ff)",
          padding:"5px", boxShadow:"0 12px 40px rgba(255,122,182,0.3)",
        }}>
          <div style={{
            width:"100%", height:"100%", borderRadius:"50%", overflow:"hidden",
            background:"#fff8fb",
          }}>
            <img src="assets/avatar.gif" alt="avatar" style={{
              width:"100%", height:"100%", objectFit:"cover",
            }}/>
          </div>
        </div>

        <h2 style={{
          margin:0, fontSize:"1.5rem", fontWeight:800,
          background:"linear-gradient(135deg, #be185d, #7c3aed)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
        }}>Happy Birthday, {name}!</h2>

        <span style={{
          background:"rgba(255,236,245,0.9)", color:"#9d174d", padding:"6px 14px",
          borderRadius:"999px", fontWeight:600, fontSize:"0.85rem",
          backdropFilter:"blur(4px)",
        }}>💗 With love & best wishes</span>
      </div>

      {/* Message Card */}
      <div style={{
        maxWidth:"600px", width:"100%", marginTop:"24px",
        background:"rgba(30,30,30,0.92)", color:"#fff",
        borderRadius:"22px", padding:"24px 22px 28px",
        boxShadow:"0 24px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06) inset",
        backdropFilter:"blur(10px)", position:"relative",
        transform: animIn ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
        opacity: animIn ? 1 : 0,
        transition:"all 0.7s 0.2s cubic-bezier(.22,1,.36,1)",
      }}>
        {/* glowing dot */}
        <div style={{
          position:"absolute", top:"18px", left:"18px",
          width:"12px", height:"12px", borderRadius:"50%",
          background:"#ff7ab6", boxShadow:"0 0 20px #ff7ab6aa",
          animation:"pulse 2s ease-in-out infinite",
        }}/>

        <div style={{
          lineHeight:1.7, whiteSpace:"pre-wrap", minHeight:"120px",
          paddingTop:"8px", fontSize:"1.02rem",
        }}>
          {display}
          <span style={{ animation:"blink 0.8s step-end infinite", fontWeight:100 }}>|</span>
        </div>

        {done && (
          <div style={{textAlign:"center", marginTop:"18px"}}>
            <button onClick={handleSurprise} style={{
              background:"linear-gradient(135deg, #7c3aed, #a855f7)",
              color:"#fff", border:"none", padding:"14px 24px",
              borderRadius:"14px", fontSize:"1rem", fontWeight:700,
              cursor:"pointer",
              boxShadow:"0 10px 30px rgba(139,92,246,0.4)",
              animation:"gentleBounce 2s ease-in-out infinite",
              transition:"transform 0.15s",
            }}
              onMouseDown={e=>e.currentTarget.style.transform="scale(0.95)"}
              onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
            >
              Tap here for your birthday surprise 🎁
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════
   PAGE 3 — 3D Photo Carousel
   ═══════════════════════════════════════════ */
function GalleryPage({ name }){
  const photos = Array.from({length:9}).map((_,i)=>`photos/photo${i+1}.webp`);

  // Responsive sizing — computed once on mount
  const vw = window.innerWidth;
  const isMobile = vw < 640;
  const cardSize = isMobile ? Math.round(Math.min(vw * 0.42, 180)) : 220;
  const radius   = isMobile ? Math.round(Math.min(vw * 0.52, 280)) : 480;
  // title fades in after the last card has popped in
  const titleDelay = (photos.length - 1) * 0.55 + 1.0;

  return (
    <div style={{
      minHeight:"100svh", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", gap:"28px",
      position:"relative", zIndex:1, overflow:"hidden", padding:"24px 0",
    }}>

      {/* top decorative row */}
      <div style={{
        display:"flex", gap:"12px", fontSize:"clamp(1.4rem, 4vw, 2rem)",
        opacity:0, animation:`fadeIn 0.8s 0.2s forwards`,
      }}>
        {["🎈","🎂","🎉","🎁","🎀","🎊"].map((e,i)=>(
          <span key={i} style={{
            display:"inline-block",
            animation:`gentleBounce ${1.2 + i*0.15}s ${i*0.1}s ease-in-out infinite`,
          }}>{e}</span>
        ))}
      </div>

      {/* title — fades in after all cards appear */}
      <div style={{
        textAlign:"center", zIndex:10, pointerEvents:"none", padding:"0 16px",
        marginBottom:"24px",
        opacity:0, animation:`fadeIn 1.2s ${titleDelay}s forwards`,
      }}>
        <h2 style={{
          fontFamily:"'Brush Script MT', 'Segoe Script', cursive",
          fontSize:"clamp(2.6rem, 10vw, 5rem)",
          background:"linear-gradient(135deg, #f472b6, #7c3aed, #38bdf8)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          margin:0, lineHeight:1.2,
          filter:"drop-shadow(0 2px 12px rgba(124,58,237,0.35))",
        }}>
          Happy Birthday {name}
        </h2>
      </div>

      {/* carousel — spins immediately; cards pop in one-by-one on the spinning ring */}
      <div style={{
        width:`${cardSize}px`, height:`${cardSize}px`,
        perspective:`${radius * 3}px`, position:"relative", flexShrink:0,
      }}>
        <div style={{
          width:"100%", height:"100%", transformStyle:"preserve-3d", position:"absolute",
          animation:"carouselSpin 22s linear infinite",
        }}>
          {photos.map((src, i)=>(
            /* outer div: sets the 3D slot — no animation so it doesn't conflict */
            <div key={i} style={{
              position:"absolute", top:0, left:0, width:"100%", height:"100%",
              transform:`rotateY(${i * (360 / photos.length)}deg) translateZ(${radius}px)`,
            }}>
              {/* inner div: only scale + opacity pop-in; padding creates gap between cards */}
              <div style={{
                width:"100%", height:"100%",
                padding:"0 10px",
                opacity:0,
                animation:`popIn 0.7s ${i * 0.55}s ease-out forwards`,
              }}>
                <img src={src} alt={`photo ${i+1}`} decoding="async" loading="eager" style={{
                  width:"100%", height:"100%", objectFit:"cover",
                  borderRadius:"12px", border:"3px solid rgba(255,255,255,0.85)",
                  boxShadow:"0 8px 32px rgba(0,0,0,0.25)", display:"block",
                }}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* bottom quote */}
      <div style={{
        textAlign:"center", padding:"0 24px",
        marginTop:`${Math.round(cardSize * 0.3)}px`,
        opacity:0, animation:`fadeIn 1.2s ${titleDelay + 0.4}s forwards`,
      }}>
        <p style={{
          fontSize:"clamp(0.95rem, 3.5vw, 1.2rem)", color:"rgba(255,255,255,0.9)",
          fontStyle:"italic", margin:0, lineHeight:1.6,
          textShadow:"0 1px 8px rgba(124,58,237,0.4)",
        }}>
          "Every moment with you is a memory worth keeping 💗"
        </p>
      </div>

      {/* bottom decorative hearts */}
      <div style={{
        display:"flex", gap:"10px", fontSize:"clamp(1.2rem, 3.5vw, 1.7rem)",
        opacity:0, animation:`fadeIn 0.8s ${titleDelay + 0.7}s forwards`,
      }}>
        {["💗","💜","💗","💜","💗"].map((e,i)=>(
          <span key={i} style={{ animation:`pulse 1.8s ${i*0.3}s ease-in-out infinite` }}>{e}</span>
        ))}
      </div>

      <p style={{
        position:"fixed", bottom:"16px", left:"50%", transform:"translateX(-50%)",
        fontSize:"0.8rem", color:"rgba(255,255,255,0.6)", whiteSpace:"nowrap",
      }}>Made with ❤️ for someone special</p>
    </div>
  );
}


/* ═══════════════════════════════════════════
   MAIN APP — Page router + persistent music
   ═══════════════════════════════════════════ */
export default function App(){
  const [page, setPage] = useState("welcome"); // welcome | message | gallery
  const [name, setName] = useState("Friend");
  const audioRef = useRef(null);
  const [musicStarted, setMusicStarted] = useState(false);

  const startMusic = useCallback(()=>{
    if(!musicStarted && audioRef.current){
      audioRef.current.play().then(()=>{
        setMusicStarted(true);
      }).catch(()=>{
        // retry on next interaction
      });
    }
  },[musicStarted]);

  const handleWelcome = (n)=>{
    setName(n);
    startMusic();
    setPage("message");
  };

  const handleSurprise = ()=>{
    startMusic();
    setPage("gallery");
  };

  return (
    <div style={{
      margin:0, minHeight:"100svh",
      fontFamily:"'Segoe UI', system-ui, -apple-system, sans-serif",
      background:"radial-gradient(ellipse at 50% -20%, #ffe6f2 0, rgba(255,230,242,0) 70%), linear-gradient(180deg, #ffe0ef 0%, #ffb6d6 40%, #ff9ac2 100%)",
      overflow:"hidden", position:"relative",
    }} onClick={startMusic}>

      {/* persistent background music */}
      <audio ref={audioRef} loop preload="auto">
        <source src="assets/music.mp3" type="audio/mpeg"/>
      </audio>

      {/* floating hearts */}
      <FloatingHearts/>

      {/* global styles via style tag */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }
        @keyframes blink { 50% { opacity: 0; } }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }
        @keyframes gentleBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.2); }
          60%  { opacity: 1; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes carouselSpin {
          from { transform: rotateY(0deg); }
          to   { transform: rotateY(360deg); }
        }
        * { box-sizing: border-box; margin:0; padding:0; }
        body { margin:0; }
        ::selection { background: #f9a8d4; color: #fff; }
      `}</style>

      {/* Pages */}
      {page === "welcome" && <WelcomePage onNext={handleWelcome}/>}
      {page === "message" && <MessagePage name={name} onNext={handleSurprise}/>}
      {page === "gallery" && <GalleryPage name={name}/>}
    </div>
  );
}
