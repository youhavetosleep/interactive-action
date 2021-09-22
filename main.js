(()=> {

    let yOffset = 0 // window.pageYOffset 대신 쓸 변수 
    let preScrollHeight = 0 // 현재 스크롤 위치(yOffet)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0 // 현재 활성화된 (눈 앞에 보고 있는) 씬 (scroll- section)
    let enterNewScene = false; // 새로운  scene이 시작되는 순간 true
    let acc = 0.1 ; // 가속도 곱하는 변수 
    let delayedYOffset = 0;
    let rafId;
    let rafState; 

    const sceneInfo = [
        {
            // 0
            type: 'sticky',
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d'),
                canvas : document.querySelector('#video-cansvas-0'),
                context : document.querySelector('#video-cansvas-0').getContext('2d'),
                //context가 뭔데
                videoImages : []
            },
            values: {
                videoImageCount : 300,
                imageSequence : [0, 299],
                canvas_opacity : [1, 0, {start : 0.9, end : 1}],
                canvas_opacity_in : [0, 1, {start : 0, end : 0.1}],
                canvas_opacity_out : [1, 0, {start : 0.95, end : 1}],
                messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
                messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
                messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
                messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
                messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
                messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
                messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
                messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
                messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
                messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
                messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
                messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
                messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
                messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
                messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
                messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
            }
        },
        {
            // 1
            type: 'normal',
            // heightNum: 5, // type normal에서는 필요 없음
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1'),
                content: document.querySelector('#scroll-section-1 .description')
            }
        },
        {
            // 2
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2'),
                messageA: document.querySelector('#scroll-section-2 .a'),
                messageB: document.querySelector('#scroll-section-2 .b'),
                messageC: document.querySelector('#scroll-section-2 .c'),
                pinB: document.querySelector('#scroll-section-2 .b .pin'),
                pinC: document.querySelector('#scroll-section-2 .c .pin'),
                canvas : document.querySelector('#video-cansvas-1'),
                context : document.querySelector('#video-cansvas-1').getContext('2d'),
                //context가 뭔데
                videoImages : []
            },
            values: {
                videoImageCount : 960,
                imageSequence : [0, 959],
                canvas_opacity_in : [0, 1, {start : 0, end : 0.1}],
                canvas_opacity_out : [1, 0, {start : 0.95, end : 1}],
                messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
                messageB_translateY_in: [30, 0, { start: 0.5, end: 0.55 }],
                messageC_translateY_in: [30, 0, { start: 0.72, end: 0.77 }],
                messageA_opacity_in: [0, 1, { start: 0.15, end: 0.2 }],
                messageB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
                messageC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
                messageA_translateY_out: [0, -20, { start: 0.3, end: 0.35 }],
                messageB_translateY_out: [0, -20, { start: 0.58, end: 0.63 }],
                messageC_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
                messageA_opacity_out: [1, 0, { start: 0.3, end: 0.35 }],
                messageB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
                messageC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
                pinB_scaleY: [0.5, 1, { start: 0.5, end: 0.55 }],
                pinC_scaleY: [0.5, 1, { start: 0.72, end: 0.77 }],
                pinB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
                pinC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
                pinB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
                pinC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }]
            }
        },
        {
            // 3
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-3'),
                canvasCaption: document.querySelector('.canvas-caption'),
                canvas : document.querySelector('.image-blend-canvas'),
                context  : document.querySelector('.image-blend-canvas').getContext('2d'),
                imagesPath : [
                    './images/blend-image-1.jpg',
                    './images/blend-image-2.jpg',
                ],
                images : []
            },
            values: {
                rect1X : [0, 0, {start : 0, end : 0}],
                rect2X : [0, 0, {start : 0, end : 0}], 
                blendHeight : [0, 0, {start : 0, end : 0}],
                canvas_scale : [0, 0, {start : 0, end : 0}],
                canvasCaption_opacity :[0, 1, {start : 0, end : 0}],
                canvasCaption_translateY : [20, 0, {start : 0, end : 0}],
                rectStartY : 0,
            }
        }
    ];

    function setCanvasImages() {
        //이미지 순서 가져오는 함수
        let imgElem 
        for ( let i = 0 ; i < sceneInfo[0].values.videoImageCount ; i++) {
            // imgElem = document.createElement('img') ; --> 아래 방법과 동일 
            imgElem = new Image() // 새로운 이미지 객체 만들기
            imgElem.src = `./video/001/IMG_${6726 + i}.JPG`;
            sceneInfo[0].objs.videoImages.push(imgElem); 
        }
        
        let imgElem2 
        for ( let i = 0 ; i < sceneInfo[2].values.videoImageCount ; i++) {
            // imgElem2 = document.createElement('img') ; --> 아래 방법과 동일 
            imgElem2 = new Image() // 새로운 이미지 객체 만들기
            imgElem2.src = `./video/002/IMG_${7027 + i}.JPG`;
            sceneInfo[2].objs.videoImages.push(imgElem2); 
        }
        let imgElem3
        for(let i = 0 ; i < sceneInfo[3].objs.imagesPath.length ; i++) {
            imgElem3 = new Image() 
            imgElem3.src = sceneInfo[3].objs.imagesPath[i];
            sceneInfo[3].objs.images.push(imgElem3); 
        }

    }


    function checkMenu() {
        // yOffset은 문서 전체에서 스크롤된 위치 (현재 스크롤된 위치)
        if(yOffset > 44) {
            document.body.classList.add('local-nav-sticky');
        }else {
            document.body.classList.remove('local-nav-sticky');
        }
    }

    function setLayout() {
        // 각 스크롤 섹션의 높이 세팅
        for (let i = 0 ; i < sceneInfo.length ; i++) {
            if(sceneInfo[i].type === 'sticky') {
               sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            }else if (sceneInfo[i].type === 'normal') {
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
            }
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }
        

        yOffset = window.pageYOffset;
        let totalScrollHeight = 0 ; 
        for ( let i = 0 ; i < sceneInfo.length ; i++) {
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if(totalScrollHeight >= yOffset) {
                currentScene = i;
                break
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);

        const heightRatio = window.innerHeight / 1080 ;
        sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
    }

    function calcValues(values, currentYOffset) {
        // message_opacity 값을 계산
        let rv;
        // 현재 scene(scroll section)에서 스크롤된 범위를 비율로 구하기 
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset /  scrollHeight;

        if(values.length === 3) {
            // start ~ end 사이에 애니메이션 실행
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;

            if(currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
                rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
            }else if( currentYOffset < partScrollStart) {
                rv = values[0];
            }else if( currentYOffset > partScrollEnd) {
                rv = values[1];
            }
        }else {
            rv = scrollRatio * values[1] - values[0] + values[0];
        }


        return rv
    }


    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - preScrollHeight; // currentYOffset은 현재 씬에서 얼마나 스크롤 했는지 결정하는 변수
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;

        switch (currentScene) {
            case 0:
                // console.log('0 play');
                // let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                // objs.context.drawImage(objs.videoImages[sequence], 0, 0);
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);

                if (scrollRatio <= 0.22) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }
    
                if (scrollRatio <= 0.42) {
                    // in
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                }
    
                if (scrollRatio <= 0.62) {
                    // in
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                }
    
                if (scrollRatio <= 0.82) {
                    // in
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
                }
    
                break;
    
            case 2:
                // console.log('2 play');
                // let sequence2 = Math.round(calcValues(values.imageSequence, currentYOffset));
                // objs.context.drawImage(objs.videoImages[sequence2], 0, 0);

                if(scrollRatio <= 0.5 ) {
                    // in
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
                }else {
                    // out
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);
                }


                if (scrollRatio <= 0.25) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }
    
                if (scrollRatio <= 0.57) {
                    // in
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                } else {
                    // out
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                }
    
                if (scrollRatio <= 0.83) {
                    // in
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
                } else {
                    // out
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
                }
                // currentScene 3에서 쓰는 캔버스를 미리 그려주기 시작
                if(scrollRatio > 0.9) {
                // case 2에서 3의 사진이 쓰이고 있기 때문에 변수(objs,values)도 case3에 맞춰 변경해 줘야한다. 
                const objs = sceneInfo[3].objs;
                const values = sceneInfo[3].values;
                const widthRatio = window.innerWidth / objs.canvas.width;
                const heightRatio = window.innerHeight / objs.canvas.height;
                
                let canvasScaleRatio;

                if (widthRatio <= heightRatio) {
                    //캔버스보다 브라우저 창이 홀쭉한 경우 
                    canvasScaleRatio = heightRatio;
                    // console.log("heightRatio")
                }else {
                    //캔버스보다 브라우저 창이 납작한 경우 
                    canvasScaleRatio = widthRatio;
                    // console.log('widthRatio') 
                }
                objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
                objs.context.fillStyle = 'white'; // 캔버스 색상 설정 
                objs.context.drawImage(objs.images[0], 0, 0);

                //캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight 
                // innerWidth는 스크롤바 까지 포함한 길이 여기선 제외돈 width를 구애햐 한다. 
                // const recalculatedInnerWidth = window.innerWidth / canvasScaleRatio;
                // document.body.offsetWidth -> 스크롤바를 제외한 width 길이 
                const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
                const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

                const whiteRectWidth = recalculatedInnerWidth * 0.15;
                // [0] -> 출발값 [1] ->  애니메이션이 끝날 때 최종값 
                values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;             // 이동 전 처음 세팅된 상태 
                values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
                values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;   // 이동 전 처음 세팅된 상태 
                values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

                // 캔버스는 default가 검정색이다. 
                // fillRect 캔버스에서 사각형을 그리는 메소드 
                // 좌우 흰색 박스 그리기          x             y        width                     height
                // objs.context.fillRect(values.rect1X[0], 0, parseInt(whiteRectWidth), objs.canvas.height);
                // objs.context.fillRect(values.rect2X[0], 0, parseInt(whiteRectWidth), objs.canvas.height);
                
                objs.context.fillRect(parseInt(values.rect1X[0]), 0, parseInt(whiteRectWidth), objs.canvas.height); // x값을 스크롤 값에 따라서 갱신되도록 
                objs.context.fillRect(parseInt(values.rect2X[0]), 0, parseInt(whiteRectWidth), objs.canvas.height); // 애니메이션 처리 
                }

                break;
    
            case 3:
                // console.log('3 play');
                let step = 0
                // 가로 세로 모드 꽉 차게 하기 위해 여기서 세팅 (계산 필요)
                const widthRatio = window.innerWidth / objs.canvas.width;
                const heightRatio = window.innerHeight / objs.canvas.height;
                
                let canvasScaleRatio;
                if (widthRatio <= heightRatio) {
                    //캔버스보다 브라우저 창이 홀쭉한 경우 
                    canvasScaleRatio = heightRatio;
                    // console.log("heightRatio")
                }else {
                    //캔버스보다 브라우저 창이 납작한 경우 
                    canvasScaleRatio = widthRatio;
                    // console.log('widthRatio') 
                }
                objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
                objs.context.drawImage(objs.images[0], 0, 0);
                objs.context.fillStyle = 'white'; // 캔버스 색상 설정 

                //캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight 
                // innerWidth는 스크롤바 까지 포함한 길이 여기선 제외돈 width를 구애햐 한다. 
                // const recalculatedInnerWidth = window.innerWidth / canvasScaleRatio;
                // document.body.offsetWidth -> 스크롤바를 제외한 width 길이 
                const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
                const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

                // getBoundingClientRect = 화면상에 있는 크기와 위치를 가져오는 메소드 
                if(!values.rectStartY) {
                    // values.rectStartY = objs.canvas.getBoundingClientRect().top; // -> 속도에 따라서 값이 변하기 때문에 항상 고정되는 값이 아니다. 
                    // 위 방법은 값이 고정되지 않아서 아래의 방법을 사용 offsetTop은 계산이 복잡하다. 
                    values.rectStartY = objs.canvas.offsetTop + (objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2 ; 
                    values.rect1X[2].start = ( window.innerHeight / 2 ) / scrollHeight;
                    values.rect2X[2].start = ( window.innerHeight / 2 ) / scrollHeight;
                    values.rect1X[2].end = values.rectStartY / scrollHeight;
                    values.rect2X[2].end = values.rectStartY / scrollHeight;
                }
                


                const whiteRectWidth = recalculatedInnerWidth * 0.15;
                // [0] -> 출발값 [1] ->  애니메이션이 끝날 때 최종값 
                values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;             // 이동 전 처음 세팅된 상태 
                values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
                values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;   // 이동 전 처음 세팅된 상태 
                values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

                // 캔버스는 default가 검정색이다. 
                // fillRect 캔버스에서 사각형을 그리는 메소드 
                // 좌우 흰색 박스 그리기          x             y        width                     height
                // objs.context.fillRect(values.rect1X[0], 0, parseInt(whiteRectWidth), objs.canvas.height);
                // objs.context.fillRect(values.rect2X[0], 0, parseInt(whiteRectWidth), objs.canvas.height);
                
                objs.context.fillRect(parseInt(calcValues(values.rect1X, currentYOffset)), 0, parseInt(whiteRectWidth), objs.canvas.height); // x값을 스크롤 값에 따라서 갱신되도록 
                objs.context.fillRect(parseInt(calcValues(values.rect2X, currentYOffset)), 0, parseInt(whiteRectWidth), objs.canvas.height); // 애니메이션 처리 

                // if 캔버스가 브러우저 상단에 닿지 않았다면
                if(scrollRatio < values.rect1X[2].end) {
                    step = 1;
                    // console.log('캔버스 닿기 전 ')
                    objs.canvas.classList.remove('sticky')
                }else {
                    step = 2;
                    // console.log('캔버스 닿기 후 ')
                    // 이미지 블렌드 
                    //imageBlendY : [ 0, 0,{start:0, end :0}]
                    // objs.context.drawImage(img, x, y, width, height);
                    values.blendHeight[0] = 0;
                    values.blendHeight[1] = objs.canvas.height;
                    values.blendHeight[2].start = values.rect1X[2].end;
                    values.blendHeight[2].end = values.blendHeight[2].start + 0.2;
                    const blendHeight = calcValues(values.blendHeight, currentYOffset);

                    // mdn drawImage 메소드 확인하기 
                    objs.context.drawImage(objs.images[1],
                        0, objs.canvas.height -blendHeight, objs.canvas.width, blendHeight,
                        0, objs.canvas.height -blendHeight, objs.canvas.width, blendHeight
                    );

                    objs.canvas.classList.add('sticky');
                    objs.canvas.style.top = `${-(objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2}px`;
                    // 블렌드 이미지가 나타나는 시점 
                    if(scrollRatio > values.blendHeight[2].end) {
                        values.canvas_scale[0] = canvasScaleRatio;
                        //                                                    1.5를 곱해준건 블렌드 이미지 크기를 줄이기 위해서 
                        values.canvas_scale[1] = document.body.offsetWidth / (1.5 * objs.canvas.width);
                        values.canvas_scale[2].start = values.blendHeight[2].end
                        values.canvas_scale[2].end = values.canvas_scale[2].start + 0.2; 

                        // 위 계산된 값을 calcValues로 스케일을 계산해서 적용  
                        // currentYOffset은 현재 씬에서 얼마나 스크롤 했는지 결정하는 변수
                        objs.canvas.style.transform = `scale(${calcValues(values.canvas_scale, currentYOffset)})`;
                        // marginTop을 0으로 하는 이유는 스크롤을 다시 올렸을 때 이미지를 보여지도록 하기 위함
                        objs.canvas.style.marginTop = 0;
                    }
                    // 블렌드 이미지의 position : fixed가 풀리는 지점 ( 스크롤 시작점)
                    // 블렌드 이미지가 나타나는 시점의 조건 안에 values.canvas_scale[2].end가 0이기 때문에 따로 조건을 달아줘야 한다. 왜냐면 scrollRatio는 항상 0보다 큼
                    if(scrollRatio > values.canvas_scale[2].end && values.canvas_scale[2].end > 0) 
                        {
                        objs.canvas.classList.remove('sticky');
                        objs.canvas.style.marginTop = `${scrollHeight * 0.4}px`;

                        values.canvasCaption_opacity[2].start = values.canvas_scale[2].end;
                        values.canvasCaption_opacity[2].end = values.canvasCaption_opacity[2].start + 0.1;
                        objs.canvasCaption.style.opacity = calcValues(values.canvasCaption_opacity, currentYOffset);

                        values.canvasCaption_translateY[2].start = values.canvas_scale[2].end;
                        values.canvasCaption_translateY[2].end = values.canvasCaption_opacity[2].start + 0.1;
                        objs.canvasCaption.style.transform = `translate3d(0, ${calcValues(values.canvasCaption_translateY, currentYOffset)}%, 0)`
                        }
                        else {
                            objs.canvasCaption.style.opacity = values.canvasCaption_opacity[0];
                        }
                    
                    }
                break;
        }
    }



    function scrollLoop () {
        enterNewScene = false;
        preScrollHeight = 0
        for( let i = 0 ; i < currentScene ; i++) {

            preScrollHeight += sceneInfo[i].scrollHeight;
        }
        
        if(delayedYOffset > preScrollHeight + sceneInfo[currentScene].scrollHeight) {
            enterNewScene =true;
            currentScene++;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }
        if(delayedYOffset < preScrollHeight) {
            enterNewScene =true;
            if(currentScene===0) return;
            currentScene--;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }
        if(enterNewScene) return;
        playAnimation()
    }

    function loop() {
        delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;
        if(!enterNewScene) {
            if( currentScene === 0 || currentScene === 2 ) {
                const currentYOffset = delayedYOffset - preScrollHeight;
                const objs = sceneInfo[currentScene].objs;
                const values = sceneInfo[currentScene].values;
            // playAnimation의 부분을 가져옴 
            let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
            if(objs.videoImages[sequence]) {
                objs.context.drawImage(objs.videoImages[sequence], 0, 0);
                }
            }
        }


        rafId = requestAnimationFrame(loop); 

        // 계속 연산되는 루프 함수를 멈추기 위한 조건 
        if(Math.abs(yOffset - delayedYOffset) < 1 ) {
            cancelAnimationFrame(rafId);
            rafState = false;
        }
    }




    window.addEventListener('scroll', ()=> {
        yOffset = window.pageYOffset // 현재 스크롤 값 출력 
        scrollLoop(); 
        checkMenu();

        if(!rafState) {
            rafId = requestAnimationFrame(loop);
            rafState = true;
        }


    });
    window.addEventListener('load', ()=> {
        document.body.classList.remove('before-load');
        
        setLayout();
        sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0); 
    });
    // window.addEventListener('DOMContentLoad', setLayout); 위와 같은 의미 
    window.addEventListener('resize', ()=> {
        if(window.innerWidth > 900) {
            setLayout();
        }
        // 창 리사이즈시 레이아웃이 안맞는 현상에 대처하기 위해 
        // 리사이즈 될 때마다 rectStartY을 초기화 함 
        sceneInfo[3].values.rectStartY = 0;
    });
    //orientationchange 모바일 가로 세로 변경시에 일어나는 이벤트 
    window.addEventListener('orientationchange', setLayout);
    //transitionend은 트렌지션이 끝나고 실행되는 메소드 
    document.querySelector('.loading').addEventListener('transitionend', (e) => {
        document.body.removeChild(e.currentTarget);
    })

    setCanvasImages();

})(); // 함수호출

