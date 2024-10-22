import Hammer from "hammerjs";




function HammerInit() {

    const tabs = document.querySelector<HTMLElement>(".el-tabs__header")!;
    const nav = tabs.querySelector<HTMLElement>(".el-tabs__nav")!;


    const hammertime = new Hammer(tabs);

    let lastEvent: HammerInput | undefined;
    let lastX = 0;


    function moveNav(mov: number) {

        lastX += mov;

        if (lastX > 0) {
            lastX = 0;
        } else {

            const maxWdith = tabs.scrollWidth - nav.scrollWidth;

            if (lastX <= maxWdith) {
                lastX = maxWdith
            }
        }



        nav.style.transform = `translateX(${lastX}px)`

    }

    hammertime.on('panstart', function (ev) {
        if (tabs.scrollWidth > nav.scrollWidth) {
            lastEvent = undefined;
            return;
        }

        lastEvent = ev;
    });
    hammertime.on('panleft', function (ev) {
        if (!lastEvent) {
            return;
        }

        const moveX = Math.abs(ev.center.x - lastEvent.center.x);

        moveNav(-moveX);

        lastEvent = ev;

    });
    hammertime.on('panright', function (ev) {
        if (!lastEvent) {
            return;
        }


        const moveX = Math.abs(ev.center.x - lastEvent.center.x);


        moveNav(moveX);



        lastEvent = ev;



    });


}



export default HammerInit;