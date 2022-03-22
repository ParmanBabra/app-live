import React, { FunctionComponent, useEffect } from "react";
import "./3DCarousel.css";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";

export type Image = {
  title?: string;
  url?: string;
};

export const Carousel: FunctionComponent<{
  imageList: Image[];
  imageClassName?: string;
  id?: string;
  onClick?: () => {};
  autoplay?: boolean;
  className?: string;
  showArrows?: boolean;
  interval?: number;
  overlayClassName?: string;
}> = ({
  imageList,
  imageClassName,
  id,
  onClick,
  className,
  autoplay,
  showArrows,
  overlayClassName,
  interval,
}) => {
  const showArrowsStatus = showArrows ? showArrows : false;
  const autoplayStatus = autoplay !== undefined ? autoplay : true;

  const prop: any = {
    middle: 0,
    left: 1,
    right: imageList.length - 1,
  };

  var images = [];

  for (var i = 0; i < imageList.length; i++) {
    if (imageList[i].title == undefined) {
      imageList[i].title = "";
    }

    images.push({
      index: i,
      url: imageList[i].url,
      title: imageList[i].title,
    });
  }

  useEffect(() => {
    addCarouselItems();
  }, []);

  function addCarouselItems() {
    document.getElementById(prop.right)?.classList.add("carousel____right");
    document.getElementById(prop.left)?.classList.add("carousel____left");
    document.getElementById(prop.middle)?.classList.add("carousel____middle");

    document.getElementById(prop.middle)?.classList.add("carousel_____zIndex4");

    prop.title = "";
  }

  function removeCarouselItems() {
    document
      .getElementById(prop.middle)
      ?.classList.remove("carousel____middle");
    document.getElementById(prop.left)?.classList.remove("carousel____left");
    document.getElementById(prop.right)?.classList.remove("carousel____right");

    document
      .getElementById(prop.left)
      ?.classList.remove("carousel_____zIndex2");
    document
      .getElementById(prop.right)
      ?.classList.remove("carousel_____zIndex3");

    document
      .getElementById(prop.right)
      ?.classList.remove("carousel_____zIndex2");
    document
      .getElementById(prop.left)
      ?.classList.remove("carousel_____zIndex3");

    document
      .getElementById(prop.middle)
      ?.classList.remove("carousel_____zIndex4");

    handleMouseLeave();
  }
  if (autoplayStatus) {
    console.log("ok");
    if (interval == undefined) {
      interval = 2000;
    }

    if (!interval) {
    }
    setInterval(() => {
      handleCarouselLeftClick();
    }, interval);
  }

  function handleCarouselLeftClick() {
    removeCarouselItems();

    prop.left = prop.middle;
    prop.middle = prop.right;
    if (prop.right != 0) {
      prop.right = prop.right - 1;
    } else {
      prop.right = imageList.length - 1;
    }

    addCarouselItems();

    document.getElementById(prop.right)?.classList.add("carousel_____zIndex2");
    document.getElementById(prop.left)?.classList.add("carousel_____zIndex3");
  }

  function handleCarouselRightClick() {
    removeCarouselItems();

    prop.right = prop.middle;
    prop.middle = prop.left;
    if (prop.left == imageList.length - 1) {
      prop.left = 0;
    } else {
      prop.left = prop.left + 1;
    }

    addCarouselItems();

    document.getElementById(prop.right)?.classList.add("carousel_____zIndex3");
    document.getElementById(prop.left)?.classList.add("carousel_____zIndex2");
  }

  function handleMouseEnter() {
    document
      .getElementById("carousel_____image-overlay-" + prop.middle)
      ?.classList.remove("carousel_____image-overlay-leave");
    document
      .getElementById("carousel_____image-overlay-" + prop.middle)
      ?.classList.add("carousel_____image-overlay-enter");
  }

  function handleMouseLeave() {
    document
      .getElementById("carousel_____image-overlay-" + prop.middle)
      ?.classList.remove("carousel_____image-overlay-enter");
    document
      .getElementById("carousel_____image-overlay-" + prop.middle)
      ?.classList.add("carousel_____image-overlay-leave");
  }

  return (
    <div className={`carousel_____container ${className}`} id={id}>
      {showArrowsStatus ? (
        <div className="carousel_____indicators-wrapper">
          <IoIosArrowDropleftCircle
            className="carousel_____arrow-indicators"
            id="carousel_____left-arrow"
            onClick={() => handleCarouselLeftClick()}
          />
          <IoIosArrowDroprightCircle
            className="carousel_____arrow-indicators"
            id="carousel_____right-arrow"
            onClick={() => handleCarouselRightClick()}
          />
        </div>
      ) : (
        ""
      )}

      {images.map((image) => {
        return (
          <div
            className="carousel_____image-container-wrapper"
            key={image.index}
            onMouseEnter={() => handleMouseEnter()}
          >
            {image.title != "" ? (
              <div
                id={"carousel_____image-overlay-" + image.index}
                className={`carousel_____image-overlay carousel_____image-overlay-leave ${overlayClassName}`}
                onMouseLeave={() => handleMouseLeave()}
              >
                <h1 className="carousel_____overlay-title">{image.title}</h1>
              </div>
            ) : (
              <div
                id={"carousel_____image-overlay-" + image.index}
                className="carousel_____image-overlay-disabled"
              ></div>
            )}
            <img
              src={image.url}
              alt="carousel"
              id={image.index.toString()}
              className={`carousel_____image  ${imageClassName}`}
              onClick={onClick}
            />
          </div>
        );
      })}
    </div>
  );
};
