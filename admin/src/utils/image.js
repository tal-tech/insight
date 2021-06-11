export const imageGetSize = (pageUrl, callback) => {
  let img = new Image();
  img.src = pageUrl;
  if (img.complete) {
    callback(img.width, img.height);
  } else {
    img.onload = function () {
      callback(img.width, img.height);
      img.onload = null;
    };
  }
};
