import React, { useState } from "react";

const WHATSAPP_NUMBER = "548658665866"; // India (+91) 548658665866
const PRE_FILLED_MESSAGE = encodeURIComponent(
  "Hello! 👋"
);

const WhatsAppButton = () => {
  const [hovered, setHovered] = useState(false);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${PRE_FILLED_MESSAGE}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`whatsapp-float${hovered ? " whatsapp-float--hovered" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Order food on WhatsApp"
      id="whatsapp-float-btn"
    >
      {/* WhatsApp SVG icon */}
      <svg
        className="whatsapp-float__icon"
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M16.002 2C8.27 2 2 8.268 2 15.998c0 2.47.664 4.883 1.93 7.002L2 30l7.236-1.898A13.94 13.94 0 0 0 16.002 30C23.73 30 30 23.73 30 16S23.73 2 16.002 2zm0 25.4a11.34 11.34 0 0 1-5.784-1.582l-.414-.247-4.296 1.126 1.147-4.183-.27-.43A11.37 11.37 0 0 1 4.6 16c0-6.287 5.115-11.4 11.402-11.4S27.4 9.713 27.4 16s-5.115 11.4-11.398 11.4zm6.254-8.532c-.343-.172-2.03-1.001-2.344-1.115-.314-.115-.543-.172-.772.172-.229.343-.886 1.115-1.086 1.344-.2.229-.4.258-.743.086-.343-.172-1.449-.534-2.759-1.702-1.02-.91-1.708-2.034-1.908-2.377-.2-.343-.022-.529.15-.7.155-.154.343-.4.515-.6.171-.2.228-.343.342-.572.115-.229.057-.429-.029-.6-.086-.172-.772-1.862-1.057-2.548-.279-.668-.562-.578-.772-.589l-.657-.01c-.229 0-.6.086-.914.429-.314.343-1.2 1.172-1.2 2.858s1.228 3.316 1.4 3.544c.171.229 2.417 3.689 5.857 5.173.819.353 1.458.564 1.957.722.822.262 1.572.225 2.163.137.66-.099 2.03-.829 2.317-1.63.286-.8.286-1.486.2-1.63-.085-.144-.314-.229-.657-.4z"
          fill="currentColor"
        />
      </svg>

      {/* Tooltip label */}
      <span className="whatsapp-float__label">Chat on WhatsApp</span>
    </a>
  );
};

export default WhatsAppButton;
