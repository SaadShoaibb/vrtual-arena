import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const Portal = ({ children }) => {
  const [portalElement, setPortalElement] = useState(null);

  useEffect(() => {
    const element = document.createElement("div");
    document.body.appendChild(element);
    setPortalElement(element);

    return () => {
      document.body.removeChild(element);
    };
  }, []);

  if (!portalElement) return null;

  return createPortal(children, portalElement);
};

export default Portal;