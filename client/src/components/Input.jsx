/* eslint-disable */

function Input({inputName,type,onChange,required}) {

    return (
        <div className="input-field">
            <label htmlFor={inputName || "input"} className="label">{inputName || ""}{required && "*"}</label>
            <input id={inputName || "input"} type={type || "text"} className="input" onChange={onChange} autoComplete="off" required={required || null}/>
        </div>
    )
}

export default Input