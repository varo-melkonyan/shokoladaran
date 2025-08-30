"use client";

import { useTranslation } from "react-i18next";

export default function PrivacyPolicyClient() {
  const { t } = useTranslation();
  const p = t("privacy", { returnObjects: true }) as any;

  if (!p) return null;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-chocolate mb-2">{p.title}</h1>
      <p className="text-sm text-gray-500 mb-8">
        {p.lastUpdatedLabel}: {p.lastUpdatedDate}
      </p>

      <p className="mb-6">{p.intro}</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-chocolate mb-3">{p.s1.title}</h2>
        <p className="mb-3">{p.s1.lead}</p>

        <h3 className="font-semibold mb-2">{p.s1.p1.title}</h3>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li><strong>{p.s1.p1.i1.h}</strong> {p.s1.p1.i1.t}</li>
          <li><strong>{p.s1.p1.i2.h}</strong> {p.s1.p1.i2.t}</li>
          <li><strong>{p.s1.p1.i3.h}</strong> {p.s1.p1.i3.t}</li>
        </ul>

        <h3 className="font-semibold mb-2">{p.s1.p2.title}</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>{p.s1.p2.i1.h}</strong> {p.s1.p2.i1.t}</li>
          <li><strong>{p.s1.p2.i2.h}</strong> {p.s1.p2.i2.t}</li>
          <li><strong>{p.s1.p2.i3.h}</strong> {p.s1.p2.i3.t}</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-chocolate mb-3">{p.s2.title}</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>{p.s2.i1.h}</strong> {p.s2.i1.t}</li>
          <li><strong>{p.s2.i2.h}</strong> {p.s2.i2.t}</li>
          <li><strong>{p.s2.i3.h}</strong> {p.s2.i3.t}</li>
          <li><strong>{p.s2.i4.h}</strong> {p.s2.i4.t}</li>
          <li><strong>{p.s2.i5.h}</strong> {p.s2.i5.t}</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-chocolate mb-3">{p.s3.title}</h2>
        <p className="mb-3">{p.s3.lead}</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>{p.s3.i1.h}</strong> {p.s3.i1.t}</li>
          <li><strong>{p.s3.i2.h}</strong> {p.s3.i2.t}</li>
          <li><strong>{p.s3.i3.h}</strong> {p.s3.i3.t}</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-chocolate mb-3">{p.s4.title}</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>{p.s4.i1.h}</strong> {p.s4.i1.t}</li>
          <li><strong>{p.s4.i2.h}</strong> {p.s4.i2.t}</li>
          <li><strong>{p.s4.i3.h}</strong> {p.s4.i3.t}</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-chocolate mb-3">{p.s5.title}</h2>
        <p>{p.s5.text}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-chocolate mb-3">{p.s6.title}</h2>
        <p>{p.s6.text}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-chocolate mb-3">{p.s7.title}</h2>
        <p>{p.s7.text}</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-chocolate mb-3">{p.s8.title}</h2>
        <p className="mb-2">{p.s8.lead}</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>{p.s8.i1.h}</strong>{" "}
            <a href={`mailto:${p.s8.i1.v || "support@shokoladaran.am"}`} className="underline">
              {p.s8.i1.v || "support@shokoladaran.am"}
            </a>
          </li>
          <li><strong>{p.s8.i2.h}</strong> {p.s8.i2.v}</li>
        </ul>
      </section>
    </main>
  );
}