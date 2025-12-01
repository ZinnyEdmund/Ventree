// import React from "react";
// import clsx from "clsx";

// interface FloatingLabelInputProps {
//   label: string;
//   type?: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   placeholder?: string;
//   error?: string;
// }

// // const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
// //   label,
// //   type = "text",
// //   value,
// //   onChange,
// //   placeholder,
// //   error,
// // }) => {
// //   const [ setIsFocused] = React.useState(false);
// //   return (
// //     <div className="relative mb-6">
// //       <input
// //         type={type}
// //         value={value}
// //         onChange={onChange}
// //         onFocus={() => setIsFocused(true)}
// //         onBlur={() => setIsFocused(false)}
// //         placeholder={placeholder ?? " "}
// //         className={clsx(
// //           "peer w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2",
// //           error ? "border-error focus:ring-error" : "border-grey focus:ring-SB"
// //         )}
// //       />
// //       <label
// //          className={clsx(
// //           "absolute left-3 transition-all px-1 pointer-events-none",
// //           // default state (inside input, centered)
// //           "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:bg-transparent peer-placeholder-shown:text-base",
// //           // floated state (on border line)
// //           "peer-focus:-top-3 peer-focus:text-sm peer-focus:text-SB peer-focus:bg-bg",
// //           // when value exists, keep it floated
// //           value ? "-top-3 text-sm bg-bg text-SB" : "bg-transparent"
// //         )}
// //       >
// //         {label}
// //       </label>
// //       {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
// //     </div>
// //   );
// // };

// export default FloatingLabelInput;
