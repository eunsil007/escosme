(function(){const webpb_banner_data={"code":"skin3","mall_id":"escosme","mall_name":"주은실","skin_name":"카페24포트폴리오","banner_skin_name":"카페24포트폴리오","latest_updated":"2026/06/12 17:07:05","groups":{}};(function () {
    var MY_APP_ID = "AIFBrluHGdhkEsW6ewuLoA";
    var MY_AUTH_KEY = "QUlGQnJsdUhHZGhrRXNXNmV3dUxvQTpsMGZoY0tGbGFYb1AxVFd1azh2RDBm";

    // 인증 세팅 함수
    function applyAuth() {
        if (window.CAFE24API && typeof CAFE24API.setBasicAuthKey === 'function') {
            CAFE24API.setBasicAuthKey(MY_APP_ID, MY_AUTH_KEY);
            // console.log('프론트 키 등록 성공');
            return true; // 성공
        }
        //  console.log('프론트 키 등록 중..');
        return false; // 아직 객체가 없음
    }

    // 1. 즉시 실행 시도
    if (!applyAuth()) {
        // 2. 실패 시 0.1초(100ms) 간격으로 최대 30번(3초)만 재시도
        var attempts = 0;
        var retryTimer = setInterval(function () {
            attempts++;
            if (applyAuth() || attempts >= 30) {
                // console.log('프론트 키 등록 실패');
                clearInterval(retryTimer); // 성공하거나 3초가 지나면 타이머 종료
            }
        }, 100);
    }
})();

var WEBPB_BANNER_MANAGER = (function () {
    var d = {
        app_name: "** 웹퍼블릭 배너매니저 v 2.1 **",
        project_name: null,
        last_modified_date: null,
    }

    var init = function () {
        _replaceBanner();
        _cart_err_fixed();
    }

    const _cart_err_fixed = function () {
        if (location.href.includes('order/basket.html')) {
            document.querySelectorAll('.xans-order-list .price li').forEach(function (el) {
                // 1) li 자신의 class에서 깨진 조각 제거
                let class_name = el.getAttribute('class') || '';
                if (class_name.includes('display__<span class=')) {
                    // display__< 로 시작한 뒤의 쓰레기 전부 날림
                    class_name = class_name.replace(/display__<.*$/i, '').replace(/\s+/g, ' ').trim();
                    el.setAttribute('class', class_name);

                    // 2) notranslate" 속성 제거 (원문 그대로 유지)
                    el.removeAttribute('notranslate"');

                    // 3) li 바로 하위의 텍스트 노드 제거
                    Array.from(el.childNodes).forEach(function (node) {
                        if (node.nodeType === 3) node.remove(); // 텍스트 노드 삭제
                    });
                }

                // 4) .txtSecondary .notranslate 내용이 0이면 displaynone 추가
                const notranslate_el = el.querySelector('.txtSecondary .notranslate');
                if (notranslate_el) {
                    const num_text = notranslate_el.textContent.trim();
                    if (num_text === '0' || num_text === '-0') {
                        el.classList.add('displaynone');
                    }
                }
            });
        }
    }

    // 모달창 overflow 이슈 수정
    const htmlElement = document.querySelector('html');
    let isModalActiveHandled = false;

    const observer = new MutationObserver(function (mutationsList, observer) {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (htmlElement.classList.contains('modal-active') && !isModalActiveHandled) {
                    isModalActiveHandled = true; // 실행 플래그 설정
                    // console.log('modal-active 클래스 감지됨!');
                    _is_active_main_modal();

                    // 조건 만족 시 옵저버 종료
                    observer.disconnect();
                    // console.log('옵저버가 종료되었습니다.');
                }
            }
        });
    });

    // 2초 후 옵저버 강제 종료 (modal-active가 추가되지 않은 경우)
    setTimeout(function () {
        if (!isModalActiveHandled) {
            observer.disconnect();
            // console.log('타임아웃으로 옵저버가 종료되었습니다.');
        }
    }, 2000);

    observer.observe(htmlElement, {
        attributes: true,
        childList: false,
        subtree: false
    });

    function _is_active_main_modal() {
        if (document.querySelectorAll('.main--modal').length <= 0) {
            document.documentElement.classList.remove('modal-active');
            // console.log('modal-active 클래스가 제거되었습니다.');
        }
    }

    var _console = function () {
        var app_name = d.app_name;
        var last_modified_date = d.last_modified_date;
        var project_name = d.project_name;

        // 스타일 설정
        var styles = [
            'color: white',
            'background: linear-gradient(to right, #36d1dc, #5b86e5)',
            'padding: 8px',
            'font-size: 16px',
            'font-weight: bold',
            'border-radius: 4px'
        ].join(';');

        console.log('%c' + app_name, styles);
        if (!location.href.includes('ecudemo')) {
            console.log('%c최종 수정일자: %c' + last_modified_date, 'color: #36d1dc; font-weight: bold;', 'color: #5b86e5');
            console.log('%c프로젝트: %c' + project_name, 'color: #36d1dc; font-weight: bold;', 'color: #5b86e5');
        }
    }

    var arrShuffle = function (array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    };

    var _processUrl = function (url) {
        if (!url || !url.includes('://')) {
            return url; // 빈 값이거나 도메인이 없는 경우 그대로 반환
        }

        try {
            const parsedUrl = new URL(url);

            // 도메인이 'cafe24img.com' 또는 'ecudemo' 를 포함하면 전체 URL 반환, 아니면 경로만 반환 
            // ecudemo334188 이 사라지면서 레브 오류 예외 처리
            return (parsedUrl.hostname.includes('cafe24img.com') || parsedUrl.hostname.includes('ecudemo'))
                ? url.replace('ecudemo334188', 'ecudemo339099') : parsedUrl.pathname;
        } catch (error) {
            // console.error('Invalid URL:', url);
            return url; // 유효하지 않은 URL이면 그대로 반환
        }
    }

    var _replaceBanner = function () {

        var elements = document.querySelectorAll('[webpb-banner-code]');
        // 배너 데이터 존재 여부 확인
        if (typeof webpb_banner_data === 'undefined') {
            alert('배너 데이터 읽기에 실패하였습니다');
            return;
        }

        var data;
        try {
            // JSON encode
            data = JSON.parse(webpb_banner_data);
        } catch (e) {
            // object
            data = webpb_banner_data;
        }

        // 외부 데이터 공유
        window.__WEBPB_BANNER_DATA__ = data;

        // 콘솔 정보 호출
        d.last_modified_date = webpb_banner_data.latest_updated;
        d.project_name = webpb_banner_data.banner_skin_name;
        _console();

        Array.prototype.forEach.call(elements, function (element) {
            var code = element.getAttribute('webpb-banner-code');
            if (!code) return; // 코드가 없을 경우 다음 항목으로 이동

            try {
                var group = data.groups[code]; // 그룹 정보
                if (!group) {  // 존재하지 않는 그룹 코드를 입력하였을 경우
                    console.error(`## 그룹코드 [ ${code} ] 가 존재하지 않습니다. ##`);
                    return;
                }

                var is_shuffle = group['is_shuffle']; // 노출 순서 랜덤 여부
                var is_active = group['is_active']; // 그룹 사용 여부
                var group_name = group['name']; // 그룹 명

                // 그룹 표시 안함
                if (is_active === 'F') {
                    // 무한 스크롤 영역 - 영역 삭제 시 멈춤 발생에 대한 예외 처리 
                    if (code == '5kar' || code == 'hudv' || element.classList.contains('index_infinite_scroll')) {
                        return;
                    }
                    element.remove(); // 엘리먼트 삭제
                    return;
                }

                var banners = group.banners; // 배너 리스트
                if (!banners) return;

                // const banner_size = Object.keys(banners).length; // 그룹에 포함된 배너 개수
                const active_banner_size = Object.values(banners).filter(item => item.is_active == 'T').length; // 활성화 된 배너 개수

                // 활성화 배너 없을 경우
                if (active_banner_size <= 0) {
                    // 무한 스크롤 영역 - 영역 삭제 시 멈춤 발생에 대한 예외 처리 
                    if (code == '5kar' || code == 'hudv' || element.classList.contains('index_infinite_scroll')) {
                        return;
                    }
                    element.remove(); // 엘리먼트 삭제
                    return;
                }

                var targets = element.querySelectorAll('[webpb-banner]'); // 대상 HTML
                if (targets.length <= 0) return;

                Array.prototype.forEach.call(targets, function (target) {
                    target.classList.add('webpublic-banner-item');
                    target.removeAttribute('webpb-banner');
                });

                // 배너 데이터 오름차순 데이터 정렬
                var banner = Object.keys(banners).map(function (key) {
                    return banners[key];
                }).sort(function (a, b) {
                    return a.index - b.index;
                });

                var banner_clone_html = targets[targets.length - 1].cloneNode(true);

                // 슬라이드
                var arr_banner_html = [];

                var count = 0;
                var off_banner_count = 0; // 노출기간이 만료되었거나 사용안함 배너의 카운트
                for (var i = 0; i < banner.length; i++) {
                    var html = (i < targets.length) ? targets[i].outerHTML : banner_clone_html.outerHTML;

                    // ** 데이터 추출을 위해 키 추가 **
                    banner[i].group_name = group_name; // 그룹 명
                    banner[i].cnt = 0; // 카운트 (아래서 처리)

                    // 사용안함 상태 배너일 경우
                    if (banner[i].is_active === 'F') {
                        off_banner_count++;
                        continue;
                    }

                    // 예약시간 비교
                    if (banner[i].is_period === 'T') {
                        var period_begin_date = banner[i].period_begin.date,
                            period_begin_hour = banner[i].period_begin.hour,
                            period_begin_min = banner[i].period_begin.min,

                            period_end_date = banner[i].period_end.date,
                            period_end_hour = banner[i].period_end.hour,
                            period_end_min = banner[i].period_end.min;

                        // 시작시간
                        var start_time = new Date(period_begin_date);
                        start_time.setHours(period_begin_hour);
                        start_time.setMinutes(period_begin_min);

                        // 종료시간
                        var end_time = new Date(period_end_date);
                        end_time.setHours(period_end_hour);
                        end_time.setMinutes(period_end_min);

                        // 지정한 시간에 포함되지 않을 경우
                        var now = new Date(); // 현재시간
                        if (!(now >= start_time && now <= end_time)) {
                            off_banner_count++;
                            continue;
                        }
                    }

                    // 모든 키를 치환함
                    Object.keys(banner[i]).forEach(function (key) {
                        var value = banner[i][key];

                        // 텍스트 모음
                        if (key === 'texts') {
                            banner[i].texts.forEach(function (text, ii) {
                                html = html.replace(new RegExp('{#text_' + (ii + 1) + '}', 'g'), text);
                                html = html.replace(new RegExp(encodeURI('{#text_' + (ii + 1) + '}'), 'g'), text);
                            });
                            return;
                        }

                        // 인덱스 재정의 (키와 값의 매칭이 다르기 때문에 따로 정의)
                        if (key == 'index') {
                            html = html.replace(new RegExp('{#index}', 'g'), count);
                            html = html.replace(new RegExp(encodeURI('{#index}'), 'g'), count);
                            return;
                        }

                        // 카운트 재정의 (키와 값의 매칭이 다르기 때문에 따로 정의)
                        if (key == 'cnt') {
                            html = html.replace(new RegExp('{#cnt}', 'g'), (count + 1));
                            html = html.replace(new RegExp(encodeURI('{#cnt}'), 'g'), (count + 1));
                            return;
                        }

                        // PC 썸네일 치환
                        if (key == 'pc_thumb_url' && value.length > 0) {
                            html = html.replace(new RegExp('{#pc_thumb_tag}', 'g'), '<img src="' + _processUrl(value) + '" />');
                        }

                        // 모바일 썸네일 치환
                        if (key == 'm_thumb_url' && value.length > 0) {
                            html = html.replace(new RegExp('{#m_thumb_tag}', 'g'), '<img src="' + _processUrl(value) + '" />');
                        }

                        // 이미지 경로
                        if (key == 'pc_thumb_url' || key == 'm_thumb_url') {
                            html = html.replace(new RegExp('{#' + key + '}', 'g'), _processUrl(value));
                            html = html.replace(new RegExp(encodeURI('{#' + key + '}'), 'g'), _processUrl(value));
                            return;
                        }

                        html = html.replace(new RegExp('{#' + key + '}', 'g'), value);
                        html = html.replace(new RegExp(encodeURI('{#' + key + '}'), 'g'), value);
                    });
                    arr_banner_html.push(html);
                    count++;
                }

                // off 된 배너 수와 해당 그룹에 포함된 배너 수가 같으면 해당 엘리먼트 삭제
                if (off_banner_count == banner.length) element.remove();

                arr_banner_html = (is_shuffle === 'T') ? arrShuffle(arr_banner_html) : arr_banner_html;
                var result_html = arr_banner_html.join('').replace(/{#.*?}/g, ''); // 남아있는 {#...} 태그 모두 제거
                targets[targets.length - 1].insertAdjacentHTML('afterend', result_html);
                Array.prototype.forEach.call(targets, function (target) {
                    target.remove();
                });
                element.classList.add('webpublic-banner-area');
                element.removeAttribute('hidden');
                element.removeAttribute('webpb-banner-code');

                // 그룹명 출력하고 싶을 때
                if (element.hasAttribute('webpb-group-name')) {
                    element.setAttribute('webpb-group-name', group_name);
                }
            } catch (e) {
                console.error(e.message);
            }
        });
    }
    return {
        init: init,
    }
})();
WEBPB_BANNER_MANAGER.init();})();