function generateBanner(format) {
  const files = document.getElementById('imageUpload').files;
  if (files.length === 0) return alert("비주얼 이미지를 업로드하세요!");

  const zip = new JSZip();

  Array.from(files).forEach((file, index) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = function (e) {
      img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let canvasWidth, canvasHeight, visualX, visualY, visualW, visualH, radius = 16;

        if (format === 'bizWide') {
          canvasWidth = 1029;
          canvasHeight = 258;
          visualX = 543;
          visualY = 36;
          visualW = 438;
          visualH = 186;
        } else if (format === 'biz21') {
          canvasWidth = 1029;
          canvasHeight = 258;
          visualX = 48;
          visualY = 36;
          visualW = 315;
          visualH = 186;
        } else if (format === 'biz11') {
          canvasWidth = 1029;
          canvasHeight = 258;
          visualX = 260;
          visualY = 36;
          visualW = 186;
          visualH = 186;
        } else if (format === 'mo21') {
          canvasWidth = 1200;
          canvasHeight = 600;
          visualX = 0;
          visualY = 193;
          visualW = 1200;
          visualH = 497;
        }

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 둥근 사각형 마스크 그리기 (PNG만 적용)
        if (format !== 'mo21') {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(visualX + radius, visualY);
          ctx.lineTo(visualX + visualW - radius, visualY);
          ctx.quadraticCurveTo(visualX + visualW, visualY, visualX + visualW, visualY + radius);
          ctx.lineTo(visualX + visualW, visualY + visualH - radius);
          ctx.quadraticCurveTo(visualX + visualW, visualY + visualH, visualX + visualW - radius, visualY + visualH);
          ctx.lineTo(visualX + radius, visualY + visualH);
          ctx.quadraticCurveTo(visualX, visualY + visualH, visualX, visualY + visualH - radius);
          ctx.lineTo(visualX, visualY + radius);
          ctx.quadraticCurveTo(visualX, visualY, visualX + radius, visualY);
          ctx.closePath();
          ctx.clip();
        }

        ctx.drawImage(img, visualX, visualY, visualW, visualH);

        if (format !== 'mo21') ctx.restore();

        canvas.toBlob(function (blob) {
          const ext = (format === 'mo21') ? 'jpg' : 'png';
          zip.file(`${format}_${index + 1}.${ext}`, blob);
          if (index === files.length - 1) {
            setTimeout(() => {
              zip.generateAsync({ type: 'blob' }).then(function (content) {
                saveAs(content, `${format}_banners.zip`);
              });
            }, 300);
          }
        }, (format === 'mo21') ? 'image/jpeg' : 'image/png');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
