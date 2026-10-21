"use client";

import { useId, useRef, useState } from "react";
import { ArrowRight, Phone } from "lucide-react";
import { enquiry, site } from "@/content/site";

type Fields = { name: string; email: string; type: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;
type Status = "idle" | "sending" | "sent" | "error" | "unconnected";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = "Please tell us your name.";
  if (!EMAIL.test(f.email.trim())) e.email = "Please enter a valid email address.";
  if (!f.type) e.type = "Please choose a project type.";
  if (f.message.trim().length < 10) e.message = "A few words about your project will help (10 characters or more).";
  return e;
}

/**
 * Enquiry form. When `enquiry.endpoint` is set it POSTs JSON to that URL.
 * When it is empty, the form validates but does not send — and says so.
 */
export function EnquiryForm() {
  const uid = useId();
  const [fields, setFields] = useState<Fields>({ name: "", email: "", type: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const statusRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const next = { ...fields, [k]: e.target.value };
    setFields(next);
    if (touched[k]) setErrors(validate(next));
  };
  const blur = (k: keyof Fields) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(fields));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(fields);
    setErrors(errs);
    setTouched({ name: true, email: true, type: true, message: true });
    const first = Object.keys(errs)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    if (!enquiry.endpoint) {
      setStatus("unconnected");
      requestAnimationFrame(() => statusRef.current?.focus());
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(enquiry.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...fields, source: "website" }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  if (status === "sent" || status === "unconnected") {
    const sent = status === "sent";
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="border-t border-paper/20 pt-10 focus:outline-none">
        <span aria-hidden className="brand-square !h-[9px] !w-[9px]" />
        <h3 className="display mt-6 text-[clamp(2rem,3.4vw,3.2rem)] leading-[1.05]">
          {sent ? `Thank you, ${fields.name.split(" ")[0]}.` : "Thank you — one more step."}
        </h3>
        <p className="pretty mt-5 max-w-[46ch] text-[1.0625rem] leading-relaxed text-paper/75">
          {sent
            ? "Your enquiry has been received. The studio will be in touch soon."
            : "This website’s enquiry form is not connected to the studio yet, so your message has not been sent. Please call the studio directly to talk about your project."}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {!sent && (
            <a href={site.contact.phoneHref} className="btn btn-ghost">
              <Phone aria-hidden className="h-4 w-4" strokeWidth={1.4} />
              Call {site.contact.phoneDisplay}
            </a>
          )}
          <button type="button" className="btn !px-0 text-paper/75 hover:text-paper" onClick={() => setStatus("idle")}>
            Back to form
          </button>
        </div>
      </div>
    );
  }

  const err = (k: keyof Fields) => (touched[k] ? errors[k] : undefined);
  const id = (k: string) => `${uid}-${k}`;

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
      <Field id={id("name")} label="Name" error={err("name")}>
        <input
          id={id("name")}
          name="name"
          autoComplete="name"
          value={fields.name}
          onChange={set("name")}
          onBlur={blur("name")}
          aria-invalid={Boolean(err("name"))}
          aria-describedby={err("name") ? id("name-err") : undefined}
          required
        />
      </Field>
      <Field id={id("email")} label="Email" error={err("email")}>
        <input
          id={id("email")}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={fields.email}
          onChange={set("email")}
          onBlur={blur("email")}
          aria-invalid={Boolean(err("email"))}
          aria-describedby={err("email") ? id("email-err") : undefined}
          required
        />
      </Field>
      <Field id={id("type")} label="Project type" error={err("type")} className="sm:col-span-2">
        <select
          id={id("type")}
          name="type"
          value={fields.type}
          onChange={set("type")}
          onBlur={blur("type")}
          aria-invalid={Boolean(err("type"))}
          aria-describedby={err("type") ? id("type-err") : undefined}
          required
        >
          <option value="" disabled>
            Select one
          </option>
          {enquiry.projectTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>
      <Field id={id("message")} label="Message" error={err("message")} className="sm:col-span-2">
        <textarea
          id={id("message")}
          name="message"
          rows={4}
          placeholder="Tell us about your site, your plans, and your timeline."
          value={fields.message}
          onChange={set("message")}
          onBlur={blur("message")}
          aria-invalid={Boolean(err("message"))}
          aria-describedby={err("message") ? id("message-err") : undefined}
          className="resize-none"
          required
        />
      </Field>

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className="btn btn-solid !bg-paper !text-ink hover:!text-paper" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send enquiry"}
          <ArrowRight aria-hidden className="btn-arrow h-4 w-4" strokeWidth={1.4} />
        </button>
        <div ref={statusRef} tabIndex={-1} aria-live="polite" className="text-sm text-[#ef9f7d] focus:outline-none">
          {status === "error" && (
            <>
              Something went wrong and your enquiry was not sent. Please try again or call{" "}
              <a className="underline" href={site.contact.phoneHref}>
                {site.contact.phoneDisplay}
              </a>
              .
            </>
          )}
        </div>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  className = "",
  children,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`field ${className}`}>
      <label htmlFor={id} className="eyebrow block text-mist">
        {label}
      </label>
      {children}
      <p id={`${id}-err`} className="mt-2 min-h-[1.25rem] text-[13px] text-[#ef9f7d]" aria-live="polite">
        {error ?? ""}
      </p>
    </div>
  );
}
