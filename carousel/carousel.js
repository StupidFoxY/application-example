window.onload = () => {
  var banners = document.querySelectorAll('div[id*=banner_]');
  if (banners.length) {
    var banner_ctrls = document.querySelectorAll('.banner-ctrl > span');
    var banner_ctrlsArr = Array.apply(null, banner_ctrls);
    if (banner_ctrls.length) {
      var first_banner = banner_ctrls[0];
      toggleClass(first_banner, 'red-bgd', true);
    }
    var animation = function () {
      var cur_move1 = document.querySelector('.banner-item[class~=banner_move_left1]');
      var cur_move2 = document.querySelector('.banner-item[class~=banner_move_left2]');
      var index = 1;
      if (cur_move2 && cur_move1) {
        toggleClass(cur_move1, 'banner_move_left1', false);
        toggleClass(cur_move2, 'banner_move_left2', false);
        var id = Number(cur_move2.id.substr(-1, 1));
        index = id == 3 ? 1 : id + 1;
        toggleClass(cur_move2, 'banner_move_left1', true);
        toggleClass(document.getElementById('banner_' + index), 'banner_move_left2', true);
      }
      else {
        toggleClass(document.getElementById('banner_1'), 'banner_move_left1', true);
        toggleClass(document.getElementById('banner_2'), 'banner_move_left2', true);
        index = 2;
      }
      var active_ctrl = document.querySelector('.banner-ctrl > span.red-bgd');
      if (active_ctrl) {
        toggleClass(active_ctrl, 'red-bgd', false);
      }
      var target_ctrl = document.querySelector('.banner-ctrl > span[data-id=banner_' + index + ']');
      toggleClass(target_ctrl, 'red-bgd', true);
    };
    var interval = setInterval(animation, 5000);
    banner_ctrlsArr.forEach(function (ctrl) {
      ctrl.onclick = function (event) {
        clearInterval(interval);
        var source = event.target;
        var target = source.dataset.id;
        var tar_banner = document.getElementById(target);
        var cur_move1 = document.querySelector('.banner-item[class~=banner_move_left1]');
        var cur_move2 = document.querySelector('.banner-item[class~=banner_move_left2]');
        if (tar_banner != cur_move2) {
          if (cur_move1 && cur_move2) {
            toggleClass(cur_move1, 'banner_move_left1', false);
            toggleClass(cur_move2, 'banner_move_left2', false);
          }
          if (!cur_move2) {
            cur_move2 = document.getElementById('banner_1');
          }
          toggleClass(cur_move2, 'banner_move_left1', true);
          toggleClass(tar_banner, 'banner_move_left2', true);
        }
        var active_ctrl = document.querySelector('.banner-ctrl > span.red-bgd');
        toggleClass(active_ctrl, 'red-bgd', false);
        toggleClass(source, 'red-bgd', true);
        interval = setInterval(animation, 5000);
      };
    });
  }
}
function toggleClass(element, className, action) {
  if (action) {
    if (!element.classList.contains(className)) {
      element.classList.add(className);
    }
  }
  else {
    if (element.classList.contains(className)) {
      element.classList.remove(className);
    }
  }
}
