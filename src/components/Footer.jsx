import React from "react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-lightAccent py-4">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-sm">© {new Date().getFullYear()} FOZLAVA. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
