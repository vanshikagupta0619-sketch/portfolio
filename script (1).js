// ---------- footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- hero typing subtitle ----------
const phrases = [
  "B.Tech ISE Student",
  "Aspiring Software Developer",
  "AI & IoT Enthusiast"
];
const typeTarget = document.getElementById('typeTarget');
let phraseIndex = 0, charIndex = 0, deleting = false;

function typeLoop(){
  const current = phrases[phraseIndex];
  if(!deleting){
    charIndex++;
    typeTarget.textContent = current.slice(0, charIndex);
    if(charIndex === current.length){
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    charIndex--;
    typeTarget.textContent = current.slice(0, charIndex);
    if(charIndex === 0){
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(typeLoop, deleting ? 35 : 65);
}
typeLoop();

// ---------- code editor typing animation ----------
const codeLines = [
  [['kw','const'], ['punc',' '], ['prop','developer'], ['punc',' = {']],
  [['prop','  name'], ['punc',': '], ['str','"Vanshika Gupta"'], ['punc',',']],
  [['prop','  role'], ['punc',': '], ['str','"Software Developer (Fresher)"'], ['punc',',']],
  [['prop','  university'], ['punc',': '], ['str','"Reva University"'], ['punc',',']],
  [['prop','  stack'], ['punc',': ['], ['str','"Python"'], ['punc',', '], ['str','"Java"'], ['punc',', '], ['str','"C"'], ['punc',', '], ['str','"HTML"'], ['punc','],']],
  [['prop','  focus'], ['punc',': ['], ['str','"AI"'], ['punc',', '], ['str','"IoT"'], ['punc',', '], ['str','"Web Dev"'], ['punc','],']],
  [['prop','  status'], ['punc',': '], ['str','"open_to_opportunities"']],
  [['punc','};']]
];

const codeEl = document.querySelector('#codeBlock code');
const consoleOut = document.getElementById('consoleOut');

function renderLineHTML(tokens, charsToShow){
  let out = '';
  let remaining = charsToShow;
  for(const [cls, text] of tokens){
    if(remaining <= 0) break;
    const slice = text.slice(0, remaining);
    out += `<span class="${cls}">${escapeHTML(slice)}</span>`;
    remaining -= text.length;
  }
  return out;
}
function escapeHTML(s){
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function lineLength(tokens){
  return tokens.reduce((sum, [,text]) => sum + text.length, 0);
}

let typedLines = [];
function typeCode(lineIdx = 0, charIdx = 0){
  if(!codeEl) return;
  if(lineIdx >= codeLines.length){
    codeEl.innerHTML = typedLines.join('\n');
    typeConsole();
    return;
  }
  const tokens = codeLines[lineIdx];
  const total = lineLength(tokens);
  const currentLineHTML = renderLineHTML(tokens, charIdx) + '<span class="cursor-blink">▍</span>';
  codeEl.innerHTML = [...typedLines, currentLineHTML].join('\n');

  if(charIdx < total){
    setTimeout(() => typeCode(lineIdx, charIdx + 1), 14);
  } else {
    typedLines.push(renderLineHTML(tokens, total));
    setTimeout(() => typeCode(lineIdx + 1, 0), 90);
  }
}

function typeConsole(){
  const text = '"open_to_opportunities 🟢"';
  let i = 0;
  function step(){
    if(!consoleOut) return;
    consoleOut.textContent = text.slice(0, i);
    if(i < text.length){
      i++;
      setTimeout(step, 28);
    }
  }
  setTimeout(step, 300);
}

// start code animation once hero is visible
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      typeCode();
      heroObserver.disconnect();
    }
  });
}, { threshold: 0.3 });
const heroSection = document.getElementById('home');
if(heroSection) heroObserver.observe(heroSection);

// ---------- stat counters ----------
const statNums = document.querySelectorAll('.stat-num');
let statsAnimated = false;
function animateStats(){
  if(statsAnimated) return;
  statsAnimated = true;
  statNums.forEach(el => {
    const target = parseInt(el.dataset.count, 10) || 0;
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 30));
    const tick = () => {
      current += step;
      if(current >= target){
        el.textContent = target;
      } else {
        el.textContent = current;
        requestAnimationFrame(() => setTimeout(tick, 25));
      }
    };
    tick();
  });
}
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      animateStats();
      statObserver.disconnect();
    }
  });
}, { threshold: 0.4 });
const statRow = document.querySelector('.stat-row');
if(statRow) statObserver.observe(statRow);

// ---------- scroll progress (scan line + rail fill) ----------
const scanLine = document.getElementById('scanLine');
const railFill = document.getElementById('railFill');
const navEl = document.getElementById('nav');

function updateScrollProgress(){
  const doc = document.documentElement;
  const scrollTop = doc.scrollTop || document.body.scrollTop;
  const scrollHeight = doc.scrollHeight - doc.clientHeight;
  const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  scanLine.style.width = pct + '%';
  if(railFill) railFill.style.height = pct + '%';
  if(navEl) navEl.classList.toggle('scrolled', scrollTop > 30);
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

// ---------- nav / rail active section + reveal on scroll ----------
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');
const railNodes = document.querySelectorAll('.rail-node');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.id;
    const inner = entry.target.querySelector('.section-inner');

    if(entry.isIntersecting){
      if(inner) inner.classList.add('in-view');
    }

    if(entry.intersectionRatio > 0.4 || (entry.isIntersecting && entry.intersectionRatio > 0.25)){
      navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === id));
      railNodes.forEach(n => n.classList.toggle('active', n.dataset.target === id));
    }
  });
}, { threshold: [0.25, 0.4, 0.6], rootMargin: '-80px 0px -30% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// ---------- rail node click ----------
railNodes.forEach(node => {
  node.addEventListener('click', () => {
    const target = document.getElementById(node.dataset.target);
    if(target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ---------- mobile menu ----------
const menuBtn = document.getElementById('menuBtn');
const navLinksWrap = document.getElementById('navLinks');

menuBtn.addEventListener('click', () => {
  const isOpen = navLinksWrap.classList.toggle('open');
  menuBtn.classList.toggle('open', isOpen);
  menuBtn.setAttribute('aria-expanded', isOpen);
});

navLinksWrap.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinksWrap.classList.remove('open');
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
});

// ---------- card spotlight (mouse-follow glow) ----------
const spotlightCards = document.querySelectorAll('.project-card, .cert-card, .contact-card');
spotlightCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
});
