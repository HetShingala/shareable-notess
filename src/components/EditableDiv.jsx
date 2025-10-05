import React, { useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import "./Editor.css";

const EditableDiv = forwardRef(({ initialHTML = "", onChange }, ref) => {
  const el = useRef();

  // Only set innerHTML on mount (first render)
  useEffect(() => {
    if (el.current) el.current.innerHTML = initialHTML;
  }, []); // 👈 empty dependency array

  useImperativeHandle(ref, () => ({
    getHTML: () => (el.current ? el.current.innerHTML : ""),
    highlightTerms: (terms = []) => {
      if (!el.current) return;
      let html = el.current.innerText;
      terms.forEach((term) => {
        const re = new RegExp(`\\b(${escapeReg(term)})\\b`, "ig");
        html = html.replace(
          re,
          `<mark data-term="$1">$1</mark>`
        );
      });
      el.current.innerHTML = html;
    },
  }), []);

  function escapeReg(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  return (
    <div
      ref={el}
      className="editable"
      contentEditable
      onInput={() => onChange && onChange(el.current.innerHTML)}
      style={{
        minHeight: 300,
        padding: 12,
        borderRadius: 8,
        border: "1px solid #eee",
        background: "#fff",
      }}
    />
  );
});

export default EditableDiv;
