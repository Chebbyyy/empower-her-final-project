import React, { useState } from 'react';
import { submitContact } from '../utils/api.js';
import FormMessage from '../components/FormMessage.jsx';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const result = await submitContact(formData);
      setStatus({
        type: 'success',
        text: result.message || `Thank you, ${formData.name}. Your message has been received.`,
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({
        type: 'error',
        text: typeof err === 'string' ? err : 'Could not send your message. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <section className="page-section border-b border-line">
        <div className="section-wrap max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-brass mb-4">
            Contact
          </p>
          <h1 className="font-display text-4xl text-forest md:text-5xl tracking-tight">
            Write to us
          </h1>
          <p className="mt-6 text-lg text-ink-muted leading-relaxed">
            Questions, partnerships, or feedback — send a message and we’ll get back to you.
          </p>
        </div>
      </section>

      <section className="page-section">
        <div className="section-wrap max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {status && <FormMessage type={status.type}>{status.text}</FormMessage>}

            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-ink">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="field"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="field"
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="mb-2 block text-sm font-medium text-ink">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="field"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium text-ink">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                className="field resize-y"
                required
              />
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? 'Sending…' : 'Send message'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;
