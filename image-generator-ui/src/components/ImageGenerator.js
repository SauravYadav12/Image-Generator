import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import ColorThief from "colorthief";

const ImageGenerator = forwardRef(({ posterData, generatedPoster }, ref) => {
  const canvasRef = useRef();
  const [poster, setPoster] = useState("");
  useEffect(() => {
    if (posterData.bgImage && posterData.imageFile) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const bgImage = new Image();
      const img = new Image();

      img.src = posterData.imageFile;
      bgImage.src = posterData.bgImage;

      bgImage.onload = () => {
        // canvas.width = bgImage.width;
        // canvas.height = bgImage.height;
        const colorthief = new ColorThief();
        // ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

        canvas.width = 500;
        canvas.height = 500;

        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
        const color = colorthief.getColor(bgImage);
        const pixelColor = ctx.getImageData(0, 0, 1, 1).data;
        const rgbaColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${
          pixelColor[3] / 255
        })`;

        ctx.textAlign = "center";
        ctx.font = "bolder 40px serif";
        ctx.fillStyle = "black";
        ctx.fillText(posterData.firstInput, canvas.width / 2, 90);

        ctx.font = "20px Arial";
        ctx.fillText(posterData.secondInput, canvas.width / 2, 130);

        const scaleFactor = Math.min(200 / img.width, 250 / img.height);
        const imageWidth = img.width * scaleFactor;
        const imageHeight = img.height * scaleFactor;
        const imageX = (canvas.width - imageWidth) / 2;
        const imageY = (canvas.height - imageHeight) / 2;

        ctx.drawImage(img, imageX, imageY, imageWidth, imageHeight);
        ctx.font = "18px Arial";
        ctx.fillText(
          posterData.dummyContent,
          canvas.width / 2,
          canvas.height - 100
        );
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = rgbaColor;
        ctx.globalCompositeOperation = "color";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      };

      setPoster(canvasRef);
    }
  }, [posterData, posterData.bgImage, posterData.imageFile]);

  useImperativeHandle(
    ref,
    () => ({
      getPoster: () => poster,
    }),
    [poster]
  );
  return <canvas ref={canvasRef} width={500} height={500} />;
});

export default ImageGenerator;
