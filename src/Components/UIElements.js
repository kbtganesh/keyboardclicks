import React from 'react';
import './UIElements.css'
export const Textbox = (props) =>{
    let style = {
        borderColor: props.wrongWord?'red':'gray',
    }
    return <input className='text-box' style={style} type='text' onChange={props.onChange} value={props.value} />
}

export const Button = (props) =>{
    return <button type="button" className={props.rounded?'rounded-button':'normal-button'} onClick={props.onClick}> {props.title} </button>
}