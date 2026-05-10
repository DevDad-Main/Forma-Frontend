import { Link } from "react-router-dom";
import { Leaf, Award, Handshake, Lightbulb } from "lucide-react";

const values = [
  {
    icon: Leaf,
    title: "Sustainability",
    description:
      "Every piece is crafted from responsibly sourced materials. We partner with forests that replenish faster than we harvest, and our finishes are non-toxic and water-based.",
  },
  {
    icon: Award,
    title: "Artisanship",
    description:
      "Our furniture is built by hand by master craftspeople with decades of experience. Each joint, curve, and finish is a testament to time-honored techniques.",
  },
  {
    icon: Handshake,
    title: "Fair Making",
    description:
      "We believe beautiful furniture should come from a fair process. Every artisan in our supply chain earns a living wage and works in safe, supportive conditions.",
  },
  {
    icon: Lightbulb,
    title: "Timeless Design",
    description:
      "We design for the long term. Our pieces transcend trends, built to be passed down through generations rather than replaced every few years.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#F5F0E8] dark:bg-[#1C1A17] min-h-screen pt-16">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=80"
          alt="Forma workshop"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A17]/80 via-[#1C1A17]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-[1440px] mx-auto px-6 md:px-16 py-16">
          <div className="max-w-2xl">
            <p className="font-accent text-xs tracking-[0.2em] uppercase text-[#C8A97E] mb-4">
              Since 2012
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-light text-[#F5F0E8] leading-tight mb-6">
              Furniture made to<br /> outlive us.
            </h1>
            <p className="font-body text-lg text-[#F5F0E8]/70 max-w-xl leading-relaxed">
              Forma was born from a simple belief: the things you surround yourself with
              should be built with intention, by hand, and built to last.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-16 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-accent text-xs tracking-[0.2em] uppercase text-[#C8A97E] mb-4">
              Our Story
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-[#1C1A17] dark:text-[#F5F0E8] leading-tight mb-8">
              Crafting heirlooms<br /> from the ground up.
            </h2>
            <div className="space-y-5 font-body text-base text-[#1C1A17]/70 dark:text-[#F5F0E8]/70 leading-relaxed">
              <p>
                Forma began in a small workshop in the Polish countryside, where our
                founder, an architect turned furniture maker, set out to bridge the gap
                between fine design and everyday living. Dissatisfied with the disposable
                nature of modern furniture, he spent two years mastering traditional
                joinery techniques before crafting his first collection.
              </p>
              <p>
                Today, we work with a network of independent studios across Europe. Every
                piece is made to order, reducing waste and ensuring that each item receives
                the attention it deserves. From the selection of the raw timber to the final
                oil finish, our process is deliberate, patient, and human.
              </p>
              <p>
                We don't chase trends. We build furniture that ages gracefully —
                acquiring character, deepening in color, and growing more beautiful
                with each passing year.
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"
              alt="Handcrafted furniture detail"
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute -bottom-6 -left-6 bg-[#C8A97E] p-8 max-w-[240px] hidden md:block">
              <p className="font-display text-4xl font-light text-[#1C1A17]">13+</p>
              <p className="font-body text-sm text-[#1C1A17]/70 mt-1">
                Years of craftsmanship
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#EDE8DF] dark:bg-[#252220] py-24 md:py-32">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="font-accent text-xs tracking-[0.2em] uppercase text-[#C8A97E] mb-4">
              What We Stand For
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-[#1C1A17] dark:text-[#F5F0E8] leading-tight">
              Principles that guide<br /> everything we make.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {values.map((v) => (
              <div key={v.title} className="flex gap-6">
                <div className="w-12 h-12 rounded-full bg-[#C8A97E]/15 flex items-center justify-center flex-shrink-0 mt-1">
                  <v.icon size={20} className="text-[#C8A97E]" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-light text-[#1C1A17] dark:text-[#F5F0E8] mb-3">
                    {v.title}
                  </h3>
                  <p className="font-body text-base text-[#1C1A17]/70 dark:text-[#F5F0E8]/70 leading-relaxed">
                    {v.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-16 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <img
              src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800&q=80"
              alt="Woodworking process"
              className="w-full h-[500px] object-cover"
            />
          </div>
          <div className="order-1 lg:order-2">
            <p className="font-accent text-xs tracking-[0.2em] uppercase text-[#C8A97E] mb-4">
              Made to Order
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-[#1C1A17] dark:text-[#F5F0E8] leading-tight mb-8">
              Every piece,<br /> made for you.
            </h2>
            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "You choose",
                  desc: "Select your piece, wood, and finish. Every combination is made to your specification.",
                },
                {
                  step: "02",
                  title: "We craft",
                  desc: "Our artisans begin work, carefully shaping and assembling your furniture by hand.",
                },
                {
                  step: "03",
                  title: "It arrives",
                  desc: "Your piece is shipped directly from our workshop, ready to become part of your home.",
                },
              ].map((s) => (
                <div key={s.step} className="flex gap-5">
                  <span className="font-display text-3xl font-light text-[#C8A97E] w-12 flex-shrink-0">
                    {s.step}
                  </span>
                  <div>
                    <h4 className="font-body text-base font-500 text-[#1C1A17] dark:text-[#F5F0E8] mb-1">
                      {s.title}
                    </h4>
                    <p className="font-body text-sm text-[#1C1A17]/60 dark:text-[#F5F0E8]/60">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1C1A17] dark:bg-[#0f0e0c] py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-light text-[#F5F0E8] leading-tight mb-6">
            Ready to find your<br /> forever piece?
          </h2>
          <p className="font-body text-base text-[#F5F0E8]/60 max-w-lg mx-auto mb-10 leading-relaxed">
            Explore our collection of heirloom-quality furniture, crafted for the way
            you live.
          </p>
          <Link
            to="/shop"
            className="inline-block px-10 py-4 bg-[#C8A97E] text-[#1C1A17] font-body font-600 text-sm tracking-wider uppercase hover:bg-[#F5F0E8] transition-colors"
          >
            Browse the Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
