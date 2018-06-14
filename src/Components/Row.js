import React from 'react';
import './Row.css'
export default function Row (props){
    return(
        <div key = {props.Key} className='row'>
            <label className='key' style={{color: 'gray'}}> {props.keyName} </label>
            <label className='value' style={{fontWeight: 'bold'}}> {props.value} </label>
        </div>
    )
}