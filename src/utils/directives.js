import Vue from 'vue'

Vue.directive('dialogDrag', {
  bind (el) {
    const dialogHeader = el.querySelector('.el-dialog__header');
    const dialog = el.querySelector('.el-dialog');
    dialogHeader.style.cssText += ';cursor:move;';
    dialog.style.cssText += ';top:0px;';

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = (function () {
      if (window.document.currentStyle) {
        return (dom, attr) => dom.currentStyle[attr]
      } else {
        return (dom, attr) => getComputedStyle(dom, false)[attr]
      }
    })();

    dialogHeader.onmousedown = (e) => {
      // 鼠标按下计算当前元素距离可视区域的距离
      const disX = e.clientX - dialogHeader.offsetLeft;
      const disY = e.clientY - dialogHeader.offsetTop;

      const screenWidth = document.body.clientWidth;
      const screenHeight = document.documentElement.clientHeight;

      const dialogWidth = dialog.offsetWidth;
      const dialogHeight = dialog.offsetHeight;

      const minDialogLeft = dialog.offsetLeft;
      const maxDialogLeft = screenWidth - minDialogLeft - dialogWidth;

      const minDialogTop = dialog.offsetTop;
      const maxDialogTop = screenHeight - minDialogTop - dialogHeight;

      let styL = sty(dialog, 'left');
      let styT = sty(dialog, 'top');

      if (styL.includes('%')) {
        styL = +document.body.clientWidth * (+styL.replace(/%/g, '') / 100);
        styT = +document.body.clientHeight * (+styT.replace(/%/g, '') / 100)
      } else {
        styL = +styL.replace(/px/g, '');
        styT = +styT.replace(/px/g, '')
      }

      document.onmousemove = function (e) {
        let left = e.clientX - disX;
        let top = e.clientY - disY;

        if (-(left) > minDialogLeft) {
          left = -(minDialogLeft)
        } else if (left > maxDialogLeft) {
          left = maxDialogLeft
        }

        if (-(top) > minDialogTop) {
          top = -(minDialogTop)
        } else if (top > maxDialogTop) {
          top = maxDialogTop
        }

        dialog.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`
      };

      document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null
      }
    }
  }
})
