var addclass = function(el, className) {
  if (el.classList)
    el.classList.add(className);
  else
    el.className += ' ' + className;
};

var remclass = function(el, className) {
  if (el.classList)
    el.classList.remove(className);
  else
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}

var hasclass = function(el, className) {
  if (el.classList)
    return el.classList.contains(className);
  else
    return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
}

document.addEventListener('DOMContentLoaded', function(){
  var plel = document.createElement('a');
  //addclass(plel, 'permalink');
  plel.innerHTML = '<svg aria-hidden="true" class="i-share"><use xlink:href="img/icons.svg#i-share"></use></svg> SHARE';

  var plwrapdiv = document.createElement('div')
  addclass(plwrapdiv, 'permalink');

  var sharebox = document.createElement('div');
  addclass(sharebox, 'sharebox');
  var shareboxtext = '<p><label>Link to this section:<input type="url" value="%s" readonly> Shortcut to copy the link: <kbd>ctrl</kbd>+<kbd>C</kbd> <em>or</em> <kbd>⌘</kbd><kbd>C</kbd></label></p><p><a href="mailto:?subject=Web%20Accessibility%20Tutorials&body=Hi!%0AYou%20might%20be%20interested%20in%20this%20section%20of%20W3C%20WAI%E2%80%99s%20Web%20Accessibility%20Tutorials%3A%0A%0A%s">E-mail a link to this section</a><button>Close</button></p>';

  var url = window.location.origin + window.location.pathname;

  var elements = document.querySelectorAll('.sc-wrapper h4');
  Array.prototype.forEach.call(elements, function(el, i){ // … .each(…)

    var cplel = plel.cloneNode(true);
    cplel.setAttribute('href', '#' + el.id);
    cplel.setAttribute('aria-label', 'Share Link to the section “' + el.textContent + '”');

    var csbtext = shareboxtext.replace("%s", url + '#' + el.id).replace("%s", url + '#' + el.id);
    var csb = sharebox.cloneNode(true);
    csb.innerHTML = csbtext;

    var cplwrapdiv = plwrapdiv.cloneNode(true);
    cplwrapdiv.appendChild(cplel);
    cplwrapdiv.appendChild(csb);
    //addclass(cplwrapdiv, el.localName);

    function showsharebox(e) {
      var sbox = this.nextSibling;
      if (hasclass(sbox, 'open')) {
        remclass(this.nextSibling, 'open');
      } else {
        addclass(this.nextSibling, 'open');
        this.nextSibling.querySelector('input').select();
      }
      e.preventDefault();
    }

    cplel.addEventListener('click', showsharebox);

    el.parentNode.insertBefore(cplwrapdiv, el);
  });

  var sbbuttons = document.querySelectorAll('.sharebox button');
  Array.prototype.forEach.call(sbbuttons, function(el, i){ // … .each(…)
    el.addEventListener('click', function(){
      var openboxes = document.querySelectorAll('.sharebox.open');
      for (var i = openboxes.length - 1; i >= 0; i--) {
        remclass(openboxes[i], 'open');
      };
      el.parentNode.parentNode.parentNode.querySelector('a').focus();
    });
  });
});