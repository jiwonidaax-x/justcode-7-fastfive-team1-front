import React, { useState, useRef } from 'react';
import css from './WriteReply.module.scss';

function Comment({ commentObj }) {
  const [isInputClicked, setIsInputClicked] = useState(false);
  const [textareaLength, setTextareaLength] = useState(0);
  const [lockState, setLockState] = useState(false);
  const textarea = useRef();

  const changeTextarea = event => {
    textarea.current.style.height = 'auto';
    textarea.current.style.height = textarea.current.scrollHeight + 'px';
    setTextareaLength(textarea.current.value.length);
  };

  const changeLockState = event => {
    setLockState(!lockState);
  };

  const clickSubmitBtn = () => {
    const textLength = textarea.current.value.length;
    if (textLength < 1 || textLength > 1000) return;

    //등록
    fetch('http://127.0.0.1:5500/post/commentOnComment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: localStorage.getItem('authorization'),
      },
      body: JSON.stringify({
        comment: textarea.current.value,
        postId: 1,
        is_secret: lockState ? 1 : 0,
        commentId: commentObj.comments_id,
      }),
    });
  };

  return (
    <div className={css.comment}>
      <div className={css.commentMarginDiv}>
        <div className={css.leftArea}>
          <textarea
            className={`${css.commentContent} ${
              textareaLength > 1000 && css.overText
            }`}
            onChange={changeTextarea}
            rows="1"
            ref={textarea}
            maxLength="1000"
            onFocus={() => {
              setIsInputClicked(true);
            }}
            onBlur={() => {
              setIsInputClicked(false);
            }}
            placeholder={
              isInputClicked
                ? ''
                : '위 멤버에게 궁금한 점이나 제안하고 싶은 내용을 댓글로 남겨보세요'
            }
          />
          <div className={css.letterCount}>
            <span>{textareaLength}/1000</span>
            <div className={css.lockDiv}>
              <i
                className={`${
                  lockState ? 'fa-solid fa-lock' : 'fa-solid fa-lock-open'
                } ${lockState ? css.lock : css.lockOpen}`}
                onClick={changeLockState}
              />
            </div>
          </div>
        </div>
        <div className={css.rightArea}>
          <button onClick={clickSubmitBtn}>등록</button>
        </div>
      </div>
    </div>
  );
}

export default Comment;
