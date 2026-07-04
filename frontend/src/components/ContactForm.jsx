import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { SITE } from "../data/siteData";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const PROPERTY_TYPES = ["HDB", "Condominium", "Landed", "Commercial", "Retail / F&B", "Office"];
const PROJECT_TYPES = ["New Renovation", "Resale / Existing Home", "Reinstatement", "Custom Carpentry", "Commercial Fit-out"];
const BUDGETS = [
  "Below S$20,000",
  "S$20,001 – 40,000",
  "S$40,001 – 60,000",
  "S$60,001 – 100,000",
  "S$100,001 – 200,000",
  "S$200,001 & Above",
];

export default function ContactForm() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    property_type: "",
    project_type: "",
    estimated_budget: "",
    preferred_start_date: "",
    message: "",
    website: "", // honeypot
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (form.full_name.trim().length < 2) e.full_name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Please enter a valid email.";
    if (!/^[+\d\s\-()]{5,}$/.test(form.phone)) e.phone = "Please enter a valid phone number.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API}/enquiries`, form);
      if (res.data?.success) {
        setSuccess(true);
        toast.success("Enquiry received — we'll be in touch.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      const msg = err?.response?.data?.detail || "Unable to send. Please try again.";
      toast.error(typeof msg === "string" ? msg : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="relative bg-ivory py-24 md:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-24">
          {/* Left: heading + contact info */}
          <div className="lg:col-span-5">
            <div className="text-[11px] tracking-[0.35em] uppercase text-bronze font-sans mb-6">
              Get in Touch
            </div>
            <h2 className="font-serif font-light text-charcoal text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight">
              Let&rsquo;s shape your<br />
              next space.
            </h2>
            <p className="mt-8 text-charcoal/70 text-base md:text-lg font-sans font-light max-w-md leading-relaxed">
              Share a few details about your home or project. A designer will get back to you
              personally within one working day.
            </p>

            <dl className="mt-12 space-y-8">
              <ContactBlock label="Showroom" value={SITE.addresses.showroom} />
              <ContactBlock label="Workshop" value={SITE.addresses.workshop} />
              <ContactBlock
                label="Direct"
                value={
                  <div className="flex flex-col gap-1">
                    <a href={SITE.phoneHref} className="link-underline">{SITE.phone}</a>
                    <a href={`mailto:${SITE.email}`} className="link-underline">{SITE.email}</a>
                  </div>
                }
              />
            </dl>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-7">
            {success ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                data-testid="contact-success-message"
                className="border border-bronze/40 bg-beige/30 p-10 md:p-14"
              >
                <div className="text-[11px] tracking-[0.35em] uppercase text-bronze font-sans mb-6">
                  Thank You
                </div>
                <h3 className="font-serif font-light text-charcoal text-3xl md:text-4xl leading-tight">
                  We&rsquo;ve received your project details.
                </h3>
                <p className="mt-4 text-charcoal/70 text-base md:text-lg font-sans font-light max-w-md">
                  Our team will contact you shortly to arrange a conversation and a next step.
                </p>
                <button
                  onClick={() => { setSuccess(false); setForm({ full_name: "", email: "", phone: "", property_type: "", project_type: "", estimated_budget: "", preferred_start_date: "", message: "", website: "" }); }}
                  data-testid="contact-send-another"
                  className="mt-8 text-[12px] tracking-[0.25em] uppercase text-charcoal link-underline"
                >
                  Send Another Enquiry
                </button>
              </motion.div>
            ) : (
              <form
                onSubmit={submit}
                data-testid="contact-form"
                className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8"
                noValidate
              >
                {/* Honeypot */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={onChange("website")}
                  name="website"
                  className="hidden"
                  aria-hidden="true"
                  data-testid="hp-website"
                />

                <Field
                  label="Full Name*"
                  testid="input-full-name"
                  error={errors.full_name}
                  input={
                    <input
                      className="field-underline"
                      type="text"
                      value={form.full_name}
                      onChange={onChange("full_name")}
                      required
                      data-testid="input-full-name"
                    />
                  }
                />
                <Field
                  label="Email Address*"
                  error={errors.email}
                  input={
                    <input
                      className="field-underline"
                      type="email"
                      value={form.email}
                      onChange={onChange("email")}
                      required
                      data-testid="input-email"
                    />
                  }
                />
                <Field
                  label="Phone Number*"
                  error={errors.phone}
                  input={
                    <input
                      className="field-underline"
                      type="tel"
                      value={form.phone}
                      onChange={onChange("phone")}
                      required
                      data-testid="input-phone"
                    />
                  }
                />
                <Field
                  label="Property Type"
                  input={
                    <select
                      className="field-select"
                      value={form.property_type}
                      onChange={onChange("property_type")}
                      data-testid="select-property-type"
                    >
                      <option value="">Select</option>
                      {PROPERTY_TYPES.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  }
                />
                <Field
                  label="Project Type"
                  input={
                    <select
                      className="field-select"
                      value={form.project_type}
                      onChange={onChange("project_type")}
                      data-testid="select-project-type"
                    >
                      <option value="">Select</option>
                      {PROJECT_TYPES.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  }
                />
                <Field
                  label="Estimated Budget"
                  input={
                    <select
                      className="field-select"
                      value={form.estimated_budget}
                      onChange={onChange("estimated_budget")}
                      data-testid="select-budget"
                    >
                      <option value="">Select</option>
                      {BUDGETS.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  }
                />
                <Field
                  label="Preferred Start Date"
                  input={
                    <input
                      className="field-underline"
                      type="date"
                      value={form.preferred_start_date}
                      onChange={onChange("preferred_start_date")}
                      data-testid="input-start-date"
                    />
                  }
                />
                <div className="md:col-span-2">
                  <Field
                    label="Tell us about your project"
                    input={
                      <textarea
                        className="field-underline resize-none"
                        rows={4}
                        value={form.message}
                        onChange={onChange("message")}
                        placeholder="Share your vision, layout ideas or specific needs…"
                        data-testid="input-message"
                      />
                    }
                  />
                </div>

                <div className="md:col-span-2 mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <p className="text-xs text-charcoal/50 font-sans font-light max-w-md">
                    By submitting this form you agree to be contacted by Suntek Designs regarding your enquiry.
                  </p>
                  <button
                    type="submit"
                    disabled={loading}
                    data-testid="submit-enquiry"
                    className="inline-flex items-center justify-center gap-3 bg-charcoal text-ivory px-8 py-4 text-[12px] tracking-[0.25em] uppercase disabled:opacity-60 hover:bg-bronze transition-colors duration-500 min-w-[220px]"
                  >
                    {loading ? "Sending…" : "Submit Enquiry"}
                    {!loading && (
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                        <path d="M0 5h13M9 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
                      </svg>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, input, error }) {
  return (
    <label className="block">
      <span className="text-[11px] tracking-[0.25em] uppercase text-charcoal/60 font-sans">
        {label}
      </span>
      <div className="mt-1">{input}</div>
      {error && (
        <span className="mt-2 block text-xs text-red-700 font-sans" data-testid="field-error">
          {error}
        </span>
      )}
    </label>
  );
}

function ContactBlock({ label, value }) {
  return (
    <div className="border-t border-charcoal/15 pt-4">
      <dt className="text-[10px] tracking-[0.3em] uppercase text-bronze font-sans mb-2">{label}</dt>
      <dd className="text-charcoal text-[15px] md:text-base font-sans font-light leading-relaxed">
        {value}
      </dd>
    </div>
  );
}
