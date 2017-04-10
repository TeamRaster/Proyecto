edgrid.menu('main-nav','main-menu');


(function(d){
  let nav = d.getElementById('nav-container');
  let top = nav.offsetTop;
  window.addEventListener('scroll', () => {
    let scroll = d.body.scrollTop;
    let scrollW = d.body.scrollWidth;
    // todo Corregir error del menu sticky en moviles
    if (scroll >= top) {
      nav.classList.add('sticky');
    } else {
      console.log(scrollW);
      nav.classList.remove('sticky');
    }
  });
})(document);
