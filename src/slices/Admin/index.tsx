import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Admin`.
 */
export type AdminProps = SliceComponentProps<Content.AdminSlice>;

/**
 * Component for "Admin" Slices.
 */
const Admin: FC<AdminProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for admin (variation: {slice.variation}) Slices
    </section>
  );
};

export default Admin;
