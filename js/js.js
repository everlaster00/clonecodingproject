function createTypingEffect(elementId, text, options = {}) {
    const typingTextElement = document.getElementById(elementId);
    let textIndex = 0;
    let jamoIndex = 0;
    let completedText = ''; // 완성된 글자들을 저장할 변수
    let currentJamo = [];

    const typingSpeed = options.typingSpeed || 100;
    const delayBeforeBurn = options.delayBeforeBurn || 1500;
    const burnAnimationDuration = options.burnAnimationDuration || 2000;

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

    // 타이핑 효과를 구현하는 메인 함수
    function typeWriter() {
        if (textIndex < text.length) {
            const currentCharacter = text[textIndex];
            const jamo = getJamo(currentCharacter);

            let typingProgress = ''; // 현재 타이핑 중인 글자

            if (jamo) { // 현재 글자가 한글일 경우
                if (jamoIndex === 0) {
                    currentJamo = jamo;
                }

                if (jamoIndex === 0) {
                    typingProgress = currentJamo[0];
                } else if (jamoIndex === 1) {
                    typingProgress = combineJamo(currentJamo[0], currentJamo[1], '');
                } else {
                    typingProgress = combineJamo(currentJamo[0], currentJamo[1], currentJamo[2]);
                }
                
                typingTextElement.innerHTML = completedText + typingProgress;
                jamoIndex++;

                if (jamoIndex === currentJamo.length) {
                    completedText += currentCharacter;
                    textIndex++;
                    jamoIndex = 0;
                }

            } else { // 한글이 아닐 경우 (띄어쓰기, 영어, 특수문자, \n 등)
                if (currentCharacter === '\n') {
                    completedText += '<br>';
                } else {
                    completedText += currentCharacter;
                }
                typingTextElement.innerHTML = completedText;
                textIndex++;
                jamoIndex = 0;
            }
            
            setTimeout(typeWriter, typingSpeed);

        } else {
            // 모든 글자가 다 나왔을 때 소멸 효과 시작
            setTimeout(() => {
                typingTextElement.classList.add('fade-out-burn');
                setTimeout(() => {
                    const container = document.getElementById('typing-container');
                    if (container) container.style.display = 'none';
                }, burnAnimationDuration);
            }, delayBeforeBurn);
        }
    }
    return typeWriter;
}

// 사용 방법
const igniteText = "IGNITE\n\n프롬프트 샵✨";
const myTypingEffect = createTypingEffect("typing-text", igniteText, {
    typingSpeed: 100,
    delayBeforeBurn: 1500,
    burnAnimationDuration: 2000
});
myTypingEffect();