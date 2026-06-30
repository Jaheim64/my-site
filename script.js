document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('[data-project]').forEach(btn=>{
    btn.addEventListener('click',async ()=>{
      const slug = btn.getAttribute('data-project');
      try{
        const res = await fetch(`projects/${slug}.html`);
        const html = await res.text();
        const modal=document.getElementById('modal');
        modal.querySelector('.panel').innerHTML=html;
        modal.classList.add('open');
      }catch(err){
        alert('Could not load project details.');
      }
    })
  })

  const navToggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const toggleEl = document.getElementById('theme-toggle');
  const sunSVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4V2M12 22v-2M4.93 4.93L3.51 3.51M20.49 20.49l-1.42-1.42M4 12H2M22 12h-2M4.93 19.07l-1.42 1.42M20.49 3.51l-1.42 1.42" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6"/></svg>';
  const moonSVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function setToggleIcon(theme){
    if(!toggleEl) return;
    if(theme === 'light'){
      toggleEl.innerHTML = moonSVG; // clicking will make dark
      toggleEl.setAttribute('title','Switch to dark mode');
    }else{
      toggleEl.innerHTML = sunSVG; // clicking will make light
      toggleEl.setAttribute('title','Switch to light mode');
    }
  }

  if(toggleEl){
    // initialize icon from saved theme or page default
    const savedTheme = localStorage.getItem('portfolio-theme');
    const current = savedTheme || document.body.getAttribute('data-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', current);
    document.body.setAttribute('data-theme', current);
    setToggleIcon(current);
    toggleEl.addEventListener('click', e=>{
      e.preventDefault();
      const body = document.body;
      const root = document.documentElement;
      const curr = body.getAttribute('data-theme') || root.getAttribute('data-theme') || 'dark';
      const next = curr === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      body.setAttribute('data-theme', next);
      localStorage.setItem('portfolio-theme', next);
      setToggleIcon(next);
    });
  }

  if(navToggle && mobileNav){
    navToggle.addEventListener('click', ()=>{
      const isOpen = mobileNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    mobileNav.querySelectorAll('a').forEach(link=>{
      link.addEventListener('click', ()=>{
        if(mobileNav.classList.contains('open')){
          mobileNav.classList.remove('open');
          navToggle.setAttribute('aria-expanded','false');
        }
      });
    });
  }

  const projectsGrid = document.querySelector('.projects-grid');
  const projectLeft = document.querySelector('.project-nav.left');
  const projectRight = document.querySelector('.project-nav.right');
  const projectImageButtons = document.querySelectorAll('[data-image]');
  const galleryScroll = document.querySelector('.gallery-scroll');
  const galleryLeft = document.querySelector('.gallery-btn.left');
  const galleryRight = document.querySelector('.gallery-btn.right');
  const imageOverlay = document.querySelector('.image-overlay');
  const overlayImage = imageOverlay?.querySelector('img');
  const overlayClose = imageOverlay?.querySelector('.close-lightbox');

  if(projectsGrid){
    const scrollAmount = projectsGrid.getBoundingClientRect().width * 0.8;
    projectLeft?.addEventListener('click',()=>projectsGrid.scrollBy({left:-scrollAmount,behavior:'smooth'}));
    projectRight?.addEventListener('click',()=>projectsGrid.scrollBy({left:scrollAmount,behavior:'smooth'}));
    projectsGrid.addEventListener('wheel', e=>{
      if(!projectsGrid.matches(':hover')) return;
      if(Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      projectsGrid.scrollBy({left:e.deltaY * 1.5,behavior:'smooth'});
    });
  }

  if(projectImageButtons.length && imageOverlay){
    projectImageButtons.forEach(btn=>{
      btn.addEventListener('click',()=>{
        const imageSrc = btn.getAttribute('data-image');
        if(!imageSrc) return;
        overlayImage.src = imageSrc;
        imageOverlay.classList.add('open');
      });
    });
  }

  if(galleryScroll){
    const scrollAmount = galleryScroll.querySelector('.gallery-item')?.getBoundingClientRect().width || 320;
    galleryLeft?.addEventListener('click',()=>galleryScroll.scrollBy({left:-scrollAmount-18,behavior:'smooth'}));
    galleryRight?.addEventListener('click',()=>galleryScroll.scrollBy({left:scrollAmount+18,behavior:'smooth'}));
    galleryScroll.querySelectorAll('.gallery-item img').forEach(img=>{
      img.addEventListener('click',()=>{
        if(!imageOverlay || !overlayImage) return;
        overlayImage.src = img.src;
        imageOverlay.classList.add('open');
      });
    });
  }

  if(imageOverlay){
    imageOverlay.addEventListener('click', e=>{
      if(e.target === imageOverlay || e.target === overlayClose) imageOverlay.classList.remove('open');
    });
  }

  document.querySelectorAll('.modal, .modal .close').forEach(el=>{
    el.addEventListener('click',e=>{
      const modal=document.getElementById('modal');
      if(e.target===el || e.target.classList.contains('close')) modal.classList.remove('open');
    })
  })
})
