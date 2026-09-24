const programToggle = document.querySelector('#expand-program');
const programDays = [...document.querySelectorAll('.day')];
function updateProgramToggle() {
  const allOpen = programDays.every(day => day.open);
  programToggle.setAttribute('aria-expanded', String(allOpen));
  programToggle.innerHTML = allOpen ? 'Свернуть все дни <span aria-hidden="true">−</span>' : 'Развернуть все дни <span aria-hidden="true">＋</span>';
}
programToggle.addEventListener('click', () => {
  const shouldOpen = !programDays.every(day => day.open);
  programDays.forEach(day => { day.open = shouldOpen; });
  updateProgramToggle();
});
programDays.forEach(day => day.addEventListener('toggle', updateProgramToggle));
