document.documentElement.classList.add('js');
const sections = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  sections.forEach(section => observer.observe(section));
} else {
  sections.forEach(section => section.classList.add('visible'));
}
document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('#copy-email').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText('aktilekkorganbek41@gmail.com');
    status.textContent = 'Email скопирован.';
  } catch {
    status.textContent = 'Выдели и скопируй адрес выше: браузер ограничил доступ к буферу обмена.';
  }
});
