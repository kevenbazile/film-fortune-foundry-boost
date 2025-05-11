
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-muted py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="font-bold text-xl text-primary mb-4 block">
              SceneVox
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              The premier platform for indie filmmakers to distribute and monetize their work.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/how-it-works" className="hover:text-primary transition-colors">Distribution Packages</Link></li>
              <li><Link to="/how-it-works" className="hover:text-primary transition-colors">Marketing Services</Link></li>
              <li><Link to="/how-it-works" className="hover:text-primary transition-colors">Festival Submissions</Link></li>
              <li><Link to="/how-it-works" className="hover:text-primary transition-colors">Revenue Management</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Success Stories</Link></li>
              <li><Link to="/how-it-works" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="/how-it-works" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/how-it-works" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/how-it-works" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/how-it-works" className="hover:text-primary transition-colors">Copyright Policy</Link></li>
              <li><Link to="/how-it-works" className="hover:text-primary transition-colors">Distribution Agreement</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-sm text-muted-foreground flex flex-col md:flex-row justify-between">
          <div>
            &copy; {new Date().getFullYear()} SceneVox. All rights reserved. TechMaych Copyright
          </div>
          <div className="mt-4 md:mt-0">
            Empowering filmmakers to succeed in the digital distribution landscape.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
