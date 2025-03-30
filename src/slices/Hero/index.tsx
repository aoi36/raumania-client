import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, PrismicText, SliceComponentProps } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import { Bounded } from "@/components/Bounded";
import { Heading } from "@/components/Heading";

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero: FC<HeroProps> = ({ slice }) => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className = "bg-brand-gray relative h-dvh overflow-hidden text-zinc-800 bg-texture"
    >
      <Heading>
    
          <PrismicText field={slice.primary.heading} />      
     
        </Heading>
        <div className="mt-4 [&_p]:text-gray-700">
          <PrismicRichText field={slice.primary.body} />   
        </div>
        <div className="mt-40">
          <PrismicNextLink 
            field={slice.primary.button} 
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors" 
          />
        </div>
   
    </Bounded>
  );
};

export default Hero;
