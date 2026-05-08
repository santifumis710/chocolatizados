"use client";

import { spacing, typography } from "@/theme";

const paragraphStyle: React.CSSProperties = {
  fontSize: typography.sizes.lg,
  lineHeight: 1.8,
  fontStyle: "italic",
  textAlign: "justify",
  textIndent: spacing.xl,
  margin: 0,
};

export const Hero = () => (
  <section className="hero-background">
    <div className="hero-content-wrapper">
      <div className="hero-row" style={{ flexDirection: "row" }}>
        <div className="hero-col">
          <img
            src="/images/hero_madre_16_9.jpg"
            alt="Chocolate artesanal - Día de la Madre"
            className="hero-img"
            style={{ borderRadius: "16px" }}
          />
        </div>
        <div className="hero-col hero-text-right">
          <p style={paragraphStyle}>
            Cuando una persona o empresa quiere agasajar a sus invitados o clientes, nada mejor que hacerlo con un producto tentador como es el chocolate... personalizando su envoltorio. Mas allá de lo emotivo, endulzarle el día a alguien querido es un acto totalmente grato, tanto para el que recibe el regalo como para el que lo brinda.
          </p>
        </div>
      </div>

      <div className="hero-row" style={{ flexDirection: "row-reverse" }}>
        <div className="hero-col" style={{ display: "flex", justifyContent: "center" }}>
          <img
            src="/images/marie.jpg"
            alt="Mariela"
            className="hero-img"
            style={{ borderRadius: "16px", maxWidth: "70%", height: "auto" }}
          />
        </div>
        <div className="hero-col hero-text-left">
          <p style={paragraphStyle}>
            Soy Mariela, la persona detrás de Chocolatizados. Hace mas de 18 años nació este emprendimiento, que permite transformar chocolate verdadero en momentos únicos. Mi intención es lograr que lo que quieras decir, lo digas con chocolates.
          </p>
        </div>
      </div>

      <div className="hero-row" style={{ flexDirection: "row" }}>
        <div className="hero-col">
          <img
            src="/images/products/hero-bombones.jpg"
            alt="Bombones premium"
            className="hero-img"
            style={{ borderRadius: "16px" }}
          />
        </div>
        <div className="hero-col hero-text-right">
          <p style={paragraphStyle}>
            Elegí chocolate de verdad! El chocolate genuino y el baño de reposteria pueden parecer similares a primera vista, pero sus diferencias son significativas, podés reconocerlo porque el verdadero chocolate no deja una sensación de grasitud en el paladar, es rígido, crocante y brilloso, tiene un sabor y aroma diferencial... y se funde de manera agradable en tu boca.
          </p>
        </div>
      </div>
    </div>
  </section>
);
