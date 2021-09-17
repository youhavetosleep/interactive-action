(()=> {

    let yOffset = 0 // window.pageYOffset 대신 쓸 변수 
    let preScrollHeight = 0 // 현재 스크롤 위치(yOffet)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0 // 현재 활성화된 (눈 앞에 보고 있는) 씬 (scroll- section)
    let enterNewScene = false; // 새로운  scene이 시작되는 순간 true

    const sceneInfo = [
        {
            // 0
            type : 'sticky',
            scrollHeight : 0,
            heightNum : 5, //브라우저 높이의 5배로 scrollHeight 세팅 
            objs : {
                container : document.querySelector('#scroll-section-0'),
                messageA : document.querySelector('#scroll-section-0 .main-message.a'),
                messageB : document.querySelector('#scroll-section-0 .main-message.b'),
                messageC : document.querySelector('#scroll-section-0 .main-message.c'),
                messageD : document.querySelector('#scroll-section-0 .main-message.d'),
            },
            values : {
                messageA_opacity_in : [0, 1, {start : 0.1, end : 0.2}],
                // messageB_opacity_in : [0, 1, {start : 0.3, end : 0.4}],
                messageA_translateY_in : [20, 0, {start : 0.1, end : 0.2}],
                messageA_opacity_out : [1, 0, {start : 0.25, end : 0.3}],
                messageA_translateY_out : [0, -20, {start : 0.25, end : 0.3}],
                
            },
        },
        {
            // 1
            type : 'normal',
            scrollHeight : 0,
            heightNum : 5,  
            objs : {
                container : document.querySelector('#scroll-section-1')
                    },
        }, 
        {
            // 2
            type : 'sticky',
            scrollHeight : 0,
            heightNum : 5,  
            objs : {
                container : document.querySelector('#scroll-section-2')
                    },
        }, 
        {
            // 3
            type : 'sticky',
            scrollHeight : 0,
            heightNum : 5, 
            objs : {
                container : document.querySelector('#scroll-section-3')
                    },
        }, 

    ];

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
        const values =sceneInfo[currentScene].values;
        const objs =sceneInfo[currentScene].objs;
        const currentYOffset = yOffset - preScrollHeight;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = (currentYOffset) / scrollHeight;
     
        switch (currentScene) {
            case 0:
                if(scrollRatio <= 0.22) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_in, currentYOffset)}%)`;
                }else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_out, currentYOffset)}%)`;
                }

                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
        
        }
    }



    function scrollLoop () {
        enterNewScene = false;
        preScrollHeight = 0
        for( let i = 0 ; i < currentScene ; i++) {

            preScrollHeight += sceneInfo[i].scrollHeight;
        }
        
        if(yOffset > preScrollHeight + sceneInfo[currentScene].scrollHeight) {
            enterNewScene =true;
            currentScene++;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }
        if(yOffset < preScrollHeight) {
            enterNewScene =true;
            if(currentScene===0) return;
            currentScene--;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }
        if(enterNewScene) return;
        playAnimation()
    }





    window.addEventListener('scroll', ()=> {
        yOffset = window.pageYOffset // 현재 스크롤 값 출력 
        scrollLoop(); 
    });
    window.addEventListener('load', setLayout);
    // window.addEventListener('DOMContentLoad', setLayout); 위와 같은 의미 
    window.addEventListener('resize', setLayout);
    setLayout()

})(); // 함수호출
