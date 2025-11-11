import React, { type ReactNode } from "react";
import { Check, Frown, Info, X } from "lucide-react";
import clsx from "clsx";
import { Icon } from "@iconify/react";

interface ModalProps {
  status?: "success" | "error" | "info" | "smiley" | "emoji"; // control icon and color
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  titleColor?: string;
  description?: string;
  children?: ReactNode;
  size?: "sm" | "md" | "lg"; // control width
  removeIcon?: boolean; // option to remove icon
}

const Modal: React.FC<ModalProps> = ({
  status,
  isOpen,
  onClose,
  title,
  titleColor,
  description,
  children,
  size = "md",
  removeIcon = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-bg">
      <div
        className={clsx(
          "relative bg-white rounded-xl shadow-lg p-6 transition-all w-2/3 md:w-1/3",
        )}
      >
        {/* Close button */}

        {removeIcon && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        )}

        {/* Image */}
        {status === "success" ? (
          <div className="flex justify-center items-center h-20 ">
            {/* Outer Octagon */}
            <div className="relative w-20 h-20 bg-success-bg rounded-full flex items-center justify-center">
              {/* Inner Octagon */}
              <div className="w-14 h-14 bg-success rounded-full  flex items-center justify-center">
                {/* Icon */}
                <Check className="text-white" size={28} />
              </div>
            </div>
          </div>
        ) : status === "info" ? (
          <div className="flex justify-center items-center h-20 mb-4">
            {/* Outer Octagon */}
            <div className="relative w-20 h-20 bg-[#EF44441A] rotate-25 [clip-path:polygon(30%_0%,70%_0%,100%_30%,100%_70%,70%_100%,30%_100%,0%_70%,0%_30%)] flex items-center justify-center">
              {/* Icon */}

              <Info
                className="text-error -rotate-25"
                size={48}
                strokeWidth={2}
                fill="transparent"
              />
            </div>
          </div>
        ) : status === "smiley" ? (
          <div className="flex justify-center items-center h-20 mb-4">
            {/* Outer Octagon */}
            <div className="relative w-20 h-20 bg-[#FFB7031A] rotate-25 [clip-path:polygon(30%_0%,70%_0%,100%_30%,100%_70%,70%_100%,30%_100%,0%_70%,0%_30%)] flex items-center justify-center">
              {/* Icon */}
                <Icon icon="fa6-solid:face-smile" width="48" className="text-supporting -rotate-25" />
            </div>
          </div>
        ) : status === "emoji" ? (
          <div className="flex justify-center items-center h-20 mb-4">
            {/* Outer Octagon */}
            <div className="relative w-20 h-20 bg-[#FFB7031A] [clip-path:polygon(30%_0%,70%_0%,100%_30%,100%_70%,70%_100%,30%_100%,0%_70%,0%_30%)] flex items-center justify-center">
              {/* Icon */}
              <img src="/images/thanks.jpg" alt="" width={100}/>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-20 mb-4">
            {/* Outer Octagon */}
            <div className="relative w-20 h-20 bg-[#EF44441A] rotate-25 [clip-path:polygon(30%_0%,70%_0%,100%_30%,100%_70%,70%_100%,30%_100%,0%_70%,0%_30%)] flex items-center justify-center">
              {/* Icon */}

              <Frown
                className="text-error -rotate-25"
                size={48}
                strokeWidth={2}
                fill="transparent"
              />
            </div>
          </div>
        )}

        {/* Header */}
        {title && (
          <h2
            className={`${
              titleColor || "text-secondary"
            } h4 font-medium text-center mb-2`}
          >
            {title}
          </h2>
        )}
        {description && <p className="text-sm text-grey mb-4 text-center">{description}</p>}

        {/* Body */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
