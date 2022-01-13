console.log("chanters header executed");
Chanters("chanters-header", {
  visibility: "hidden",
  changeBackground: function (event) {
    // event.target.nextElementSibling.click();
    // var that = this;
    // event.target.nextElementSibling.onchange = function(event) {
    //     var imageList = event.target.files;
    //     that.parent.communicate({
    //         element: "chanters-background",
    //         effectedProperty: "imageList",
    //         newValue: imageList
    //     });
    // };
  },
  changeMode: function (event) {
    // var mode = event.target.mode === "Night Mode" ? "Day Mode" : "Night Mode";
    // event.target.mode = mode;
    // this.parent.communicate({
    //     element: "chanters-content",
    //     effectedProperty: "mode",
    //     newValue: mode
    // });
  },
  inheritParent: true,
  openSettings: function () {
    // this.parent.communicate({
    //     element: "chanters-menu",
    //     effectedProperty: "visibility",
    //     newValue: event
    // })
  },
  menuItemClicked: function (event, item) {
    // if (item && this[item])
    //     this[item](event);
  },
  resizeBackground: function (event) {
    // this.parent.communicate({
    //     element: "chanters-background",
    //     effectedProperty: "zIndex",
    //     newValue: event
    // });
  },
  createList: function (event, item) {
    // event.target.nextElementSibling.click();
    // var that = this;
    // event.target.nextElementSibling.onchange = function(event) {
    //     that.parent.communicate({
    //         element: "chanters-player",
    //         effectedProperty: "imageList",
    //         newValue: this.files
    //     });
    // };
  },
});
