// import { useEffect, useState } from 'react';

// export const useAutoFontSizeToWindow = (
//   textRef: React.RefObject<HTMLElement>
// ) => {
//   const [fontSize, setFontSize] = useState(0);

//   useEffect(() => {
//     if (!textRef.current) return;

//     const resizeFont = () => {
//       const text = textRef.current!;

//       while (low <= high) {
//         const mid = Math.floor((low + high) / 2);
//         text.style.fontSize = `${mid}px`;

//         if (
//           text.scrollWidth <= window.innerWidth &&
//           text.scrollHeight <= window.innerHeight
//         ) {
//           bestFit = mid;
//           low = mid + 1;
//         } else {
//           high = mid - 1;
//         }
//       }

//       setFontSize(bestFit);
//       text.style.fontSize = `${bestFit}px`;
//     };

//     window.addEventListener('resize', resizeFont);
//     resizeFont(); // Initial run

//     return () => window.removeEventListener('resize', resizeFont);
//   }, [textRef, value]);

//   return fontSize;
// };
