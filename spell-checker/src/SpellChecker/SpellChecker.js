import React, { useState } from "react";
import { checkText } from "../utils/apis";
import { moveCursorToLast } from "../utils/moveCursorToLast";
import './styles.css';

const SpellChecker = () => {

    const [suggestions, setSuggestions] = useState([]);
    const [id, setId] = useState(-1);
    const [showList, setShowList] = useState(false);
    const [top, setTop] = useState(-1);
    const [left, setLeft] = useState(-1);

    const checkSpelling = async (event) => {
        let textToCheck = event.target.innerText.replaceAll('&nbsp;', ' ');
        // const textArr = textToCheck.split('');
        // if (textArr[textArr.length - 1] === ' ') {
            const badWords = new Map();
            const response = await checkText(textToCheck);
            response.errors.forEach(e => {
                badWords.set(e.bad, e);
            });
            let correctText = textToCheck.split(' ');
            correctText = correctText.map((text, index) => {
                if (badWords.has(text.trim())) {
                    const fragment = `<span class='wrong' id=${index}>${text}</span>`;
                    return fragment;
                }
                return `<span id=${index}>${text}</span>`;
            }).join(' ');
            event.target.innerHTML = correctText;
            moveCursorToLast(document.getElementById('spell-box'));
        // }
    }
    
    const getSuggestions = async (event) => {
        if (event.target.id !== 'spell-box') {
            event.preventDefault();
            setId(event.target.id);
            setShowList(true);
            setTop(event.target.offsetTop);
            setLeft(event.target.offsetLeft);
            const response = await checkText(event.target.innerText);
            if (response.errors) {
                setSuggestions(response.errors[0].better);
            }
        } else {
            setId(-1);
            setSuggestions([]);
        }
    }

    const replaceWord = (event) => {
        const el = document.getElementById(id);
        el.innerText = event.target.innerText;
        setShowList(false);
        el.classList.remove('wrong');
        setId(-1);
        setSuggestions([]);
    }

    return (
        <>
            <div contentEditable id='spell-box' className='main' spellCheck={false} onInput={checkSpelling} onContextMenu={getSuggestions}></div>  
            <ul className={showList ? 'showList' : 'hideList'} style={{ top: top, left: left }}>
                {suggestions.map(el => <li onClick={replaceWord}>{el}</li>)}
            </ul>
        </>
    );
};

export default SpellChecker;
