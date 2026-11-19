const sections = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  sections.forEach(section => observer.observe(section));
  document.documentElement.classList.add('js');
} else {
  sections.forEach(section => section.classList.add('visible'));
}
document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('#copy-email').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try {
    const address = document.querySelector('.email').getAttribute('href').slice('mailto:'.length);
    await navigator.clipboard.writeText(address);
    status.textContent = 'Email скопирован.';
  } catch {
    status.textContent = 'Выдели и скопируй адрес выше: браузер ограничил доступ к буферу обмена.';
  }
});
