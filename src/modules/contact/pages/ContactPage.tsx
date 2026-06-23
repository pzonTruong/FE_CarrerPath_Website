import React, { useState } from 'react';
import { toast } from 'sonner';

export const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('All fields are required.');
      return;
    }
    setLoading(true);

    // Simulate sending message
    setTimeout(() => {
      toast.success('Your message has been sent successfully.');
      setName('');
      setEmail('');
      setMessage('');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="py-10 max-w-md mx-auto">
      <div className="border-2 border-foreground bg-card text-card-foreground p-8 rounded-[4px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(250,250,250,0.15)] space-y-6">
        {/* Form Title */}
        <div className="space-y-2 border-b-2 border-foreground pb-4 text-center">
          <span className="font-mono text-[10px] font-bold bg-primary/10 text-primary border border-foreground px-2 py-0.5 rounded-[2px] uppercase tracking-widest">
            Support Desk
          </span>
          <h1 className="text-2xl font-black uppercase font-mono tracking-tight mt-2">
            Get in touch
          </h1>
          <p className="text-xs text-muted-foreground font-sans">
            Have a question or feedback about our roadmaps? Send us a message.
          </p>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="contact-name" className="text-xs font-mono font-bold uppercase tracking-wider block">
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              placeholder="YOUR NAME"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-2 border-foreground bg-background px-3 py-2 text-sm font-mono rounded-[2px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/50 uppercase"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="contact-email" className="text-xs font-mono font-bold uppercase tracking-wider block">
              Email Address
            </label>
            <input
              id="contact-email"
              type="email"
              placeholder="YOUR.EMAIL@PROVIDER.COM"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-foreground bg-background px-3 py-2 text-sm font-mono rounded-[2px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/50 uppercase"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="contact-message" className="text-xs font-mono font-bold uppercase tracking-wider block">
              Message
            </label>
            <textarea
              id="contact-message"
              placeholder="WRITE YOUR MESSAGE HERE..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full border-2 border-foreground bg-background px-3 py-2 text-sm font-mono rounded-[2px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/50 resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 border-2 border-foreground bg-primary text-primary-foreground font-mono font-bold text-sm uppercase tracking-widest transition-all duration-150 hover:opacity-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(250,250,250,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(250,250,250,1)] rounded-[2px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'SENDING...' : 'SUBMIT MESSAGE'}
          </button>
        </form>
      </div>
    </div>
  );
};
