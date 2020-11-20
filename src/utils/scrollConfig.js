var scrollConfig = {
        vuescroll: {
            sizeStrategy: "percent",
            detectResize: true,
            wheelScrollDuration: 500,
            wheelDirectionReverse: false,
        },
        scrollPanel: {
            scrollingX: false,
            scrollingY: true,
            speed: 500,
            easing: undefined,
            // verticalNativeBarPos: left,
            maxHeight: 800,
            maxWidth: undefined,
        },
        bar: {
            showDelay: 500,
            onlyShowBarOnScroll: true,
            keepShow: false,
            background: "#c1c1c1",
            opacity: 1,
            hoverStyle: false,
            specifyBorderRadius: false,
            minSize: false,
            size: "3px",
            disable: false,
        }
}
export default scrollConfig;