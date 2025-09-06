function createTypingEffect(containerId, text, options = {}) {
    const typingContainer = document.getElementById(containerId);
    let textIndex = 0;
    let jamoIndex = 0;
    let currentJamo = [];
    let displayedChars = []; // 화면에 표시된 글자(span 태그)들을 저장

    const typingSpeed = options.typingSpeed || 100;
    const burnDelayPerChar = options.burnDelayPerChar || 80; // 글자 하나씩 불 붙는 시간차 (ms)
    const delayBeforeBurnAway = options.delayBeforeBurnAway || 1500; // 모든 불 붙은 후 소멸 전 대기 시간
    const burnAwayDuration = options.burnAwayDuration || 2000; // 소멸 애니메이션 지속 시간

    // 초성, 중성, 종성 분리 함수 (한글 아니면 null)
    function getJamo(char) {
        const uni = char.charCodeAt(0);
        if (uni < 0xac00 || uni > 0xd7a3) {
            return null;
        }
        const initialConsonants = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
        const vowels = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
        const finalConsonants = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
        const unicode = uni - 0xac00;
        const initialIndex = Math.floor(unicode / (21 * 28));
        const vowelIndex = Math.floor((unicode % (21 * 28)) / 28);
        const finalIndex = unicode % 28;
        const result = [initialConsonants[initialIndex], vowels[vowelIndex]];
        if (finalIndex !== 0) {
            result.push(finalConsonants[finalIndex]);
        }
        return result;
    }

    // 자모 합쳐서 한 글자 만드는 함수
    function combineJamo(initial, vowel, final) {
        const initialConsonants = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
        const vowels = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
        const finalConsonants = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
        
        const initialIndex = initialConsonants.indexOf(initial);
        const vowelIndex = vowels.indexOf(vowel);
        const finalIndex = finalConsonants.indexOf(final);
        
        if (initialIndex === -1 || vowelIndex === -1) {
            return '';
        }
        
        const charCode = 0xac00 + initialIndex * 21 * 28 + vowelIndex * 28 + finalIndex;
        return String.fromCharCode(charCode);
    }

    // 글자 하나하나를 span으로 감싸는 함수
    function appendCharToContainer(char, isJamoInProgress = false) {
        if (char === '<br>') {
            typingContainer.appendChild(document.createElement('br'));
            displayedChars.push(document.createElement('br')); // <br> 태그도 배열에 저장
            return;
        }
        
        let span;
        if (isJamoInProgress && displayedChars.length > 0 && displayedChars[displayedChars.length - 1].tagName === 'SPAN') {
            // 한글 자모 진행 중이면 마지막 span의 내용을 업데이트
            span = displayedChars[displayedChars.length - 1];
            span.textContent = char;
        } else {
            span = document.createElement('span');
            span.textContent = char;
            typingContainer.appendChild(span);
            displayedChars.push(span);
        }
    }

    // 타이핑 효과를 구현하는 메인 함수
    function typeWriter() {
        if (textIndex < text.length) {
            const currentCharacter = text[textIndex];
            const jamo = getJamo(currentCharacter);

            if (jamo) { // 현재 글자가 한글일 경우
                if (jamoIndex === 0) {
                    currentJamo = jamo;
                    // 새로운 한글 시작 전에 마지막 글자가 한글 완성 형태였다면 초기화
                    if (displayedChars.length > 0 && displayedChars[displayedChars.length - 1].tagName === 'SPAN' && getJamo(displayedChars[displayedChars.length - 1].textContent) !== null) {
                        displayedChars.pop(); // 완성된 한글 지우기
                        typingContainer.lastChild.remove();
                    }
                }

                let typingProgressChar = '';
                if (jamoIndex === 0) {
                    typingProgressChar = currentJamo[0];
                } else if (jamoIndex === 1) {
                    typingProgressChar = combineJamo(currentJamo[0], currentJamo[1], '');
                } else {
                    typingProgressChar = combineJamo(currentJamo[0], currentJamo[1], currentJamo[2]);
                }
                
                appendCharToContainer(typingProgressChar, true);
                jamoIndex++;

                if (jamoIndex === currentJamo.length) {
                    // 한 글자 완성 후 최종 형태로 업데이트
                    if (displayedChars.length > 0 && displayedChars[displayedChars.length - 1].tagName === 'SPAN') {
                        displayedChars[displayedChars.length - 1].textContent = currentCharacter;
                    } else { // 예외 처리: 혹시나 span이 없으면 새로 추가 (정상적이라면 발생하지 않음)
                        appendCharToContainer(currentCharacter, false);
                    }
                    textIndex++;
                    jamoIndex = 0;
                }

            } else { // 한글이 아닐 경우 (띄어쓰기, 영어, 특수문자, \n 등)
                const charToAppend = currentCharacter === '\n' ? '<br>' : currentCharacter;
                appendCharToContainer(charToAppend, false);
                textIndex++;
                jamoIndex = 0;
            }
            
            setTimeout(typeWriter, typingSpeed);

        } else {
            // 모든 글자가 다 나왔을 때 불꽃 번짐 시작
            let charIndex = 0;
            const igniteInterval = setInterval(() => {
                // <br> 태그는 스킵
                while (charIndex < displayedChars.length && displayedChars[charIndex].tagName === 'BR') {
                    charIndex++;
                }
                
                if (charIndex < displayedChars.length) {
                    displayedChars[charIndex].classList.add('char-spark');
                    charIndex++;
                } else {
                    clearInterval(igniteInterval); // 모든 글자에 불이 붙으면 인터벌 종료
                    // 모든 불꽃이 다 붙은 후 소멸 효과 시작
                    setTimeout(() => {
                        typingContainer.classList.add('fade-out-burn');
                        // 애니메이션 끝난 후 요소 제거 (완전히 사라진 후)
                        setTimeout(() => {
                            typingContainer.style.display = 'none';
                        }, burnAwayDuration);
                    }, delayBeforeBurnAway);
                }
            }, burnDelayPerChar); // 글자 하나씩 불 붙는 시간차
        }
    }
    return typeWriter;
}

// 사용 방법
const igniteText = "IGNITE\n\n프롬프트 샵✨";
const myTypingEffect = createTypingEffect("typing-container", igniteText, {
    typingSpeed: 200, // 타이핑 속도
    burnDelayPerChar: 180, // 글자 하나하나 불 붙는 시간차
    delayBeforeBurnAway: 1500, // 모든 불 붙고 나서 소멸 시작까지 대기 시간
    burnAwayDuration: 2000 // 소멸 애니메이션 지속 시간
});
myTypingEffect();