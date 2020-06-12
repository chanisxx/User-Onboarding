import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import axios from 'axios';
import './App.css';
import styled from 'styled-components'

const FormStyle = styled.form`
    display: flex;
    flex-direction: column;
    width: 60%;
    margin: 20px auto;
    padding: 28px;
    border-radius: 5px;
`;

const LabelStyle = styled.label`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px 0;
`;

const ButtonStyle = styled.button`
    background-color: lightblue;
    margin: 40px 0px;
    display: inline-block;
    padding: 8px 11px;
    border: none;
    border-radius: 5px; 
    cursor: pointer;
    box-shadow: 0 5px 20px -3px rgba(0, 0, 0, 0.5);
`;

const InputStyle = styled.input`
    width: 100%;
    display: block;
    width: 100%;
    border: none;
    border-bottom: 2px solid lightgreen;
    padding: 5px;
    font-size: 1rem;
    background-color: white;
    outline-width: 0;
`;

const CheckboxStyle = styled.label`
    font-size: .8rem;
    margin: 30px, 0;
    disply: block;
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
`;

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
        name: yup.string().required('Please enter name'),
        email: yup 
            .string()
            .required('You need to include an email address'),
        password: yup.string().required('Must enter password'),
        terms: yup.boolean().oneOf([true], 'You gotta accept terms and conditions')
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

    const [showPassword, setShowPassword] = useState(false);
    const togglePassword = () => {
        setShowPassword(showPassword ? false : true)
    }

    return (
        <FormStyle onSubmit={formSubmit}>

            <LabelStyle htmlFor='name'>
                <InputStyle id='name' type='text' name='name' onChange={inputChange} placeholder='Name'/>
                {errors.name.length > 0 ? <p className="error">{errors.name}</p> : null}
            </LabelStyle>

            <LabelStyle htmlFor='email'>
                <InputStyle id='email' type='text' name='email' onChange={inputChange} placeholder="Email"/>
                {errors.email.length > 0 ? <p className="error">{errors.email}</p> : null}
            </LabelStyle>

            <LabelStyle htmlFor='password'>
                <InputStyle id='password' type={showPassword ? "text" : "password"} name='password' onChange={inputChange} placeholder="Password"/>
                 {errors.password.length > 0 ? <p className="error">{errors.password}</p> : null}
               
            </LabelStyle>

            <CheckboxStyle>
            show password
            <input type="checkbox" id="togglePassword" onClick = {togglePassword} /> 
            </CheckboxStyle>

            <CheckboxStyle  htmlFor='terms'>
            Terms and Conditions
                <input id='terms' type='checkbox' name='terms' checked={form.terms} onChange={inputChange}/>
                {errors.terms.length > 0 ? <p className="error">{errors.terms}</p> : null}
            </CheckboxStyle>

            <ButtonStyle type='submit'>Complete</ButtonStyle>

            <pre>{JSON.stringify(users, null, 2)}</pre>

        </FormStyle>
    )
}

export default Form