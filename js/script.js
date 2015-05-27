jQuery(document).ready(function($) {

  function updateuri(uri) {
    uri.fragment("");
    history.pushState(null, null, uri);
    localStorage.setItem('url', uri);
  }

  function applyurl() {
    var location = window.history.location || window.location;
    var uri = new URI(location);
    var data = uri.search(true);

    for(var prop in data) {
      if(data.hasOwnProperty(prop)) {
        if (prop == "hide") {
          for (var i = data[prop].length - 1; i >= 0; i--) {
            var sidebar = $('#' + data[prop]);
            var status = sidebar.find('.sidebar-content').toggle().is(":visible");
            sidebar.find('h6 .glyphicon').prop('hidden', function(idx, oldProp) {
                return !oldProp;
            });
            sidebar.parent().toggleClass('hidden-sb');
          }
        } else {
          for (var i = data[prop].length - 1; i >= 0; i--) {
            $('[name=' + prop + '][value=' + data[prop][i] + ']').prop('checked', false);
            applyFilters();
          }
        }
      }
    }
  }

  function geturi() {
    var location = window.history.location || window.location;
    var uri = new URI(location);
    var url = localStorage.getItem('url');
    if (uri.search()=="" && url!=="") {
      history.replaceState(null, null, url);
    }
    applyurl();
  }


  function applyFilters() {
    var o = [];
    $('#filters input').each(function(){
      var cinput = $(this);
      var location = window.history.location || window.location;
      var uri = new URI(location);
      if (cinput.is(':checked')) {
        $('.' + cinput.attr('name') + '-' + cinput.val()).each(function () {
          $(this).show();
        });
        uri.removeSearch(cinput.attr('name'),cinput.val());
      } else {
        o.push($.trim(cinput.parent().text()));
        $('.' + cinput.attr('name') + '-' + cinput.val()).each(function () {
          $(this).hide();
        });
        uri.addSearch(cinput.attr('name'),cinput.val());
      }
      updateuri(uri);
    });

    if (o.length == 0) {
      $('#filtered').html('<strong>No filters set.</strong>');
      $('#clearall').hide();
    } else {
      o = ' <strong>Items filtered out:</strong> ' + o.join(', ');
      $('#filtered').html(o);
      $('#clearall').show();
      var val = $('#exampleSearch').val();
      if (val.length > 0) {
        search(val, false);
      } else {
        $('#searchnumber').val('0/0').attr('data-current-index', 0).attr('data-max-index', 0).attr('aria-label', "No search results").attr('disabled', 'disabled');
        $('#searchbtnprev, #searchbtnnext').attr('disabled', 'disabled');
        $('#searchbtnfocusresult').hide();
        $('main').removeHighlight();
      }
    }
  }

  $('#clearall').on('click', function(e) {
    var unchecked = $('#filters input:not(:checked)');
    unchecked.each(function(){
      $(this).prop('checked', 'checked');
    });
    applyFilters();
  });

  $('#btn-filters').on('click', function(e) {
    e.preventDefault();
    $('body').append('<div id="backdrop"></div>');
    $('#filters').show().focus();
  });



  $('#btn-closefilters').on('click', function(e) {
    e.preventDefault();
    applyFilters();
    $('#backdrop').remove();
    $('#filters').hide();
    $('#btn-filters').focus();
  });



  function scrollto(target) {
     $('html,body').animate({
         scrollTop: (target.offset().top - parseInt($('.filterrow').outerHeight(),10))
    }, 1000);
    return false;
  }

  function search(query, scroll) {
    $('#searchbtnfocusresult').parent().hide();
    $('#searchbtnprev, #searchbtnnext, #searchnumber').attr('disabled', 'disabled');
    $('#searchnumber').val('0/0');
    $('main').removeHighlight();
    $('main').highlight(query);
    var total = $('mark.highlight');
    var marknum = total.filter(":visible").length;
    var hiddennum = total.length - marknum;
    $('#searchnumber').attr('data-current-index', '1').attr('data-max-index', marknum).attr('data-hiddennum', hiddennum);
    if (marknum > 0) {
      $('#searchbtnfocusresult').parent().css('display','flex');
      $('#searchnumber').val('1/' + marknum + ' [' + hiddennum + ' hidden]').removeAttr('disabled', 'disabled');
      if (scroll !== false) {
        scrollto($('mark.highlight').filter(":visible").first().addClass('current'));
      }
    }
    if (marknum > 1) {
      $('#searchbtnnext').removeAttr('disabled');
    }
  }

  $('#exampleSearch').on('keyup', function() {
    var val = $(this).val();
    if (val.length > 3) {
      search(val);
    } else {
      $('#searchnumber').val('0/0').attr('data-current-index', 0).attr('data-max-index', 0).attr('aria-label', "No search results").attr('disabled', 'disabled');
      $('#searchbtnprev, #searchbtnnext').attr('disabled', 'disabled');
      $('#searchbtnfocusresult').parent().hide();
      $('main').removeHighlight();
    }
  });

  $('#searchbtnsubmit').on('click', function(e) {
    e.preventDefault();
    var val = $('#exampleSearch').val();
    if (val.length > 0) {
      search(val);
    } else {
      $('#searchnumber').val('0/0').attr('data-current-index', 0).attr('data-max-index', 0).attr('aria-label', "No search results").attr('disabled', 'disabled');
      $('#searchbtnprev, #searchbtnnext').attr('disabled', 'disabled');
      $('#searchbtnfocusresult').hide();
      $('main').removeHighlight();
    }
  });

  $('#searchbtnprev').on('click', function() {
    var currentindex = parseInt($('#searchnumber').attr('data-current-index'),10);
    var maxindex = parseInt($('#searchnumber').attr('data-max-index'),10);
    var hiddennum = parseInt($('#searchnumber').attr('data-hiddennum'),10);
    $('mark.highlight.current').removeClass('current');
    if (currentindex > 1) {
      var newindex = currentindex - 1;
      scrollto($('mark.highlight').filter(":visible").eq(newindex - 1).addClass('current'));
      $('#searchnumber').val(newindex + '/' + maxindex + ' [' + hiddennum + ' invisible]').attr('aria-label', "Result" + newindex + ' of ' + maxindex).attr('data-current-index', newindex);
      $('#searchbtnnext').removeAttr('disabled');
      if (newindex == 1) {
        $('#searchbtnprev').attr('disabled', 'disabled');
      }
    }
  });

  $('#searchbtnnext').on('click', function() {
    var currentindex = parseInt($('#searchnumber').attr('data-current-index'),10);
    var maxindex = parseInt($('#searchnumber').attr('data-max-index'),10);
    var hiddennum = parseInt($('#searchnumber').attr('data-hiddennum'),10);
    $('mark.highlight.current').removeClass('current');
    if (currentindex < maxindex) {
      var newindex = currentindex + 1;
      scrollto($('mark.highlight').filter(":visible").eq(newindex -1).addClass('current'));
      $('#searchnumber').val(newindex + '/' + maxindex + ' [' + hiddennum + ' invisible]').attr('aria-label', "Result" + newindex + ' of ' + maxindex).attr('data-current-index', newindex);
      $('#searchbtnprev').removeAttr('disabled');
      if (newindex == $('#searchnumber').attr('data-max-index')) {
        $('#searchbtnnext').attr('disabled', 'disabled');
      }
    }
  });

  $('#searchbtnfocusresult').on('click', function() {
    $('mark.highlight.current').attr('tabindex', '-1').focus();
  });

  $('[data-toggle]').each(function(e) {
    $('#'+$(this).attr('aria-controls')).on('hidden.bs.collapse shown.bs.collapse', function () {
      var val = $('#exampleSearch').val();
      if (val.length > 0) {
        search(val, false);
      } else {
        $('#searchnumber').val('0/0').attr('data-current-index', 0).attr('data-max-index', 0).attr('aria-label', "No search results").attr('disabled', 'disabled');
        $('#searchbtnprev, #searchbtnnext').attr('disabled', 'disabled');
        $('#searchbtnfocusresult').hide();
        $('main').removeHighlight();
      }
    });
  });

  $('.btn-only').on('click', function(){
    $(this).parents('.form-group').find("input[type=checkbox]").prop('checked', false);
    $(this).parent().find("input[type=checkbox]").prop('checked', true).trigger( "change" );
  });

  $('.hide-sb').on('click', function(e){
    // console.log($(this).offset().top + ' -- ' + $('body').scrollTop());
    // var top = $(this).parent().css('top', $(this).offset().top - $('html').scrollTop());
    var sidebar = $(this).parent().parent().parent();
    var status = sidebar.find('.sidebar-content').toggle().is(":visible");
    sidebar.find('h6>span:first-child').toggle();
    sidebar.parent().toggleClass('hidden-sb');

    $(this).parent().find('.glyphicon').prop('hidden', function(idx, oldProp) {
        return !oldProp;
    });
    var uri = new URI(window.location);
    if (status) {
      uri.removeSearch("hide", $(this).parent().parent().attr('class'));
    } else {
      uri.addSearch("hide", $(this).parent().parent().attr('class'));
    }
    updateuri(uri);
  });

  function affixOn(target, offset) {
    var $affixTarget = $(target);
    var $offset = (parseInt(offset, 10));// ? (affixTarget.offset().top + parseInt(offset, 10)) : $affixTarget.offset().top;

    $affixTarget.affix({
      offset: {
        top: function () {
          var offsetTop      = $offset;

          return (this.top = offsetTop);
        },
        bottom: function () {
          return 0;
          // return (this.bottom = $('.bs-docs-footer').outerHeight(true))
        }
      }
    });

    $affixTarget.on('affix.bs.affix', function(e) {
      //$(this).css('width', $(this).parent().width());
      if ($(this).hasClass('navbar-scroll')) {
        $(this).css('top', (parseInt($('.filterrow').outerHeight(),10)) + 'px' );
      }
    });

    $affixTarget.on('affixed-top.bs.affix', function(e) {
      //$(this).css('width', 'auto');
    });
  }

  function excolsc() {
    var hr = $('.sc-content hr');
    hr.hide(); // hide horizontal rule
    hr.prev().append('<button type="button" aria-expanded="false" class="btn btn-default"><span class="word-show"><span class="glyphicon glyphicon-chevron-right"></span> Show</span><span class="word-hide"><span class="glyphicon glyphicon-chevron-down"></span> Hide</span> full description</button>'); // Append button
    hr.find('~ *').hide();
    hr.prev().find('button').on('click', function(event) {
      event.preventDefault();
      /* Act on the event */
      $(this).attr('aria-expanded', function(idx, oldAttr) {
          if(oldAttr==='true') {
            return 'false';
          } else {
            return 'true';
          }
      }).parent().find('~ *:not(hr)').toggle();

    });;
  }
  excolsc();

  function affixOff(target) {
    $(window).off('.affix');
    $(target)
        .removeClass("affix affix-top affix-bottom")
        .removeData("bs.affix");
  }

  function init() {
    $('html').addClass('.has-js');
    affixOff('.navbar-scroll');
    affixOff('.filterrow');
    affixOn('.filterrow', $('.filterrow').offset().top);
    if ($( window ).width() > 896) {
      affixOn('.navbar-scroll', $('.navbar-scroll').offset().top);
      $('html').addClass('large');
      $('.tab-nav-wrap .nav-pills').addClass('nav-stacked');
    } else {
      $('html').removeClass('large');
      $('.tab-nav-wrap .nav-pills').removeClass('nav-stacked');
    }
    if ($( window ).width() < 480) {
      $('.hide-sb').not(".hidden-sb .hide-sb").trigger('click');
    }
  }

  $( window ).resize(function() {
    init();
  });

  init();
  geturi();

});

$(window).on('popstate', function(event) {
  applyurl();
});
