
export function getFontSize(isScreenFullWidth: boolean) {
    return isScreenFullWidth ? "md" : "sm";
  }

export function getLogoSize(isScreenFullWidth: boolean, isScreenSmallWidth:boolean, isScreenMediumWidth:boolean) {
    if (isScreenFullWidth) {
      return "8rem";
    } else if (isScreenMediumWidth) {
      return "7rem";
    } else if (isScreenSmallWidth) {
      return "6rem";
    }
    return "5rem";
  }