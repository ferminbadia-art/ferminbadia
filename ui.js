(function(){
  const triggers = document.querySelectorAll('.skill-project-trigger');
  const overlay = document.getElementById('project-modal-overlay');
  const closeBtn = document.getElementById('project-modal-close');
  const posterImg = document.getElementById('modal-poster');
  const videoEl = document.getElementById('modal-video');
  const details = document.getElementById('project-modal-details');
  const titleEl = document.getElementById('project-modal-title');

  if(!triggers.length || !overlay) return;

  function isVideoFile(src){
    if(!src) return false;
    const videoExts = ['.mp4', '.webm', '.ogg', '.mov', '.mkv'];
    return videoExts.some(ext => src.toLowerCase().endsWith(ext));
  }

  function openModal(trigger){
    const projectId = trigger.dataset.project;
    const title = trigger.dataset.title || 'Proyecto';
    const poster = trigger.dataset.poster || '';

    titleEl.textContent = title;

    // Determine if poster is video or image
    if(isVideoFile(poster)){
      posterImg.style.display = 'none';
      videoEl.style.display = 'block';
      videoEl.src = poster;
    } else {
      videoEl.style.display = 'none';
      posterImg.style.display = 'block';
      posterImg.src = poster || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23333" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="18"%3ENo image%3C/text%3E%3C/svg%3E';
    }

    // Restore saved content for this project
    try{
      const savedDetails = localStorage.getItem(`project_${projectId}_details`);
      if(savedDetails) details.innerHTML = savedDetails;
    }catch(e){}

    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(){
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => openModal(trigger));
    trigger.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        openModal(trigger);
      }
    });
  });

  closeBtn && closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', function(e){
    if(e.target === overlay) closeModal();
  });

  window.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeModal();
  });

})();
