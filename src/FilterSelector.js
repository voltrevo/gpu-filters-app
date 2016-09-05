'use strict';

module.exports = function(filterList, changeHandler) {
  const select = document.createElement('select');
  select.style.position = 'absolute';
  select.style.left = '10px';
  select.style.top = '10px';

  filterList.forEach(filterName => {
    const option = document.createElement('option');
    option.value = filterName;
    option.textContent = filterName;
    select.appendChild(option);
  });

  document.body.appendChild(select);

  const fireChange = () => {
    changeHandler(filterList[select.selectedIndex]);
  };

  select.addEventListener('change', fireChange);
  setTimeout(fireChange);
};
