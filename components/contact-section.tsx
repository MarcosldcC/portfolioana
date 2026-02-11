"use client";

import { Instagram, Mail, MessageCircle } from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { MotionWrapper } from "./motion-wrapper";
import { incrementClick } from "@/app/actions/analytics";

export function ContactSection() {
  return (
    <section id="contato" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-20">
          {/* Text side */}
          <MotionWrapper direction="right">
            <p className="mb-2 font-script text-2xl text-rose">
              Vamos conversar
            </p>
            <h2 className="mb-6 font-serif text-4xl font-black text-ink md:text-5xl">
              <span className="text-balance">
                Pronta para transformar sua{" "}
                <span className="text-rose">presença digital?</span>
              </span>
            </h2>
            <p className="mb-8 leading-relaxed text-muted-foreground">
              Entre em contato e vamos criar juntas uma estratégia única para a
              sua marca. Cada projeto é uma nova oportunidade de conexão.
            </p>

            <div className="space-y-4">
              <a
                href="mailto:contato@seudominio.com"
                onClick={() => incrementClick('contact')}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-rose/30 hover:shadow-md"
              >
                <div className="flex items-center justify-center rounded-lg bg-rose/10 p-3">
                  <Mail className="h-5 w-5 text-rose" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">E-mail</p>
                  <p className="text-sm text-muted-foreground">
                    contato@seudominio.com
                  </p>
                </div>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => incrementClick('contact')}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-rose/30 hover:shadow-md"
              >
                <div className="flex items-center justify-center rounded-lg bg-moss/10 p-3">
                  <Instagram className="h-5 w-5 text-moss" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">Instagram</p>
                  <p className="text-sm text-muted-foreground">
                    @seuperfil
                  </p>
                </div>
              </a>

              <a
                href="https://wa.me/5500000000000"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => incrementClick('contact')}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-rose/30 hover:shadow-md"
              >
                <div className="flex items-center justify-center rounded-lg bg-slate/10 p-3">
                  <MessageCircle className="h-5 w-5 text-slate" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">WhatsApp</p>
                  <p className="text-sm text-muted-foreground">
                    Solicitar Orçamento
                  </p>
                </div>
              </a>
            </div>
          </MotionWrapper>

          {/* Form side */}
          <MotionWrapper direction="left" delay={0.2} className="relative flex items-center justify-center">
            <ContactForm />
          </MotionWrapper>
        </div>
      </div>
    </section>
  );
}
