let sampleVisual = null;
let compositionVisuals = [];
let composedImages = [];

document.getElementById('sampleVisual').addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
        const img = new Image();
        img.onload = () => {
            sampleVisual = img;
            alert("예시 비주얼 업로드 완료");
        };
        img.src = URL.createObjectURL(file);
    }
});

document.getElementById('compositionVisuals').addEventListener('change', e => {
    compositionVisuals = [];
    for (const file of e.target.files) {
        const img = new Image();
        img.onload = () => {
            compositionVisuals.push(img);
        };
        img.src = URL.createObjectURL(file);
    }
    alert("합성 희망 비주얼 업로드 완료");
});

function composeBanner(format) {
    if (!sampleVisual || compositionVisuals.length === 0) {
        alert("예시 비주얼과 합성 비주얼을 모두 업로드하세요.");
        return;
    }

    composedImages = [];

    compositionVisuals.forEach((visual, index) => {
        const canvas = document.getElementById('canvas');
        let canvasWidth, canvasHeight, visualX, visualY, visualWidth, visualHeight;

        if (format === 'biz2_1') {
            canvasWidth = 1200;
            canvasHeight = 600;
            visualWidth = 1200;
            visualHeight = 497;
            visualX = 0;
            visualY = (canvasHeight - visualHeight) / 2;
        } else if (format === 'biz1_1') {
            canvasWidth = 600;
            canvasHeight = 600;
            visualWidth = 600;
            visualHeight = 600;
            visualX = 0;
            visualY = 0;
        } else if (format === 'mo2_1') {
            canvasWidth = 1200;
            canvasHeight = 600;
            visualWidth = 1200;
            visualHeight = 497;
            visualX = 0;
            visualY = (canvasHeight - visualHeight) / 2;
        } else {
            return;
        }

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // 배경 예시 비주얼 전체 합성
        ctx.drawImage(sampleVisual, 0, 0, canvasWidth, canvasHeight);

        // 비율 유지 리사이징
        const ratio = Math.min(visualWidth / visual.width, visualHeight / visual.height);
        const scaledWidth = visual.width * ratio;
        const scaledHeight = visual.height * ratio;
        const offsetX = visualX + (visualWidth - scaledWidth) / 2;
        const offsetY = visualY + (visualHeight - scaledHeight) / 2;

        ctx.drawImage(visual, offsetX, offsetY, scaledWidth, scaledHeight);

        const dataUrl = canvas.toDataURL("image/png");
        composedImages.push(dataUrl);
    });

    alert("합성 완료. ZIP 다운로드를 클릭하세요.");
}

function downloadZip() {
    if (composedImages.length === 0) {
        alert("합성 이미지를 먼저 생성하세요.");
        return;
    }

    const zip = new JSZip();
    composedImages.forEach((dataUrl, index) => {
        const base64 = dataUrl.split(',')[1];
        zip.file(`banner_${index + 1}.png`, base64, {base64: true});
    });

    zip.generateAsync({type: "blob"}).then(content => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = "banners.zip";
        link.click();
    });
}
