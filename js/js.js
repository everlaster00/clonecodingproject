
function createTypingEffect(elementId, text, options = {}) {
    const typingTextElement = document.getElementById(elementId);
    let textIndex = 0;
    let jamoIndex = 0;
    let currentJamo = [];
    const typingSpeed = options.typingSpeed || 100; // 글자 입력 속도
    const delayBeforeBurn = options.delayBeforeBurn || 1500; // 글자 다 나오고 소멸 전 대기 시간 (1.5초)
    const burnAnimationDuration = options.burnAnimationDuration || 2000; // 소멸 애니메이션 지속 시간 (2초)

    // 초성, 중성, 종성 분리 함수
    function getJamo(char) {
        const uni = char.charCodeAt(0);
        if (uni < 0xac00 || uni > 0xd7a3) {
            return null; // 한글이 아니면 null 반환
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
        const charCode = 0xac00 + initialIndex * 21 * 28 + vowelIndex * 28 + finalIndex;
        return String.fromCharCode(charCode);
    }

    // 타이핑 효과를 구현하는 메인 함수
    function typeWriter() {
        if (textIndex < text.length) {
            const currentCharacter = text[textIndex];
            const jamo = getJamo(currentCharacter);

            if (jamo) { // 현재 글자가 한글일 경우
                if (jamoIndex === 0) {
                    currentJamo = jamo;
                }
                let tempText = typingTextElement.textContent.slice(0, -1);
                if (jamoIndex === 0) {
                    tempText += currentJamo[0];
                } else if (jamoIndex === 1) {
                    tempText += combineJamo(currentJamo[0], currentJamo[1], '');
                } else {
                    tempText += combineJamo(currentJamo[0], currentJamo[1], currentJamo[2]);
                }
                typingTextElement.textContent = tempText;
                jamoIndex++;

                if (jamoIndex === currentJamo.length) {
                    textIndex++;
                    jamoIndex = 0;
                }
            } else { // 현재 글자가 한글이 아닐 경우
                typingTextElement.textContent += currentCharacter;
                textIndex++;
                jamoIndex = 0;
            }
            setTimeout(typeWriter, typingSpeed);
        } else {
            // 모든 글자가 다 나왔을 때 소멸 효과 시작
            setTimeout(() => {
                typingTextElement.classList.add('fade-out-burn');
                // 애니메이션 끝난 후 요소 숨기기 (선택 사항)
                setTimeout(() => {
                    const body = document.getElementsByClassName(`igniteBody`);
                    body.style.display = `none`;
                    typingTextElement.style.display = 'none';
                }, burnAnimationDuration);
            }, delayBeforeBurn);
        }
    }

    return typeWriter;
}

// 사용 방법은 이렇게!
// HTML: <div id="typing-text"></div>
const igniteText = ` I G N I T E \n 프  롬  프  트  샵`; // 두 줄로 표현하기 위해 \n 사용
const myTypingEffect = createTypingEffect("typing-text", igniteText, {
    typingSpeed: 120, // 글자 입력 속도 조절
    delayBeforeBurn: 2000, // 글자 다 나오고 2초 후 소멸 시작
    burnAnimationDuration: 2500 // 소멸 애니메이션 2.5초 동안
});
myTypingEffect();


