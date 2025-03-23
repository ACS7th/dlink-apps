import React, { useState } from "react";

function RelatedQuestionsCards({ questions, handleChat }) {
    const [clickedIndex, setClickedIndex] = useState(null);

    const onClick = (question, index) => {
        if (clickedIndex !== null) return; // 이미 클릭된 상태면 무시
        setClickedIndex(index);
        handleChat(question);
    };

    return (
        <div className="flex gap-2 mt-10 text-tiny">
            {questions.slice(0, 3).map((question, index) => (
                <button
                    key={index}
                    onClick={() => onClick(question, index)}
                    disabled={clickedIndex !== null}
                    className={`flex-1 border px-1 py-2 rounded transition
                        ${clickedIndex === index ? "bg-primary text-white font-semibold" : ""}
                        ${clickedIndex !== null && clickedIndex !== index ? "opacity-50" : ""}
                    `}
                >
                    {question}
                </button>
            ))}
        </div>
    );
}

export default RelatedQuestionsCards;
