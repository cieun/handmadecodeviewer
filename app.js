const apiKey = "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";  // 여기에 실제 API 키를 넣으세요

const askGPT = async (message) => {
    try {
        const loading = document.getElementById('loading');
        loading.style.display = 'block';

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [
                    { role: "system", content: `
당신은 사용자가 입력한 단어를 분석하여 그에 맞는 HTML 코드를 생성하는 AI입니다. 규칙에 따라 오직 HTML 코드만 출력하십시오.

규칙:
1. 입력된 단어에 맞는 HTML 태그와 구조만 생성하십시오.
2. 출력은 오직 HTML 코드만 포함해야 하며, 추가적인 텍스트나 설명은 절대 포함하지 마십시오.
3. 태그는 <name>...</name> 형식으로 작성하며, 필요한 경우 적절한 중첩 구조를 만드십시오.
4. 입력된 단어와 관련 없는 내용은 생성하지 마십시오.

예제:
(입력: 책장)
<bookcase>
    <bookcase>
        <shelf>
            <book></book>
            <book></book>
            <book></book>
            <book></book>
            <book></book>
</shelf>
        <shelf>
            <book></book>
            <book></book>
            <book></book>
            <book></book>
            <book></book>
        </shelf>
        <shelf>
            <book></book>
            <book></book>
            <book></book>
            <book></book>
            <book></book>
        </shelf>
        <shelf>
        </shelf>
        <shelf>
        </shelf>
</bookcase>
<bookcase>
<shelf></shelf>
        <shelf></shelf>
        <shelf>
            <book></book>
            <book></book>
            <book></book>
            <book></book>
            <book></book>
        </shelf>
        <shelf></shelf>
        <shelf></shelf>
    </bookcase>
</bookcase>


                    ` },
                    { role: "user", content: message }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        const messageContent = data.choices[0].message.content;

        const lines = messageContent.trim().split('\n');
        let currentLine = 0;

        const displayLine = () => {
            if (currentLine < lines.length) {
                document.getElementById('responseOutput').textContent += lines[currentLine] + "\n";
                currentLine++;
                // 스크롤 맨 아래
                const codeContainer = document.querySelector('.code-container');
                codeContainer.scrollTop = codeContainer.scrollHeight;
            }
        };

        // 100ms 간격으로 한 줄씩 출력
        const interval = setInterval(displayLine, 200);
        // 마지막 줄까지 출력되면 interval을 멈춤
        setTimeout(() => {
            clearInterval(interval);
            // 최종적으로 출력된 content를 저장
            saveResponseOutput(document.getElementById('responseOutput').textContent);
            loading.style.display = 'none';
        }, lines.length * 200);

    } catch (error) {
        document.getElementById('responseOutput').textContent = `//오류 발생: ${error.message}`;
        loading.style.display = 'none';
    }
};
