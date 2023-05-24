
import { useState, useEffect } from "react"

const useValidateForms = (initialState, validate, fn) => {

    const [values, setValues] = useState(initialState)
    const [errors, setErrors] = useState({})
    const [submitForm, setSubmitForm] = useState(false)

    useEffect(() => {
        const noErrors = Object.keys(errors).length === 0;
        if(noErrors){
            fn()
        }
        setSubmitForm(false)
    }, [errors])

    function handleChange(e){
        setValues({
            ...values,
            [e.target.name]: e.target.value
        })
    }

    function handleSubmit(e){
        e.preventDefault()
        const validateErrors = validate(values)
        setErrors(validateErrors)
        setSubmitForm(true)
    }

  return {
        values,
        errors,
        submitForm,
        handleSubmit,
        handleChange
  }
}

export default useValidateForms