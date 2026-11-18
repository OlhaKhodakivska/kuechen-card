"use client";

import Image from "next/image";
import { useRef, useState, type FormEvent } from "react";

const kitchens = [
  { name: "Kompakt", detail: "Kleiner Raum. Große Möglichkeiten.", image: "kompakt", alt: "Kompakte olivgrüne Küche mit hellen Oberschränken und offenen Holzregalen" },
  { name: "Charaktervoll", detail: "Design mit Persönlichkeit.", image: "design", alt: "Moderne bordeauxrote Küche mit dunklen Steinflächen und einer Kücheninsel" },
  { name: "Exklusiv", detail: "Besondere Räume. Besondere Details.", image: "exklusiv", alt: "Großzügige dunkle Küche mit Holzoberflächen und warmer indirekter Beleuchtung" },
];
type Mode = "beratung" | "zusammenarbeit";
function localDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export default function Home() {
  const formDialog = useRef<HTMLDialogElement>(null);
  const photoDialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const [mode, setMode] = useState<Mode>("beratung");
  const [selected, setSelected] = useState(0);
  const [status, setStatus] = useState("");
  const [minimumDate, setMinimumDate] = useState("");
  function openForm(next: Mode, element: HTMLElement) {
    trigger.current = element;
    setMode(next); setStatus(""); setMinimumDate(localDate());
    formDialog.current?.querySelector("form")?.reset();
    formDialog.current?.querySelectorAll("input").forEach(input => input.setCustomValidity(""));
    formDialog.current?.showModal();
    formDialog.current?.querySelector<HTMLInputElement>('input[name="name"]')?.focus();
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const phone = form.elements.namedItem("phone") as HTMLInputElement;
    const date = form.elements.namedItem("date") as HTMLInputElement;
    const time = form.elements.namedItem("time") as HTMLInputElement;
    const name = form.elements.namedItem("name") as HTMLInputElement;
    const proposal = form.elements.namedItem("proposal") as HTMLTextAreaElement | null;
    if (proposal) {
      proposal.value = proposal.value.trim();
      proposal.setCustomValidity(proposal.value.length < 10 ? "Bitte beschreiben Sie Ihren Vorschlag mit mindestens 10 Zeichen." : "");
    }
    [phone, date, time, name].forEach(input => input.setCustomValidity(""));
    name.value = name.value.trim();
    if (name.value.length < 2) name.setCustomValidity("Bitte geben Sie Ihren Namen an (mindestens 2 Zeichen).");
    const digits = phone.value.replace(/\D/g, "");
    if (!/^\+?[\d\s().-]+$/.test(phone.value.trim()) || digits.length < 7 || digits.length > 15) phone.setCustomValidity("Bitte geben Sie eine gültige Telefonnummer mit 7 bis 15 Ziffern an.");
    date.min = localDate();
    if (new Date(`${date.value}T${time.value}`).getTime() <= Date.now()) time.setCustomValidity("Bitte wählen Sie einen zukünftigen Zeitpunkt.");
    if (!form.reportValidity()) return;
    setStatus("Dies ist eine Konzeptwebsite. Ihre Anfrage wurde nicht versendet. Der E-Mail-Versand ist noch nicht eingerichtet.");
  }
  function restoreFocus() { trigger.current?.focus({ preventScroll: true }); }

  return (
    <div className="site-frame">
      <a className="skip-link" href="#main">Zum Inhalt</a>
      <header className="header">
        <a className="wordmark" href="#main" aria-label="Küchen nach Maß — Startseite">Küchen<span>nach Maß</span><i aria-hidden="true" /></a>
        <span className="header-note">Räume für das Leben.</span>
        <nav aria-label="Kontaktmöglichkeiten">
          <button className="nav-button" onClick={e => openForm("zusammenarbeit", e.currentTarget)}>Zusammenarbeit</button>
          <button className="nav-button consultation-nav" onClick={e => openForm("beratung", e.currentTarget)}>Kontakt</button>
        </nav>
      </header>
      <main id="main" className="main" tabIndex={-1}>
        <section className="intro" aria-labelledby="title">
          <p className="eyebrow">Individuell geplant. Für Sie gemacht.</p>
          <h1 id="title">Ihre Küche. <br />Ihr Leben.<br /><em>Nach Maß.</em></h1>
          <p className="intro-description">Von der ersten Idee bis zum letzten Detail. Küchen, die Ihren Raum nutzen und Ihre Persönlichkeit widerspiegeln.</p>
          <div className="actions">
            <button className="button primary" onClick={e => openForm("beratung", e.currentTarget)}>Beratung anfragen</button>
            <button className="button secondary" onClick={e => openForm("zusammenarbeit", e.currentTarget)}>Zusammenarbeit</button>
          </div>
          <p className="intro-footnote">Ein guter Raum beginnt mit einem Gespräch.</p>
        </section>
        <section className="showcase" aria-labelledby="showcase-title">
          <div className="showcase-heading"><h2 id="showcase-title">Drei Ideen. Ihr Zuhause.</h2><span>Unsere Küchenwelten</span></div>
          <div className="kitchens">
            {kitchens.map((kitchen, index) => <button className={`kitchen kitchen-${kitchen.image}`} key={kitchen.image} aria-label={`${kitchen.name}: Foto vergrößern`} onClick={e => { trigger.current = e.currentTarget; setSelected(index); photoDialog.current?.showModal(); }}>
              <div className="photo-window"><Image unoptimized src={`/images/${kitchen.image}.webp`} alt={kitchen.alt} width="900" height="1300" fetchPriority={index === 0 ? "high" : "auto"} style={{ animationDelay: `${index * 110}ms` }} /></div>
              <div className="kitchen-caption"><h3>{kitchen.name}</h3><p>{kitchen.detail}</p></div>
            </button>)}
          </div>
        </section>
      </main>
      <footer className="footer"><span>Küchen nach Maß</span><span>Planung mit Persönlichkeit.</span><small>Konzeptwebsite</small></footer>
      <dialog ref={formDialog} className="form-dialog" aria-labelledby="dialog-title" aria-describedby="dialog-intro" onClose={restoreFocus}>
        <button className="close" aria-label="Dialog schließen" onClick={() => formDialog.current?.close()}>×</button>
        <p className="eyebrow">Lassen Sie uns sprechen</p>
        <h2 id="dialog-title">{mode === "beratung" ? "Ihre Küche beginnt hier." : "Gemeinsam mehr gestalten."}</h2>
        <p id="dialog-intro">{mode === "beratung" ? "Erzählen Sie uns von Ihren Plänen. Wählen Sie einen Wunschtermin für unseren Rückruf." : "Sie haben eine Idee für eine Zusammenarbeit? Wir freuen uns auf Ihren Vorschlag."}</p>
        <form onSubmit={submit} onInput={e => { const target = e.target; if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) target.setCustomValidity(""); setStatus(""); }}>
          <label>Ihr Name<input name="name" autoComplete="name" required minLength={2} maxLength={80} /></label>
          <label>Telefonnummer<input name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+49 …" required maxLength={25} /></label>
          {mode === "zusammenarbeit" && <label>Ihr Vorschlag<textarea name="proposal" placeholder="Was möchten Sie gemeinsam mit uns umsetzen?" required minLength={10} maxLength={2000} rows={3} /></label>}
          <div className="form-row"><label>Wunschdatum<input name="date" type="date" required min={minimumDate} /></label><label>Uhrzeit für den Rückruf<input name="time" type="time" required /></label></div>
          <p className="form-note">Bitte geben Sie die Uhrzeit in Ihrer lokalen Zeitzone an. Der Termin wird persönlich bestätigt.</p>
          <button className="button primary" type="submit">{mode === "beratung" ? "Rückruf anfragen" : "Zusammenarbeit anfragen"}</button>
          <p className="form-note">Konzeptformular: Der Versand ist noch nicht eingerichtet.</p>
          <p className="form-status" role="status" aria-live="polite">{status}</p>
        </form>
      </dialog>
      <dialog ref={photoDialog} className="photo-dialog" aria-label={`${kitchens[selected].name} — Küchenansicht`} onClose={restoreFocus}>
        <button className="close" aria-label="Foto schließen" onClick={() => photoDialog.current?.close()}>×</button>
        <Image unoptimized src={`/images/${kitchens[selected].image}.webp`} alt={kitchens[selected].alt} width={900} height={1300} />
        <p>{kitchens[selected].name}</p>
      </dialog>
    </div>
  );
}
