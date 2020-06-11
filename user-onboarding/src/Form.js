import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import axios from 'axios';
import './App.css';

function Form() {

    const [users, setUsers] = useState([]);
    const [serverError, setServerError] = useState("");

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        terms: false
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        terms: ''
    });

    const formSchema = yup.object().shape({
        name: yup.string().required('Must enter name'),
        email: yup 
            .string()
            .email('Must be a valid email address')
            .required('Must include email address'),
        password: yup.string().required('Must enter password'),
        terms: yup.boolean().oneOf([true])
    });

    useEffect(() => {
        formSchema.isValid(form).then(formValidation => {
            console.log('is form valid?', formValidation);
        })
    }, [form]);

    const validateChange = e => {
        yup
            .reach(formSchema, e.target.name)
            .validate(e.target.name === 'terms' ? e.target.checked : e.target.value)
            .then(valid => {
                setErrors({
                    ...errors,
                    [e.target.name]: ''
                });
            })
            .catch(err => {
                setErrors({
                    ...errors,
                    [e.target.name]: err.errors[0]
                });
            });
    };

    const inputChange = e => {
        e.persist();

        let checkBox = true;

        if(e.target.name === 'terms') {
            checkBox = e.target.checked;
        } else {
            checkBox = form.terms;
        }

        const newFormInput = {
            ...form,
            terms: checkBox,
            [e.target.name]: 
                e.target.name === 'terms' ? e.target.checked : e.target.value
        };

        validateChange(e);
        setForm(newFormInput);
    }

    const formSubmit = e => {
        e.preventDefault();

        axios
            .post('https://reqres.in/api/users', form)
            .then(res => {
                setUsers(res.data);
                console.log('SET POST');

                setForm({
                    name:'',
                    email:'',
                    password:'',
                    terms: true
                });

                setServerError(null);
            })
            .catch(err => {
                setServerError('SERVER ERROR')
            })
    }


    return (
        <form onSubmit={formSubmit}>

            <label htmlFor='name'>
                Name:<input id='name' type='text' name='name' onChange={inputChange}/>
                {errors.name.length > 0 ? <p className="error">{errors.name}</p> : null}
            </label>

            <label htmlFor='email'>
                Email:<input id='email' type='text' name='email' onChange={inputChange}/>
                {errors.email.length > 0 ? <p className="error">{errors.email}</p> : null}
            </label>

            <label htmlFor='password'>
                Password:<input id='password' type='text' name='password' onChange={inputChange}/>
                {errors.password.length > 0 ? <p className="error">{errors.password}</p> : null}
            </label>

            <label htmlFor='terms'>
                <input id='terms' type='checkbox' name='terms' checked={form.terms} onChange={inputChange}/>
                Terms and Conditions
                {errors.terms.length > 0 ? <p className="error">{errors.terms}</p> : null}
            </label>

            <button type='submit'>Complete</button>

            <pre>{JSON.stringify(users, null, 2)}</pre>

        </form>
    )
}

export default Form