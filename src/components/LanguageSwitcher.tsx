// "use client";
// import { usePathname, useRouter, locales } from "@/app/navigation";

// export default function LanguageSwitcher() {
//   const pathname = usePathname();
//   const router = useRouter();

//   return (
//     <div className="flex space-x-4">
//       {locales.map((locale) => (
//         <button
//           key={locale}
//           onClick={() => {
//             const segments = pathname.split('/');
//             segments[1] = locale;
//             router.push(segments.join('/'));
//           }}
//           className="text-sm text-[#7B3F00] hover:underline"
//         >
//           {locale.toUpperCase()}
//         </button>
//       ))}
//     </div>
//   );
// }
