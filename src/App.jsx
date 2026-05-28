import { useState, useEffect } from "react";

const load = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
};
const save = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
};

// ── Exercise Database ──────────────────────────────────────
const DEFAULT_EXERCISES = [
  { id:'e1',  name:'Bench Press',               category:'Chest' },
  { id:'e2',  name:'Incline Bench Press',        category:'Chest' },
  { id:'e3',  name:'Decline Bench Press',        category:'Chest' },
  { id:'e4',  name:'Dumbbell Fly',               category:'Chest' },
  { id:'e5',  name:'Cable Fly',                  category:'Chest' },
  { id:'e6',  name:'Push-Up',                    category:'Chest' },
  { id:'e7',  name:'Chest Dip',                  category:'Chest' },
  { id:'e8',  name:'Deadlift',                   category:'Back'  },
  { id:'e9',  name:'Pull-Up',                    category:'Back'  },
  { id:'e10', name:'Barbell Row',                category:'Back'  },
  { id:'e11', name:'Seated Cable Row',           category:'Back'  },
  { id:'e12', name:'Lat Pulldown',               category:'Back'  },
  { id:'e13', name:'T-Bar Row',                  category:'Back'  },
  { id:'e14', name:'Single Arm DB Row',          category:'Back'  },
  { id:'e15', name:'Overhead Press',             category:'Shoulders' },
  { id:'e16', name:'Lateral Raise',              category:'Shoulders' },
  { id:'e17', name:'Front Raise',                category:'Shoulders' },
  { id:'e18', name:'Face Pull',                  category:'Shoulders' },
  { id:'e19', name:'Arnold Press',               category:'Shoulders' },
  { id:'e20', name:'Shrug',                      category:'Shoulders' },
  { id:'e21', name:'Barbell Curl',               category:'Biceps' },
  { id:'e22', name:'Dumbbell Curl',              category:'Biceps' },
  { id:'e23', name:'Hammer Curl',                category:'Biceps' },
  { id:'e24', name:'Preacher Curl',              category:'Biceps' },
  { id:'e25', name:'Cable Curl',                 category:'Biceps' },
  { id:'e26', name:'Tricep Pushdown',            category:'Triceps' },
  { id:'e27', name:'Skull Crusher',              category:'Triceps' },
  { id:'e28', name:'Overhead Tricep Extension',  category:'Triceps' },
  { id:'e29', name:'Close Grip Bench Press',     category:'Triceps' },
  { id:'e30', name:'Tricep Dip',                 category:'Triceps' },
  { id:'e31', name:'Squat',                      category:'Legs' },
  { id:'e32', name:'Leg Press',                  category:'Legs' },
  { id:'e33', name:'Romanian Deadlift',          category:'Legs' },
  { id:'e34', name:'Leg Curl',                   category:'Legs' },
  { id:'e35', name:'Leg Extension',              category:'Legs' },
  { id:'e36', name:'Calf Raise',                 category:'Legs' },
  { id:'e37', name:'Lunge',                      category:'Legs' },
  { id:'e38', name:'Bulgarian Split Squat',      category:'Legs' },
  { id:'e39', name:'Hip Thrust',                 category:'Legs' },
  { id:'e40', name:'Plank',                      category:'Core' },
  { id:'e41', name:'Crunch',                     category:'Core' },
  { id:'e42', name:'Leg Raise',                  category:'Core' },
  { id:'e43', name:'Russian Twist',              category:'Core' },
  { id:'e44', name:'Ab Wheel Rollout',           category:'Core' },
  { id:'e45', name:'Cable Crunch',               category:'Core' },
];

const CATS = ['Chest','Back','Shoulders','Biceps','Triceps','Legs','Core'];
const uid  = () => Math.random().toString(36).slice(2,9);
const fmt  = d  => new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric'});
const fmtL = d  => new Date(d).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});

// ── SVG Icons ──────────────────────────────────────────────
const Ic = {
  home:    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
  splits:  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>,
  clock:   <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>,
  dumbbell:<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/></svg>,
  plus:    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>,
  check:   <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>,
  trash:   <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>,
  back:    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>,
  edit:    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>,
  fire:    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/></svg>,
  trophy:  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/></svg>,
};

