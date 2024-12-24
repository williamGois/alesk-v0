import Image from "next/image";
import { Carousel } from "@/components/carousel";

const slides = [
  {
    title: "Prestador de Serviços, Bem-vindo(a) ao Alesk!",
    description:
      "Aqui no Alesk, suas informações são seguras e protegidas. Quanto mais detalhadas forem as informações que você fornecer, melhores serão suas oportunidades de ser encontrado por pacientes que precisam dos seus serviços.",
    image: "",
  },
  // Add more slides here as needed
];

export function WelcomeBanner() {
  return (
    <Carousel
      images={slides.map((slide) => slide.image)}
      autoRotate={true}
      interval={5000}
    >
      {(currentIndex) => (
        <div className="relative z-10 flex items-center justify-between gap-16">
          <div className="flex flex-1 flex-col gap-6">
            <h2 className="text-3xl font-bold text-white">
              {slides[currentIndex].title}
            </h2>
            <p className="text-lg leading-relaxed text-white/90">
              {slides[currentIndex].description}
            </p>
          </div>
          <div className="relative h-[480px] w-[480px] shrink-0">
            <Image
              src={slides[currentIndex].image}
              alt="Profissional de saúde"
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>
      )}
    </Carousel>
  );
}
