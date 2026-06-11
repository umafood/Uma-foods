import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "./Container";
import { getCategories } from "../api/getCategories";
import spicy from "../assets/spicy.png";
import sweet from "../assets/sweet.png";
import special from "../assets/special.png";
import masala from "../assets/masala.png";
import classic from "../assets/classic.png";
import flavoured from "../assets/flavoured.png";

const getCategoryImage = (categoryName = "") => {
  const name = categoryName.toLowerCase();

  if (name.includes("spicy")) return spicy;
  if (name.includes("flavoured")) return flavoured;
  if (name.includes("masala")) return masala;
  if (name.includes("special")) return special;
  if (name.includes("sweet")) return sweet;

  return classic;
};

const CategorySlider = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const sectionRefs = useRef([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();

      setCategories(data || []);

      if (data?.length > 0) {
        setActiveCategory(data[0]);
      }
    } catch (error) {
      console.error("Category Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!categories.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            setActiveCategory(categories[index]);
          }
        });
      },
      {
        threshold: 0.6,
      }
    );

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [categories]);

  if (loading) {
    return (
      <div className="py-20 text-center text-lg font-medium">
        Loading Categories...
      </div>
    );
  }

  return (
         <section id="categories" className="bg-[#FFFDF7] py-12 md:py-20 lg:py-24">
      <Container>
        {/* Heading */}
        <div className="mb-8 text-center sm:mb-12 lg:mb-20">
          <span className="section-kicker block text-xs font-semibold uppercase tracking-wider text-saffron-600 sm:text-sm">
            Our Categories
          </span>

          <h2 className="section-title mt-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl lg:text-5xl">
            Explore Our <span className="text-gradient">Papad Range</span>
          </h2>

          <p className="type-copy mx-auto mt-3 max-w-2xl text-sm text-neutral-600 sm:text-base">
            Discover authentic flavours crafted using traditional recipes and
            premium ingredients.
          </p>
 <p className="mt-8 animate-bounce text-sm font-bold uppercase tracking-[0.25em] text-neutral-500">
            ↓ Scroll Down Here ↓
          </p>
        </div>

        {/* MAIN INTERACTIVE CONTAINER 
          Mobile: Fixed 350px height box, side-by-side grid layout.
          Desktop (lg): Removes fixed height restrictions, scales to natural scrolling heights.
        */}
        <div className="relative grid h-[350px] grid-cols-2 items-center gap-4 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm sm:h-[400px] sm:p-6 lg:h-auto lg:grid-cols-2 lg:items-start lg:gap-12 lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none">
          
          {/* LEFT IMAGE 
              Mobile: Centered inside the fixed 350px box.
              Desktop: Standard smooth screen-sticky behavior.
          */}
          <div className="flex h-full w-full items-center justify-center lg:sticky lg:top-0 lg:h-screen">
            <div className="relative flex aspect-square w-full max-w-[120px] items-center justify-center sm:max-w-[180px] lg:max-w-[300px] xl:max-w-[360px]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeCategory?.id || "default"}
                  src={
                    activeCategory
                      ? getCategoryImage(activeCategory.name)
                      : classic
                  }
                  alt={activeCategory?.name || "Papad Category"}
                  initial={{
                    opacity: 0,
                    scale: 0.85,
                    rotate: -5,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 1.1,
                    rotate: 5,
                  }}
                  transition={{
                    duration: 0.4,
                  }}
                  className="h-full w-full object-contain drop-shadow-lg lg:drop-shadow-xl"
                />
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT SCROLLING CONTENT
              Mobile: Becomes its own independently scrollable area (`overflow-y-scroll`). 
              Desktop: Scrolls normally with the page wrapper.
          */}
          <div className="no-scrollbar h-full w-full overflow-y-scroll snap-y snap-mandatory lg:h-auto lg:overflow-visible">
            {categories.map((category, index) => (
              <section
                key={category.id}
                data-index={index}
                ref={(el) => (sectionRefs.current[index] = el)}
                // Mobile: Each text fits exactly into the 350px container window using snap alignment
                className="flex h-full min-h-full snap-center items-center justify-start lg:min-h-[80vh]"
              >
                <div className="w-full pr-2 text-left lg:pr-0">
                  <motion.h2
                    animate={{
                      opacity: activeCategory?.id === category.id ? 1 : 0.15,
                      scale: activeCategory?.id === category.id ? 1 : 0.9,
                      x: activeCategory?.id === category.id ? 0 : -10,
                    }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                    className={`
                      font-display
                      font-bold
                      leading-tight
                      text-xl
                      xs:text-2xl
                      sm:text-3xl
                      lg:text-6xl
                      xl:text-7xl
                      transition-all
                      duration-300
                      ${activeCategory?.id === category.id
                        ? "text-gradient"
                        : "text-neutral-300"
                      }
                    `}
                  >
                    {category.name}
                  </motion.h2>
                </div>
              </section>
            ))}
          </div>

        </div>
      </Container>
    </section>
  );
};

export default CategorySlider;