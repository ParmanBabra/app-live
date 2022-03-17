import { Fragment, FunctionComponent } from "react";

export const PreviewImage: FunctionComponent<{ src?: string | null }> = ({
  src = null,
}) => {
  if (!src || src == "") return <Fragment></Fragment>;

  return (
    <img src={src} alt="image" style={{ width: "100%", marginTop: 20 }}></img>
  );
};