// ── Bottom Nav ─────────────────────────────────────────────
function BottomNav({ view, navigate }) {
  const tabs = [
    { id:'home',      label:'Home',      icon:Ic.home },
    { id:'splits',    label:'Splits',    icon:Ic.splits },
    { id:'history',   label:'History',   icon:Ic.clock },
    { id:'exercises', label:'Exercises', icon:Ic.dumbbell },
  ];
  return (
    <nav style={{background:'#0f0f0f',borderTop:'1px solid #1e1e1e'}}
         className="fixed bottom-0 left-0 right-0 flex max-w-md mx-auto">
      {tabs.map(t => (
        <button key={t.id} onClick={() => navigate(t.id)}
          className="flex-1 flex flex-col items-center py-3 gap-1 text-xs font-medium transition-all"
          style={{color: view===t.id ? '#f97316' : '#4b5563'}}>
          {t.icon}
          <span style={{fontSize:'10px',letterSpacing:'0.05em'}}>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

// ── Shared: Exercise Picker Sheet ─────────────────────────
function ExSheet({ exercises, selected=[], onToggle, onClose, title="Add Exercises" }) {
  const [q, setQ] = useState('');
  const filtered = exercises.filter(e => e.name.toLowerCase().includes(q.toLowerCase()));
  const groups = CATS.map(c => ({cat:c, items:filtered.filter(e=>e.category===c)})).filter(g=>g.items.length);
  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{background:'rgba(0,0,0,0.85)'}}
         onClick={onClose}>
      <div className="w-full max-w-md mx-auto rounded-t-2xl flex flex-col"
           style={{background:'#141414',maxHeight:'80vh'}} onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h2 className="font-bold text-white">{title}</h2>
          <button onClick={onClose} style={{color:'#f97316'}} className="text-sm font-semibold">Done</button>
        </div>
        <div className="px-4 pb-3">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search…"
            className="w-full rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
            style={{background:'#1e1e1e',border:'1px solid #2a2a2a'}} />
        </div>
        <div className="overflow-y-auto px-4 pb-6">
          {groups.map(g => (
            <div key={g.cat} className="mb-4">
              <p className="text-xs font-bold uppercase mb-2" style={{color:'#f97316',letterSpacing:'0.1em'}}>{g.cat}</p>
              {g.items.map(ex => {
                const on = selected.includes(ex.id);
                return (
                  <button key={ex.id} onClick={() => onToggle(ex.id)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl mb-1 transition-all text-left"
                    style={{background: on ? '#1f1008' : '#1a1a1a', border: `1px solid ${on ? '#f97316' : '#2a2a2a'}`}}>
                    <span className="text-sm" style={{color: on ? '#fb923c' : '#d1d5db'}}>{ex.name}</span>
                    {on && <span style={{color:'#f97316'}}>{Ic.check}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Home View ──────────────────────────────────────────────
function HomeView({ splits, sessions, exercises, navigate }) {
  const [picker, setPicker] = useState(false);
  const [selSplit, setSelSplit] = useState(null);
  const recent = sessions[0];

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6 mt-2">
        <span style={{color:'#f97316'}}>{Ic.fire}</span>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">GAINLOG</h1>
          <p className="text-xs" style={{color:'#6b7280',letterSpacing:'0.08em'}}>TRACK · OVERLOAD · GROW</p>
        </div>
      </div>

      {/* Start Workout CTA */}
      <button onClick={() => splits.length ? setPicker(true) : navigate('splits')}
        className="w-full py-5 rounded-2xl font-black text-lg tracking-wide mb-5 flex items-center justify-center gap-2 transition-all active:scale-95"
        style={{background:'linear-gradient(135deg,#ea580c,#f97316)',color:'#fff',boxShadow:'0 4px 24px rgba(249,115,22,0.3)'}}>
        {Ic.plus} START WORKOUT
      </button>

      {splits.length === 0 && (
        <div className="rounded-2xl p-5 text-center mb-4" style={{background:'#141414',border:'1px dashed #2a2a2a'}}>
          <p className="text-sm mb-2" style={{color:'#6b7280'}}>No splits yet — build your program first.</p>
          <button onClick={() => navigate('splits')} style={{color:'#f97316'}} className="text-sm font-semibold">Create a split →</button>
        </div>
      )}

      {/* Last Workout Card */}
      {recent && (
        <div className="rounded-2xl p-4 mb-4" style={{background:'#141414',border:'1px solid #1e1e1e'}}>
          <p className="text-xs font-bold uppercase mb-2" style={{color:'#6b7280',letterSpacing:'0.1em'}}>Last Workout</p>
          <div className="flex items-baseline justify-between mb-1">
            <p className="font-bold text-white text-lg">{recent.dayName}</p>
            <p className="text-sm" style={{color:'#6b7280'}}>{fmt(recent.date)}</p>
          </div>
          <p className="text-sm mb-3" style={{color:'#9ca3af'}}>{recent.splitName}</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {recent.exercises.slice(0,4).map(ex => {
              const e = exercises.find(x=>x.id===ex.exerciseId);
              const best = ex.sets.reduce((b,s)=>s.weight>b?s.weight:b,0);
              return e ? (
                <span key={ex.exerciseId} className="text-xs px-2.5 py-1 rounded-full"
                      style={{background:'#1e1e1e',color:'#9ca3af'}}>
                  {e.name}{best>0 ? ` · ${best}lb` : ''}
                </span>
              ) : null;
            })}
            {recent.exercises.length>4 && <span className="text-xs" style={{color:'#6b7280'}}>+{recent.exercises.length-4} more</span>}
          </div>
          <button onClick={() => navigate('history', recent)} style={{color:'#f97316'}} className="text-xs font-semibold">View session →</button>
        </div>
      )}

      {/* Stats row */}
      {sessions.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl p-4" style={{background:'#141414',border:'1px solid #1e1e1e'}}>
            <p className="text-xs font-bold uppercase mb-1" style={{color:'#6b7280',letterSpacing:'0.08em'}}>Total Sessions</p>
            <p className="text-3xl font-black" style={{color:'#f97316'}}>{sessions.length}</p>
          </div>
          <div className="rounded-2xl p-4" style={{background:'#141414',border:'1px solid #1e1e1e'}}>
            <p className="text-xs font-bold uppercase mb-1" style={{color:'#6b7280',letterSpacing:'0.08em'}}>This Week</p>
            <p className="text-3xl font-black" style={{color:'#f97316'}}>
              {sessions.filter(s => (Date.now()-new Date(s.date).getTime()) < 604800000).length}
            </p>
          </div>
        </div>
      )}

      {/* Split Picker Sheet */}
      {picker && (
        <div className="fixed inset-0 z-50 flex items-end" style={{background:'rgba(0,0,0,0.85)'}}
             onClick={() => { setPicker(false); setSelSplit(null); }}>
          <div className="w-full max-w-md mx-auto rounded-t-2xl p-4 overflow-y-auto"
               style={{background:'#141414',maxHeight:'70vh'}} onClick={e=>e.stopPropagation()}>
            <h2 className="font-black text-white text-lg mb-4">
              {selSplit ? selSplit.name : 'Choose Split'}
            </h2>
            {!selSplit ? (
              <div className="flex flex-col gap-2">
                {splits.map(sp => (
                  <button key={sp.id} onClick={() => setSelSplit(sp)}
                    className="text-left px-4 py-3 rounded-xl transition-all"
                    style={{background:'#1a1a1a',border:'1px solid #2a2a2a'}}>
                    <p className="font-bold text-white">{sp.name}</p>
                    <p className="text-xs mt-0.5" style={{color:'#6b7280'}}>{sp.days.length} day{sp.days.length!==1?'s':''}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button onClick={() => setSelSplit(null)} style={{color:'#f97316'}} className="text-sm font-semibold text-left mb-1">← Back</button>
                {selSplit.days.map(d => (
                  <button key={d.id} onClick={() => { navigate('workout',{split:selSplit,day:d}); setPicker(false); setSelSplit(null); }}
                    className="text-left px-4 py-3 rounded-xl transition-all"
                    style={{background:'#1a1a1a',border:'1px solid #2a2a2a'}}>
                    <p className="font-bold text-white">{d.name}</p>
                    <p className="text-xs mt-0.5" style={{color:'#6b7280'}}>{d.exerciseIds.length} exercises</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Splits View ────────────────────────────────────────────
function SplitsView({ splits, setSplits, navigate }) {
  const del = id => { if(window.confirm('Delete this split?')) setSplits(p=>p.filter(s=>s.id!==id)); };
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-5 mt-1">
        <h1 className="text-xl font-black text-white">SPLITS</h1>
        <button onClick={() => navigate('split-editor',null)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-bold transition-all"
          style={{background:'#f97316',color:'#fff'}}>
          {Ic.plus} New
        </button>
      </div>

      {splits.length===0 && (
        <div className="rounded-2xl p-8 text-center" style={{background:'#141414',border:'1px dashed #2a2a2a'}}>
          <p className="text-sm mb-1" style={{color:'#6b7280'}}>No splits yet.</p>
          <p className="text-xs" style={{color:'#4b5563'}}>Create a split to organize your weekly program.</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {splits.map(sp => (
          <div key={sp.id} className="rounded-2xl p-4" style={{background:'#141414',border:'1px solid #1e1e1e'}}>
            <div className="flex items-start justify-between mb-3">
              <p className="font-black text-white text-lg">{sp.name}</p>
              <div className="flex gap-2">
                <button onClick={() => navigate('split-editor',sp)} className="p-1.5 rounded-lg transition-all" style={{color:'#9ca3af',background:'#1e1e1e'}}>{Ic.edit}</button>
                <button onClick={() => del(sp.id)} className="p-1.5 rounded-lg transition-all" style={{color:'#9ca3af',background:'#1e1e1e'}}>{Ic.trash}</button>
              </div>
            </div>
            {sp.days.map(d => (
              <div key={d.id} className="flex items-center justify-between py-2"
                   style={{borderTop:'1px solid #1e1e1e'}}>
                <p className="text-sm font-semibold" style={{color:'#d1d5db'}}>{d.name}</p>
                <p className="text-xs" style={{color:'#6b7280'}}>{d.exerciseIds.length} exercises</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Split Editor View ──────────────────────────────────────
function SplitEditorView({ splits, setSplits, exercises, navigate, editSplit }) {
  const [name, setName]   = useState(editSplit?.name || '');
  const [days, setDays]   = useState(editSplit?.days || []);
  const [picker, setPicker] = useState(null); // dayId

  const addDay   = () => setDays(p=>[...p, {id:uid(), name:`Day ${p.length+1}`, exerciseIds:[]}]);
  const remDay   = id => setDays(p=>p.filter(d=>d.id!==id));
  const setDName = (id,v) => setDays(p=>p.map(d=>d.id===id?{...d,name:v}:d));
  const remEx    = (dayId,exId) => setDays(p=>p.map(d=>d.id===dayId?{...d,exerciseIds:d.exerciseIds.filter(e=>e!==exId)}:d));
  const togEx    = (dayId,exId) => setDays(p=>p.map(d=>d.id===dayId?{...d,exerciseIds:d.exerciseIds.includes(exId)?d.exerciseIds.filter(e=>e!==exId):[...d.exerciseIds,exId]}:d));

  const save = () => {
    if (!name.trim()) return alert('Enter a split name');
    if (!days.length) return alert('Add at least one day');
    const s = {id: editSplit?.id||uid(), name:name.trim(), days};
    setSplits(p => editSplit ? p.map(x=>x.id===editSplit.id?s:x) : [...p,s]);
    navigate('splits');
  };

  const pd = days.find(d=>d.id===picker);

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-5 mt-1">
        <button onClick={() => navigate('splits')} style={{color:'#9ca3af'}}>{Ic.back}</button>
        <h1 className="text-xl font-black text-white">{editSplit ? 'Edit Split' : 'New Split'}</h1>
      </div>

      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Split name (e.g. PPL, Upper/Lower…)"
        className="w-full rounded-xl px-4 py-3 text-white text-sm mb-5 focus:outline-none"
        style={{background:'#141414',border:'1px solid #2a2a2a'}} />

      <div className="flex flex-col gap-3 mb-4">
        {days.map(day => (
          <div key={day.id} className="rounded-2xl p-4" style={{background:'#141414',border:'1px solid #1e1e1e'}}>
            <div className="flex items-center gap-2 mb-3">
              <input value={day.name} onChange={e=>setDName(day.id,e.target.value)}
                className="flex-1 rounded-lg px-3 py-1.5 text-white text-sm font-semibold focus:outline-none"
                style={{background:'#1e1e1e',border:'1px solid #2a2a2a'}} />
              <button onClick={()=>remDay(day.id)} style={{color:'#6b7280'}}>{Ic.trash}</button>
            </div>

            {day.exerciseIds.map(exId => {
              const ex = exercises.find(e=>e.id===exId);
              return ex ? (
                <div key={exId} className="flex items-center justify-between rounded-lg px-3 py-2 mb-1"
                     style={{background:'#1e1e1e'}}>
                  <span className="text-sm" style={{color:'#d1d5db'}}>{ex.name}</span>
                  <button onClick={()=>remEx(day.id,exId)} style={{color:'#6b7280'}}>{Ic.trash}</button>
                </div>
              ) : null;
            })}

            <button onClick={() => setPicker(day.id)}
              className="flex items-center gap-1 text-sm font-semibold mt-2" style={{color:'#f97316'}}>
              {Ic.plus} Add Exercises
            </button>
          </div>
        ))}
      </div>

      <button onClick={addDay}
        className="w-full py-3 rounded-2xl text-sm font-semibold mb-5 flex items-center justify-center gap-1 transition-all"
        style={{border:'1px dashed #374151',color:'#6b7280'}}>
        {Ic.plus} Add Day
      </button>

      <button onClick={save}
        className="w-full py-4 rounded-2xl font-black text-white text-base tracking-wide transition-all active:scale-95"
        style={{background:'linear-gradient(135deg,#ea580c,#f97316)'}}>
        SAVE SPLIT
      </button>

      {picker && pd && (
        <ExSheet exercises={exercises} selected={pd.exerciseIds}
          onToggle={exId => togEx(pd.id, exId)}
          onClose={() => setPicker(null)}
          title={`${pd.name} — Exercises`} />
      )}
    </div>
  );
}

// ── Workout View ───────────────────────────────────────────
function WorkoutView({ split, day, exercises, sessions, saveSession, navigate }) {
  const lastSess = sessions.find(s => s.splitId===split.id && s.dayId===day.id);

  const [wEx, setWEx] = useState(() =>
    day.exerciseIds.map(exId => {
      const last = lastSess?.exercises.find(e=>e.exerciseId===exId);
      return {
        exerciseId: exId,
        sets: last
          ? last.sets.map(s=>({weight:String(s.weight||''), reps:String(s.reps||''), completed:false}))
          : [{weight:'', reps:'', completed:false}]
      };
    })
  );
  const [addExOpen, setAddExOpen] = useState(false);
  const [done, setDone] = useState(false);

  const upd = (ei,si,f,v) => setWEx(p=>p.map((ex,i)=>i!==ei?ex:{...ex,sets:ex.sets.map((s,j)=>j!==si?s:{...s,[f]:v})}));
  const tog = (ei,si) => setWEx(p=>p.map((ex,i)=>i!==ei?ex:{...ex,sets:ex.sets.map((s,j)=>j!==si?s:{...s,completed:!s.completed})}));
  const addSet = ei => setWEx(p=>p.map((ex,i)=>i!==ei?ex:{...ex,sets:[...ex.sets,{weight:ex.sets.at(-1)?.weight||'',reps:ex.sets.at(-1)?.reps||'',completed:false}]}));
  const remSet = ei => setWEx(p=>p.map((ex,i)=>i!==ei||ex.sets.length<2?ex:{...ex,sets:ex.sets.slice(0,-1)}));
  const remEx  = ei => setWEx(p=>p.filter((_,i)=>i!==ei));
  const addEx  = id => { if(!wEx.find(e=>e.exerciseId===id)) setWEx(p=>[...p,{exerciseId:id,sets:[{weight:'',reps:'',completed:false}]}]); setAddExOpen(false); };

  const finish = () => {
    saveSession({
      id:uid(), date:new Date().toISOString(),
      splitId:split.id, splitName:split.name,
      dayId:day.id, dayName:day.name,
      exercises: wEx.map(ex=>({
        exerciseId:ex.exerciseId,
        sets:ex.sets.map(s=>({weight:parseFloat(s.weight)||0, reps:parseInt(s.reps)||0, completed:s.completed}))
      }))
    });
    setDone(true);
  };

  if (done) return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <div className="text-7xl mb-6">💪</div>
      <h2 className="text-3xl font-black text-white mb-2">DONE!</h2>
      <p className="mb-8" style={{color:'#9ca3af'}}>{day.name} logged.</p>
      <button onClick={() => navigate('home')}
        className="px-10 py-4 rounded-2xl font-black text-white transition-all active:scale-95"
        style={{background:'linear-gradient(135deg,#ea580c,#f97316)'}}>
        Back to Home
      </button>
    </div>
  );

  const availEx = exercises.filter(e => !wEx.find(we=>we.exerciseId===e.id));
  const totalSets = wEx.reduce((s,ex)=>s+ex.sets.length,0);
  const doneSets  = wEx.reduce((s,ex)=>s+ex.sets.filter(s=>s.completed).length,0);
  const pct = totalSets ? Math.round(doneSets/totalSets*100) : 0;

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2 mt-1">
        <button onClick={()=>{ if(window.confirm('Cancel workout? Progress will be lost.')) navigate('home'); }}
          style={{color:'#9ca3af'}}>{Ic.back}</button>
        <div className="flex-1">
          <h1 className="font-black text-white text-xl leading-none">{day.name}</h1>
          <p className="text-xs mt-0.5" style={{color:'#6b7280'}}>{split.name}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black" style={{color:'#f97316'}}>{pct}%</p>
          <p className="text-xs" style={{color:'#6b7280'}}>{doneSets}/{totalSets} sets</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 rounded-full mb-4" style={{background:'#1e1e1e'}}>
        <div className="h-1 rounded-full transition-all" style={{width:`${pct}%`,background:'linear-gradient(90deg,#ea580c,#f97316)'}} />
      </div>

      {lastSess && (
        <p className="text-xs mb-4 px-1" style={{color:'#6b7280'}}>
          Last {day.name}: {fmt(lastSess.date)} — beat those numbers 👊
        </p>
      )}

      {/* Exercises */}
      <div className="flex flex-col gap-4 mb-4">
        {wEx.map((ex, ei) => {
          const info  = exercises.find(e=>e.id===ex.exerciseId);
          const last  = lastSess?.exercises.find(e=>e.exerciseId===ex.exerciseId);
          const allOk = ex.sets.every(s=>s.completed);

          return (
            <div key={ex.exerciseId} className="rounded-2xl p-4 transition-all"
                 style={{background: allOk?'#1a0d00':'#141414', border:`1px solid ${allOk?'#7c2d12':'#1e1e1e'}`}}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-white">{info?.name}</p>
                  {info && <p className="text-xs mt-0.5" style={{color:'#6b7280'}}>{info.category}</p>}
                </div>
                <button onClick={()=>remEx(ei)} style={{color:'#374151'}}>{Ic.trash}</button>
              </div>

              {/* Last session reference */}
              {last && (
                <div className="rounded-xl px-3 py-2 mb-3" style={{background:'#1e1e1e',border:'1px solid #2a2a2a'}}>
                  <p className="text-xs font-bold mb-1.5" style={{color:'#f97316',letterSpacing:'0.08em'}}>LAST SESSION — BEAT THIS</p>
                  <div className="flex flex-wrap gap-1.5">
                    {last.sets.map((s,i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{background:'#0f0f0f',color:'#9ca3af'}}>
                        {i+1}: {s.weight}lb × {s.reps}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Set headers */}
              <div className="grid gap-2 mb-1 px-1" style={{gridTemplateColumns:'28px 1fr 1fr 36px'}}>
                <span className="text-xs text-center" style={{color:'#4b5563'}}>SET</span>
                <span className="text-xs text-center" style={{color:'#4b5563'}}>LBS</span>
                <span className="text-xs text-center" style={{color:'#4b5563'}}>REPS</span>
                <span></span>
              </div>

              {/* Sets */}
              {ex.sets.map((s,si) => (
                <div key={si} className="grid gap-2 mb-2 items-center" style={{gridTemplateColumns:'28px 1fr 1fr 36px'}}>
                  <span className="text-sm font-black text-center" style={{color: s.completed?'#f97316':'#4b5563'}}>{si+1}</span>
                  <input type="number" inputMode="decimal" value={s.weight} onChange={e=>upd(ei,si,'weight',e.target.value)}
                    placeholder="0" className="rounded-xl py-2 text-white text-sm text-center focus:outline-none transition-all"
                    style={{background: s.completed?'#1a0d00':'#1e1e1e', border:`1px solid ${s.completed?'#7c2d12':'#2a2a2a'}`}} />
                  <input type="number" inputMode="numeric" value={s.reps} onChange={e=>upd(ei,si,'reps',e.target.value)}
                    placeholder="0" className="rounded-xl py-2 text-white text-sm text-center focus:outline-none transition-all"
                    style={{background: s.completed?'#1a0d00':'#1e1e1e', border:`1px solid ${s.completed?'#7c2d12':'#2a2a2a'}`}} />
                  <button onClick={()=>tog(ei,si)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                    style={{background: s.completed?'#f97316':'#1e1e1e', color: s.completed?'#fff':'#4b5563'}}>
                    {Ic.check}
                  </button>
                </div>
              ))}

              <div className="flex gap-3 mt-2">
                <button onClick={()=>addSet(ei)} className="text-xs font-semibold flex items-center gap-0.5" style={{color:'#f97316'}}>
                  {Ic.plus} Add Set
                </button>
                {ex.sets.length>1 && (
                  <button onClick={()=>remSet(ei)} className="text-xs" style={{color:'#6b7280'}}>Remove last</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={()=>setAddExOpen(true)}
        className="w-full py-3 rounded-2xl text-sm font-semibold mb-4 flex items-center justify-center gap-1 transition-all"
        style={{border:'1px dashed #374151',color:'#6b7280'}}>
        {Ic.plus} Add Exercise
      </button>

      <button onClick={finish}
        className="w-full py-4 rounded-2xl font-black text-white text-lg tracking-wide mb-2 transition-all active:scale-95"
        style={{background:'linear-gradient(135deg,#16a34a,#22c55e)',boxShadow:'0 4px 24px rgba(34,197,94,0.25)'}}>
        FINISH WORKOUT ✓
      </button>

      {addExOpen && (
        <ExSheet exercises={availEx} selected={[]} onToggle={addEx}
          onClose={()=>setAddExOpen(false)} title="Add Exercise" />
      )}
    </div>
  );
}

// ── History View ───────────────────────────────────────────
function HistoryView({ sessions, exercises, navigate, sessionDetail }) {
  const [detail, setDetail] = useState(sessionDetail || null);

  if (detail) {
    const totalVol = detail.exercises.reduce((sum,ex)=>sum+ex.sets.reduce((s2,s)=>s2+(s.weight*s.reps),0),0);
    return (
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4 mt-1">
          <button onClick={()=>setDetail(null)} style={{color:'#9ca3af'}}>{Ic.back}</button>
          <div>
            <h1 className="font-black text-white text-xl leading-none">{detail.dayName}</h1>
            <p className="text-xs mt-0.5" style={{color:'#6b7280'}}>{detail.splitName} · {fmtL(detail.date)}</p>
          </div>
        </div>

        <div className="rounded-2xl px-4 py-3 mb-4 flex items-center justify-between" style={{background:'#141414',border:'1px solid #1e1e1e'}}>
          <div><p className="text-xs uppercase font-bold" style={{color:'#6b7280',letterSpacing:'0.08em'}}>Total Volume</p>
          <p className="text-2xl font-black" style={{color:'#f97316'}}>{totalVol.toLocaleString()} <span className="text-sm">lbs</span></p></div>
          <div><p className="text-xs uppercase font-bold" style={{color:'#6b7280',letterSpacing:'0.08em'}}>Exercises</p>
          <p className="text-2xl font-black text-white">{detail.exercises.length}</p></div>
        </div>

        <div className="flex flex-col gap-3">
          {detail.exercises.map(ex => {
            const info = exercises.find(e=>e.id===ex.exerciseId);
            const best = ex.sets.reduce((b,s)=>s.weight>b?s.weight:b,0);
            const vol  = ex.sets.reduce((s,x)=>s+(x.weight*x.reps),0);
            return (
              <div key={ex.exerciseId} className="rounded-2xl p-4" style={{background:'#141414',border:'1px solid #1e1e1e'}}>
                <div className="flex items-baseline justify-between mb-2">
                  <p className="font-bold text-white">{info?.name||'Unknown'}</p>
                  <p className="text-xs" style={{color:'#6b7280'}}>{vol.toLocaleString()} lbs vol</p>
                </div>
                {ex.sets.map((s,i) => (
                  <div key={i} className="flex items-center gap-3 py-1.5" style={{borderTop:'1px solid #1e1e1e'}}>
                    <span className="text-xs w-8 font-bold" style={{color:'#6b7280'}}>Set {i+1}</span>
                    <span className="text-sm font-semibold text-white">{s.weight} lbs</span>
                    <span style={{color:'#374151'}}>×</span>
                    <span className="text-sm font-semibold text-white">{s.reps} reps</span>
                    {s.completed && <span className="ml-auto text-xs font-bold" style={{color:'#f97316'}}>✓</span>}
                  </div>
                ))}
                {best>0 && <p className="text-xs mt-2 font-semibold" style={{color:'#f97316'}}>Top set: {best} lbs</p>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-black text-white mb-5 mt-1">HISTORY</h1>
      {sessions.length===0 && (
        <div className="rounded-2xl p-8 text-center" style={{background:'#141414',border:'1px dashed #2a2a2a'}}>
          <p className="text-sm" style={{color:'#6b7280'}}>No workouts logged yet.</p>
        </div>
      )}
      <div className="flex flex-col gap-3">
        {sessions.map(s => (
          <button key={s.id} onClick={()=>setDetail(s)}
            className="rounded-2xl p-4 text-left w-full transition-all"
            style={{background:'#141414',border:'1px solid #1e1e1e'}}>
            <div className="flex items-baseline justify-between mb-1">
              <p className="font-black text-white">{s.dayName}</p>
              <p className="text-xs" style={{color:'#6b7280'}}>{fmt(s.date)}</p>
            </div>
            <p className="text-sm mb-2" style={{color:'#6b7280'}}>{s.splitName}</p>
            <div className="flex flex-wrap gap-1.5">
              {s.exercises.slice(0,3).map(ex => {
                const info = exercises.find(e=>e.id===ex.exerciseId);
                const best = ex.sets.reduce((b,x)=>x.weight>b?x.weight:b,0);
                return info ? (
                  <span key={ex.exerciseId} className="text-xs px-2.5 py-1 rounded-full" style={{background:'#1e1e1e',color:'#9ca3af'}}>
                    {info.name}{best>0?` · ${best}lb`:''}
                  </span>
                ) : null;
              })}
              {s.exercises.length>3 && <span className="text-xs" style={{color:'#6b7280'}}>+{s.exercises.length-3} more</span>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Exercise Library View ──────────────────────────────────
function ExerciseLibraryView({ exercises, setExercises }) {
  const [q,    setQ]    = useState('');
  const [cat,  setCat]  = useState('All');
  const [modal,setModal]= useState(false);
  const [nName,setNName]= useState('');
  const [nCat, setNCat] = useState('Chest');

  const filtered = exercises.filter(e => {
    const ms = e.name.toLowerCase().includes(q.toLowerCase());
    const mc = cat==='All' || e.category===cat;
    return ms && mc;
  });
  const groups = (cat==='All'?CATS:[cat]).map(c=>({cat:c,items:filtered.filter(e=>e.category===c)})).filter(g=>g.items.length);

  const addCustom = () => {
    if (!nName.trim()) return;
    setExercises(p=>[...p,{id:uid(),name:nName.trim(),category:nCat,custom:true}]);
    setNName(''); setModal(false);
  };
  const del = id => { if(window.confirm('Remove this exercise?')) setExercises(p=>p.filter(e=>e.id!==id)); };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4 mt-1">
        <h1 className="text-xl font-black text-white">EXERCISES</h1>
        <button onClick={()=>setModal(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-bold"
          style={{background:'#f97316',color:'#fff'}}>
          {Ic.plus} Custom
        </button>
      </div>

      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search exercises…"
        className="w-full rounded-xl px-4 py-2.5 text-white text-sm mb-3 focus:outline-none"
        style={{background:'#141414',border:'1px solid #2a2a2a'}} />

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4" style={{scrollbarWidth:'none'}}>
        {['All',...CATS].map(c=>(
          <button key={c} onClick={()=>setCat(c)}
            className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-all"
            style={{background: cat===c?'#f97316':'#1e1e1e', color: cat===c?'#fff':'#6b7280'}}>
            {c}
          </button>
        ))}
      </div>

      {groups.map(g=>(
        <div key={g.cat} className="mb-5">
          <p className="text-xs font-black uppercase mb-2 px-1" style={{color:'#f97316',letterSpacing:'0.1em'}}>{g.cat}</p>
          <div className="flex flex-col gap-1">
            {g.items.map(ex=>(
              <div key={ex.id} className="flex items-center justify-between px-4 py-3 rounded-xl"
                   style={{background:'#141414',border:'1px solid #1e1e1e'}}>
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{color:'#d1d5db'}}>{ex.name}</span>
                  {ex.custom && (
                    <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{background:'#1a0d00',color:'#f97316'}}>CUSTOM</span>
                  )}
                </div>
                {ex.custom && (
                  <button onClick={()=>del(ex.id)} style={{color:'#4b5563'}}>{Ic.trash}</button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Add Custom Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.85)'}}
             onClick={()=>setModal(false)}>
          <div className="w-full max-w-sm rounded-2xl p-5" style={{background:'#141414',border:'1px solid #2a2a2a'}}
               onClick={e=>e.stopPropagation()}>
            <h2 className="font-black text-white text-lg mb-4">Add Custom Exercise</h2>
            <input value={nName} onChange={e=>setNName(e.target.value)} placeholder="Exercise name"
              className="w-full rounded-xl px-4 py-3 text-white text-sm mb-4 focus:outline-none"
              style={{background:'#1e1e1e',border:'1px solid #2a2a2a'}} />
            <p className="text-xs font-bold uppercase mb-2" style={{color:'#6b7280',letterSpacing:'0.08em'}}>Category</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {CATS.map(c=>(
                <button key={c} onClick={()=>setNCat(c)}
                  className="px-3 py-1 rounded-full text-xs font-bold transition-all"
                  style={{background: nCat===c?'#f97316':'#1e1e1e', color: nCat===c?'#fff':'#6b7280'}}>
                  {c}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={()=>setModal(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{background:'#1e1e1e',color:'#9ca3af'}}>Cancel</button>
              <button onClick={addCustom} className="flex-1 py-2.5 rounded-xl text-sm font-black text-white" style={{background:'#f97316'}}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── App Root ───────────────────────────────────────────────
export default function App() {
  const [exercises, setExercises] = useState(() => load('gl_exercises', DEFAULT_EXERCISES));
const [splits,    setSplits]    = useState(() => load('gl_splits',    []));
const [sessions,  setSessions]  = useState(() => load('gl_sessions',  []));
useEffect(() => save('gl_exercises', exercises), [exercises]);
useEffect(() => save('gl_splits',    splits),    [splits]);
useEffect(() => save('gl_sessions',  sessions),  [sessions]);
  const [view,      setView]      = useState('home');
  const [navData,   setNavData]   = useState(null);

  const navigate = (v, data=null) => { setView(v); setNavData(data); };
  const saveSession = s => setSessions(p=>[s,...p]);

  const navView = ['home','splits','history','exercises'].includes(view) ? view : 'home';

  return (
    <div style={{minHeight:'100vh',background:'#0a0a0a',fontFamily:"'DM Sans', 'Inter', system-ui, sans-serif"}}>
      <style>{`
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        ::-webkit-scrollbar { display: none; }
        body { margin: 0; }
      `}</style>
      <div className="max-w-md mx-auto min-h-screen flex flex-col" style={{position:'relative'}}>
        <div style={{flex:1, overflowY:'auto', paddingBottom:'72px'}}>
          {view==='home'         && <HomeView splits={splits} sessions={sessions} exercises={exercises} navigate={navigate} />}
          {view==='splits'       && <SplitsView splits={splits} setSplits={setSplits} navigate={navigate} />}
          {view==='split-editor' && <SplitEditorView splits={splits} setSplits={setSplits} exercises={exercises} navigate={navigate} editSplit={navData} />}
          {view==='workout'      && navData && <WorkoutView split={navData.split} day={navData.day} exercises={exercises} sessions={sessions} saveSession={saveSession} navigate={navigate} />}
          {view==='history'      && <HistoryView sessions={sessions} exercises={exercises} navigate={navigate} sessionDetail={navData} />}
          {view==='exercises'    && <ExerciseLibraryView exercises={exercises} setExercises={setExercises} />}
        </div>
        <BottomNav view={navView} navigate={navigate} />
      </div>
    </div>
  );
}